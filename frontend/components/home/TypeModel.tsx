import { useContext, useEffect, useState } from 'react';
import { Typography, Button } from '@mui/material';
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Inline from "yet-another-react-lightbox/plugins/inline";
import { FormattedMessage, useIntl } from 'react-intl';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import Share from "yet-another-react-lightbox/plugins/share";
import Counter from "yet-another-react-lightbox/plugins/counter";
import { Modal, Box, Fade } from '@mui/material';
import { CloseSharp } from '@mui/icons-material';
import ContactForm from '../ContactForm';
import Image from 'next/image';
import useMediaQuery from '@mui/material/useMediaQuery';

interface Model {
  _id: string;
  model: {
    _id: string
    mainType: string;
    secondaryType: { ar?: string; en?: string; };
    details: {
      images: any[],
      length: number,
      width: number,
      height: number,
      squareMeter: number,
      description: { ar?: string; en?: string; };
      unitIdentifier: string;
      availability : boolean,
    }
  }
}

interface ModalProps {
  ModelData?: Model
}

const ModelManager: React.FC<ModalProps> = ({ModelData}) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const { isRTL } = useContext(LanguageDirectionContext);
  const {formatMessage} = useIntl();
  const toggleOpen = (state: boolean) => () => setOpen(state);

  const updateIndex = ({ index: current }: { index: number }) => setIndex(current);
  
  const [selectedModelDetails, setSelectedModelDetails] = useState<Model | undefined>()

  const [isModalOpen, setIsModalOpen] = useState(false);

  const matches = useMediaQuery('(min-width:600px)');

  useEffect(() => {
    setSelectedModelDetails(ModelData as Model)
  }, [ModelData])  
  
  useEffect(() => {
    if (ModelData) {
      setSelectedModelDetails({
        ...ModelData,
        model: {
          ...ModelData.model,
          details: {
            ...ModelData.model.details,
            images: ModelData.model.details.images.map((image) => ({ src: image })),
          },
        },
      });
    }
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  return (
    <main dir={isRTL? 'rtl' : 'ltr'} className="flex flex-col w-full md:flex-row py-8 max-h-96 lg:max-h-full overflow-y-auto space-y-8">
      <div className={`w-full md:w-1/2 h-full md:px-8`}>
        <div className="">

          {selectedModelDetails && (
            <div className='mt-8 grid gap-4'>
              <Typography className={`${selectedModelDetails?.model?.details?.availability? 'text-primary' : 'text-gray-500'}`}>
                {selectedModelDetails?.model?.details?.availability? <FormattedMessage id='unit.available'/> : <FormattedMessage id='unit.notAvailable' />}
              </Typography>

              <Typography variant="h4" className="font-bold" component="div" display="inline">
                <FormattedMessage id='floor.details'/> {isRTL? selectedModelDetails?.model?.secondaryType?.ar : selectedModelDetails?.model?.secondaryType?.en}
              </Typography>

              <div className='grid gap-8'>
                <div>
                  {isRTL? selectedModelDetails?.model?.details?.description?.ar : selectedModelDetails?.model?.details?.description?.en} 
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='flex space-x-2 items-center'>
                    <Image src={'/axis.png'} alt='axis length' width={64} height={64} className='w-8 h-8 ml-2 -rotate-[135deg]'/> 
                    <Typography variant="body1" className="font-bold">
                      <FormattedMessage id='floor.length'/> <Typography className='px-2'>{isRTL? selectedModelDetails?.model?.details?.length.toLocaleString('ar-EG') : selectedModelDetails?.model?.details?.length} <FormattedMessage id='floor.meter'/></Typography>
                    </Typography>
                  </div>

                  <div className='flex space-x-2 items-center'>
                    <Image src={'/axis.png'} alt='axis length' width={64} height={64} className='w-8 h-8 ml-2 rotate-[135deg]'/> 
                    <Typography variant="body1" className="font-bold">
                      <FormattedMessage id='floor.width'/> <Typography className='px-2'>{isRTL? selectedModelDetails?.model?.details?.width.toLocaleString('ar-EG') : selectedModelDetails?.model?.details?.width} <FormattedMessage id='floor.meter'/></Typography>
                    </Typography>
                  </div>

                  <div className='flex space-x-2 items-center'>
                    <Image src={'/axis.png'} alt='axis length' width={64} height={64} className='w-8 h-8 ml-2'/> 
                    <Typography variant="body1" className="font-bold">
                      <FormattedMessage id='floor.height'/> <Typography className='px-2'>{isRTL? selectedModelDetails?.model?.details?.height.toLocaleString('ar-EG') : selectedModelDetails?.model?.details?.height} <FormattedMessage id='floor.meter'/></Typography>
                    </Typography>
                  </div>

                  <div className='flex space-x-2 items-center'>
                    <Image src={'/area.png'} alt='axis length' width={512} height={512} className='w-8 h-8 ml-2'/> 
                    <Typography variant="body1" className="font-bold">
                      <FormattedMessage id='floor.square'/> <Typography className='px-2'>{isRTL? selectedModelDetails?.model?.details?.squareMeter.toLocaleString('ar-EG') : selectedModelDetails?.model?.details?.squareMeter} <FormattedMessage id='floor.meter'/><sup>{isRTL? '٢' : 2}</sup></Typography>
                    </Typography>
                  </div>

                </div>
              </div>
              <div className={`flex justify-start mt-4`}>
                <Button disabled={!selectedModelDetails?.model?.details?.availability} onClick={handleOpenModal} size='large' variant='contained' className='bg-primary w-32 text-lg'>
                  <FormattedMessage id='unit.book' />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedModelDetails && (
        <div className='flex w-full md:w-1/2 justify-center items-center md:px-8'>
          <Lightbox
            index={index}
            className='rounded-xl w-full'
            slides={selectedModelDetails.model.details.images}
            plugins={[Inline, Video]}
            on={{
              view: updateIndex,
              click: toggleOpen(true),
            }}
            video={{'autoPlay': true}}
            carousel={{
              padding: 0,
              spacing: 5,
              imageFit: "cover",
            }}  
            styles={{  
              container: {
                borderRadius: "5px 5px 0px 0px",
                backgroundColor: "transparent"
              },
              navigationNext: {
                display: matches? 'grid' : 'none'
              },
              navigationPrev: {
                display: matches? 'grid' : 'none'
              },
              thumbnail: {
                backgroundColor: 'transparent',
                border: 'none'
              },
              thumbnailsContainer: {
                // backgroundColor: "transparent"
                borderRadius: "0px 0px 5px 5px",
              } 
            }}
            inline={{
              style: {
                width: "100%",
                height: '100%',
                maxWidth: "900px",
                minHeight: '300px',
                aspectRatio: "3 / 2",
                margin: "0 auto",
                backgroundColor: "transparent"
              },
            }}
          />

          <Lightbox
            open={open}
            close={toggleOpen(false)}
            index={index}
            slides={selectedModelDetails?.model?.details?.images}
            on={{ view: updateIndex }}
            animation={{ fade: 0 }}
            plugins={[Captions, Fullscreen, Slideshow, Thumbnails, Video, Zoom, Download, Share, Counter]}
            controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
          />

          <Modal open={isModalOpen} onClose={handleCloseModal}>
            <Fade in={isModalOpen}>
              <Box sx={modalStyle}>
                <div className="flex flex-row-reverse w-96">
                  <CloseSharp className="relative right-0 hover:text-red-500 cursor-pointer" onClick={handleCloseModal}/>
                </div>
                <ContactForm  Booking={`[${isRTL? selectedModelDetails?.model?.secondaryType?.ar : selectedModelDetails?.model?.secondaryType?.en}] \n \n ${formatMessage({id: 'unit.bookMessage'})}`}/>
              </Box>
            </Fade>
          </Modal>
        </div>
      )}
    </main>
  );
};

export default ModelManager;

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  maxWidth: '90%',
  transform: 'translate(-50%, -50%)',
  transition: 'height 2s',
  borderRadius: '20px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};  