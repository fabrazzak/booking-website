'use client'
const { createContext, useContext, useState } = require("react");


const MyContext = createContext();

const MyContextProvider = ({ children }) => {

 
    const [checkOut, setCheckOut] = useState(null);
    const [checkIn, setCheckIn] = useState(null);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [guests, setGuests] = useState({ adults: 0, children: 0 });
      const [totalBookingDay, setTotalBookingDay] = useState(0)
  
    const info = { checkOut, checkIn, selectedDestination,guests,setCheckOut,setCheckIn,setSelectedDestination ,setGuests,totalBookingDay,setTotalBookingDay}
    return (
        <MyContext.Provider value={info}>
            {children}
        </MyContext.Provider>
    );
};

export default MyContextProvider;


export const useMyContext = () => useContext(MyContext)