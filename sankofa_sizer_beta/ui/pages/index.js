import React from 'react';
import Link from 'next/link';

const IndexPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-9/12 flex-1 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to Sankofa Sizer Beta
        </h1>

        <p className="mt-3 text-2xl">
          Choose an option to proceed
        </p>

        <div className="flex mt-6">
          <Link href="/body-measurement">
            <a className="m-3 px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Body Measurement
            </a>
          </Link>

          <Link href="/pattern">
            <a className="m-3 px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Pattern
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default IndexPage;
