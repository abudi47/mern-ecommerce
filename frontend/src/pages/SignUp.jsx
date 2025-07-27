import React from "react";
import { User ,Mail} from "lucide-react";
export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="font-bold text-emerald-600 text-2xl">
        Create your account
      </h1>
      <div className="bg-gray-900 max-w-6xl flex flex-col items-center justify-center p-8 rounded-lg shadow-lg mt-4">
        <form className="w-full max-w-md space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-gray-200 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter your name"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <User size={20} />
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter your email"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Mail size={20} />
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
