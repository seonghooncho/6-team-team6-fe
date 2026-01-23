import Link from "next/link";

import PostItem from "@/features/post/components/PostItem";
import { DUMMY_POSTS } from "@/features/post/constants";

import HorizontalPaddingBox from "@/shared/components/layout/HorizontalPaddingBox";
import { Separator } from "@/shared/components/ui/separator";

interface RentalsPageProps {
	params: Promise<{
		groupId: string;
	}>;
}

async function PostsPage(props: RentalsPageProps) {
	const { groupId } = await props.params;

	console.log(groupId);

	return (
		<ul className={`flex flex-col gap-6 py-6`}>
			{DUMMY_POSTS.map((post, index) => (
				<li key={post.postId} className="flex flex-col gap-y-6">
					<HorizontalPaddingBox>
						<Link href={`/groups/${groupId}/posts/${post.postId}`}>
							<PostItem {...post} />
						</Link>
					</HorizontalPaddingBox>
					{index !== DUMMY_POSTS.length - 1 && <Separator />}
				</li>
			))}
		</ul>
	);
}

export default PostsPage;
