import React from 'react'
import Masonry from 'react-masonry-css'
import '../app/globals.css'
import CardComponent from './CardComponent'
import { Listing, ListingsProps } from '@/app/(client)/client_home/[home]/page'

export interface ListingProps {
    listing: Listing;
}

const MasonryComp = ({listings} : ListingsProps) => {

    const breakpoints = {
        default: 3,
        800: 3,
        700: 2,
        600: 2,
        500: 1,
    }
  return (

    <div>
        <Masonry
            breakpointCols={breakpoints}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
        >
            {listings.map( (listing: Listing) => (
                <div key={listing.id}>
                    <CardComponent listing={listing} />
                </div>
            ) )} 
        </Masonry>
    </div>

)
}

export default MasonryComp