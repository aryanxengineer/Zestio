import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useAppData } from "../context/AppContext";
import { useEffect, useState } from "react";
import { MapPin, Search, ShoppingCart, User } from "lucide-react";

const Navbar = () => {
    const { isAuth, city } = useAppData();
    const location = useLocation();
    const isHomepage = location.pathname === "/";

    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = {};

            //   if (search) params.search = search;
            //   if (city) params.city = city;

            setSearchParams(params);
        }, 400);

        return () => clearTimeout(timer);
    }, [search, city, setSearchParams]);

    return (
        <nav className="w-full backdrop-blur-md bg-white/70 border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">

                {/* Logo */}
                <div className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-black to-gray-500 bg-clip-text text-transparent cursor-pointer">
                    <Link to={'/'}>Zestio</Link>
                </div>

                {/* Search Section */}
                {
                    isHomepage && <div className="flex items-center w-full max-w-3xl bg-white shadow-sm border rounded-full overflow-hidden hover:shadow-md transition">

                        {/* City */}
                        <div className="flex items-center gap-1 px-3 border-r bg-gray-50">
                            <MapPin size={16} className="text-gray-500" />
                            <span>{city}</span>
                        </div>

                        {/* Input */}
                        <div className="flex items-center flex-1 px-3">
                            <Search size={18} className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Search for restaurants..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full py-2 outline-none text-sm"
                            />
                        </div>
                    </div>
                }

                {/* Right Section */}
                <div className="flex items-center gap-6">

                    {/* Account */}
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition">
                        <User size={20} />
                        <span className="hidden sm:block text-sm font-medium">
                            {isAuth ? <Link to={'/account'}>Account</Link> : <Link to={'/login'}>Login</Link>}
                        </span>
                    </button>

                    {/* Cart */}
                    <Link to={'/cart'}>
                        <div className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 transition">
                            <ShoppingCart size={22} />

                            {2 > 0 && (
                                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5 animate-pulse">
                                    {2}
                                </span>
                            )}
                        </div>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
