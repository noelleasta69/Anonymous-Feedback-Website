import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";


export async function POST(request: Request) {
    await dbConnect();
    
    try {
        const {username, email, password} = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername){
            
        }
        
    } catch (error) {
        console.log("Error while registering user",error);
        return Response.json(
            {
                success: false,
                message: "Error while registering user"
            },
            {
                status: 500 
            }
        )
    }
}