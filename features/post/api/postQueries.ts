import { queryOptions } from "@tanstack/react-query";

import { getGroupPosts } from "@/features/post/api/getGroupPosts";
import {
	getPostDetail,
	type GetPostDetailParams,
	type PostDetailError,
} from "@/features/post/api/getPostDetail";
import type { PostDetailDto, PostSummariesResponseDto } from "@/features/post/schemas";

const postQueryKeys = {
	all: ["posts"] as const,
	group: (groupId: string) => [...postQueryKeys.all, "group", groupId] as const,
	list: (groupId: string) => [...postQueryKeys.group(groupId), "list"] as const,
	detail: (groupId: string, postId: string) =>
		[...postQueryKeys.group(groupId), "detail", postId] as const,
};

const postQueries = {
	groupList: (params: { groupId: string; cursor?: string }) => {
		const { groupId, cursor } = params;
		return queryOptions<PostSummariesResponseDto>({
			queryKey: postQueryKeys.list(groupId),
			queryFn: () => getGroupPosts({ groupId, cursor }),
			enabled: Boolean(groupId),
		});
	},
	detail: (params: GetPostDetailParams & { enabled?: boolean }) => {
		const { groupId, postId, enabled = true } = params;
		return queryOptions<PostDetailDto, PostDetailError>({
			queryKey: postQueryKeys.detail(groupId, postId),
			queryFn: () => getPostDetail({ groupId, postId }),
			enabled: Boolean(groupId) && Boolean(postId) && enabled,
		});
	},
};

export { postQueries, postQueryKeys };
