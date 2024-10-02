import React from 'react';
import { Listing, ListingsProps } from '@/app/(client)/client_home/[home]/page'
import { ListingProps } from './masonry';
import Link from 'next/link';

export interface Card {
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

const CardComponent = ({ listing }: ListingProps) => {
  let url = listing.visual_urls[0]

  const clientId = localStorage.getItem('clientId');

  return (
    <div className="bg-gray-300 shadow-lg rounded-lg p-2 m-2 hover:bg-blue-300 border-2 border-black">
      <Link href={`/client_home/${clientId}/listings/${listing.id}`}>
        <img src={url} alt='listing image' className='w-[200px] h-[250px]'/>
        <div className="text-lg font-semibold text-gray-800"><p>name: {listing.name}</p></div>
        <div className="text-lg font-semibold text-gray-800"><p>location: {listing.location}</p></div>
        <div className="text-sm text-gray-600"><p>bedrooms: {listing.bedrooms}, for:{listing.ownership}</p></div>
        <div className="text-sm text-gray-600"><p> {listing.distance}km from road</p></div>
      </Link>
    </div>
  );
};

export default CardComponent;
