import React from "react";
import Typography from '@mui/material/Typography';

const Usage = () => {
  return (
    <main  id='Units' className="min-h-screen relative overflow-hidden -skew-y-[3deg]">
      {/* Image Overlay */}
      <div className="absolute inset-0 z-[3] mt-20 skew-y-[3deg] flex items-center justify-center">
        <img src="/logo.svg" alt="Overlay" className="w-96" />
      </div>

      {/* Skewed Background */}
      <div
        className="absolute inset-0 bg-cover bg-center skew-y-[6deg]"
        style={{ backgroundImage: 'url("/office.jpg")' }}
      >
        <div className="absolute inset-0 flex justify-between">
          <div className="w-1/2 h-full bg-secondary opacity-90 transform ">
            <div dir="rtl" className="p-4 space-y-6 text-white transform grid mt-20 -skew-y-[3deg]">
              <Typography variant="h3">
                SIMPLE TO USE
              </Typography>
              <Typography className="w-96 text-gray-300">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
              </Typography>
            </div>
          </div>
          <div className="w-1/2 transform">
            <div className=" bg-white transform">
              {/* Add your content here */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Usage;
