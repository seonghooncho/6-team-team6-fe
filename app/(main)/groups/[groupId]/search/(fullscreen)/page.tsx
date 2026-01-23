import { GroupSearchPage } from "@/features/post/screens/GroupSearchPage";

interface SearchPageProps {
	params: Promise<{
		groupId: string;
	}>;
}

export default async function Page(props: SearchPageProps) {
	const { groupId } = await props.params;

	return <GroupSearchPage groupId={groupId} />;
}
