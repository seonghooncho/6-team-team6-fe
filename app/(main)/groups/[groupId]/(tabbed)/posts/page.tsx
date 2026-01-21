import Image from "next/image";

import { DUMMY_POSTS } from "@/features/post/constants";
import { Post } from "@/features/post/schemas";

import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Typography } from "@/shared/components/ui/typography";

type BadgeVariant = "secondary" | "outline";

interface RentalsPageProps {
	params: Promise<{
		groupId: string;
	}>;
}

type PostItemProps = Post;

function PostItem(props: PostItemProps) {
	const { postTitle, postFirstImageUrl, rentalFee, feeUnit, rentalStatus } = props;

	return (
		<div className="flex gap-x-4">
			<div>
				<Image src={postFirstImageUrl} alt={postTitle} width={100} height={100} />
			</div>
			<div>
				<div className="flex flex-col gap-y">
					<div>
						<Typography type="body">{postTitle}</Typography>
					</div>
					<div>
						{rentalFee === 0 ? (
							<Typography type="subtitle">무료 대여</Typography>
						) : (
							<Typography type="subtitle">
								{rentalFee} / {feeUnit === "HOUR" ? "시간" : "일"}
							</Typography>
						)}
					</div>
					{rentalStatus === "RENTED_OUT" && <Badge>대여 중</Badge>}
				</div>
			</div>
		</div>
	);
}

async function PostsPage(props: RentalsPageProps) {
	const { groupId } = await props.params;

	console.log(groupId);

	return (
		<ul className={`flex flex-col gap-6 `}>
			{DUMMY_POSTS.map((post) => (
				<li key={post.postId} className="flex flex-col">
					<PostItem {...post} />
					<Separator />
				</li>
			))}
		</ul>
	);
}

export default PostsPage;
