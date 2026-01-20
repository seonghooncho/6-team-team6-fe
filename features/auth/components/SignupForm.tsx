"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";

const signupSchema = z
	.object({
		loginId: z.string().min(1, "아이디를 입력해 주세요."),
		password: z
			.string()
			.min(1, "비밀번호를 입력해 주세요.")
			.regex(
				/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]{8,16}$/,
				"비밀번호는 8~16자이며 대/소문자, 숫자, 특수문자를 포함해야 합니다.",
			),
		confirmPassword: z.string().min(1, "비밀번호 확인을 입력해 주세요."),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "비밀번호가 일치하지 않습니다.",
		path: ["confirmPassword"],
	});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
	onSubmit?: (values: SignupFormValues) => void | Promise<void>;
}

export function SignupForm({ onSubmit }: SignupFormProps) {
	const form = useForm<SignupFormValues>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			loginId: "",
			password: "",
			confirmPassword: "",
		},
		mode: "onChange",
	});

	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting, isValid },
	} = form;

	const handleFormSubmit = async (values: SignupFormValues) => {
		if (onSubmit) {
			await onSubmit(values);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
				<FormField
					control={control}
					name="loginId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>아이디</FormLabel>
							<FormControl>
								<Input placeholder="아이디를 입력하세요" autoComplete="username" {...field} />
							</FormControl>
							<FormMessage>{errors.loginId?.message}</FormMessage>
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>비밀번호</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="비밀번호를 입력하세요"
									autoComplete="new-password"
									{...field}
								/>
							</FormControl>
							<FormMessage>{errors.password?.message}</FormMessage>
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>비밀번호 확인</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="비밀번호를 다시 입력하세요"
									autoComplete="new-password"
									{...field}
								/>
							</FormControl>
							<FormMessage>{errors.confirmPassword?.message}</FormMessage>
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full cursor-pointer" disabled={!isValid || isSubmitting}>
					{isSubmitting ? "회원가입 중..." : "회원가입"}
				</Button>
			</form>
		</Form>
	);
}

export default SignupForm;
