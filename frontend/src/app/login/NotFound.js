import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-4xl font-bold mb-4">
        <span className="text-red-500">404</span> Page Not Found
      </h2>
      <p className="text-lg mb-8">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition duration-300"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
