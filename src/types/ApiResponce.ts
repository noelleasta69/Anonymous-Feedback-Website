import { Message } from "@/model/User";

export interface NextApiResponce {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>
}
