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
  const user = false;
  const isAdmin = true;
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-800 bg-opacity-90 backdrop-blur-md shadow-lg text-white  z-40 transition-all duration-300 border-b border-emerald-800 ">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-emerald-400 items-center space-x-2 flex"
          >
            E-commerce
          </Link>

          <nav className="flex flex-wrap items-center gap-4">
            <Link
              to={"/"}
              className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
            >
              Home
            </Link>
            {user && (
              <Link
                to={"/cart"}
                className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 
							ease-in-out"
              >
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-emerald-400"
                  size={20}
                />
                <span className="hidden sm:inline">Cart</span>
                {1 > 0 && (
                  <span
                    className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
									text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out"
                  >
                    2
                  </span>
                )}
              </Link>
            )}

            {isAdmin && (
              <Link
                to={"/admin"}
                className="bg-emerald-700 hover:bg-emerald-600  text-white px-3 py-1 rounded-md font-medium  transition duration-300 ease-in-out flex items-center"
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}
            {user ? (
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out">
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="bg-emerald-700 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out flex items-center"
                >
                  <UserPlus className=" mr-2" size={18} />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
                <Link
                  to={"/login"}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
