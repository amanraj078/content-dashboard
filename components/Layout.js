"use client";
import { debounce } from "lodash";
import { useDispatch } from "react-redux";
import { setQuery, searchContent } from "@/store/searchSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
    FiMenu,
    FiX,
    FiSearch,
    FiHome,
    FiTrendingUp,
    FiHeart,
    FiUser,
} from "react-icons/fi";

export default function Layout({ children }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    const handleSearch = debounce((q) => {
        dispatch(setQuery(q));
        dispatch(searchContent(q));
        router.push("/search");
    }, 500);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed md:static z-30 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
                    isSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0"
                } w-64 flex-shrink-0 flex flex-col`}
            >
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-gray-800">
                            Personalized Feed
                        </h1>
                        <button
                            onClick={toggleSidebar}
                            className="md:hidden p-2 rounded-md hover:bg-gray-100"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto">
                    <ul className="p-2 space-y-1">
                        <li>
                            <Link
                                href="/"
                                className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                                onClick={closeSidebar}
                            >
                                <FiHome className="w-5 h-5 mr-3" />
                                <span className="text-gray-800 font-semibold">
                                    Feed
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/trending"
                                className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                                onClick={closeSidebar}
                            >
                                <FiTrendingUp className="w-5 h-5 mr-3" />
                                <span className="text-gray-800 font-semibold">
                                    Trending
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/favorites"
                                className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                                onClick={closeSidebar}
                            >
                                <FiHeart className="w-5 h-5 mr-3" />
                                <span className="text-gray-800 font-semibold">
                                    Favorites
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/search"
                                className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                                onClick={closeSidebar}
                            >
                                <FiSearch className="w-5 h-5 mr-3" />
                                <span className="text-gray-800 font-semibold">
                                    Search
                                </span>
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-3">
                            <FiUser className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Welcome</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white p-3 border-b border-b-neutral-200 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center flex-1 w-full">
                        <button
                            onClick={toggleSidebar}
                            className="mr-3 p-2 rounded-md hover:bg-gray-100 md:hidden"
                        >
                            <FiMenu className="w-5 h-5" />
                        </button>
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-100 pl-10 pr-4 py-2 border border-neutral-300 shadow-md rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Mobile profile button */}
                    <button className="md:hidden p-2 rounded-full hover:bg-gray-100">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                            <FiUser className="w-4 h-4" />
                        </div>
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto w-full p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
