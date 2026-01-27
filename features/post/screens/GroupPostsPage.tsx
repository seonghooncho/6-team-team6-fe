import Link from "next/link";

import PostItem from "@/features/post/components/PostItem";
import { DUMMY_POST_SUMMARIES } from "@/features/post/constants";

import HorizontalPaddingBox from "@/shared/components/layout/HorizontalPaddingBox";
import { Separator } from "@/shared/components/ui/separator";

interface GroupPostsPageProps {
	groupId: string;
}

export function GroupPostsPage(props: GroupPostsPageProps) {
	const { groupId } = props;

	return (
		<ul className="flex flex-col gap-6 py-6">
			{DUMMY_POST_SUMMARIES.map((post, index) => (
				<li key={post.postId} className="flex flex-col gap-y-6">
					<HorizontalPaddingBox>
						<Link href={`/groups/${groupId}/posts/${post.postId}`}>
							<PostItem {...post} />
						</Link>
					</HorizontalPaddingBox>
					{index !== DUMMY_POST_SUMMARIES.length - 1 && <Separator />}
				</li>
			))}
		</ul>
	);
}
