import React, { useContext } from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import ClientProfileCardComponent from './CprofileCard';
import { Listing, ListingsProps } from '@/app/(client)/client_home/[home]/page'

export interface ListingProps {
    listing: Listing;
}

const LeftArrow = () => {
    const { scrollPrev } = useContext(VisibilityContext);
  
    return (
      <button style={{color:'black'}} onClick={() => scrollPrev()} >
          <FaArrowAltCircleLeft />
      </button>
    );
  };
  
  const RightArrow = () => {
    const { scrollNext } = useContext(VisibilityContext);
  
    return (
      <button style={{color:'black'}} onClick={() => scrollNext()} >
          <FaArrowAltCircleRight />
      </button>
    );
  };
  
const HorizontalScrollbar = ({listings}: ListingsProps) => (

    <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>

            {listings.map( (listing: Listing ) => (
                <div key={listing.id}>
                    <ClientProfileCardComponent listing={listing} />
                </div>
            ) )} 

    </ScrollMenu>

);

export default HorizontalScrollbar