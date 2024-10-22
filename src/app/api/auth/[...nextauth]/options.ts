import { NextAuthOptions } from "next-auth";
// import Credentials, { CredentialsProvider } from "next-auth/providers/credentials";  // this is wrong
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials", // this is just id you have given to identify this auth option as you can have more than one
            name: "credentials",//this is the name of credential options you have given (you can name it anything)

            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },


            async authorize(credentials:any): Promise<any> {
                await dbConnect();

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier.email},// this is how you get access to credentials
                            {username: credentials.identifier} // both are correct>>>>
                        ]
                    })

                    if(!user){
                        throw new Error("No user with this eamil");
                        
                    }
                    if(!user.isVerified){
                        throw new Error("Please veriry account first");
                        
                    }

                    const isPasswordCorrect =  await bcrypt.compare(credentials.password, user.password) // for password you dont have to do credentials.indentifier.password

                    if(isPasswordCorrect){
                        return user;
                    }
                    else{
                        throw new Error("Incorrect password");
                        
                    }

                } catch (err: any) {
                    throw new Error(err); // yahan pe thorw new Error(err) ye karna jaruri hai--> but why>???
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user}) {
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username

            }

            return token
        },
        async session({ session, user, token }) {
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username

            }

            return session
        },
    },
    pages: {
        signIn: '/sign-in'
    }, 
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET


}