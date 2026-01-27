import { PostEditPage } from "@/features/post/screens/PostEditPage";

interface PostEditPageProps {
	params: Promise<{ groupId: string; postId: string }>;
}

export default async function Page(props: PostEditPageProps) {
	const { groupId, postId } = await props.params;

	return <PostEditPage groupId={groupId} postId={postId} />;
}
