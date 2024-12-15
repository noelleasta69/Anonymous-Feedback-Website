import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import {User} from 'next-auth'
import { messageSchema } from "@/schemas/messageSchema";

export const POST = async(req: Request) => {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user : User = session?.user;

    if (!session || !session.user) {
        return Response.json(
          {
            success: false,
            message: "User not authenticated",
          },
          {
            status: 403,
          },
        );
    }

    const userId = user._id;
    const {acceptMessages} = await req.json(); // This  is sent from fornt end to chenge the accept message status of user.

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },

            {
              new: true,
            },
            // above third parameter decides what to return in the updatedUser variable
            // if used {new: true} then the updatedUser will have the updated user 
            // and if set to false or not used then updated user will have user before updadation .
        );


        if (!updatedUser) {
            return Response.json(
              {
                success: false,
                message: "Unable to find the user",
              },
              {
                status: 404,
              },
            );
        }

        return Response.json(
            {
              success: true,
              message: "Accept message status updated successfully",
            },
            {
              status: 200,
            },
        );


    } catch (error) {
        console.error("Error updating accept message status", error);
        return Response.json(
            {
              success: false,
              message: "Error updating the message status",
            },
            {
              status: 500,
            },
          );
    }

}

export async function GET(req:Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user : User = session?.user

    console.log("user from accept-message route: ",user);

    if(!session || !user){
        return Response.json({
            success: false,
            message: "User not Authenticated"
        },
        {
            status: 401,
        }
        )
    }

    const userId = user._id

    try {
        const user = await UserModel.findById(userId);
    
        if (!user) {
          return Response.json(
            {
              success: false,
              message: "Unable to find the user",
            },
            {
              status: 404,
            },
          );
        }
    
        return Response.json(
          {
            success: true,
            isAcceptingMessages: user.isAcceptingMessage,
          },
          {
            status: 200,
          },
        );
      } catch (error) {
        console.error("Error updating accept message status", error);
        return Response.json(
          {
            success: false,
            message: "Error in getting message acceptance status",
          },
          {
            status: 500,
          },
        );
      }

} 

