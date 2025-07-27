import React, { useContext, useEffect, useState } from 'react';
import { Modal, Typography, Box, Fade, Button } from '@mui/material';
import { CloseSharp } from '@mui/icons-material';
import Image from 'next/image';
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import Share from "yet-another-react-lightbox/plugins/share";
import Counter from "yet-another-react-lightbox/plugins/counter";
import ModelManager from './TypeModel';
import { FormattedMessage } from 'react-intl';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { motion, useAnimation } from 'framer-motion';
import CrudComponent from "@/helpers/CRUD";

interface FloorData {
  units: number;
  models: number;
  usage: string;
  bathrooms: number;
  floors: string[];
}

interface FloorGalleryProps {
  floorData: FloorData;
  imageSrc: string;
  svgImage: any;
}

const FloorGallery: React.FC<FloorGalleryProps> = ({ floorData, imageSrc, svgImage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const { isRTL } = useContext(LanguageDirectionContext);
  const [gallery, setGallery] = useState([])
  const apiEndpoint = `${process.env.BACKEND}gallery`;

  const {
    data,
    fetchData,
  } = CrudComponent({});

  useEffect(() => {
    fetchData(apiEndpoint, "Gallery")
  }, [apiEndpoint]);

  useEffect(() => {
    if (data && data.length > 0) {
      const galleryData: any = data[0];
      const formattedImages = galleryData.images.map((image: any) => ({
        src: image.image, // Rename "image" to "src"
        alt: image.alt,   // Keep "alt" as is
        _id: image._id,   // Keep "_id" as is
      }));
  
      // Assuming you have a setGallery function
      setGallery(formattedImages);
    }
  }, [data]);


  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenGallery = () => {
    setIsGalleryOpen(true)
  }

  const leftSectionControls = useAnimation();
  const rightSectionControls = useAnimation();

  // Trigger animations when floorData changes
  useEffect(() => {
    // Start animation for the left section
    leftSectionControls.start({ opacity: 1, x: 0 });
    // Start animation for the right section
    rightSectionControls.start({ opacity: 1, x: 0 });
  }, [floorData]);

  return (
    <main className="flex flex-col items-center lg:flex-row h-fit">
      {/* First Half: Floor Details */}
      <motion.div
        className="lg:w-1/2 h-fit p-4"
        initial={{ opacity: 0, x: isRTL ? '100%' : '-100%' }}
        animate={leftSectionControls}
        transition={{ duration: 2 }}
      >
        <div className="mt-16">
          {Object.entries(floorData).slice(0, -2).map(([key, value]) => (
            <div key={key} className="mb-2">
              <Typography variant="h2" className="text-white [text-shadow:_0_5px_0_rgb(0_0_0_/_40%)]" component="div" display="inline">
                {Array.isArray(value) ? (isRTL? value.join(' و ') : value.join(', ')) : value}&nbsp;
              </Typography>
              <Typography variant="h4" className={`text-white`} component="div" display="inline">
                {<FormattedMessage id={`floor.${key}`} />} {/* Translate the key */}
              </Typography>
            </div>
          ))}

          <div className="w-full flex justify-center mt-16 space-x-8">
            <Button
              variant="contained"
              className={`bg-primary px-4 rounded-2xl ${isRTL? 'ml-8' : ''}`}
              color="primary"
              onClick={handleButtonClick}
              title='Know More'
            >
              <Typography><FormattedMessage id='knowMore'/></Typography>
            </Button>

            <Button
              variant="contained"
              className="bg-white text-secondary hover:text-white px-4 rounded-2xl"
              color="secondary"
              title='View More'
              onClick={handleOpenGallery}
            >
              <Typography>
                <FormattedMessage id='viewMore'/>
              </Typography>
            </Button>
          </div>
        </div>

        {/* Modal for Floor Details */}
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Fade in={isModalOpen}>
            <Box sx={modalStyle}>
              <div className="flex flex-row-reverse w-full">
                <CloseSharp
                  className="relative right-0 hover:text-red-500 cursor-pointer"
                  onClick={handleCloseModal}
                />
              </div>
              <ModelManager />
            </Box>
          </Fade>
        </Modal>
      </motion.div>
 
      {/* Second Half: Floor Image */}
      <motion.div
        className="w-full flex justify-center relative"
        initial={{ opacity: 0, x: isRTL ? '-100%' : '100%' }}
        animate={rightSectionControls}
        transition={{ duration: 1 }}
      >

        <div className="flex rotate-90 rounded-xl z-[8] w-full md:w-6/12 lg:w-[25rem]   "
          style={{ backgroundImage: `url('${imageSrc}')`, backgroundSize: 'cover' }}
        >
          {svgImage}
        </div>

      </motion.div>

      <Lightbox
        open={isGalleryOpen}
        close={() => setIsGalleryOpen(false)}
        slides={gallery}
        plugins={[Captions, Fullscreen, Slideshow, Thumbnails, Video, Zoom, Download, Share, Counter]}
      />
    </main>
  );
};

export default FloorGallery;

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  transition: 'height 2s',
  width: '80vw',
  borderRadius: '20px',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};