import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function GET(req:Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user : User = session?.user
    console.log("current user form get-meesages: ", user); // remove this later.

    if(!session || !user){
        return Response.json({
            success: false,
            message: "User not authenticated"
        },
        {
            status: 500
        }
    )
    }

    const userId = new mongoose.Types.ObjectId(user._id); // to convert it into an id from string.
    // stirng id would work for normal tasks but would not work for aggregation pipelie 
    const seeWhatisInside = user.id;
    console.log("see what is inside of user.id :: ", seeWhatisInside);


    try {
        const user = await UserModel.aggregate([
          { $match: { _id: userId } },
          { $unwind: '$messages' },
          { $sort: { 'messages.createdAt': -1 } },
          { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]).exec();
    
        if (!user || user.length === 0) {
          return Response.json(
            { message: 'User not found', success: false },
            { status: 404 }
          );
        }
    
        return Response.json(
          { messages: user[0].messages },
          {
            status: 200,
          }
        );
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json(
          { message: 'Internal server error', success: false },
          { status: 500 }
        );
    }



}