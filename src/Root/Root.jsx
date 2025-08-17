import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';

const Root = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
            {/* Navbar at the top */}
            <header>
                <Navbar />
            </header>

            {/* Main content area */}
            <main className="flex-grow px-4 sm:px-6 lg:px-20 py-10 w-full">
                {/* Each page rendered via Outlet */}
                <Outlet />
            </main>

            {/* Footer at the bottom */}
            <footer className="mt-auto bg-white shadow-inner">
                <Footer />
            </footer>
        </div>
    );
};

export default Root;
