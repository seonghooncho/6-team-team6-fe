import { GroupPostsPage } from "@/features/post/screens/GroupPostsPage";

interface RentalsPageProps {
	params: Promise<{
		groupId: string;
	}>;
}

export default async function Page(props: RentalsPageProps) {
	const { groupId } = await props.params;

	return <GroupPostsPage groupId={groupId} />;
}
