import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { ListingProps } from "./masonry";
import { Listing } from "@/app/(client)/client_home/[home]/page";

const NextJsCarousel = ({ listing }: ListingProps) => {

    let url = listing.visual_urls[0]
    return (
        <div>
            {/* <Carousel>
                <div>
                    <img
                        src="https://media.geeksforgeeks.org/wp-content/uploads/20211213172224/1.png"
                        alt="image1"
                    />
                    <p className="legend">
                        Image 1
                    </p>
                </div>
                <div>
                    <img
                        src="https://media.geeksforgeeks.org/wp-content/uploads/20211213172225/2.png"
                        alt="image2"
                    />
                    <p className="legend">
                        Image 2
                    </p>
                </div>
                <div>
                    <img
                        src="https://media.geeksforgeeks.org/wp-content/uploads/20211213172226/3.png"
                        alt="image3"
                    />
                    <p className="legend">
                        Image 3
                    </p>
                </div>
                <div>
                    <img
                        src="https://media.geeksforgeeks.org/wp-content/uploads/20211213172227/4.png"
                        alt="image4"
                    />
                    <p className="legend">
                        Image 4
                    </p>
                </div>
                <div>
                    <img
                        src="https://media.geeksforgeeks.org/wp-content/uploads/20211213172229/5.png"
                        alt="image5"
                    />
                    <p className="legend">
                        Image 5
                    </p>
                </div>
            </Carousel> */}
            <Carousel>
                <div>
                    <img
                        src={listing.visual_urls[0]}
                        alt="image1"
                    />
                    <p className="legend">
                        Image 1
                    </p>
                </div>
                <div>
                    <img
                        src={listing.visual_urls[1]}
                        alt="image2"
                    />
                    <p className="legend">
                        Image 2
                    </p>
                </div>
                <div>
                    <img
                        src={listing.visual_urls[2]}
                        alt="image3"
                    />
                    <p className="legend">
                        Image 3
                    </p>
                </div>
                <div>
                    <img
                        src={listing.visual_urls[3]}
                        alt="image4"
                    />
                    <p className="legend">
                        Image 4
                    </p>
                </div>
                <div>
                    <img
                        src={listing.visual_urls[4]}
                        alt="image5"
                    />
                    <p className="legend">
                        Image 5
                    </p>
                </div>
            </Carousel>
        </div>
    );
};

export default NextJsCarousel;