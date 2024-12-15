import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";


export async function POST(req:Request) {
    await dbConnect();

    const {username, content} = await req.json();

    try {
        const user = await UserModel.findOne({username});

        if(!user){
            return Response.json({
                success: false,
                message: "user not found"
            },
            {
                status: 500
            })
        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success: false,
                message: "user not accepting the message"
            },
            {
                status: 403
            })
        }

            const newMessage = {content, createdAt: new Date()};
            user.messages.push(newMessage as Message) // why do we have to write as Message??
            await user.save();

            return Response.json({
                success: true,
                message: "Message sent Succfully"
            },
            {
                status: 200
            })

    } catch (error) {
        console.log("Error adding messages: ",error);
        return Response.json({
            success: false,
            message: "Internal Sefver Error"
        },
        {
            status: 500,
        }
    )
    }
}