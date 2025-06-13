'use client'
import PropertyCard from '@/component/PropertyCard/PropertyCard';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { BsGlobe } from "react-icons/bs";
import { BsWhatsapp } from "react-icons/bs";
import { MdMenu } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import { useMyContext } from '@/context/MyContext';
import { addMonths } from 'date-fns';




export default function SearchBar() {
  const [activeTab, setActiveTab] = useState(null)
  // const [checkIn, setCheckIn] = useState(null)
  // const [checkOut, setCheckOut] = useState(null)
  // const [guests, setGuests] = useState({ adults: 0, children: 0 })
  const [datePickerView, setDatePickerView] = useState(null)
  // const [selectedDestination, setSelectedDestination] = useState(null)
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  // const [totalBookingDay, setTotalBookingDay] = useState(0)

  const containerRef = useRef(null)
  const destinationRef = useRef(null)
  const dateRef = useRef(null)
  const guestsRef = useRef(null)
  const searchRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [destinations, setDestinations] = useState([])
  const { checkOut, checkIn, selectedDestination,guests,setCheckOut,setCheckIn,setSelectedDestination ,setGuests,totalBookingDay,setTotalBookingDay} = useMyContext()

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        !searchRef.current?.contains(event.target)
      ) {
        setActiveTab(null)
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCheckInSelect = (date) => {
    setCheckIn(date);
    setDatePickerView('checkOut');

    if (!checkOut || date >= checkOut) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 3);
      setCheckOut(nextDay);
      setActiveTab('out-date')
    }
  };

  const handleCheckOutSelect = (date) => {
    // Ensure checkout date is after current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date <= today) {
      // If selected date is today or before, set to tomorrow
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 3);
      setCheckOut(tomorrow);
    } else {
      setCheckOut(date);
    }

    if (checkIn) {
      const timeDiff = date.getTime() - checkIn.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      setTotalBookingDay(nights);
    }
  }

  const getMinCheckoutDate = () => {
    if (!checkIn) {
      // If no check-in date selected, minimum checkout is tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 3);
      return tomorrow;
    }
    const minDate = new Date(checkIn);
    minDate.setDate(minDate.getDate() + 3);
    return minDate;
  };

  const handleGuestChange = (type, operation) => {
    setGuests(prev => ({
      ...prev,
      [type]: operation === 'increment' ? prev[type] + 1 : Math.max(prev[type] - 1, 0)
    }))
  }

  const handleDestinationSelect = (destination) => {
    setSelectedDestination(destination)
    setTimeout(() => {
      setActiveTab('in-date')
      setDatePickerView('checkIn')
    }, 50)
  }

  useEffect(() => {
    const fetchListingData = async () => {
      try {
        const response = await axios.get('https://api.hostaway.com/v1/listings', {
          headers: {
            Authorization: `${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
          }
        });
        setProperties(response?.data?.result);
        setFilteredProperties(response?.data?.result);
        setDestinations([...new Set(response?.data?.result.map(p => p.city))])
      } catch (err) {
        console.error('Failed to fetch listings', err);
      }
    }
    fetchListingData()
  }, [])

 const handleSearch = async () => {
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const checkInDate = formatDate(checkIn);
  const checkOutDate = formatDate(checkOut);

  const generateDateRange = (start, end) => {
    const dates = [];
    const current = new Date(start);
    while (current < end) {
      dates.push(formatDate(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const dateRange = generateDateRange(checkIn, checkOut);
  const totalGuests = guests.adults + guests.children;

  try {
    // 1. Fetch all properties
    const { data } = await axios.get('https://api.hostaway.com/v1/listings', {
      headers: {
        Authorization: `${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      },
    });

    const allProperties = data?.result || [];

    // 2. Filter based on static fields like destination and guest capacity
    const staticFiltered = allProperties.filter(property => {
      if (selectedDestination && property.city !== selectedDestination) return false;
      if (totalGuests > 0 && (property.bedrooms * 2) < totalGuests) return false;
      return true;
    });

    // 3. Check availability for each property (async)
    const availabilityChecks = await Promise.all(
      staticFiltered.map(async (property) => {
        try {
          const res = await axios.get(`https://api.hostaway.com/v1/listings/${property.id}/calendar?startDate=${checkInDate}&endDate=${checkOutDate}`, {
            headers: {
              Authorization: `${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
            },
          });

          const availabilityData = res?.data?.result;

          const isAvailable = dateRange.every(date => {
            const match = availabilityData.find(item => item.date === date);
            return match && match.isAvailable === 1 && match.status === "available";
          });

          return isAvailable ? property : null;
        } catch (error) {
          console.error(`Error checking availability for property ${property.id}`, error);
          return null;
        }
      })
    );

    // 4. Filter out nulls and update state
    const finalFiltered = availabilityChecks.filter(p => p !== null);
    setFilteredProperties(finalFiltered);
  } catch (error) {
    console.error('Failed to fetch listings:', error);
  }

  // Final UI updates
  setSearchPerformed(true);
  setActiveTab(null);
  setShowMobileSearch(false);
};




  const renderSearchBar = () => (
    <div
      ref={containerRef}
      className={`bg-white ${showMobileSearch ? 'rounded-lg' : 'hidden md:rounded-full'} border border-[#bc7c37] shadow-md relative ${showMobileSearch ? 'flex flex-col p-4 space-y-4' : 'md:flex md:flex-row md:space-x-2'}`}
    >
      {/* Destination */}
      <div
        ref={destinationRef}
        className="cursor-pointer relative"
        onClick={() => setActiveTab(activeTab === 'destination' ? null : 'destination')}
      >
        <div className={`px-6 py-4 ${!showMobileSearch ? 'border-r border-gray-100' : ''} ${activeTab === 'destination' ? 'bg-[#f7f7f7] z-50 rounded-full' : ''}`}>
          <p className="text-sm font-semibold text-[#141414]">DESTINATION</p>
          <p className="text-gray-500 text-sm">
            {selectedDestination || 'Search destination'}
          </p>
        </div>

        {activeTab === 'destination' && (
          <div className={`absolute ${showMobileSearch ? 'left-0 right-0' : 'left-0'} top-full mt-2 bg-white shadow-lg p-4 rounded-xl z-50 ${showMobileSearch ? 'w-full' : 'w-96'}`}>
            <p className='my-5'>Suggestions de destinations</p>
            <ul className="space-y-2">
              {destinations.map((dest, index) => (
                <li
                  key={index}
                  className="hover:bg-gray-100 p-2 rounded cursor-pointer flex items-center gap-4"
                  onClick={() => handleDestinationSelect(dest)}
                >
                  <img
                    src="/images/destination-icon.webp"
                    alt="Destination icon"
                    className="w-10 h-10 object-contain"
                  />
                  <span>{dest}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Check In */}
      <div
        ref={dateRef}
        className="cursor-pointer relative"
        onClick={() => {
          setActiveTab('in-date')
          setDatePickerView('checkIn')
        }}
      >
        <div className={`px-6 py-4 ${!showMobileSearch ? 'border-r border-gray-100' : ''} ${activeTab === 'in-date' ? 'bg-[#f7f7f7] rounded-full' : ''}`}>
          <p className="text-sm font-semibold text-[#141414]">CHECK IN</p>
          <p className="text-gray-500 text-sm">
            {checkIn ? checkIn.toLocaleDateString() : 'Add date'}
          </p>
        </div>
      </div>

      {/* Check Out */}
      <div
        className="cursor-pointer relative"
        onClick={() => {
          setActiveTab('out-date')
          setDatePickerView('checkOut')
        }}
      >
        <div className={`px-6 py-4 ${!showMobileSearch ? 'border-r border-gray-100' : ''} ${activeTab === 'out-date' ? 'bg-[#f7f7f7] rounded-full' : ''}`}>
          <p className="text-sm font-semibold text-[#141414]">CHECK OUT</p>
          <p className="text-gray-500 text-sm">
            {checkOut ? checkOut.toLocaleDateString() : 'Add date'}
          </p>
        </div>
      </div>

      {/* Combined Date Picker Popup for check-in */}
      {(activeTab === 'in-date') && (
        <div className={`absolute ${showMobileSearch ? 'left-4 right-4' : 'left-0'} top-full mt-2 bg-white shadow-lg p-6 rounded-xl z-50 ${showMobileSearch ? 'w-auto' : 'w-full'}`}>
          <div className={`grid ${showMobileSearch ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
            <div className={datePickerView === 'checkIn' ? '' : 'opacity-70'}>
              <div className="flex gap-4">
                <DatePicker
                  selected={checkIn}
                  onChange={handleCheckInSelect}
                  selectsStart
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={new Date()}
                  inline
                  monthsShown={2}
                  calendarClassName="rounded-lg border-2 border-gray-200 w-full"
                  dateFormat="dd MMM yyyy"
                  shouldCloseOnSelect={false}
                  focusSelectedMonth={true}
                  dayClassName={date => {
                    // const isBooked = properties.some(property =>
                    //   isBookedDate(date, property.id)
                    // );
                    // return isBooked ? 'bg-red-100 text-red-500' : undefined;
                  }}
                  renderDayContents={(day, date) => (
                    <div className="day-content">
                      {day}
                    </div>
                  )}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  calendarContainer={({ className, children }) => (
                    <div className={`${className} flex gap-4`}>
                      {children}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {checkIn && checkOut && (
              <p className="font-medium">
                Selected stay: {totalBookingDay} {totalBookingDay === 1 ? 'night' : 'nights'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Combined Date Picker Popup for checkout */}
      {(activeTab === 'out-date') && (
        <div className={`absolute ${showMobileSearch ? 'left-4 right-4' : 'left-0'} top-full mt-2 bg-white shadow-lg p-6 rounded-xl z-50 ${showMobileSearch ? 'w-auto' : 'w-full'}`}>
          <div className={`grid ${showMobileSearch ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
            <div className={datePickerView === 'checkOut' ? '' : 'opacity-70'}>
              <DatePicker
                selected={checkOut}
                onChange={handleCheckOutSelect}
                selectsEnd
                startDate={checkIn}
                endDate={checkOut}
                minDate={getMinCheckoutDate()}
                maxDate={addMonths(new Date(), 12)}
                inline
                monthsShown={2}
                calendarClassName="rounded-lg border-2 border-gray-200 w-full"
                dateFormat="dd MMM yyyy"
                shouldCloseOnSelect={false}
                focusSelectedMonth={true}
                dayClassName={date => {
                  // const isBooked = properties.some(property =>
                  //   isBookedDate(date, property.id)
                  // );
                  // return isBooked ? 'bg-red-100 text-red-500' : undefined;
                }}
              />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {checkIn && checkOut && (
              <p className="font-medium">
                Selected stay: {totalBookingDay} {totalBookingDay === 1 ? 'night' : 'nights'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Guests */}
      <div
        ref={guestsRef}
        className="cursor-pointer relative"
        onClick={() => setActiveTab(activeTab === 'guests' ? null : 'guests')}
      >
        <div className={`px-6 py-4 ${activeTab === 'guests' ? 'bg-[#f7f7f7] rounded-full' : ''}`}>
          <p className="text-sm font-semibold text-[#141414]">GUESTS</p>
          <p className="text-gray-500 text-sm">
            {guests.adults + guests.children > 0
              ? `${guests.adults + guests.children} guest${guests.adults + guests.children !== 1 ? 's' : ''}`
              : 'Add guests'}
          </p>
        </div>

        {activeTab === 'guests' && (
          <div className={`absolute ${showMobileSearch ? 'left-4 right-4' : 'left-1/2 -translate-x-1/2'} top-full mt-2 bg-white shadow-2xl p-5 rounded-2xl z-50 w-${showMobileSearch ? 'auto' : '96'}`}>
            {[
              { type: 'adults', label: 'Adults', description: 'Ages 13 or above' },
              { type: 'children', label: 'Children', description: 'Ages 2-12' },
            ].map(({ type, label, description }) => (
              <div className="flex justify-between items-center mb-4 border-b-1 pb-4 border-[#f7f7f7]" key={type}>
                <div className="flex flex-col">
                  <p className="capitalize text-gray-700 font-medium">{label}</p>
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleGuestChange(type, 'decrement')
                    }}
                    className="w-8 h-8 text-lg border rounded-full flex items-center justify-center shadow"
                  >
                    -
                  </button>
                  <span className="min-w-[20px] text-center font-semibold">
                    {guests[type]}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleGuestChange(type, 'increment')
                    }}
                    className="w-8 h-8 text-lg border rounded-full flex items-center justify-center shadow"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Button */}
      <div ref={searchRef} className="px-6 py-4 flex items-center">
        <button
          className="bg-[#bc7c37] hover:bg-[#e69500] text-white px-5 py-2 rounded-full w-full"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full flex justify-center relative flex-col">
      <div className='bg-[#f7f7f7] border-[#bc7c37] border-b-1'>
        <header className='w-full flex justify-center py-8 md:py-10 max-w-7xl mx-auto z-50 relative'>

          {/* language selector */}
          <div
            className="absolute z-50 right-5 top-3 md:top-1/2 transform md:-translate-y-1/2 rounded-full text-[#bc7c37] text-2xl md:text-4xl border border-[#bc7c37] w-10 h-10 md:h-16 md:w-16  flex justify-center items-center font-semibold cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <BsGlobe />
          </div>

          {!openMenu && (
            <div
              className="absolute z-50 left-5 top-3 transform  rounded-full text-[#bc7c37] text-2xl w-10 h-10 flex justify-center items-center font-semibold cursor-pointer md:hidden"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              {showMobileSearch ? <IoClose /> : <MdMenu />}
            </div>
          )}

          {/* Popup container */}
          <div
            ref={containerRef}
            className="bg-white border border-[#bc7c37] absolute right-20 shadow-md flex rounded-xl p-4"
            style={{
              minWidth: "150px",
              display: isOpen ? "flex" : "none",
              flexDirection: "column",
              top: "100%",
              marginTop: "10px"
            }}
          >
            <button
              className="py-1 px-2 hover:bg-[#bc7c37] hover:text-white rounded"
              onClick={() => alert("English selected")}
            >
              English
            </button>
            <button
              className="py-1 px-2 hover:bg-[#bc7c37] hover:text-white rounded"
              onClick={() => alert("Spanish selected")}
            >
              Spanish
            </button>
          </div>

          {/* Main search bar */}
          {showMobileSearch ? (
            <div className="w-full mt-16 px-4 md:hidden">
              {renderSearchBar()}
            </div>
          ) : (
            <div className="hidden md:block">
              {renderSearchBar()}
            </div>
          )}
        </header>
      </div>

      {/* Property listings */}
      <div>
        {searchPerformed && (
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h2 className="text-xl font-semibold">
              {filteredProperties.length} properties found
              {selectedDestination ? ` in ${selectedDestination}` : ''}
              {checkIn && checkOut ? ` from ${checkIn.toLocaleDateString()} to ${checkOut.toLocaleDateString()}` : ''}
              {guests.adults + guests.children > 0 ? ` for ${guests.adults + guests.children} guest${guests.adults + guests.children !== 1 ? 's' : ''}` : ''}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 py-6">
          {filteredProperties.map(property => {
            
            return (
              <PropertyCard
                key={property.id}
                property={property}
                checkIn={checkIn}
                checkOut={checkOut}
              />
            );
          })}
        </div>

        {searchPerformed && filteredProperties.length === 0 && (
          <div className="max-w-7xl mx-auto px-4 py-10 text-center">
            <h3 className="text-xl font-medium text-gray-600">No properties match your search criteria</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search dates</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer>
        <div className="bg-[#f7f7f7] py-6 relative">
          <div className="max-w-7xl mx-auto px-4 gap-1 text-center md:text-left flex flex-col relative">
            <div className='px-4 gap-1 text-center md:text-left flex flex-col md:ml-72'>
              <Link href="/" className="hover:text-[#bc7c37] transition text-[#141414]">
                Rentals
              </Link>
              <Link href="/about-us" className="hover:text-[#bc7c37] transition text-[#141414]">
                About Us
              </Link>
              <Link href="/our-services" className="hover:text-[#bc7c37] transition text-[#141414]">
                Our Services
              </Link>
              <Link href="/contact" className="hover:text-[#bc7c37] transition text-[#141414]">
                Contact
              </Link>
            </div>

            <div className='absolute bottom-5 right-0 transform -translate-x-1/2 text-4xl text-green-600'>
              <Link href="https://api.whatsapp.com/send?phone=8801812345678" target="_blank" className="hover:text-green-600 transition">
                <BsWhatsapp />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}