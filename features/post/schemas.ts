import { z } from "zod";

const PostSchema = z.object({
	postId: z.number(),
	postTitle: z.string().min(1, "글 제목을 입력해 주세요."),
	postFirstImageUrl: z.string().url("이미지 URL 형식이 올바르지 않습니다."),
	rentalFee: z.number().min(0, "대여료는 0 이상이어야 합니다."),
	feeUnit: z.enum(["HOUR", "DAY"]),
	rentalStatus: z.enum(["AVAILABLE", "RENTED_OUT"]),
});

export type Post = z.infer<typeof PostSchema>;

export { PostSchema };
