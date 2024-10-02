
"use client";
import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
//import { getMyVariable, setMyVariable } from '@/components/Auth';

export default function AgentLogin() {

  const [newAgent, setNewAgent] = React.useState({ email: '', password: ''});

  const router = useRouter();


  // Login user
  const loginAgent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/agent/login', newAgent);

      console.log(`Successful login ${response.status}`)

      localStorage.setItem('token', response.data.token);

      console.log(response.data.token)

      let agentId = response.data.agent['id']

      localStorage.setItem('agentId', agentId);

      /*const handleChange = () => {
        const newValue = true;
        setMyVariable(newValue);
      };

      handleChange()*/

      router.push(`/agent/${agentId}`)

    } catch (error) {
      console.error('Error logging in agent:', error);
    }
  };


  return (
    <div
      style={{
        backgroundImage: 'url("/assets/agents.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',  
      }}
    >
      <div style={{  backgroundColor: 'white' }} className='items-center w-[350px] h-[570px] rounded-2xl'>
        <div >
          <Image
            src="/assets/house.png"
            alt="Homely Realtors"
            width={70}  
            height={70}
            className='mx-auto mt-5'
          /> 
        </div>
        <form onSubmit={loginAgent} className="mx-4 my-4 p-4 bg-blue-100 rounded shadow"> 
            <input
                placeholder="Please enter email"
                value={newAgent.email}
                onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                className="mb-2 w-full p-2 border border-gray-300 rounded"
            />
            <input
                placeholder="Please enter password"
                type='password'
                value={newAgent.password}
                onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
                className="mb-2 w-full p-2 border border-gray-300 rounded"
            />
            <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
              <p >Login</p>
            </button>
        </form>

        <div className="mx-4 my-4  p-4 bg-blue-100 rounded shadow">
            <p>Don't have an acount?</p>

            <button className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                <Link href="/agent_registration">Register here</Link>
            </button>
        </div>

        <hr className="mx-12 border-2 border-teal-950"/>

        <div className="mx-4 my-4 p-4 bg-green-100 rounded shadow">
            <button className="mb-2 w-full p-2 text-white bg-green-500 rounded hover:bg-green-600">
                <Link href="/">Login as an client</Link>
            </button>

            <button className="mt-2 w-full p-2 text-white bg-green-500 rounded hover:bg-green-600">
                <Link href="/client_registration">Register as a client &#x1F600;</Link>
            </button>
        </div>
      </div>
    </div>
  );
}
