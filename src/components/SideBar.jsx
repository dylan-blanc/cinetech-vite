import React from "react";

function SideBar() {
    return (
        <nav className="w-1/5 min-w-[200px] sticky left-0 top-0 h-screen text-white p-6 overflow-y-auto" style={{ backgroundColor: '#282129' }}>
            {/* Films / Series TV */}
            <ul className="mb-6">
                <li className="py-1">
                    <a href="#" className="text-white hover:text-gray-300">Films</a>
                </li>
                <li className="py-1">
                    <a href="#" className="text-white hover:text-gray-300">Serie TV</a>
                </li>
            </ul>

            {/* Genres Section */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Genres</span>
                    <span className="text-gray-400">≫</span>
                </div>
                <ul>
                    <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Action</a></li>
                    <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Adventure</a></li>
                    <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Fantasy</a></li>
                    <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Animation</a></li>
                    <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Comedy</a></li>
                    <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Drama</a></li>
                    <li className="py-1"><a href="#" className="text-white hover:text-gray-300">History</a></li>
                    <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Horror</a></li>
                    <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Music</a></li>
                    <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Mystery</a></li>
                    <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Family</a></li>
                    <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Science-Fiction</a></li>
                    <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Thriller</a></li>
                    <li className="py-1"><a href="#" className="text-white hover:text-gray-300">War</a></li>
                    <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Western</a></li>
                    <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Documentary</a></li>
                </ul>
                <div className="text-gray-500 text-center py-2">............</div>
            </div>

            {/* Filtrer Par Section */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Filtrer Par</span>
                    <span className="text-gray-400">≫</span>
                </div>
                <ul>
                    <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Popularité</a></li>
                    <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Revenue</a></li>
                    <li className="py-1"><a href="#" className="text-white hover:text-gray-300">Vote</a></li>
                </ul>
            </div>
        </nav>
    );
}

export default SideBar;