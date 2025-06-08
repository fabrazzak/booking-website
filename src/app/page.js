'use client'
import PropertyCard from '@/component/PropertyCard/PropertyCard';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { BsGlobe } from "react-icons/bs";
import { BsWhatsapp } from "react-icons/bs";

// Mock database of booked dates for each property
const bookedDates = {
  "apt-001": [
    { start: new Date(2024, 5, 10), end: new Date(2024, 5, 15) },
    { start: new Date(2024, 6, 1), end: new Date(2024, 6, 7) }
  ],
  "apt-002": [
    { start: new Date(2024, 5, 5), end: new Date(2024, 5, 12) },
    { start: new Date(2024, 6, 20), end: new Date(2024, 6, 25) }
  ],
  "apt-003": [
    { start: new Date(2024, 5, 20), end: new Date(2024, 5, 27) }
  ],
  "apt-0011": [
    { start: new Date(2024, 5, 10), end: new Date(2024, 5, 15) }
  ],
  "apt-0022": [
    { start: new Date(2024, 5, 8), end: new Date(2024, 5, 14) }
  ],
  "apt-0033": [
    { start: new Date(2024, 5, 25), end: new Date(2024, 5, 30) }
  ]
};

export const properties = [
  {
    id: "apt-001",
    type: "apartment",
    title: "Sea View Luxury Apartment",
    destination: "Cox's Bazar",
    mainImage: "https://a0.muscache.com/im/pictures/hosting/Hosting-1199417950513832087/original/6fe09420-a945-441f-948f-bc1da99773db.jpeg?im_w=1200",
    capacity: {
      adults: 4,
      children: 2,
      bedrooms: 2,
      bathrooms: 1
    },
    price: 120,
    isFeatured: true
  },
  {
    id: "apt-002",
    type: "apartment",
    title: "Modern City Center Flat",
    destination: "Dhaka",
    mainImage: "https://a0.muscache.com/im/pictures/7c5e5afc-c954-41f7-bf0c-70b866dbcc60.jpg?im_w=1200",
    capacity: {
      adults: 3,
      children: 1,
      bedrooms: 1,
      bathrooms: 1
    },
    price: 95,
    isFeatured: false
  },
  {
    id: "apt-003",
    type: "villa",
    title: "Nature Retreat Villa",
    destination: "Sylhet",
    mainImage: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-52666336/original/2b259c4f-d5b5-4e1c-8651-86debc704bfc.jpeg?im_w=1200",
    capacity: {
      adults: 6,
      children: 3,
      bedrooms: 3,
      bathrooms: 2
    },
    price: 150,
    isFeatured: true
  },
  {
    id: "apt-0011",
    type: "apartment",
    title: "Sea View Luxury Apartment",
    destination: "Cox's Bazar",
    mainImage: "https://a0.muscache.com/im/pictures/hosting/Hosting-1199417950513832087/original/6fe09420-a945-441f-948f-bc1da99773db.jpeg?im_w=1200",
    capacity: {
      adults: 4,
      children: 2,
      bedrooms: 2,
      bathrooms: 1
    },
    price: 120,
    isFeatured: true
  },
  {
    id: "apt-0022",
    type: "apartment",
    title: "Modern City Center Flat",
    destination: "Dhaka",
    mainImage: "https://a0.muscache.com/im/pictures/7c5e5afc-c954-41f7-bf0c-70b866dbcc60.jpg?im_w=1200",
    capacity: {
      adults: 3,
      children: 1,
      bedrooms: 1,
      bathrooms: 1
    },
    price: 95,
    isFeatured: false
  },
  {
    id: "apt-0033",
    type: "villa",
    title: "Nature Retreat Villa",
    destination: "Sylhet",
    mainImage: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-52666336/original/2b259c4f-d5b5-4e1c-8651-86debc704bfc.jpeg?im_w=1200",
    capacity: {
      adults: 6,
      children: 3,
      bedrooms: 3,
      bathrooms: 2
    },
    price: 150,
    isFeatured: true
  }
];

// Function to check if a date range is available
const isDateRangeAvailable = (propertyId, checkIn, checkOut) => {
  const bookings = bookedDates[propertyId] || [];
  
  // If no dates selected, consider it available
  if (!checkIn || !checkOut) return true;
  
  // Check if the selected range overlaps with any booked dates
  for (const booking of bookings) {
    if (
      (checkIn >= booking.start && checkIn <= booking.end) ||
      (checkOut >= booking.start && checkOut <= booking.end) ||
      (checkIn <= booking.start && checkOut >= booking.end)
    ) {
      return false; // Overlapping dates found
    }
  }
  return true; // No overlapping dates found
};

export default function SearchBar() {
  const [activeTab, setActiveTab] = useState(null)
  const [checkIn, setCheckIn] = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [guests, setGuests] = useState({ adults: 0, children: 0 })
  const [datePickerView, setDatePickerView] = useState('checkIn')
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [filteredProperties, setFilteredProperties] = useState(properties)
  const [searchPerformed, setSearchPerformed] = useState(false)

  const containerRef = useRef(null)
  const destinationRef = useRef(null)
  const dateRef = useRef(null)
  const guestsRef = useRef(null)
  const searchRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false);

  const destinations = ['Dhaka', 'Chattogram', 'Sylhet', 'Cox\'s Bazar', 'Rajshahi']

  // Handle click outside to close popup
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
    const oneMonthLater = new Date(date);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    
    setCheckIn(date);
    // setCheckOut(oneMonthLater); // Auto-set checkout to 1 month after checkin
    setDatePickerView('checkOut');
    setActiveTab('out-date');
  };

  const handleCheckOutSelect = (date) => {
    // Ensure checkout is at least 1 month after checkin
    if (checkIn) {
      const minCheckout = new Date(checkIn);
      minCheckout.setMonth(minCheckout.getMonth() + 1);
      
      if (date < minCheckout) {
        setCheckOut(minCheckout);
      } else {
        setCheckOut(date);
      }
    } else {
      setCheckOut(date);
    }
  }

  const getMinCheckoutDate = () => {
    if (checkIn) {
      const minDate = new Date(checkIn);
      minDate.setMonth(minDate.getMonth() + 1);
      return minDate;
    }
    const today = new Date();
    const minDate = new Date(today);
    minDate.setMonth(minDate.getMonth() + 1);
    return minDate;
  };

  const handleGuestChange = (type, operation) => {
    setGuests(prev => {
      const newValue = operation === 'increment'
        ? prev[type] + 1
        : Math.max(prev[type] - 1, 0)

      return {
        ...prev,
        [type]: newValue
      }
    })
  }

  const handleDestinationSelect = (destination) => {
    setSelectedDestination(destination)
    setTimeout(() => {
      setActiveTab('in-date')
      setDatePickerView('checkIn')
    }, 50)
  }

  // Function to handle search
  const handleSearch = () => {
    const totalGuests = guests.adults + guests.children;
    
    const filtered = properties.filter(property => {
      // Filter by destination if selected
      if (selectedDestination && property.destination !== selectedDestination) {
        return false;
      }
      
      // Filter by guest capacity
      if (totalGuests > 0 && 
          (property.capacity.adults + property.capacity.children) < totalGuests) {
        return false;
      }
      
      // Filter by date availability
      if (checkIn && checkOut && !isDateRangeAvailable(property.id, checkIn, checkOut)) {
        return false;
      }
      
      return true;
    });
    
    setFilteredProperties(filtered);
    setSearchPerformed(true);
    setActiveTab(null);
  };

  // Function to highlight booked dates in the date picker
  const isBookedDate = (date, propertyId) => {
    const bookings = bookedDates[propertyId] || [];
    return bookings.some(booking => 
      date >= booking.start && date <= booking.end
    );
  };

  return (
    <div className="w-full flex justify-center bg-white z-50 relative flex-col">
      <div className=' bg-[#f7f7f7]  border-[#bc7c37] border-b-1 '>
        <header className='w-full flex justify-center py-10 max-w-7xl mx-auto z-50 relative '>

          {/* language selector */}
          <div
            className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-full text-[#bc7c37] text-4xl border border-[#bc7c37] w-18 h-18 flex justify-center items-center font-semibold cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <BsGlobe />
          </div>

          {/* Popup container */}
          <div
            ref={containerRef}
            className="bg-white border border-[#bc7c37] absolute right-15  shadow-md flex rounded-xl  p-4"
            style={{ minWidth: "150px", display: isOpen ? "flex" : "none", flexDirection: "column" }}
          >
            <button
              className="py-1 px-2 hover:bg-[#bc7c37] hover:text-white rounded  "
              onClick={() => alert("English selected")}
            >
              English
            </button>
            <button
              className="py-1 px-2 hover:bg-[#bc7c37] hover:text-white rounded  "
              onClick={() => alert("Spanish selected")}
            >
              Spanish
            </button>
          </div>

          {/* main search bar  */}
          <div
            ref={containerRef}
            className="bg-white rounded-full border border-[#bc7c37] shadow-md flex relative space-x-2"
          >

            {/* Destination */}
            <div
              ref={destinationRef}
              className="cursor-pointer relative "
              onClick={() => setActiveTab(activeTab === 'destination' ? null : 'destination')}
            >
              <div className={`px-6 py-4 border-r border-gray-100 ${activeTab === 'destination' ? 'bg-amber-50 rounded-full' : ''}`}>
                <p className="text-sm font-semibold text-[#141414]">DESTINATION</p>
                <p className="text-gray-500 text-sm">
                  {selectedDestination || 'Search destination'}
                </p>
              </div>

              {activeTab === 'destination' && (
                <div className="absolute left-0 top-full mt-2 bg-white shadow-lg p-4 rounded-xl z-50 w-96">
                  <p className='my-5'>Suggestions de destinations</p>
                  <ul className="space-y-2" >
                    {destinations.map((dest, i) => (
                      <li
                        key={i}
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
              <div className={`px-6 py-4 border-r border-gray-100 ${activeTab === 'in-date' ? 'bg-amber-50 rounded-full' : ''}`}>
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
              <div className={`px-6 py-4 border-r border-gray-100 ${activeTab === 'out-date' ? 'bg-amber-50 rounded-full' : ''}`}>
                <p className="text-sm font-semibold text-[#141414]">CHECK OUT</p>
                <p className="text-gray-500 text-sm">
                  {checkOut ? checkOut.toLocaleDateString() : 'Add date'}
                </p>
              </div>
            </div>

            {/* Combined Date Picker Popup */}
            {(activeTab === 'in-date' || activeTab === 'out-date') && (
              <div className="absolute left-0 top-full mt-2 bg-white shadow-lg p-6 rounded-xl z-50 w-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className={datePickerView === 'checkIn' ? '' : 'opacity-70'}>
                    <DatePicker
                      selected={checkIn}
                      onChange={handleCheckInSelect}
                      selectsStart
                      startDate={checkIn}
                      endDate={checkOut}
                      minDate={new Date()}
                      maxDate={checkOut ? new Date(checkOut.getFullYear(), checkOut.getMonth() - 1, checkOut.getDate()) : null}
                      inline
                      calendarClassName="rounded-lg border-2 border-gray-200"
                      dateFormat="dd MMM yyyy"
                      shouldCloseOnSelect={false}
                      focusSelectedMonth={true}
                      dayClassName={date => {
                        // Disable dates that are less than 1 month before checkOut (if checkOut is set)
                        if (checkOut) {
                          const oneMonthBeforeCheckOut = new Date(checkOut);
                          oneMonthBeforeCheckOut.setMonth(oneMonthBeforeCheckOut.getMonth() - 1);
                          if (date > oneMonthBeforeCheckOut) {
                            return 'disabled-date';
                          }
                        }
                        // Highlight booked dates in red
                        const isBooked = properties.some(property => 
                          isBookedDate(date, property.id)
                        );
                        return isBooked ? 'bg-red-100 text-red-500' : undefined;
                      }}
                    />
                  </div>
                  <div className={datePickerView === 'checkOut' ? '' : 'opacity-70'}>
                    <DatePicker
                      key={checkIn ? `checkout-${checkIn.getTime()}` : 'checkout-default'}
                      selected={checkOut}
                      onChange={handleCheckOutSelect}
                      selectsEnd
                      startDate={checkIn}
                      endDate={checkOut}
                      minDate={getMinCheckoutDate()}
                      inline
                      calendarClassName="rounded-lg"
                      dateFormat="dd MMM yyyy"
                      shouldCloseOnSelect={false}
                      focusSelectedMonth={true}
                      initialMonth={checkIn 
                        ? new Date(checkIn.getFullYear(), checkIn.getMonth() + 1, 1)
                        : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                      }
                      dayClassName={date => {
                        // Disable dates that are less than 1 month after checkIn (if checkIn is set)
                        if (checkIn) {
                          const oneMonthAfterCheckIn = new Date(checkIn);
                          oneMonthAfterCheckIn.setMonth(oneMonthAfterCheckIn.getMonth() + 1);
                          if (date < oneMonthAfterCheckIn) {
                            return 'disabled-date';
                          }
                        }
                        // Highlight booked dates in red
                        const isBooked = properties.some(property => 
                          isBookedDate(date, property.id)
                        );
                        return isBooked ? 'bg-red-100 text-red-500' : undefined;
                      }}
                    />
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Minimum stay: 1 month</p>
                  {checkIn && checkOut && (
                    <p className="font-medium">
                      Selected stay: {Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))} days
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
              <div className={`px-6 py-4 ${activeTab === 'guests' ? 'bg-amber-50 rounded-full' : ''}`}>
                <p className="text-sm font-semibold text-[#141414]">GUESTS</p>
                <p className="text-gray-500 text-sm">
                  {guests.adults + guests.children > 0 
                    ? `${guests.adults + guests.children} guest${guests.adults + guests.children !== 1 ? 's' : ''}` 
                    : 'Add guests'}
                </p>
              </div>

              {activeTab === 'guests' && (
                <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 bg-white shadow-2xl p-5 rounded-2xl z-50 w-96 transition-all duration-300">
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
                className="bg-[#bc7c37] hover:bg-[#e69500] text-white px-5 py-2 rounded-full"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
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
            const isAvailable = isDateRangeAvailable(property.id, checkIn, checkOut);
            
            return (
              <PropertyCard 
                key={property.id} 
                property={property} 
                checkIn={checkIn}
                checkOut={checkOut}
                isAvailable={isAvailable}
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
      <footer className=''>
        <div className="bg-[#f7f7f7] py-6 relative">
          <div className="max-w-7xl mx-auto px-4 gap-1 text-center md:text-left flex flex-col relative">
            <Link href="/" className=" hover:text-[#bc7c37] transition text-[#141414]">
              Rentals
            </Link>
            <Link href="/about-us" className="  hover:text-[#bc7c37] transition text-[#141414]">
              About Us
            </Link>
            <Link href="/our-services" className="  hover:text-[#bc7c37] transition text-[#141414]">
              Our Services
            </Link>
            <Link href="/contact" className="fhover:text-[#bc7c37] transition text-[#141414]">
              Contact
            </Link>

            <div className='absolute bottom-5 right-0 transform -translate-x-1/2 text-4xl text-green-600'>
              <Link href="https://api.whatsapp.com/send?phone=8801812345678" target="_blank" className=" hover:text-green-600 transition">
                <BsWhatsapp />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}