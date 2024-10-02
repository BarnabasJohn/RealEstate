"use client"
import axios from 'axios';
import Image from 'next/image';
import { useRouter, redirect, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import HorizontalScrollbar from '@/components/AgentScrollbar';
import { Listing } from '@/app/(client)/client_home/[home]/page';


interface Agent {
    name: string;
    email: string;
    password1: string;
    password2: string;
    contact: number;
    listings: Listing[];
}


export default function AgentProfile () {

    const router = useRouter();

    const params = useParams<{ profile: string;}>()


    const [newListing, setNewListing] = useState({
        name: '', location: '',
        price: 0, bedrooms: 0,
        visual_urls: [], ownership: '',
        distance: 0, agent:parseInt(params.profile), tours: 0
    });

    const [listings, setListings] = useState<Listing[]>([])

    const [agent, setAgent] = useState<Agent>()

    const agent_listing = async() => {
        let response = await axios.get(`http://localhost:8080/agent/${params.profile}`)
        //setAgent(response.data)
        //setNewAgent({...newAgent, listings: response.data.listings})
    }

    const [newAgent, setNewAgent] = useState({
        name: '', email: '',
        password1: '', password2: '',
        contact: 254, listings: agent_listing,
    })

    // Fetch tours
    useEffect(() => {
        const fetchData = async () => {

            const token = localStorage.getItem('token');

            if (!token) {
                router.push('/');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/agent/${params.profile}/listings`)

                console.log( response.status)

                console.log( response.data)

                setListings(response.data.reverse())

                let agent_response = await axios.get(`http://localhost:8080/agent/${params.profile}`)

                setAgent(agent_response.data)

                setNewAgent({...newAgent, listings: agent_response.data.listings})

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

            fetchData();

    }, []);


    // Create listing
    const createListing = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
        const response = await axios.post(`http://localhost:8080/agent/${params.profile}/create-listing`, newListing);

        console.log(`Successful update ${response.status}`)

        router.push(`/agent/${params.profile}`)

        } catch (error) {
        console.error('Error updating listing:', error);
        }
    };

    // Update agent
    const updateAgent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
        const response = await axios.patch(`http://localhost:8080/updateagent/${params.profile}`, newAgent);

        console.log(`Successful update ${response.status}`)

        router.push(`/agent/${params.profile}`)

        } catch (error) {
        console.error('Error updating listing:', error);
        }
    };

    // Delete agent
    const deleteAgent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
        const response = await axios.delete(`http://localhost:8080/deleteagent/${params.profile}`);

        console.log(`Successful deletion ${response.status}`)

        router.push('/')

        } catch (error) {
        console.error('Error deleting in client:', error);
        }
    };

    if(agent){
        <>
            <div className='mb-4'
                style={{
                    backgroundImage: 'url("/assets/agentprofile.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '500px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',  
                }}
            >
               <div>
                    <Image
                        src="/assets/house.png"
                        alt="Homely Realtors"
                        width={70}  
                        height={70}
                        className='mx-auto mt-5'
                    />
                    <h1 
                        style={{ display: 'flex', alignContent: 'center',fontSize: '40px', color: 'black', fontWeight: 'bolder' }}
                        className=' mt-5'
                    >
                        Homely&#x1F600;.
                    </h1>
                </div>    
            </div>

            <h1
                className='mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white'
            >Welcome {`${agent?.name}`}
            </h1>

            <HorizontalScrollbar  listings={ listings }/>
            
            <div className="grid grid-cols-2 gap-4 mx-2 mt-6">
                <div className="bg-green-100 p-4 rounded-xl border-2
                        border-black h-[500px]">
                    <form onSubmit={createListing} className="mx-auto my-4 p-4 bg-green-300 rounded shadow"> 
                        <input
                            placeholder="Please enter name"
                            value={newListing.name}
                            onChange={(e) => setNewListing({ ...newListing, name: e.target.value })}
                            className="mb-2 w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            placeholder="Please enter location"
                            value={newListing.location}
                            onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                            className="mb-2 w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            placeholder="Please enter price"
                            type='number'
                            value={newListing.price}
                            onChange={(e) => setNewListing({ ...newListing, price: parseInt(e.target.value) })}
                            className="mb-2 w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            placeholder="Please number of bedrooms"
                            type='number'
                            value={newListing.bedrooms}
                            onChange={(e) => setNewListing({ ...newListing, bedrooms: parseInt(e.target.value)})}
                            className="mb-2 w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            placeholder="Please ownership status"
                            value={newListing.ownership}
                            onChange={(e) => setNewListing({ ...newListing, ownership: e.target.value})}
                            className="mb-2 w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            placeholder="Distance to road"
                            type='number'
                            value={newListing.distance}
                            onChange={(e) => setNewListing({ ...newListing, distance: parseInt(e.target.value)})}
                            className="mb-2 w-full p-2 border border-gray-300 rounded"
                        />
                        <button type="submit" className="w-full p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600">
                            Create Listing
                        </button>
                    </form>
                </div>
                <div className="bg-blue-100 p-4 h-[500px] rounded-xl
                                border-2 border-black">
                    <form onSubmit={updateAgent} className="mx-4 my-4 p-4 bg-blue-300 rounded shadow"> 
                        <input
                            placeholder={`Change name from: ${agent.name}`}
                            value={newAgent.name}
                            onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                            className="mb-2 w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            placeholder="Please enter email"
                            type='email'
                            value={newAgent.email}
                            onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                            className="mb-2 w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            placeholder="Please enter password"
                            type='password'
                            value={newAgent.password1}
                            onChange={(e) => setNewAgent({ ...newAgent, password1: e.target.value })}
                            className="mb-2 w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            placeholder="Repeat password"
                            type='password'
                            value={newAgent.password2}
                            onChange={(e) => setNewAgent({ ...newAgent, password2: e.target.value })}
                            className="mb-2 w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            placeholder="Enter phone number"
                            type='number'
                            value={newAgent.contact}
                            onChange={(e) => setNewAgent({ ...newAgent, contact:  parseInt(e.target.value) })}
                            className="mb-2 w-full p-2 border border-gray-300 rounded"
                        />
                        <button type="submit" className="w-full p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600">
                            Update Profile
                        </button>
                    </form>
                </div>
            </div>
            <form onSubmit={deleteAgent}>
                <button 
                    type="submit"
                    style={{display:'flex', justifyItems:'center', alignItems:'center', color:'white', fontWeight:'bold'}}
                    className="mx-auto w-[350px] my-10 p-4 bg-red-600 rounded shadow"
                >
                    <p className="mx-auto">Delete Account</p>
                </button>
            </form>
        </>
    }

    return(
        <>
            <div className='mb-4'
                style={{
                    backgroundImage: 'url("/assets/agentprofile.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '500px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',  
                }}
            >
               <div>
                    <Image
                        src="/assets/house.png"
                        alt="Homely Realtors"
                        width={70}  
                        height={70}
                        className='mx-auto mt-5'
                    />
                    <h1 
                        style={{ display: 'flex', alignContent: 'center',fontSize: '40px', color: 'black', fontWeight: 'bolder' }}
                        className=' mt-5'
                    >
                        Homely&#x1F600;.
                    </h1>
                </div>    
            </div>

            <h1
                className='mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white'
            >Welcome {`${agent?.name}`}
            </h1>

            <HorizontalScrollbar  listings={ listings }/>
            
            <div className="grid grid-cols-2 gap-4 mx-2 mt-6">
                <div className="bg-green-100 p-4 rounded-xl border-2
                        border-black h-[500px]">
                    <form onSubmit={createListing} className="mx-auto my-4 p-4 bg-green-300 rounded shadow"> 
                        <input
                            placeholder="Please enter name"
                            value={newListing.name}
                            onChange={(e) => setNewListing({ ...newListing, name: e.target.value })}
                            className="mb-2 w-full p-2 border border-gray-300 rounded hover:border-4"
                        />
                        <input
                            placeholder="Please enter location"
                            value={newListing.location}
                            onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                            className="mb-2 w-full p-2 border border-gray-300 rounded hover:border-4"
                        />
                        <input
                            placeholder="Please enter price"
                            type='number'
                            value={newListing.price}
                            onChange={(e) => setNewListing({ ...newListing, price: parseInt(e.target.value) })}
                            className="mb-2 w-full p-2 border border-gray-300 rounded hover:border-4"
                        />
                        <input
                            placeholder="Please number of bedrooms"
                            type='number'
                            value={newListing.bedrooms}
                            onChange={(e) => setNewListing({ ...newListing, bedrooms: parseInt(e.target.value)})}
                            className="mb-2 w-full p-2 border border-gray-300 rounded hover:border-4"
                        />
                        <input
                            placeholder="Please ownership status"
                            value={newListing.ownership}
                            onChange={(e) => setNewListing({ ...newListing, ownership: e.target.value})}
                            className="mb-2 w-full p-2 border border-gray-300 rounded hover:border-4"
                        />
                        <input
                            placeholder="Distance to road"
                            type='number'
                            value={newListing.distance}
                            onChange={(e) => setNewListing({ ...newListing, distance: parseInt(e.target.value)})}
                            className="mb-2 w-full p-2 border border-gray-300 rounded hover:border-4"
                        />
                        <button type="submit" className="w-full p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600">
                            Create Listing
                        </button>
                    </form>
                </div>
                <div className="bg-blue-100 p-4 h-[500px] rounded-xl
                                border-2 border-black">
                    <form onSubmit={updateAgent} className="mx-4 my-4 p-4 bg-blue-300 rounded shadow"> 
                        <input
                            placeholder={`${agent?.name}`}
                            onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                            className="mb-2 w-full p-2 border border-gray-300 rounded hover:border-4"
                        />
                        <input
                            placeholder={`${agent?.email}`}
                            type='email'
                            onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                            className="mb-2 w-full p-2 border border-gray-300 rounded hover:border-4"
                        />
                        <input
                            placeholder="Please enter password"
                            type='password'
                            value={newAgent.password1}
                            onChange={(e) => setNewAgent({ ...newAgent, password1: e.target.value })}
                            className="mb-2 w-full p-2 border border-gray-300 rounded hover:border-4"
                        />
                        <input
                            placeholder="Repeat password"
                            type='password'
                            value={newAgent.password2}
                            onChange={(e) => setNewAgent({ ...newAgent, password2: e.target.value })}
                            className="mb-2 w-full p-2 border border-gray-300 rounded hover:border-4"
                        />
                        <input
                            placeholder={`${agent?.contact}`}
                            type='number'
                            //value={newAgent.contact}
                            onChange={(e) => setNewAgent({ ...newAgent, contact:  parseInt(e.target.value) })}
                            className="mb-2 w-full p-2 border border-gray-300 rounded hover:border-4"
                        />
                        <button type="submit" className="w-full p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600">
                            Update Profile
                        </button>
                    </form>
                </div>
            </div>
            <form onSubmit={deleteAgent}>
                <button 
                    type="submit"
                    style={{display:'flex', justifyItems:'center', alignItems:'center', color:'white', fontWeight:'bold'}}
                    className="mx-auto w-[350px] my-10 p-4 bg-red-600 rounded shadow hover:p-8"
                >
                    <p className="mx-auto">Delete Account</p>
                </button>
            </form>
        </>
    )
}