import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

const GET = async (req: Request) => {

    await dbConnect();

    try {
        const {username, code} = await req.json();
        const decodedUsername = decodeURI(username);

        const user = await UserModel.findOne({username:decodedUsername});
        if(!user){
            return Response.json({
                success: false,
                message: "user not found"
            }, {status: 500}
        )
        }


        const userVerificationCode = user.verifyCode;
        const verifyCodeExpiry = new Date(user.verifyCodeExpiry);

        if(userVerificationCode == code && new Date() < verifyCodeExpiry){
            user.isVerified = true;
            await user.save()

            return Response.json({
                success: true,
                message: "user verification successful"
            }, {status: 200})
        } else if(userVerificationCode != code){
            return Response.json({
                success: false,
                message: "verification code is wrong!"
            }, {status: 500})
        } else{
            return Response.json({
                success: false,
                message: "verification code expired!"
            }, {status: 200})
        }






    } catch (error) {
        console.log("Error verifying the user" ,error);
        return Response.json({
            success: false,
            message: ""
        })
    }
};

export default GET;
