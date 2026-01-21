import DefaultNavigation from "@/shared/components/layout/bottomNavigations/DefaultNavigation";
import DefaultHeader from "@/shared/components/layout/headers/DefaultHeader";

interface GroupLayoutProps {
	children: React.ReactNode;
	params: {
		groupId: string;
	};
}

function GroupLayout({ children, params }: GroupLayoutProps) {
	return (
		<>
			<DefaultHeader />
			<div className="flex flex-1">
				<section
					className={`flex flex-1 flex-col h-full overflow-y-scroll no-scrollbar 
						px-(--p-layout-horizontal)
						pb-(--h-bottom-nav)
 `}
				>
					{children}
				</section>
			</div>
			<DefaultNavigation />
		</>
	);
}

export default GroupLayout;
