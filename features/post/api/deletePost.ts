"use client";

import { deleteMockPost, USE_POST_MOCKS } from "@/features/post/lib/mock-posts";

import { apiClient } from "@/shared/lib/api/api-client";

type DeletePostParams = {
	groupId: string;
	postId: string;
};

class DeletePostError extends Error {
	status: number;
	errorCode?: string;

	constructor(status: number, errorCode?: string) {
		super(errorCode ?? "UNKNOWN_ERROR");
		this.name = "DeletePostError";
		this.status = status;
		this.errorCode = errorCode;
	}
}

async function deletePost(params: DeletePostParams): Promise<void> {
	const { groupId, postId } = params;

	if (USE_POST_MOCKS) {
		if (!groupId) {
			throw new DeletePostError(404, "GROUP_NOT_FOUND");
		}
		const postIdNumber = Number(postId);
		if (Number.isNaN(postIdNumber)) {
			throw new DeletePostError(404, "POST_NOT_FOUND");
		}
		const deleted = deleteMockPost(postIdNumber);
		if (!deleted) {
			throw new DeletePostError(404, "POST_NOT_FOUND");
		}
		return;
	}

	const response = await apiClient.delete(`groups/${groupId}/posts/${postId}`);

	if (response.ok) {
		return;
	}

	const data = await response.json().catch(() => null);
	const errorCode =
		typeof data === "object" && data !== null
			? (data as { errorCode?: string }).errorCode
			: undefined;
	throw new DeletePostError(response.status, errorCode);
}

export type { DeletePostParams };
export { deletePost, DeletePostError };
