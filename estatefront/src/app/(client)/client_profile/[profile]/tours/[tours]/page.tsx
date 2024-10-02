"use client"

import { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import { useRouter, redirect, useParams } from 'next/navigation';
import NextJsCarousel from '@/components/Carousel';
import { Listing } from '@/app/(client)/client_home/[home]/page';

export default function ClientProfileTours () {

    const params = useParams<{ home: string; tours: string }>()

    console.log( params)

    const [listing, setListing] = useState<Listing>();

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {

            const token = localStorage.getItem('token');

            if (!token) {
                router.push('/');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/listing/${params.tours}`)

                console.log( response.status)

                console.log( response.data)

                setListing(response.data)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
            };

            fetchData();

    }, []);

    if (!listing) {
        return (
            <>
                <p>Page still loading</p>
            </>
        )
    }

    return(
        <div className='pt-10'>
            <NextJsCarousel listing={listing as unknown as any}/>
            <div className="mx-auto w-[350px] my-4 p-4 bg-blue-200 rounded-xl shadow">
                <div className='bg-white text-black rounded-2xl border-2 border-black py-2 px-4 mx-4'>
                    <p className='hover:font-bold'>Name: {listing.name}</p>
                </div>
                <div className='bg-white text-black my-4 rounded-2xl border-2 border-black py-2 px-4 mx-4'>
                    <p className='hover:font-bold'>Location: {listing.location}</p>
                </div>
                <div className='bg-white text-black my-4 rounded-2xl border-2 border-black py-2 px-4 mx-4'>
                    <p className='hover:font-bold'>Price: {listing.price} Kshs</p>
                </div>
                <div className='bg-white text-black my-4 rounded-2xl border-2 border-black py-2 px-4 mx-4'>
                    <p className='hover:font-bold'>{listing.bedrooms} bedrooms</p>
                </div>
                <div className='bg-white text-black my-4 rounded-2xl border-2 border-black py-2 px-4 mx-4'>
                    <p className='hover:font-bold'>For {listing.ownership}</p>
                </div>
                <div className='bg-white text-black my-4 rounded-2xl border-2 border-black py-2 px-4 mx-4'>
                    <p className='hover:font-bold'>{listing.distance} km from road</p>
                </div>
                <div className='bg-white text-black my-4 rounded-2xl border-2 border-black py-2 px-4 mx-4'>
                    <p className='hover:font-bold'>{listing.tours} tours done</p>
                </div>
            </div>
        </div>
    );
}