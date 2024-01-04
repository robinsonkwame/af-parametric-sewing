import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DefaultService } from '../api-client/services/DefaultService';
import { ImagePreparationAlgorithm, ImageTo3DAlgorithm } from '../api-client/models/AlgorithmTypes';


const BodyMeasurementPage = () => {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Assume a way to determine if the user is logged in
  const [imageUploaded, setImageUploaded] = useState(false); // Assume a way to determine if the image is uploaded
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [retryInterval, setRetryInterval] = useState(1000); // starting with 1 second

  const handleLogin = () => {
    DefaultService.postLogin({ username: 'username', password: 'password' });
    setIsLoggedIn(true); 
  };

  const handleUploadImages = () => {
    // TODO: Implement image selection and upload OR choose images
    // although I guess they're both the same
  };

  const handleNotifyUsers = () => {
    DefaultService.postNotifyUsers({ projectId: 'projectId', message: 'message' });
  };

  const handleChooseImages = () => {
    // TODO: Implement image selection and upload
  };

  const setBodyMeasurementPane = () => {
    // TODO: Implement image selection and upload
    // display downloadStatus ???
  };


  const handleChooseAlgorithms = (algorithmStrings) => {
    const algorithms = algorithmStrings.map(str => {
      // Check and convert from ImagePreparationAlgorithm
      if (Object.values(ImagePreparationAlgorithm).includes(str)) {
        return ImagePreparationAlgorithm[str];
      }
  
      // Check and convert from ImageTo3DAlgorithm
      if (Object.values(ImageTo3DAlgorithm).includes(str)) {
        return ImageTo3DAlgorithm[str];
      }
  
      throw new Error(`Invalid algorithm type: ${str}`);
    });
  
    // Updating the selected algorithms state
    setSelectedAlgorithms([...new Set([...selectedAlgorithms, ...algorithms])]);
    DefaultService.postChooseAlgorithms({ algorithms: [...new Set([...selectedAlgorithms, ...algorithms])] });
  };

  const checkDownloadStatus = async () => {
    try {
      const status = await DefaultService.getDownloadStatus();
      setDownloadStatus(status);
      if (status === 'pending') {
        // Schedule next check with exponential backoff
        setTimeout(checkDownloadStatus, retryInterval);
        setRetryInterval(retryInterval * 2); // Double the interval for next retry
      } else if (status === 'finished') {
        // Fetch the data and pass it to setBodyMeasurementPane
        const data = await fetch(status.downloadUrl).then(res => res.json());
        setBodyMeasurementPane(data);
      }
    } catch (error) {
      console.error('Error fetching download status:', error);
    }
  };

  useEffect(() => {
    if (selectedAlgorithms.length > 0 && imageUploaded && isLoggedIn) {
      checkDownloadStatus();
    }
  }, [selectedAlgorithms, imageUploaded, isLoggedIn]);

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

        {/* Login button */}
        <button onClick={handleLogin} className="login-button mt-4 px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700">
          Login
        </button>

        {/* Upload Images button */}
        <button onClick={handleUploadImages} className="upload-images-button mt-4 px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700">
          Upload Images
        </button>

        {/* Notify Users button */}
        <button onClick={handleNotifyUsers} className="notify-users-button mt-4 px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700">
          Notify Users
        </button>

        {/* Choose Images button */}
        <button onClick={handleChooseImages} className="choose-images-button mt-4 px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700">
          Choose Images
        </button>

        {/* Choose Image Preparation Algorithms dropdown */}
        <select multiple onChange={(e) => handleChooseAlgorithms([...e.target.selectedOptions].map(o => o.value))} className="choose-algorithms-dropdown mt-4 px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700">

          <option value={ImagePreparationAlgorithm.FOREGROUND_CLIPPING}>Foreground Clipping</option>
          <option value={ImagePreparationAlgorithm.CONTRAST_SETTING}>Contrast Setting</option>
          <option value={ImagePreparationAlgorithm.DE_FUZZIFICATION}>De-Fuzzification</option>
          <option value={ImagePreparationAlgorithm.UPSCALING}>Upscaling</option>
        </select>

        {/* Choose Image to 3D Algorithms dropdown */}
        <select multiple onChange={(e) => handleChooseAlgorithms([...e.target.selectedOptions].map(o => o.value))} className="choose-algorithms-dropdown mt-4 px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700">

          <option value={ImageTo3DAlgorithm.GUASSIAN_SPLATTING}>Guassian Splatting</option>
        </select>
      </main>
    </div>
  );
};

export default BodyMeasurementPage;


