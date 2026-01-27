import HorizontalPaddingBox from "@/shared/components/layout/HorizontalPaddingBox";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { cn } from "@/shared/lib/utils";

interface PostItemSkeletonListProps {
	count?: number;
	className?: string;
}

function PostItemSkeletonList(props: PostItemSkeletonListProps) {
	const { count = 20, className } = props;

	return (
		<ul className={cn("flex flex-col gap-6", className)}>
			{Array.from({ length: count }).map((_, index) => (
				<li key={`post-skeleton-${index}`} className="flex flex-col gap-y-6">
					<HorizontalPaddingBox>
						<div className="flex gap-x-4">
							<Skeleton className="size-[100px]" />
							<div className="flex min-w-0 flex-1 flex-col gap-2">
								<Skeleton className="h-5 w-2/3" />
								<Skeleton className="h-5 w-1/3" />
								<Skeleton className="h-5 w-16" />
							</div>
						</div>
					</HorizontalPaddingBox>
					{index !== count - 1 ? <Separator /> : null}
				</li>
			))}
		</ul>
	);
}

export { PostItemSkeletonList };
