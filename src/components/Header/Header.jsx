import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutButton from '../LogoutButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faHouse, faListUl, faUser, faUserPlus, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const authStatus = useSelector((state) => state.auth.status);
    const user = useSelector((state) => state.auth.userData);
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { name: "Home", url: "/", active: true },
        { name: "Login", url: "/login", active: !authStatus },
        { name: "Signup", url: "/signup", active: !authStatus },
        { name: "Todos", url: "/todos", active: authStatus },
        { name: "Activity Logs", url: "/activitylogs", active: authStatus },
    ];

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button 
                onClick={toggleSidebar} 
                className="fixed top-2 left-2 z-50 p-2 rounded-md bg-transparent text-white md:hidden"
            >
                {isOpen ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faBars} />}
            </button>

            {/* Sidebar */}
            <div className={`bg-sideBar text-slate-200 h-screen w-64 fixed flex flex-col justify-between transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-40`}>
                <div className="pt-[49px] md:p-6">
                    {/* User Info Section */}
                    <div className="mb-4">
                        {authStatus ? (
                            <span className="bg-blue-950 py-2 px-4 rounded-none md:rounded-lg inline-block w-full font-semibold">
                                <FontAwesomeIcon icon={faUser} className='mt-[2px] mr-4' /> 
                                {user.name}
                            </span>
                        ) : null}
                    </div>

                    {/* Navigation Items */}
                    <div className="flex-1">
                        <ul className="space-y-4">
                            {navItems.map((item) => 
                                item.active ? (
                                    <li key={item.name} className='flex justify-between'>
                                        <button 
                                            onClick={() => {
                                                navigate(item.url);
                                                setIsOpen(false); // Close sidebar on navigation
                                            }} 
                                            className={`flex align-center w-full text-left py-2 px-4 rounded-lg duration-200 
                                                hover:bg-slate-700 ${
                                                    location.pathname === item.url 
                                                        ? ' text-yellow-500' // Active styles
                                                        : ''
                                                }`}
                                        >
                                            {/* Icons */}
                                            {item.name === "Home" && (<FontAwesomeIcon icon={faHouse} className='mt-[2px] mr-4' />)}
                                            {item.name === "Todos" && (<FontAwesomeIcon icon={faListUl} className='mt-[2px] mr-4' />)}
                                            {item.name === "Activity Logs" && (<FontAwesomeIcon icon={faFolderOpen} className='mt-[2px] mr-4' />)}
                                            {item.name === "Signup" && (<FontAwesomeIcon icon={faUserPlus} className='mt-[2px] mr-4' />)}
                                            {item.name === "Login" && (<FontAwesomeIcon icon={faUser} className='mt-[2px] mr-4' />)}
                                            {item.name}
                                        </button>
                                    </li>
                                ) : null
                            )}
                        </ul>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="md:p-6 p-3">
                    {authStatus && <LogoutButton />}
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
}

export default Header;
