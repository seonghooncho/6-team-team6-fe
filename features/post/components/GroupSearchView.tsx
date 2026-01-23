"use client";

import { type ChangeEvent, type FormEvent } from "react";

import Link from "next/link";

import { GroupSearchHeader } from "@/features/post/components/GroupSearchHeader";
import PostItem from "@/features/post/components/PostItem";
import { type Post } from "@/features/post/schemas";

import HorizontalPaddingBox from "@/shared/components/layout/HorizontalPaddingBox";
import { Separator } from "@/shared/components/ui/separator";
import { Typography } from "@/shared/components/ui/typography";

interface GroupSearchViewProps {
	groupId: string;
	keyword: string;
	submittedKeyword: string;
	recentKeywords: string[];
	searchResults: Post[];
	isSearchEnabled: boolean;
	shouldShowRecentKeywords: boolean;
	shouldShowResults: boolean;
	onKeywordChange: (event: ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
	onSearch: (value?: string) => void;
}

export function GroupSearchView(props: GroupSearchViewProps) {
	const {
		groupId,
		keyword,
		submittedKeyword,
		recentKeywords,
		searchResults,
		isSearchEnabled,
		shouldShowRecentKeywords,
		shouldShowResults,
		onKeywordChange,
		onSubmit,
		onSearch,
	} = props;

	return (
		<>
			<GroupSearchHeader
				keyword={keyword}
				isSearchEnabled={isSearchEnabled}
				onKeywordChange={onKeywordChange}
				onSubmit={onSubmit}
			/>

			<div className="py-6">
				{shouldShowRecentKeywords ? (
					<HorizontalPaddingBox>
						<div className="flex flex-col gap-4">
							<Typography type="subtitle">최근 검색어</Typography>
							{recentKeywords.length > 0 ? (
								<ul className="flex flex-col gap-2">
									{recentKeywords.map((item) => (
										<li key={item}>
											<button
												type="button"
												onClick={() => onSearch(item)}
												className="text-left"
											>
												<Typography type="body-sm">{item}</Typography>
											</button>
										</li>
									))}
								</ul>
							) : (
								<Typography type="caption">최근 검색어가 없어요.</Typography>
							)}
						</div>
					</HorizontalPaddingBox>
				) : shouldShowResults ? (
					<div className="flex flex-col gap-4">
						<HorizontalPaddingBox>
							<Typography type="subtitle">검색 결과</Typography>
						</HorizontalPaddingBox>
						{searchResults.length > 0 ? (
							<ul className="flex flex-col gap-6">
								{searchResults.map((post, index) => (
									<li key={post.postId} className="flex flex-col gap-y-6">
										<HorizontalPaddingBox>
											<Link href={`/groups/${groupId}/posts/${post.postId}`}>
												<PostItem {...post} />
											</Link>
										</HorizontalPaddingBox>
										{index !== searchResults.length - 1 && <Separator />}
									</li>
								))}
							</ul>
						) : (
							<HorizontalPaddingBox>
								<Typography type="body-sm" className="text-muted-foreground">
									{`'${submittedKeyword}'`}에 대한 검색 결과가 없어요.
								</Typography>
							</HorizontalPaddingBox>
						)}
					</div>
				) : (
					<div className="h-10" aria-hidden="true" />
				)}
			</div>
		</>
	);
}
