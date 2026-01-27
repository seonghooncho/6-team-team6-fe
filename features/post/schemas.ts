import { z } from "zod";

const feeUnitSchema = z.enum(["HOUR", "DAY"]);
const rentalStatusSchema = z.enum(["AVAILABLE", "RENTED_OUT"]);

const PostSummaryDtoSchema = z.object({
	postId: z.number(),
	postTitle: z.string().min(1),
	postImageId: z.number(),
	postFirstImageUrl: z.string().min(1),
	rentalFee: z.number().min(0),
	feeUnit: feeUnitSchema,
	rentalStatus: rentalStatusSchema,
});

const PostSummariesResponseDtoSchema = z.object({
	summaries: z.array(PostSummaryDtoSchema),
	nextCursor: z.string().nullable(),
	hasNextPage: z.boolean(),
});

const PostSummariesResponseApiSchema = z.object({
	postSummaries: z.array(PostSummaryDtoSchema),
	nextCursor: z.string().nullable(),
	hasNext: z.boolean(),
});

const PostImageInfoDtoSchema = z.object({
	postImageId: z.number(),
	imageUrl: z.string().min(1),
});

const PostDetailDtoSchema = z.object({
	title: z.string().min(1),
	content: z.string().min(1),
	imageUrls: z.object({
		imageInfos: z.array(PostImageInfoDtoSchema),
	}),
	sellerId: z.number(),
	sellerNickname: z.string().min(1),
	sellerAvatar: z.string().min(1),
	rentalFee: z.number().min(0),
	feeUnit: feeUnitSchema,
	rentalStatus: rentalStatusSchema,
	updatedAt: z.string().min(1),
	isSeller: z.boolean(),
	chatroomId: z.number(),
	activeChatroomCount: z.number().min(0),
});

const emojiRegex = /[\p{Extended_Pictographic}]/u;
const titleSchema = z
	.string()
	.trim()
	.min(2, "제목을 입력해 주세요.")
	.max(50, "제목은 50자 이내로 입력해 주세요.")
	.refine((value) => !emojiRegex.test(value), "이모지는 사용할 수 없습니다.");

const contentSchema = z
	.string()
	.trim()
	.min(1, "내용을 입력해 주세요.")
	.max(2000, "내용은 2000자 이내로 입력해 주세요.")
	.refine((value) => !emojiRegex.test(value), "이모지는 사용할 수 없습니다.");

const rentalFeeSchema = z
	.number()
	.min(1, "대여료는 1원 이상이어야 합니다.")
	.max(100000000, "대여료는 1억 이하로 입력해 주세요.");
// .nullable();

const postImageUrlSchema = z.string().min(1, "이미지 URL 형식이 올바르지 않습니다.");

const PostCreateSchema = z.object({
	title: titleSchema,
	content: contentSchema,
	imageUrls: z.array(postImageUrlSchema).min(1, "이미지를 첨부해 주세요."),
	rentalFee: rentalFeeSchema,
	feeUnit: feeUnitSchema,
});

const PostUpdateImageInfoSchema = z.object({
	postImageId: z.number().nullable().optional(),
	imageUrl: postImageUrlSchema,
});

const PostUpdateSchema = z.object({
	title: titleSchema,
	content: contentSchema,
	imageUrls: z.object({
		imageInfos: z.array(PostUpdateImageInfoSchema).min(1, "이미지를 첨부해 주세요."),
	}),
	rentalFee: rentalFeeSchema,
	feeUnit: feeUnitSchema,
});

const PostEditorSchema = PostCreateSchema.pick({
	title: true,
	content: true,
	rentalFee: true,
	feeUnit: true,
});

type PostCreateRequest = z.infer<typeof PostCreateSchema>;
type PostUpdateRequest = z.infer<typeof PostUpdateSchema>;
type PostEditorValues = z.infer<typeof PostEditorSchema>;

type FeeUnit = z.infer<typeof feeUnitSchema>;
type RentalStatus = z.infer<typeof rentalStatusSchema>;
type PostSummaryDto = z.infer<typeof PostSummaryDtoSchema>;
type PostSummariesResponseDto = z.infer<typeof PostSummariesResponseDtoSchema>;
type PostSummariesResponseApiDto = z.infer<typeof PostSummariesResponseApiSchema>;
type PostImageInfoDto = z.infer<typeof PostImageInfoDtoSchema>;
type PostDetailDto = z.infer<typeof PostDetailDtoSchema>;

export type {
	FeeUnit,
	PostCreateRequest,
	PostDetailDto,
	PostEditorValues,
	PostImageInfoDto,
	PostSummariesResponseApiDto,
	PostSummariesResponseDto,
	PostSummaryDto,
	PostUpdateRequest,
	RentalStatus,
};

export {
	feeUnitSchema,
	PostCreateSchema,
	PostDetailDtoSchema,
	PostEditorSchema,
	PostImageInfoDtoSchema,
	PostSummariesResponseApiSchema,
	PostSummariesResponseDtoSchema,
	PostSummaryDtoSchema,
	PostUpdateImageInfoSchema,
	PostUpdateSchema,
	rentalStatusSchema,
};
