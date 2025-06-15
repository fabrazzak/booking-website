import Link from 'next/link';
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaBed } from "react-icons/fa6";
import { LiaBathSolid } from "react-icons/lia";
import { IoMdEye } from "react-icons/io";
import { MdShower } from 'react-icons/md';

const PropertyCard = ({ property }) => {
  const hasCanalView = property?.name.includes("Canal View");
  return (
    <Link href={`/properties/${property.id}`} passHref>
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
            {hasCanalView && (
              <p className="flex items-center gap-2 text-white">
                <IoMdEye /> Canal View
              </p>
            )}
          </div>
        </div>

        {/* Bottom Part - Content */}
        <div className=" flex justify-between items-start mt-4">
          <div>
            <h3 className=" text-[14px]  text-[#141414] mb-1">{property.name.slice(0, 35)}</h3>
            <p className="text-[#141414] text-sm font-bold  flex items-center  gap-2">
              {property?.bedroomsNumber} <FaBed className='text-xl' /> | {property?.bathroomsNumber}<MdShower className='text-xl' />
            </p>
          </div>
          <div className="text-right">
            <button
              className="bg-[#bc7c37] hover:bg-[#bc7c37] text-white px-5 py-3 font-bold rounded-md text-sm uppercase"
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