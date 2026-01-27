"use client";

import { DUMMY_POST_SUMMARIES } from "@/features/post/constants";
import type { PostSummariesResponseDto } from "@/features/post/schemas";
import {
	PostSummariesResponseApiSchema,
	PostSummariesResponseDtoSchema,
} from "@/features/post/schemas";

import { apiClient } from "@/shared/lib/api/api-client";

type GetGroupPostsParams = {
	groupId: string;
	cursor?: string;
};

const USE_MOCK_GROUP_POSTS = true;
const MOCK_PAGE_SIZE = 10;
const MOCK_CURSOR_TIME = "2026-01-12T03:04:05.123456Z";

type MockCursor = {
	time: string;
	id: number;
};

class GroupPostsError extends Error {
	status: number;
	errorCode?: string;

	constructor(status: number, errorCode?: string) {
		super(errorCode ?? "UNKNOWN_ERROR");
		this.name = "GroupPostsError";
		this.status = status;
		this.errorCode = errorCode;
	}
}

const decodeCursor = (cursor?: string) => {
	if (!cursor) {
		return null;
	}

	try {
		const decoded = JSON.parse(atob(cursor)) as MockCursor;
		return typeof decoded?.id === "number" ? decoded.id : null;
	} catch {
		return null;
	}
};

const encodeCursor = (id: number) =>
	btoa(
		JSON.stringify({
			time: MOCK_CURSOR_TIME,
			id,
		} satisfies MockCursor),
	);

const getMockGroupPosts = (params: GetGroupPostsParams) => {
	const { cursor } = params;
	const cursorId = decodeCursor(cursor);
	const startIndex =
		cursorId === null ? 0 : DUMMY_POST_SUMMARIES.findIndex((post) => post.postId === cursorId) + 1;
	const safeStartIndex = Math.max(0, startIndex);
	const summaries = DUMMY_POST_SUMMARIES.slice(safeStartIndex, safeStartIndex + MOCK_PAGE_SIZE);
	const hasNextPage = safeStartIndex + MOCK_PAGE_SIZE < DUMMY_POST_SUMMARIES.length;
	const lastPostId = summaries.at(-1)?.postId ?? null;

	return PostSummariesResponseDtoSchema.parse({
		summaries,
		nextCursor: hasNextPage && lastPostId ? encodeCursor(lastPostId) : null,
		hasNextPage,
	});
};

async function getGroupPosts(params: GetGroupPostsParams): Promise<PostSummariesResponseDto> {
	const { groupId, cursor } = params;
	if (USE_MOCK_GROUP_POSTS) {
		return getMockGroupPosts(params);
	}

	const searchParams = cursor ? { cursor } : undefined;

	const response = await apiClient.get(`groups/${groupId}/posts`, { searchParams });
	const data = await response.json().catch(() => null);

	if (!response.ok) {
		const errorCode =
			typeof data === "object" && data !== null
				? (data as { errorCode?: string }).errorCode
				: undefined;
		throw new GroupPostsError(response.status, errorCode);
	}

	const parsed = PostSummariesResponseApiSchema.parse(data);
	return PostSummariesResponseDtoSchema.parse({
		summaries: parsed.postSummaries,
		nextCursor: parsed.nextCursor,
		hasNextPage: parsed.hasNext,
	});
}

export type { GetGroupPostsParams };
export { getGroupPosts, GroupPostsError };
