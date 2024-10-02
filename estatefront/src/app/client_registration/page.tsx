
"use client";
import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ClientRegistration() {

  const [newClient, setNewClient] = React.useState({ name: '', email: '',password1: '', password2: '', tours: [] });

  const router = useRouter();


  // Register client
  const registerClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/create-client', newClient);

      console.log(`Successful registration ${response.status}`)

      router.push('/')

    } catch (error) {
      console.error('Error registering in client:', error);
    }
  };


  return (
    <div
      style={{
        backgroundImage: 'url("/assets/pexels-davidmcbee-1546168.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',  
      }}
    >
      <div style={{  backgroundColor: 'white' }} className='items-center w-[350px] h-[680px] rounded-2xl'>
        <div >
          <Image
            src="/assets/house.png"
            alt="Homely Realtors"
            width={70}  
            height={70}
            className='mx-auto mt-5'
          /> 
        </div>
        <form onSubmit={registerClient} className="mx-4 my-4 p-4 bg-blue-100 rounded shadow"> 
            <input
                placeholder="Please enter name"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                className="mb-2 w-full p-2 border border-gray-300 rounded"
            />
            <input
                placeholder="Please enter email"
                type='email'
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                className="mb-2 w-full p-2 border border-gray-300 rounded"
            />
            <input
                placeholder="Please enter password"
                type='password'
                value={newClient.password1}
                onChange={(e) => setNewClient({ ...newClient, password1: e.target.value })}
                className="mb-2 w-full p-2 border border-gray-300 rounded"
            />
            <input
                placeholder="Repeat password"
                type='password'
                value={newClient.password2}
                onChange={(e) => setNewClient({ ...newClient, password2: e.target.value })}
                className="mb-2 w-full p-2 border border-gray-300 rounded"
            />
            <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
              Register
            </button>
        </form>

        <div className="mx-4 my-4  p-4 bg-blue-100 rounded shadow">
            <p>Already have an acount?</p>

            <button className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                <Link href="/">Login here</Link>
            </button>
        </div>

        <hr className="mx-12 border-2 border-teal-950"/>

        <div className="mx-4 my-4 p-4 bg-green-100 rounded shadow">
            <button className="mb-2 w-full p-2 text-white bg-green-500 rounded hover:bg-green-600">
                <Link href="/agent_login">Login as an agent</Link>
            </button>

            <button className="mt-2 w-full p-2 text-white bg-green-500 rounded hover:bg-green-600">
                <Link href="/agent_registration">Register as an agent &#x1F600;</Link>
            </button>
        </div>
      </div>
    </div>
  );
}
