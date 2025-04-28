import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { routes } from '../../routes'

export function Footer() {
    return (
        <footer className="bg-black py-12">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link to={routes.find(r => r.name === "Home")?.path || "/home"} className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <img src="/img/logo.png" className="h-8" alt="TradeSense Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">TradeSense</span>
                    </Link>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                        {routes.map(route => {

                            if (route.name === "Home") return null;


                            if (route.children && route.name === "News") {
                                return route.children.map(child => (
                                    <li key={child.name}>
                                        <Link to={`${route.path}/${child.path}`} className="hover:underline me-4 md:me-6">
                                            {child.name}
                                        </Link>
                                    </li>
                                ));
                            }

                            return (
                                <li key={route.name}>
                                    <Link to={route.path} className="hover:underline me-4 md:me-6">
                                        {route.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    © 2025 <Link to={routes.find(r => r.name === "Home")?.path || "/home"} className="hover:underline">TradeSense</Link>. All Rights Reserved.
                </span>
            </div>
        </footer>
    );
}

export default Footer
