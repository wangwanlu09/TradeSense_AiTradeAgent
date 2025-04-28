import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { routes } from '../../routes'
import { AppRoute } from '../../routes'
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from '@headlessui/react'
import {
    Bars3Icon,
    XMarkIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/outline'

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [newsMenuOpen, setNewsMenuOpen] = useState(false)


    useEffect(() => {
        if (newsMenuOpen) {
            const closeMenu = () => setNewsMenuOpen(false);
            document.addEventListener('click', closeMenu);
            return () => document.removeEventListener('click', closeMenu);
        }
    }, [newsMenuOpen]);

    return (
        <header className="bg-black fixed top-0 w-full z-50">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-8 font-sans" aria-label="Global">
                {/* Logo */}
                <div className="flex lg:flex-1">
                    <img
                        src="/img/logo.png"
                        alt="TradeSense Logo"
                        className="h-8 w-auto"
                    />
                    <Link to="/home" className="-m-1.5 p-1.5 text-xl font-bold text-white">
                        TradeSense
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex lg:gap-x-8">
                    {routes.map((route: AppRoute) => {
                        if (route.children && route.name === "News") {
                            return (
                                <div key={route.name} className="relative">
                                    <button
                                        className="flex items-center text-sm font-semibold text-white hover:text-gray-300 py-2"
                                        onClick={(e) => {
                                            e.stopPropagation(); // 防止事件冒泡
                                            setNewsMenuOpen(!newsMenuOpen);
                                        }}
                                    >
                                        {route.name}
                                        <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${newsMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {newsMenuOpen && (
                                        <div
                                            className="absolute left-0 top-full z-10 mt-1 w-48 rounded-md bg-black shadow-lg ring-1 ring-gray-700"
                                            onClick={(e) => e.stopPropagation()} // 防止点击菜单项时关闭菜单
                                        >
                                            {route.children.map((child: AppRoute) => (
                                                <Link
                                                    key={child.name}
                                                    to={`${route.path}/${child.path}`}
                                                    className="block px-4 py-3 text-sm text-white hover:bg-gray-800"
                                                >
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        }

                        return (
                            <Link
                                key={route.name}
                                to={route.path}
                                className="text-sm font-semibold text-white hover:text-gray-300 py-2"
                            >
                                {route.name}
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Mobile Navigation */}
            <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-black p-6 shadow-lg sm:ring-1 sm:ring-gray-700">
                    <div className="flex items-center justify-between">
                        <img
                            src="/img/logo.png"
                            alt="TradeSense Logo"
                            className="h-8 w-auto"
                        />
                        <Link to="/home" className="text-lg font-bold text-white">
                            TradeSense
                        </Link>
                        <button onClick={() => setMobileMenuOpen(false)} className="text-white">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="mt-6 space-y-4">
                        {routes.map((route: AppRoute) => {
                            if (route.children && route.name === "News") {
                                return (
                                    <Disclosure key={route.name}>
                                        <DisclosureButton className="flex w-full items-center justify-between text-sm font-medium text-white hover:text-gray-300 py-2">
                                            {route.name}
                                            <ChevronDownIcon className="h-4 w-4" />
                                        </DisclosureButton>
                                        <DisclosurePanel className="pl-4 mt-2 space-y-1">
                                            {route.children.map((child: AppRoute) => (
                                                <Link
                                                    key={child.name}
                                                    to={`${route.path}/${child.path}`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="block text-sm text-white hover:text-gray-300 py-2"
                                                >
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </DisclosurePanel>
                                    </Disclosure>
                                )
                            }

                            return (
                                <Link
                                    key={route.name}
                                    to={route.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-sm font-medium text-white hover:text-gray-300 py-2"
                                >
                                    {route.name}
                                </Link>
                            )
                        })}
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}

export default Navbar

