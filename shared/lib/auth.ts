import { cookies } from "next/headers";

import ky from "ky";
import { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				loginId: { label: "Login ID", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						loginId: credentials?.loginId,
						password: credentials?.password,
					}),
				});

				const data = await res.json();

				if (!res.ok) {
					// 400, 401 에러 코드 처리 (INVALID_LOGIN_ID_INPUT, LOGIN_FAILED 등)
					throw new Error(data.errorCode || "UNKNOWN_ERROR");
				}
				// 200 OK: 쿠키는 브라우저에 자동 저장됨
				return {
					id: data.userId, // TODO: API 확인
					accessToken: data.accessToken,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user, trigger }) {
			// 1. 초기 로그인 시
			if (user) {
				// 브라우저 쿠키 저장소에서 XSRF-TOKEN을 읽어 token에 보관 (토큰 재발행 시 사용 위함)
				const cookieStore = await cookies();
				const xsrfToken = cookieStore.get("XSRF-TOKEN")?.value;

				return {
					accessToken: user.accessToken,
					accessTokenExpires: Date.now() + 1000 * 60 * 60, // 1시간
					xsrfToken: xsrfToken, // 재발행 시 헤더에 반영 필요
				};
			}

			// 2. 만료 전 업데이트 요청 시
			if (trigger === "update") {
				return await refreshAccessToken(token);
			}

			// 3. 토큰 만료 여부 확인
			if (Date.now() < (token.accessTokenExpires as number)) {
				return token;
			}

			// 4. 만료 시 자동 갱신
			return await refreshAccessToken(token);
		},
		async session({ session, token }) {
			session.accessToken = token.accessToken;
			session.xsrfToken = token.xsrfToken; // 클라이언트 API 호출 시 필요
			session.error = token.error;
			return session;
		},
	},
	events: {
		async signOut({ token }) {
			// 1. 백엔드 세션 무효화 (RefreshToken 무효화)
			try {
				const cookieStore = await cookies();
				const refreshToken = cookieStore.get("refreshToken")?.value;

				await ky.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
					headers: {
						"X-XSRF-TOKEN": token.xsrfToken as string,
					},
					hooks: {
						beforeRequest: [
							(request) => {
								if (refreshToken) {
									request.headers.set("Cookie", `refreshToken=${refreshToken}`);
								}
							},
						],
					},
				});
			} catch (error) {
				console.error("Backend logout failed:", error);
			}

			const cookieStore = await cookies();
			cookieStore.delete("refreshToken");
			cookieStore.delete("XSRF-TOKEN");
		},
	},
};

async function refreshAccessToken(token: JWT) {
	try {
		const cookieStore = await cookies();
		const refreshToken = cookieStore.get("refreshToken")?.value;
		const headers: Record<string, string> = {};

		if (token.xsrfToken) {
			headers["X-XSRF-TOKEN"] = token.xsrfToken;
		}

		const response = await ky.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/tokens`, {
			headers,
			// 서버 사이드 요청 시 쿠키를 직접 주입해야 할 경우
			hooks: {
				beforeRequest: [
					(request) => {
						if (refreshToken) {
							request.headers.set("Cookie", `refreshToken=${refreshToken}`);
						}
					},
				],
			},
		});

		const data = await response.json<{ accessToken: string }>();

		// 새로운 XSRF-TOKEN이 쿠키로 내려왔는지 확인 후 세션 업데이트
		const newXsrfToken = cookieStore.get("XSRF-TOKEN")?.value;

		return {
			...token,
			accessToken: data.accessToken,
			accessTokenExpires: Date.now() + 1000 * 60 * 60,
			xsrfToken: newXsrfToken || token.xsrfToken,
		};
	} catch (error) {
		// 401(INVALID_REFRESH_TOKEN 등) 혹은 403(CSRF 관련) 발생 시
		return {
			...token,
			error: "RefreshAccessTokenError",
		};
	}
}
