"use client"
import { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import HorizontalScrollbar from '../../../../components/Scrollbar';
import { useRouter, redirect, useParams } from 'next/navigation';
import { Listing, ListingsProps } from '../../client_home/[home]/page'


export default function ClientProfile () {
    const [newClient, setNewClient] = useState({ name: '', email: '', password1: '', password2: ''});

    const [detail, setDetail ] = useState({ client: '', email: '' })

    const [listings, setListings] = useState<Listing[]>([]);

    const params = useParams<{profile: string}>()

    const router = useRouter();

    // Fetch tours
    useEffect(() => {
        const fetchData = async () => {

            const token = localStorage.getItem('token');

            if (!token) {
                router.push('/');
                return;
            }

            try {
                
                 const response = await axios.get(`http://localhost:8080/client/${params.profile}/tours`)

                setListings(response.data.reverse())

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const details = async () => {

            try {

                const response = await axios.get(`http://localhost:8080/client/${params.profile}`)

                console.log(response.data.name)

                setDetail({ ...detail,  client: `${response.data.name}`, email: `${response.data.email}`})
                
                //setDetail({ ...detail,  client: `${response.data.name}`})

                //setDetail({ ...detail,  email: `${response.data.email}`})

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

            fetchData();

            details();

    }, []);


    // Update client
    const updateClient = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.patch(`http://localhost:8080/updateclient/${params.profile}`, newClient);

            console.log(`Successful update ${response.status}`)

            window.location.reload()

        } catch (error) {
        console.error('Error updating client:', error);
        }
    };

    // Delete client
    const deleteClient = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        try {
        const response = await axios.delete(`http://localhost:8080/deleteclient/${params.profile}`);

        console.log(`Successful deletion ${response.status}`)

        router.push('/')

        } catch (error) {
        console.error('Error deleting in client:', error);
        }
    };

    if (listings.length == 0) {

        return(
            <>
                <h1>Welcome {detail.client}</h1>
                
                <form onSubmit={updateClient} className="mx-auto w-[350px] my-4 p-4 bg-blue-200 rounded shadow"> 
                    <input
                        placeholder={`Change name : ${detail.client}`}
                        onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                        className="mb-2 w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                        placeholder={`Change email: ${detail.email}`}
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
                        placeholder="Please re-enter password"
                        type='password'
                        value={newClient.password2}
                        onChange={(e) => setNewClient({ ...newClient, password2: e.target.value })}
                        className="mb-2 w-full p-2 border border-gray-300 rounded"
                    />
                    <button type="submit" className="w-full p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600">
                        Update
                    </button>
                </form>
                <form onSubmit={deleteClient}>
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
    else{
        return(
            <div className="pt-10">
                
                <h1>Welcome {detail.client}</h1>
                
                <HorizontalScrollbar listings={ listings }/>
                <form onSubmit={updateClient} className="mx-auto w-[350px] my-4 p-4 bg-blue-200 rounded shadow"> 
                    <input
                        placeholder={`Change name : ${detail.client}`}
                        onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                        className="mb-2 w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                        placeholder={`Change email: ${detail.email}`}
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
                        placeholder="Please re-enter password"
                        type='password'
                        value={newClient.password2}
                        onChange={(e) => setNewClient({ ...newClient, password2: e.target.value })}
                        className="mb-2 w-full p-2 border border-gray-300 rounded"
                    />
                    <button type="submit" className="w-full p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600">
                        Update
                    </button>
                </form>
                <form onSubmit={deleteClient}>
                    <button 
                        type="submit"
                        style={{display:'flex', justifyItems:'center', alignItems:'center', color:'white', fontWeight:'bold'}}
                        className="mx-auto w-[350px] my-10 p-4 bg-red-600 rounded shadow hover:p-8"
                    >
                        <p className="mx-auto">Delete Account</p>
                    </button>
                </form>
            </div>
        )
    }
}