import React from "react";
import {
  ShoppingCart,
  LogIn,
  LogOut,
  UserPlus,
  UserPlus2,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
export default function NavBar() {
  const user = true;
  const isAdmin = true;
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-800 bg-opacity-90 backdrop-blur-md shadow-lg text-white  z-40 transition-all duration-300 border-b border-emerald-800 ">
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="text-2xl font-bold text-emerald-400 items-center space-x-2 flex"
        >
          E-commerce
        </Link>

        <nav className="flex flex-wrap items-center mt-4">
          <Link
            to={"/"}
            className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
          >
            Home
          </Link>
          {user && (
            <Link to={"/cart"} className="relative-group">
              <ShoppingCart
                className="inline-block mr-1 text-emerald-400"
                size={20}
              />
              <span className="hidden sm:inline">Cart</span>

              <span className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                3
              </span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to={"/admin"}
              className="bg-emerald-700 text-white px-3 py-1 rounded-md font-medium hover:text-emerald-600 transition duration-300 ease-in-out flex items-center"
            >
              <Lock className="inline-block mr-1" size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}
          {user ? (
            <button className="bg-gray-600 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out">
              <LogOut className="inline-block mr-1" size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <>
              <button className="bg-gray-600 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out">
                <LogIn className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Login</span>
              </button>
              <Link
                to={"/signup"}
                className="bg-green-600 text-white px-3 py-1 rounded-md font-medium hover:text-green-500 transition duration-300 ease-in-out flex items-center"
              >
                <UserPlus className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Sign Up</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
