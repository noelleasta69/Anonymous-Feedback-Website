// import type { NextApiRequest, NextApiResponse } from 'next';
import resend from "@/lib/resend";
import EmailTemplate from '../../email/verificationEmail';
import { NextApiResponce } from "@/types/ApiResponce"; 


export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<NextApiResponce> {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'verification Code | True Feedback',
      react: EmailTemplate({username, otp: verificationCode}), 
    });
    return ({
      success: true,
      message: "Successfully sent verification code"
    })
  } catch (emailError) {
    
    console.log("Error while sending verification email", emailError);

    return ({
      success: false,
      message: "Error while sending verification code"
    })
  }

}









// what is this and what does the below lines do>> 
// below lines are taken form resende email docs**************************************************************************
// export default async (req: NextApiRequest, res: NextApiResponse) => {
//     const { data, error } = await resend.emails.send({
//       from: 'Acme <onboarding@resend.dev>',
//       to: ['delivered@resend.dev'],
//       subject: 'Hello world',
//       react: EmailTemplate({ username: 'John' , otp: "123456"}),
//     });
  
//     if (error) {
//       return res.status(400).json(error);
//     }
   
//     res.status(200).json(data);
//   };