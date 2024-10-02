"use client"
import { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import CardComponent from '../../../../components/CardComponent';
import Navbar from '../../../../components/navbar';
import MasonryComp from '../../../../components/masonry';
import { useRouter, redirect, useParams } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
//import {getMyVariable, setMyVariable}  from '@/components/Auth';


export interface Listing {
    id: number;
    name: string;
    location: string;
    price: number;
    bedrooms: number;
    visual_urls: string[];
    ownership: string;
    distance: number;
    agent: number;
    tours: number;
}

export interface ListingsProps {
    listings: Listing[];
}


export default function ClientHomeDynamic () {

    // useLayoutEffect(() => {
    //     const isAuth = getMyVariable();
    //     if(!isAuth){
    //       redirect("/")
    //     }
    //   }, [])

    const router = useRouter();

    const params = useParams<{home:string}>()

    const [listings, setListings] = useState<Listing[]>([]);

    // Fetch listings
    useEffect(() => {
        const fetchData = async () => {

            const token = localStorage.getItem('token');

            if (!token) {
                router.push('/');
                return;
            }

            //const clientId = localStorage.getItem('clientId');

            try {
                const response = await axios.get('http://localhost:8080/listings', {
                    headers: { Authorization: `${token}`}
                });
                //const response = await axios.get('http://localhost:8080/listings')

                console.log( response.status)

                console.log( response.data)

                console.log( params )

                setListings(response.data.reverse())

            } catch (error) {
                console.error('Error fetching data:', error);
            }
            };

            fetchData();

            //console.log(getMyVariable())

    }, []);

    // if(!clientId){
    //     <p>page is loading</p>
    // }

    return(
        <div>
            <div
                style={{
                    backgroundImage: 'url("/assets/pexels-davidmcbee-1546168.jpg")',
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
            <Navbar/>
            <div className='justify-center mt-9 space-y-2 ml-10'>
                
                <div className='container  mx-auto px-4 py-4 space-y-2'>
                    <MasonryComp listings={listings}/>
                </div>
            </div>
        </div>
    )
}