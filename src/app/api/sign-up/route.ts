import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
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
            return Response.json({
                success: false, // signup failed bcs user is already present and verified
                message: "Username is taken"
            }, {status: 400})
        }
        
        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString(); // creating a random verification code

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        // success: false,
                        message: "user already exists with this email"
                    }, 
                    {status: 400}
                )   
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode =  verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                //saving/updating the user
                await existingUserByEmail.save()
            }
        } else{  // user is not present so create a new one
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date(); // current date
            expiryDate.setHours(expiryDate.getHours() + 1); // setting expiryDate 1hr form current time
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []

            })
            await newUser.save() 
        } 

        //send verification email
        const emailResponce = await sendVerificationEmail(email, username, verifyCode);

        // agar seding email was unsuccessfull

        if(!emailResponce.success){
            return Response.json({
                success: false,
                message: emailResponce.message
                }, 
                {status: 500}
            )

        }
        // agar seding email was successfull
        return Response.json({
            success: true,
            message: "User Registerd successfully please verify your email"
            }, 
            {status: 200}
        )

    } catch (error) {
        console.log("Error while registering(signing up) user" ,error);
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


// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import bcrypt from "bcryptjs";
// import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

// export async function POST(request: Request) {
//     await dbConnect();

//     try {
//         const { username, email, password } = await request.json();

//         // Check if username is already taken
//         const existingUserVerifiedByUsername = await UserModel.findOne({
//             username,
//             isVerified: true,
//         });

//         if (existingUserVerifiedByUsername) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Username is taken",
//                 },
//                 { status: 400 }
//             );
//         }

//         // Check if email is already used
//         const existingUserByEmail = await UserModel.findOne({ email });
//         const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

//         if (existingUserByEmail) {
//             if (existingUserByEmail.isVerified) {
//                 return NextResponse.json(
//                     {
//                         success: false,
//                         message: "User already exists with this email",
//                     },
//                     { status: 400 }
//                 );
//             } else {
//                 // Update the existing user with a new password and verification code
//                 const hashedPassword = await bcrypt.hash(password, 10);
//                 existingUserByEmail.password = hashedPassword;
//                 existingUserByEmail.verifyCode = verifyCode;
//                 existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

//                 await existingUserByEmail.save();
//             }
//         } else {
//             // Create a new user
//             const hashedPassword = await bcrypt.hash(password, 10);
//             const expiryDate = new Date();
//             expiryDate.setHours(expiryDate.getHours() + 1);

//             const newUser = new UserModel({
//                 username,
//                 email,
//                 password: hashedPassword,
//                 verifyCode,
//                 verifyCodeExpiry: expiryDate,
//                 isVerified: false,
//                 isAcceptingMessage: true,
//                 messages: [],
//             });

//             await newUser.save();
//         }

//         // Send verification email
//         const emailResponse = await sendVerificationEmail(email, username, verifyCode);

//         if (!emailResponse.success) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: emailResponse.message,
//                 },
//                 { status: 500 }
//             );
//         }

//         // If email sending is successful
//         return NextResponse.json(
//             {
//                 success: true,
//                 message: "User registered successfully. Please verify your email.",
//             },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Error while registering (signing up) user:", error);
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Error while registering user",
//             },
//             { status: 500 }
//         );
//     }
// }
