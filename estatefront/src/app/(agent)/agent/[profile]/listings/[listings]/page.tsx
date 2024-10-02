"use client"
import { useRouter, redirect, useParams } from 'next/navigation';
import NextJsCarousel from '@/components/Carousel';
import { useState, useEffect } from 'react';
import { Listing, ListingsProps } from '../../../../../(client)/client_home/[home]/page'
import axios from 'axios';


export default function AgentListing () {

    const [newListing, setNewListing] = useState({
        name: '', location: '',
        price: 0, bedrooms: 0, ownership: '',
        distance: 0
    });

    const [listing, setListing] = useState<Listing>();

    const params = useParams<{ profile: string; listings: string }>()

    const router = useRouter()

    //Fetch agent's listings
    useEffect(() => {
        const fetchData = async () => {

            const token = localStorage.getItem('token');

            if (!token) {
                router.push('/');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/listing/${params.listings}`, {
                    headers: { Authorization: `${token}`}
                });
                //const response = await axios.get(`http://localhost:8080/listing/${params.listings}`)

                console.log( response.status)

                console.log( response.data)

                setListing(response.data)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
            };

            fetchData();

    }, []);

    // Update listing
    const updateListing = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
        const response = await axios.patch(`http://localhost:8080/updatelisting/${params.listings}`, newListing);

        console.log(`Successful update ${response.status}`)

        window.location.reload()

        } catch (error) {
        console.error('Error updating listing:', error);
        }
    };

    if(!listing){
        return (
            <h1>loading...</h1>
        )
    }
    
    return(
        <>
            <NextJsCarousel listing={listing as unknown as any }/>
            <div className="grid grid-cols-2 gap-4 mx-2 my-10"> 
                    <div className="bg-blue-500  inline-block h-auto p-4 rounded-2xl">
                        <div className='bg-white text-black border
                        my-2 p-2 border-gray-300 rounded-2xl hover:border-4'>
                            <p>Name: {listing!.name}</p>
                        </div>
                        <div className='bg-white text-black border
                        my-2 p-2 border-gray-300 rounded-2xl hover:border-4'>
                            <p>Location: {listing!.location}</p>
                        </div>
                        <div className='bg-white text-black border
                        my-2 p-2 border-gray-300 rounded-2xl hover:border-4'>
                            <p>Price: {listing!.price} Kshs</p>
                        </div>
                        <div className='bg-white text-black border
                        my-2 p-2 border-gray-300 rounded-2xl hover:border-4'>
                            <p>{listing!.bedrooms} bedrooms</p>
                        </div>
                        <div className='bg-white text-black border
                        my-2 p-2 border-gray-300 rounded-2xl hover:border-4'>
                            <p>For {listing!.ownership}</p>
                        </div>
                        <div className='bg-white text-black border
                        my-2 p-2 border-gray-300 rounded-2xl hover:border-4'>
                            <p>{listing!.distance} km from road</p>
                        </div>
                        <div className='bg-white text-black border
                        my-2 p-2 border-gray-300 rounded-2xl hover:border-4'>
                            <p>{listing!.tours} tour(s)</p>
                        </div>
                    </div> 
                    <div className="bg-green-100 inline-block w-auto h-auto p-2"
                    > 
                        <form onSubmit={updateListing} className="mx-auto w-auto my-4 p-4 bg-green-400 rounded shadow"> 
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
                                Update
                            </button>
                        </form>
                    </div> 
                </div>
        </>
    )
}