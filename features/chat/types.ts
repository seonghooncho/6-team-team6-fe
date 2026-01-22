export type ChatSummary = {
	chatRoomId: number;
	postFirstImageUrl: string;
	lastMessageAt: string;
	lastMessage: string;
	unreadCount: number;
};

export type ChatPartner = {
	chatPartnerId: number;
	chatPartnerAvatarUrl: string;
	chatPartnerNickname: string;
};

export type RoomSummary = ChatSummary & ChatPartner;

export type ChatRoomSource = RoomSummary & {
	postId: number;
};
