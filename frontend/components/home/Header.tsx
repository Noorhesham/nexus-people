import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import CrudComponent from "@/helpers/CRUD";
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';

interface DataProps {
  _id: string;
  images: [{
    alt: {ar: string, en: string},
    image: string,
    _id: string,
    layerText: {title: {ar: string, en: string }, description: {ar: string, en: string}},
    button: { hyperlink: string, text: { ar: string, en: string}}
  }],
  videos: [{
    alt: {ar: string, en: string},
    video: string,
    _id: string,
    layerText: {title: {ar: string, en: string }, description: {ar: string, en: string}},
    button: { hyperlink: string, text: { ar: string, en: string}}
  }]
}
const Header = () => {
  const { isRTL } = useContext(LanguageDirectionContext);
  const apiEndpoint = `${process.env.BACKEND}home`;
  const [Data, setData] = useState<[DataProps]>()
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const {
    data,
    fetchData,
  } = CrudComponent({ apiEndpoint: `${process.env.BACKEND}` });

  useEffect(() => {
    fetchData(apiEndpoint, "Data")
  }, [apiEndpoint]);

  useEffect(() => {
    setData(data as any);
  }, [data]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Data && Data[0]?.images) {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % Data[0]?.images.length);
      }
    }, 5000);

    // Clean up the interval when the component is unmounted or when data changes
    return () => clearInterval(intervalId);
  }, [Data]);

  if (!Data) {
    // Handle the case where Data is still undefined or an empty array
    return null; // or some loading indicator or default content
  }

  return (
    <motion.div
      id='home'
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen relative bg-cover bg-center overflow-hidden mb-4"
    >
      {Data[0]?.videos.length > 0? (
        <div className='grid place-items-center relative h-screen'>
          <video autoPlay muted loop id="myVideo" className='min-h-screen xl:w-screen max-w-[10000%] absolute'>
            <source src={Data[0]?.videos[0].video} type="video/mp4" />
          </video>

          <div className='grid place-items-center space-y-8 z-[2]'>
            <div className='space-y-4 w-60 md:w-96   text-white'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <Typography className='' variant='h2' textAlign={'center'}>
                  {isRTL ? Data[0]?.videos[0]?.layerText?.title?.ar : Data[0]?.videos[0]?.layerText?.title?.en}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <Typography variant='h6' textAlign={'center'}>
                  {isRTL ? Data[0]?.videos[0]?.layerText?.description?.ar : Data[0]?.videos[0]?.layerText?.description?.en}
                </Typography>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Button
                variant='contained'
                className='bg-white hover:bg-white text-secondary hover:scale-[1.1] transition duration-300 ease'
                onClick={() => router.push(Data[0]?.videos[0]?.button?.hyperlink)}
              >
                {isRTL ? Data[0]?.videos[0]?.button?.text?.ar : Data[0]?.videos[0]?.button?.text?.en}
              </Button>
            </motion.div>
          </div>

        </div>
      ) : (
        <div className='absolute inset-0 bg-cover bg-center grid place-items-center'       
          style={{
            backgroundImage: `url("${Data[0]?.images[currentImageIndex]?.image}")`, 
            transition: 'background-image 1s ease',
          }}
        >
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className='space-y-10 grid place-items-center text-white z-[2]'
          >
            <div className='space-y-4 w-60 md:w-96'>
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <Typography className='' variant='h2' textAlign={'center'}>
                  {isRTL ? Data[0]?.images[currentImageIndex]?.layerText?.title?.ar : Data[0]?.images[currentImageIndex]?.layerText?.title?.en}
                </Typography>
              </motion.div>

              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <Typography variant='h6' textAlign={'center'}>
                  {isRTL ? Data[0]?.images[currentImageIndex]?.layerText?.description?.ar : Data[0]?.images[currentImageIndex]?.layerText?.description?.en}
                </Typography>
              </motion.div>
            </div>
          
          {Data[0]?.images[currentImageIndex]?.button?.text?.en !== ''?
          (
            <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Button
              variant='contained'
              className='bg-white hover:bg-white text-secondary hover:scale-[1.1] transition duration-300 ease'
              onClick={() => router.push(Data[0]?.images[currentImageIndex]?.button?.hyperlink)}
            >
              {isRTL ? Data[0]?.images[currentImageIndex]?.button?.text?.ar : Data[0]?.images[currentImageIndex]?.button?.text?.en}
            </Button>
          </motion.div>
          ):null}

        </motion.div>

        </div>
      )}
      {/* Overlay */}

      <div className="absolute inset-0 bg-secondary opacity-50"></div>


    </motion.div>
  );
};

export default Header;