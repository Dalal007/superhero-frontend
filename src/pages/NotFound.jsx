import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-700">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Hero Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The hero you're looking for doesn't exist or has been removed from our database.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate("/")}
            className="btn w-full"
          >
            🦸 Browse All Heroes
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline w-full"
          >
            ← Go Back
          </button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>If you believe this is an error, please try:</p>
          <ul className="mt-2 space-y-1">
            <li>• Refreshing the page</li>
            <li>• Checking the URL for typos</li>
            <li>• Searching for the hero from the main page</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
