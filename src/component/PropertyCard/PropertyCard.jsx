import Link from 'next/link';
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoBedOutline } from "react-icons/io5";
import { LiaBathSolid } from "react-icons/lia";
import { IoMdEye } from "react-icons/io";

const PropertyCard = ({ property }) => {
  return (
    <Link href={`/properties/${property.id}`}  passHref>
      <div className=" overflow-hidden  hover:shadow transition-shadow duration-300 cursor-pointer p-2 bg-white border-2 border-[#f7f7f7]">
        {/* Top Part - Image with Location Badge */}
        <div className="relative">
          <img 
            src={property.listingImages[0].url} 
            alt={property.bookingcomPropertyName}
            className="w-full h-64 rounded-xl object-cover"
          />
            <div className="absolute inset-0 bg-[#00000031] rounded-xl"></div>
          <div className="absolute top-2 left-2 flex items-center gap-2 text-white px-2 py-1 rounded-md text-sm font-medium">
           <FaMapMarkerAlt /> {property.state}
          </div>
          <div className="absolute bottom-2 left-2 flex items-center gap-2 text-white px-2 py-1 rounded-md text-sm font-medium">
           <IoMdEye />Canal View
          </div>
        </div>

        {/* Bottom Part - Content */}
        <div className="pt-4 flex justify-between items-start">
          {/* Left Side - Property Info */}
          <div>
            <h3 className=" text-md mb-1 text-[#141414]">{property.airbnbName.slice(0,35)}</h3>
            <p className="text-[#141414] text-sm font-bold mb-2 flex items-center  gap-2">
              {property?.bedroomsNumber} <IoBedOutline className='text-xl' /> | {property?.bathroomsNumber}<LiaBathSolid className='text-xl' />
            </p>
          </div>

          {/* Right Side - Price & Book Button */}
          <div className="text-right">
          
             <button 
              className="mt-2 bg-[#bc7c37] hover:bg-[#bc7c37] text-white px-5 py-3 rounded-md text-sm uppercase"
              // onClick={(e) => e.preventDefault()} // Prevent link navigation
            >
              Book Now
            </button>
            
           
          </div>
        </div>
      </div>
    </Link>
  );
};
export default PropertyCard;