import "next-auth"
import { DefaultSession } from "next-auth"

// in this we can redefine or modify existing modules of next-auth

declare module 'next-auth'{
    interface User {
        _id? : string,
        isVerified?: string,
        isAcceptingMessages?: boolean,
        username?: string
    }

    interface Session {
        user: {
            _id? : string,
            isVerified?: string,
            isAcceptingMessages?: boolean,
            username?: string
        } & DefaultSession['username']  //??
    }
}

// another way to modify

declare module 'next-auth/jwt' {
    interface JWT {
        _id? : string,
        isVerified?: string,
        isAcceptingMessages?: boolean,
        username?: string 
    }
}