"use client"
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import SearchBar from "./Search";


const Navbar = ({}) => {
  const [nav, setNav] = useState(false);

  // const [clientId, setClientId] = useState<string>('1');

  // useEffect(() => {
  //   const storedClientId = localStorage.getItem('clientId');
  //   setClientId(storedClientId!);
  //   console.log(clientId)
  // }, []);

  // const links = [
  //   {
  //     id: 1,
  //     link: "Home",
  //     url: `/client_home/${clientId}`
  //   },
  //   {
  //     id: 2,
  //     link: "Profile",
  //     url: `/client_profile/${clientId}`
  //   },
  //   {
  //     id: 3,
  //     link: "Logout",
  //   },
  // ];

  // const handleLogout = async () => {
    //     const handleChange = () => {
    //         const newValue = false;
    //         setMyVariable(newValue);

    //         location.reload()
    //     }

    //     console.log("logout clicked")

    //     console.log(getMyVariable())

    //     await handleChange()
    // }
  const clientId = localStorage.getItem('clientId');

  // if(true){
  //   <div className="flex justify-between items-center w-full h-25 px-4 text-white bg-black nav">
  //     <div style={{display: 'flex'}}>
  //       <Image
  //         src="/assets/house.png"
  //         alt="Homely Realtors"
  //         width={30}  
  //         height={30}
  //         className='mx-auto my-4'
  //       />
  //       <SearchBar/>
  //     </div>

  //     <ul className="hidden md:flex">
  //       {links.map(({ id, link }) => (
  //         <li
  //           key={id}
  //           className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline"
  //         >
  //           <Link href={link}>{link}</Link>
  //         </li>
  //       ))}
  //     </ul>

  //     {/* <button onClick={handleLogout} className={'text-white py-2 px-4 rounded bg-red-400 hover:bg-red-700'}>
  //       Logout
  //     </button> */}

  //     <div
  //       onClick={() => setNav(!nav)}
  //       className="cursor-pointer pr-4 z-10 text-gray-500 md:hidden"
  //     >
  //       {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
  //     </div>

  //     {nav && (
  //       <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-gray-800 text-gray-500">
  //         {links.map(({ id, link }) => (
  //           <li
  //             key={id}
  //             className="px-4 cursor-pointer capitalize py-6 text-4xl"
  //           >
  //             <Link onClick={() => setNav(!nav)} href={link}>
  //               {link}
  //             </Link>
  //           </li>
  //         ))}
  //       </ul>
  //     )}

  //   </div>
  // }

  return (
    <div className="flex justify-between items-center w-full h-25 px-4 text-white bg-black nav">
      <div style={{display: 'flex'}}>
        <Image
          src="/assets/house.png"
          alt="Homely Realtors"
          width={30}  
          height={30}
          className='mx-auto my-4'
        />
        <SearchBar/>
      </div>

      <ul className="hidden md:flex">
        <li
          className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline"
        >
          <Link href={`/client_home/${clientId}`}>Home</Link>
        </li>
        <li
          className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline"
        >
          <Link href={`/client_profile/${clientId}`}>Profile</Link>
        </li>
        <li
          className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline"
        >
          <Link href={`/`}>Logout</Link>
        </li>
      </ul>

      {/* <button onClick={handleLogout} className={'text-white py-2 px-4 rounded bg-red-400 hover:bg-red-700'}>
        Logout
      </button> */}

      <div
        onClick={() => setNav(!nav)}
        className="cursor-pointer pr-4 z-10 text-gray-500 md:hidden"
      >
        {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>

      {nav && (
        <ul className="flex flex-col justify-center items-center top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-gray-800 text-gray-500">
          <li
            className="px-4 cursor-pointer capitalize py-6 text-4xl"
          >
            <Link href={`/client_home/${clientId}`} onClick={() => setNav(!nav)}>Home</Link>
          </li>
          <li
            className="px-4 cursor-pointer capitalize py-6 text-4xl"
          >
            <Link href={`/client_profile/${clientId}`} onClick={() => setNav(!nav)}>Profile</Link>
          </li>
          <li
            className="px-4 cursor-pointer capitalize py-6 text-4xl"
          >
            <Link href={'/'} onClick={() => setNav(!nav)}>Logout</Link>
          </li>
        </ul>
      )}

    </div>
  );
};

export default Navbar;