import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
	interface Session extends DefaultSession {
		accessToken?: string;
		xsrfToken?: string;
		error?: "RefreshAccessTokenError" | string;
		user?: DefaultSession["user"] & {
			id?: string;
		};
	}

	interface User extends DefaultUser {
		accessToken: string;
		xsrfToken?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		accessToken?: string;
		accessTokenExpires?: number;
		xsrfToken?: string;
		error?: "RefreshAccessTokenError" | string;
	}
}
