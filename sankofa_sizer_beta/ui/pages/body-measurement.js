import React from 'react';
import Link from 'next/link';

const BodyMeasurementPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-200">
      <main className="flex flex-col items-center justify-center w-9/12 flex-1 text-center">
        <h1 className="text-6xl font-bold text-gray-800">
          Body Measurement
        </h1>

        {/* Body Measurement Pane */}
        <div className="body-measurement-pane">
          {/* Replace this with the actual Body Measurement component */}
          <p>Body Measurement Placeholder</p>
        </div>

        {/* Share with collective button */}
        <Link href="/share">
          <button className="share-collective-button mt-4 px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700">
            Share with Collective
          </button>
        </Link>

        {/* Link to pattern page */}
        <Link href="/pattern">
          <button className="pattern-button mt-4 px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700">
            Go to Pattern
          </button>
        </Link>
      </main>
    </div>
  );
};

export default BodyMeasurementPage;
