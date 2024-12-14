interface ChatData {
    chats: Chat[];
    from: string;
    message: string;
    name: string;
    status: string;
    to: string;
}

interface Chat {
    id: string;
    message: string;
    sender: Sender;
    time: string;
}

interface Sender {
    image: string;
    is_kyc_verified: boolean;
    self: boolean;
    user_id: string;
}
