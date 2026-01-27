"use client";

import { z } from "zod";

import { updateMockPost, USE_POST_MOCKS } from "@/features/post/lib/mock-posts";
import type { FeeUnit } from "@/features/post/schemas";

import { apiClient } from "@/shared/lib/api/api-client";

const UpdatePostResponseSchema = z.object({
	postId: z.number(),
});

type UpdatePostResponse = z.infer<typeof UpdatePostResponseSchema>;

type UpdatePostImageInfo = {
	postImageId: number | null;
	imageUrl: string;
};

type UpdatePostParams = {
	groupId: string;
	postId: string;
	title: string;
	content: string;
	rentalFee: number;
	feeUnit: FeeUnit;
	imageUrls: UpdatePostImageInfo[];
	newImages: File[];
};

class UpdatePostError extends Error {
	status: number;
	errorCode?: string;

	constructor(status: number, errorCode?: string) {
		super(errorCode ?? "UNKNOWN_ERROR");
		this.name = "UpdatePostError";
		this.status = status;
		this.errorCode = errorCode;
	}
}

async function updatePost(params: UpdatePostParams): Promise<UpdatePostResponse> {
	const { groupId, postId, title, content, rentalFee, feeUnit, imageUrls, newImages } = params;

	if (USE_POST_MOCKS) {
		if (!groupId) {
			throw new UpdatePostError(404, "GROUP_NOT_FOUND");
		}
		const postIdNumber = Number(postId);
		if (Number.isNaN(postIdNumber)) {
			throw new UpdatePostError(404, "POST_NOT_FOUND");
		}
		const updated = updateMockPost({
			postId: postIdNumber,
			title,
			content,
			rentalFee,
			feeUnit,
			imageUrls,
			newImages,
		});
		if (!updated) {
			throw new UpdatePostError(404, "POST_NOT_FOUND");
		}
		return UpdatePostResponseSchema.parse(updated);
	}

	const formData = new FormData();
	formData.append("title", title);
	formData.append("content", content);
	formData.append("rentalFee", String(rentalFee));
	formData.append("feeUnit", feeUnit);
	formData.append("imageUrls", JSON.stringify(imageUrls));
	newImages.forEach((file) => {
		formData.append("newImages", file);
	});

	const response = await apiClient.put(`groups/${groupId}/posts/${postId}`, {
		body: formData,
	});

	const data = await response.json().catch(() => null);

	if (!response.ok) {
		const errorCode =
			typeof data === "object" && data !== null
				? (data as { errorCode?: string }).errorCode
				: undefined;
		throw new UpdatePostError(response.status, errorCode);
	}

	return UpdatePostResponseSchema.parse(data);
}

export type { UpdatePostImageInfo, UpdatePostParams, UpdatePostResponse };
export { updatePost, UpdatePostError };
