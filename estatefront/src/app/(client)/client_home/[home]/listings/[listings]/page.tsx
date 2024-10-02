"use client"
import { useRouter, redirect, useParams } from 'next/navigation';
import NextJsCarousel from '@/components/Carousel';
import { useState, useEffect } from 'react';
import { Listing, ListingsProps } from '../../../../../(client)/client_home/[home]/page'
import axios from 'axios';

export default function HomeListing () {
    const [listing, setListing] = useState<Listing>();

    let [booked, setBooked] = useState(false);

    let [bookListing, setBookListing] = useState<{}>();

    const params = useParams<{ home: string; listings: string }>()

    const router = useRouter()

    // Fetch listings
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

    const bookTour = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(booked)

        if ( booked === false ){

            try {
                setBookListing({tours: [parseInt(params.listings)]})

                console.log(bookListing)

                const response = await axios.patch(`http://localhost:8080/client-tours-add/${params.home}`, bookListing);

                console.log(`Successful booking ${response.status}`)

                setBooked(!booked)

                console.log(booked)


            } catch (error) {
                console.error('Error updating client:', error);
            }

        }

        else {
            try {
                console.log('attempting to unbook')

                setBookListing({tours: [parseInt(params.listings)]})

                console.log(bookListing)

                const response = await axios.patch(
                    `http://localhost:8080/client-tours-remove/${params.home}`,
                    bookListing
                );
    
                console.log(`Successful unbooking ${response.status}`)
    
                setBooked(!booked)

                console.log(booked)
    
            } catch (error) {
                console.error('Error unbooking listing:', error);
            }

        }
        
        
    }
    if (!listing) {
        return (
            <>
                <p>Page still loading</p>
            </>
        )
    }

    return(
        <>
            <NextJsCarousel listing={listing as unknown as any}/>

            <div className='m-10'>
                <div className="grid"> 
                    {/* <div className="bg-blue-300 row-start-1  
                        col-span-2 h-[430px] p-4 rounded-2xl mx-2"
                    >  */}
                    <div className="inline-block bg-blue-300 row-start-1  
                        col-span-2 h-auto p-4 rounded-2xl mx-2"
                    > 
                        <div className='bg-white text-black rounded-2xl border-2 border-black py-2 px-4 mx-4 hover:py-3'>
                            <p className='hover:font-bold'>Name: {listing.name}</p>
                        </div>
                        <div className='bg-white text-black my-4 rounded-2xl border-2 border-black py-2 px-4 mx-4 hover:py-3'>
                            <p className='hover:font-bold'>Location: {listing.location}</p>
                        </div>
                        <div className='bg-white text-black my-4 rounded-2xl border-2 border-black py-2 px-4 mx-4 hover:py-3'>
                            <p className='hover:font-bold'>Price: {listing.price} Kshs</p>
                        </div>
                        <div className='bg-white text-black my-4 rounded-2xl border-2 border-black py-2 px-4 mx-4 hover:py-3'>
                            <p className='hover:font-bold'>{listing.bedrooms} bedrooms</p>
                        </div>
                        <div className='bg-white text-black my-4 rounded-2xl border-2 border-black py-2 px-4 mx-4 hover:py-3'>
                            <p className='hover:font-bold'>For {listing.ownership}</p>
                        </div>
                        <div className='bg-white text-black my-4 rounded-2xl border-2 border-black py-2 px-4 mx-4 hover:py-3'>
                            <p className='hover:font-bold'>{listing.distance} km from road</p>
                        </div>
                        <div className='bg-white text-black my-4 rounded-2xl border-2 border-black py-2 px-4 mx-4 hover:py-3'>
                            <p className='hover:font-bold'>{listing.tours} tour(s) done</p>
                        </div>
                    </div>
                    <div className=" row-start-1 
                                col-span-2 h-[430px] p-4 rounded-2xl mx-2"
                        style={{display:'flex', justifyContent: 'center', alignItems:'center', backgroundImage: 'url("/assets/agentprofile.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',}}
                    >   
                        <form onSubmit={bookTour}>
                            <button
                                type="submit"
                                style={{display:'flex', justifyContent:'center', alignItems:'center', color:'white', fontWeight:'bold'}}
                                className=" w-[350px] mt-10 p-4 bg-red-600 rounded-xl shadow hover:p-6"
                            >
                                { 
                                    booked ? 
                                    <p className="mx-auto">Unbook the tour</p> :
                                    <p className="mx-auto">Book a tour</p>
                                }
                                
                            </button>
                        </form>
                    </div>  
                </div>
            </div>
        </>
    )
}