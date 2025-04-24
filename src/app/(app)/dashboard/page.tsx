'use client'
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { NextApiResponce } from '@/types/ApiResponce';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form';

const [messages, setMessages] = useState<Message[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [isSwitchLoading,setIsSwitchLoading] = useState(false);
const { toast } = useToast();
 
const handleDeleteMessage = (messageId: string) => {
  setMessages(messages.filter((message)=> message._id !== messageId));
}

const {data: session} = useSession();

const form = useForm({
  resolver: zodResolver(acceptMessageSchema)
});

const { register, watch, setValue } = form;

const acceptMessages = watch('acceptMessage');

const fetchAcceptMessaages = useCallback(async ()=> {
  setIsSwitchLoading(true);
  try {
    const response = await axios.get<NextApiResponce>('/api/accept-message');
    setValue("acceptMessage", response.data.isAcceptingMessages)
  } catch (error) {
    const axiosError = error as AxiosError<NextApiResponce>;
    toast({
      title: "Error",
      description: axiosError.response?.data.message || 'failed to fetch the message setting',
      variant: 'destructive'
    })
  } finally {
    setIsSwitchLoading(false);
  }
}, [setValue,toast])

const fetchMessages = useCallback(()=>{
  
}, [])


const DashBoard = () => {
  return (
    <div>DashBoard</div>
  )
}

export default DashBoard