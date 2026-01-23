import { PostEditPage } from "@/features/post/screens/PostEditPage";

interface PostEditPageProps {
	params: Promise<{ postId: string }>;
}

export default async function Page(props: PostEditPageProps) {
	const { postId } = await props.params;

	return <PostEditPage postId={postId} />;
}
