// sankofa_sizer_beta/ui/pages/pattern.js
import React from 'react';
import Link from 'next/link';

const PatternPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-200">
      <main className="flex flex-col items-center justify-center w-9/12 flex-1 text-center">
        <h1 className="text-6xl font-bold text-gray-800">
          Pattern Design
        </h1>

        {/* Placeholder for the 3D body */}
        <div className="3d-body-container mt-6">
          {/* Placeholder element for the 3D body */}
          <div className="default-3d-body">
            {/* You would replace this with the actual 3D body component */}
            <p>3D Body Placeholder</p>
          </div>
          <button className="add-image-button mt-4 px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700">
            Add Image
          </button>
        </div>

        {/* Share with collective button */}
        <Link href="/share">
          <button className="share-collective-button mt-4 px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700">
            Share with Collective
          </button>
        </Link>

        {/* Link to body-measurement page */}
        <Link href="/body-measurement">
          <button className="body-measurement-button mt-4 px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700">
            Go to Body Measurement
          </button>
        </Link>
      </main>
    </div>
  );
};

export default PatternPage;