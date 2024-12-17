below code does not have the form functioality
******************************

"use client"
import { useEffect, useState } from "react"
import { signUpSchema } from "@/schemas/signUpSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios, { AxiosError } from 'axios'
// import * as z  from "zod"
import { z } from "zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {useDebounceValue} from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Axis3DIcon } from "lucide-react"
import { NextApiResponce } from "@/types/ApiResponce"
import { Loader2 } from "lucide-react"
import Link from "next/link"


export default function ProfileForm() {

  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckinigUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceValue(username, 300);
  const { toast } = useToast();
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    },
  })

  useEffect(()=>{
    const checkUsernameUnique = async () => {
      if(debouncedUsername){
        setIsCheckingUsername(true)
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/check-user-name-unique?username=${debouncedUsername}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<NextApiResponce>;
          setUsernameMessage(axiosError.response?.data.message?? "Error checking username")
        } finally{
          setIsCheckingUsername(false);
        }
      }
    }

    checkUsernameUnique();
  }, [debouncedUsername])



    // 2. Define a submit handler. -> Read more about this on submit funciton and what it is? how is it used ( 39: 00 timeline)
  async function onSubmit(data: z.infer<typeof signUpSchema>){
    console.log(data)
    try {
      const response = await axios.post<NextApiResponce>('api/sign-up', data);
      toast({
        title: 'Success',
        description: response.data.message
      })

      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error in signup of user ", error)
      const axiosError = error as AxiosError<NextApiResponce>;
      let errorMessage = axiosError.response?.data.message ??"Form submitting failed "
      toast({
        title: 'Sign-up failed',
        description: errorMessage,
        variant: "destructive"
      })
      setIsSubmitting(false)
    }
  }


  return (
    <section className=''>
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl mb-2">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        
        {/* // you will write <Form></Form> tag here */}

        {/* add <Form></Form> between this */}

        //**************************************** */
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
    </section>
  );
}


  








