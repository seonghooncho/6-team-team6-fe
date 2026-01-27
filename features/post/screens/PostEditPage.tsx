import { submitPost } from "@/features/post/api/editPost";
import PostEditor from "@/features/post/components/PostEditor";
import { DUMMY_POST_DETAIL_BY_ID } from "@/features/post/constants";
import type { ExistingImage } from "@/features/post/hooks/usePostEditor";

import TitleBackHeader from "@/shared/components/layout/headers/TitleBackHeader";

interface PostEditPageProps {
	postId: string;
}

export function PostEditPage(props: PostEditPageProps) {
	const { postId } = props;

	const postIdNumber = Number(postId);
	const post = DUMMY_POST_DETAIL_BY_ID.get(postIdNumber);

	if (!post) {
		return null; // Or render a 404 page
	}

	const existingImages: ExistingImage[] = post.imageUrls.imageInfos.map((image) => ({
		id: String(image.postImageId),
		url: image.imageUrl,
	}));

	return (
		<div className="relative">
			<TitleBackHeader title="내 물품 수정" />
			<PostEditor
				mode="edit"
				postId={postId}
				initialValues={{
					title: post.title,
					content: post.content,
					rentalFee: post.rentalFee,
					feeUnit: post.feeUnit,
					images: existingImages,
				}}
				// TODO:fix
				onSubmit={submitPost}
			/>
		</div>
	);
}
