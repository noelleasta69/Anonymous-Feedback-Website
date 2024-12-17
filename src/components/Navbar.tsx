'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'

const Navbar = () => {
  const {data: session} = useSession();
  const user : User =  session?.user;
  console.log("user in navbar componenet: ", user);

  return (
    <nav className="p-4 md:p-4 shadow-md bg-black text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl text-white font-bold mb-4 md:mb-0">Mystry Message</a>
        {session ? (
          <>
            {/* <span className='mr-4'>Welcome, {user.username || user.email}</span> */}
            <button 
              onClick={() => signOut()} 
              className="w-full md:w-auto px-6 py-2 rounded-md bg-white text-black hover:bg-gray-200 transition-colors duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href={'/sign-in'}>
            <button 
              className="w-full md:w-auto px-6 py-2 rounded-md bg-white text-black hover:bg-gray-200 transition-colors duration-200"
            >
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar