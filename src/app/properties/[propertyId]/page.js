'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoBedOutline } from 'react-icons/io5';
import { LiaBathSolid } from 'react-icons/lia';
import { CiNoWaitingSign } from "react-icons/ci";
import { useMyContext } from '@/context/MyContext';
// import DatePicker from 'react-datepicker'

const PropertyDetailsPage = ({ params }) => {
    const [singleProperty, setSingleProperty] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(false)
    const { checkOut, checkIn, selectedDestination, guests, setCheckOut, setCheckIn, setSelectedDestination, setGuests, totalBookingDay, setTotalBookingDay } = useMyContext()


    const { propertyId } = React.use(params);

    useEffect(() => {
        const fetchListingData = async () => {
            setLoading(true)
            try {
                const response = await axios.get('https://api.hostaway.com/v1/listings/', {
                    headers: {
                        Authorization: `${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
                    }
                });
                const singleProperFilter = [...response.data.result].filter(p => p.id == propertyId)
                setSingleProperty(singleProperFilter[0]);
                setLoading(false)
            } catch (err) {
                console.error(err);
            }


              const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const checkInDate = formatDate(checkIn);
        const checkOutDate = formatDate(checkOut);
        }
        fetchListingData();


      
    }, []);


    const openPopup = () => {
        setIsPopupOpen(true);
        setCurrentSlide(0);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev === 0 ? singleProperty?.listingImages.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentSlide((prev) => (prev === singleProperty?.listingImages.length - 1 ? 0 : prev + 1));
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <p>Loading...</p>
        </div>
    }

    console.log(singleProperty, "abd razzak")
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className='max-w-7xl mx-auto mt-10 md:mt-20'>
                {/* Image section */}
                <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-3 md:grid-rows-2 gap-2 md:gap-4 border-2 border-[#f7f7f7] p-2 md:p-3 rounded-xl md:rounded-2xl">
                    {/* First item spans 2 cols and 2 rows */}
                    <div className="col-span-2 row-span-2 relative">
                        <div className='absolute right-3 bottom-3 md:right-5 md:bottom-5'>
                            <button
                                onClick={openPopup}
                                className='bg-white rounded-full font-bold px-2 md:px-3 cursor-pointer py-1 text-sm md:text-base hover:bg-gray-100 transition'
                            >
                                More Photos
                            </button>
                        </div>
                        <img
                            src={` ${singleProperty?.listingImages[0]?.url}`}
                            alt="Featured"
                            className="w-full h-full object-cover rounded-xl md:rounded-2xl"
                        />
                    </div>

                    {/* Other items: map from index 1 onward */}
                    {singleProperty?.listingImages.slice(1, 5).map((img, index) => (
                        <div key={index} className="col-span-1">
                            <img
                                src={img?.url}
                                alt={`Image ${index + 1}`}
                                className="w-full h-full object-cover rounded-xl md:rounded-2xl"
                            />
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 md:mt-10'>
                    <div className='md:col-span-3 md:pr-6'>
                        <div className='border-b-2 border-[#f7f7f7] pb-4'>
                            <h2 className='text-2xl md:text-3xl font-bold'>{singleProperty?.name || "Property Title"}</h2>
                            <p className='font-semibold text-sm md:text-base'>{singleProperty?.address || "Property Address"}</p>
                            <p className="text-[#141414] text-sm font-bold mb-3 flex items-center gap-2 pt-3 md:pt-5">
                                <span>{singleProperty?.bedroomsNumber || 0}</span>
                                <IoBedOutline className='text-lg md:text-xl' />
                                <span>|</span>
                                <span>{singleProperty?.bathroomsNumber || 0}</span>
                                <LiaBathSolid className='text-lg md:text-xl' />
                            </p>
                        </div>

                        <div className='border-b-2 border-[#f7f7f7] mt-6 md:mt-10'>
                            <h2 className='text-2xl md:text-3xl font-bold pb-4 md:pb-5'>About</h2>
                            <p className='pb-6 md:pb-10 text-base md:text-[22px]'>
                                Welcome to a serene escape in the heart of Dubai. Located in the iconic Missoni building in
                                Business Bay, this designer studio by JB Luxe Staycation blends elegance with comfort — just
                                15 minutes from the Burj Khalifa, Dubai Mall, and pristine beaches.
                            </p>
                        </div>

                        <div className='border-b-2 border-[#f7f7f7] py-6 md:py-10'>
                            <h2 className='text-2xl md:text-3xl font-bold pb-6 md:pb-10'>Property Amenities</h2>
                            <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-10 max-w-2xl'>

                                <div className='flex flex-col justify-center text-center'>
                                    <p className="text-[#141414] font-bold mb-2 mx-auto">
                                        <IoBedOutline className='text-4xl md:text-6xl mx-auto' />
                                    </p>
                                    <p className="text-[#141414] font-bold mb-2 text-base md:text-xl">
                                        Loft-style Bed
                                    </p>
                                </div>


                                <div className='flex flex-col justify-center text-center'>
                                    <p className="text-[#141414] font-bold mb-2 mx-auto">
                                        <IoBedOutline className='text-4xl md:text-6xl mx-auto' />
                                    </p>
                                    <p className="text-[#141414] font-bold mb-2 text-base md:text-xl">
                                        Bathroom
                                    </p>
                                </div>


                                <div className='flex flex-col justify-center text-center'>
                                    <p className="text-[#141414] font-bold mb-2 mx-auto">
                                        <IoBedOutline className='text-4xl md:text-6xl mx-auto' />
                                    </p>


                                    <p className="text-[#141414] font-bold mb-2 text-base md:text-xl">
                                        Kitchen
                                    </p>
                                </div>


                                <div className='flex flex-col justify-center text-center'>
                                    <p className="text-[#141414] font-bold mb-2 mx-auto">
                                        <IoBedOutline className='text-4xl md:text-6xl mx-auto' />
                                    </p>
                                    <p className="text-[#141414] font-bold mb-2 text-base md:text-xl">
                                        Living Area
                                    </p>
                                </div>


                                <div className='flex flex-col justify-center text-center'>
                                    <p className="text-[#141414] font-bold mb-2 mx-auto">
                                        <IoBedOutline className='text-4xl md:text-6xl mx-auto' />
                                    </p>
                                    <p className="text-[#141414] font-bold mb-2 text-base md:text-xl">
                                        Storage

                                    </p>
                                </div>


                                <div className='flex flex-col justify-center text-center'>
                                    <p className="text-[#141414] font-bold mb-2 mx-auto">
                                        <IoBedOutline className='text-4xl md:text-6xl mx-auto' />
                                    </p>
                                    <p className="text-[#141414] font-bold mb-2 text-base md:text-xl">
                                        Amazing view
                                    </p>
                                </div>


                                <div className='flex flex-col justify-center text-center'>
                                    <p className="text-[#141414] font-bold mb-2 mx-auto">
                                        <IoBedOutline className='text-4xl md:text-6xl mx-auto' />
                                    </p>
                                    <p className="text-[#141414] font-bold mb-2 text-base md:text-xl">
                                        Infinity pool
                                    </p>
                                </div>


                                <div className='flex flex-col justify-center text-center'>
                                    <p className="text-[#141414] font-bold mb-2 mx-auto">
                                        <IoBedOutline className='text-4xl md:text-6xl mx-auto' />
                                    </p>
                                    <p className="text-[#141414] font-bold mb-2 text-base md:text-xl">
                                        Gym
                                    </p>
                                </div>


                                <div className='flex flex-col justify-center text-center'>
                                    <p className="text-[#141414] font-bold mb-2 mx-auto">
                                        <IoBedOutline className='text-4xl md:text-6xl mx-auto' />
                                    </p>
                                    <p className="text-[#141414] font-bold mb-2 text-base md:text-xl">
                                        On-site spa
                                    </p>
                                </div>


                                <div className='flex flex-col justify-center text-center'>
                                    <p className="text-[#141414] font-bold mb-2 mx-auto">
                                        <IoBedOutline className='text-4xl md:text-6xl mx-auto' />
                                    </p>
                                    <p className="text-[#141414] font-bold mb-2 text-base md:text-xl">
                                        Children’s area
                                    </p>
                                </div>


                                <div className='flex flex-col justify-center text-center'>
                                    <p className="text-[#141414] font-bold mb-2 mx-auto">
                                        <IoBedOutline className='text-4xl md:text-6xl mx-auto' />
                                    </p>
                                    <p className="text-[#141414] font-bold mb-2 text-base md:text-xl">
                                        24/7 concierge
                                    </p>
                                </div>


                                <div className='flex flex-col justify-center text-center'>
                                    <p className="text-[#141414] font-bold mb-2 mx-auto">
                                        <IoBedOutline className='text-4xl md:text-6xl mx-auto' />
                                    </p>
                                    <p className="text-[#141414] font-bold mb-2 text-base md:text-xl">
                                        Private parking

                                    </p>
                                </div>

                            </div>
                        </div>

                        <div className='pt-6 md:pt-10 pb-5'>
                            <h2 className='text-2xl md:text-3xl font-bold pb-6 md:pb-10'>House Rules</h2>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10'>
                                <div>
                                    <div className='border-b-2 border-[#f7f7f7] pb-4 md:pb-5'>
                                        <p className="text-[#141414] text-base md:text-lg font-bold mb-2">Check-In & Check-Out</p>
                                        <div className='flex justify-between'>
                                            <span>Check-in: </span>
                                            <span className='font-bold'>
                                                {
                                                    singleProperty?.checkInTimeStart >= 12
                                                        ? String(singleProperty?.checkInTimeStart - 12).padStart(2, '0') + ":00 pm"
                                                        : String(singleProperty?.checkInTimeStart).padStart(2, '0') + ":00 am"
                                                }
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span>Check-out: </span>
                                            <span className='font-bold'>
                                                {
                                                    singleProperty?.checkOutTime >= 12
                                                        ? String(singleProperty?.checkOutTime - 12).padStart(2, '0') + ":00 pm"
                                                        : String(singleProperty?.checkOutTime).padStart(2, '0') + ":00 am"
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className='mt-4 md:mt-5'>
                                        <p className="text-[#141414] mb-2 flex items-center gap-2">
                                            <CiNoWaitingSign className='text-xl md:text-2xl font-bold text-red-500' />
                                            No pets allowed
                                        </p>
                                        <p className="text-[#141414] mb-2 flex items-center gap-2">
                                            <CiNoWaitingSign className='text-xl md:text-2xl font-bold text-red-500' />
                                            No parties or events
                                        </p>
                                        <p className="text-[#141414] mb-2 flex items-center gap-2">
                                            <CiNoWaitingSign className='text-xl md:text-2xl font-bold text-red-500' />
                                            No smoking
                                        </p>
                                    </div>
                                </div>

                                <div className='md:col-span-2'>
                                    <p className="text-[#141414] text-base md:text-lg font-bold mb-2">Maximum Occupancy</p>
                                    <p className='pb-6 md:pb-10'>
                                        Welcome to a serene escape in the heart of Dubai. Located in the iconic Missoni building in
                                        Business Bay, this designer studio by JB Luxe Staycation blends elegance with comfort — just
                                        15 minutes from the Burj Khalifa, Dubai Mall, and pristine beaches.
                                    </p>

                                    <p className="text-[#141414] text-base md:text-lg font-bold mb-2">Cleanliness</p>
                                    <p className='pb-6 md:pb-10'>
                                        We request that all guests use the building Garbage Room for
                                        proper waste disposal. In the event that a property is left in an
                                        excessively untidy condition, a fee of AED 350 per hour of
                                        additional cleaning may be imposed.
                                    </p>

                                    <p className="text-[#141414] text-base md:text-lg font-bold mb-2">Loud Music / Parties & Gatherings</p>
                                    <p className='pb-6 md:pb-10'>
                                        Excessive noise or disturbance, including loud music, is not
                                        permitted. All guests are to strictly refrain from hosting any
                                        events, parties or gatherings within the premises
                                    </p>

                                    <p className="text-[#141414] text-base md:text-lg font-bold mb-2">Late Check-out</p>
                                    <p className='pb-6 md:pb-10'>
                                        Late check-out is subject to availability, approval, and additional
                                        fees. Failure to adhere to the agreed check-out time may incur
                                        penalties.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking sidebar */}
                    <div className='mt-6 md:mt-0'>
                        <div className='border-2 border-[#f7f7f7] p-3 md:p-4 rounded-xl md:rounded-2xl sticky top-4'>
                            <div className='flex gap-3 md:gap-4'>
                                <h2 className='text-xl md:text-2xl font-bold'>AED {singleProperty?.price}  </h2>
                                <span className='mt-1 text-black text-sm md:text-base'>per night</span>
                            </div>
                            <div className='mt-3 md:mt-4 border-2 rounded-lg md:rounded-xl p-2 border-[#bc7c37]'>
                                <p className='font-bold text-base md:text-[18px]'>{totalBookingDay} nights</p>
                                <p className='flex justify-between text-sm md:text-[16px]'>
                                    <span>{checkIn?.toLocaleDateString() || "Add date"}</span>
                                    <span>{checkOut?.toLocaleDateString() ||  "Add date"}</span>
                                </p>
                            </div>

                            <button
                                className="mt-3 md:mt-4 bg-[#bc7c37] hover:bg-[#bc7c37] font-bold flex w-full justify-center text-white px-4 py-2 md:px-5 md:py-3 rounded-full text-base md:text-[18px] uppercase"
                            >
                                Reserve
                            </button>

                            <div className='flex flex-col gap-2 md:gap-3 mt-3 md:mt-4 border-t-2 border-[#f7f7f7] pt-3 md:pt-4 pb-6 md:pb-10'>
                                <p className='flex justify-between text-sm md:text-[16px]'>
                                    <span>{singleProperty?.price} AED x {totalBookingDay} nights</span>
                                    <span>{singleProperty?.price * totalBookingDay} AED</span>
                                </p>
                                <p className='flex justify-between font-bold text-sm md:text-[16px]'>
                                    <span>Total</span>
                                    <span>{singleProperty?.price * totalBookingDay} AED</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-slate-50 mt-6 md:mt-10'>
                <div className='max-w-7xl mx-auto py-6 md:py-10'>
                    <h2 className='text-2xl md:text-3xl font-bold'>Other Notes</h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-15 pt-4 md:pt-5'>
                        <div className=''>
                            <p className="text-[#141414] text-base md:text-lg font-bold mb-2">Refundable Damage Deposit</p>
                            <p className='pb-6 md:pb-10'>
                                A refundable security deposit is obtained at
                                the time of booking and will be returned in
                                full after the checkout clearance. Refer
                                Booking Terms for more information.
                            </p>

                            <p className="text-[#141414] text-base md:text-lg font-bold mb-2">Checkout Cleaning Fee</p>
                            <p className='pb-6 md:pb-10'>
                                A one-time check-out cleaning fee applies
                                to all bookings for a thorough clean upon
                                checkout, preparing the property for our
                                next guest. Additional cleaning services can
                                be added at booking or during your stay via
                                your Guest Relations Officer
                            </p>
                        </div>

                        <div className=''>
                            <p className="text-[#141414] text-base md:text-lg font-bold mb-2">Tourism Tax</p>
                            <p className='pb-6 md:pb-10'>
                                A standard Tourism Tax, payable to the
                                DTCM (Dubai Tourism & Commerce
                                Marketing), is charged per room per night.
                            </p>

                            <p className="text-[#141414] text-base md:text-lg font-bold mb-2">Cancellation Policy</p>
                            <p className='pb-6 md:pb-10'>
                                Non-Refundable: All reservations are non-
                                refundable once booked. If you cancel your
                                reservation at any time after booking or fail
                                to show up for your scheduled check-in, no
                                refund will be issued.
                            </p>
                        </div>

                        <div className=''>
                            <p className="text-[#141414] text-base md:text-lg font-bold mb-2">Refundable Damage Deposit</p>
                            <p className='pb-6 md:pb-10'>
                                A refundable security deposit is obtained at
                                the time of booking and will be returned in
                                full after the checkout clearance. Refer
                                Booking Terms for more information.
                            </p>

                            <p className="text-[#141414] text-base md:text-lg font-bold mb-2">Checkout Cleaning Fee</p>
                            <p className='pb-6 md:pb-10'>
                                A one-time check-out cleaning fee applies
                                to all bookings for a thorough clean upon
                                checkout, preparing the property for our
                                next guest. Additional cleaning services can
                                be added at booking or during your stay via
                                your Guest Relations Officer
                            </p>
                        </div>


                    </div>
                </div>
            </div>

            {/* Popup Slider */}
            {isPopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300">
                    <button
                        onClick={closePopup}
                        className="absolute top-4 right-4 md:top-6 md:right-6 text-white text-3xl md:text-4xl hover:text-red-400 transition duration-200"
                    >
                        &times;
                    </button>

                    <div className="relative w-full max-w-5xl p-2 md:p-4">
                        <img
                            src={singleProperty?.listingImages[currentSlide]?.url}
                            alt={`Slide ${currentSlide + 1}`}
                            className="w-full max-h-[80vh] md:max-h-[85vh] object-contain rounded-xl md:rounded-3xl shadow-2xl"
                        />

                        <button
                            onClick={goToPrevious}
                            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-black rounded-full p-2 md:p-3 shadow-lg backdrop-blur-md transition"
                        >
                            <span className="text-xl md:text-2xl font-bold">&lt;</span>
                        </button>

                        <button
                            onClick={goToNext}
                            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-black rounded-full p-2 md:p-3 shadow-lg backdrop-blur-md transition"
                        >
                            <span className="text-xl md:text-2xl font-bold">&gt;</span>
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm md:text-lg font-medium bg-black/40 px-3 py-1 rounded-full shadow-md">
                            {currentSlide + 1} / {singleProperty?.listingImages.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyDetailsPage;