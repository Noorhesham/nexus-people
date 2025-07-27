import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { CloseSharp } from '@mui/icons-material';
import Profile from '@/pages/profile/[id]/Profile';
import AddBlog from './newBlog';
import ViewReview from './ViewReview';
import GalleryView from './GalleryView';
import AddQA from './newChatbotQA';
import PartnersView from './partnersView';
import NewsLetterView from './newsLetterView';
import AddModel from './addModel';
import AddTimeline from '../views/addTimeline';
import PageContent from './PageContent';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: '60vw',
  borderRadius: '20px',
  // height: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

interface tabContent {
  icon: any;
  label: string
}

interface TransitionsModalProps {
  data?: {};
  ID: number | null;
  open: boolean;
  onClose: () => void;
  tabs? :tabContent[];
  api: string;
  type: string;
}

const TransitionsModal: React.FC<TransitionsModalProps> = ({ID, open, onClose, data, type, api }) => {

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 }}}
      >
        <Fade in={open} className='text-black'>
          <Box sx={style}>
            <div className='flex mb-4 flex-row-reverse w-full'>
              <CloseSharp className='relative right-0 hover:text-primary cursor-pointer' onClick={onClose} />
            </div>

            { type === 'Admin' || type=== 'User'?            
             <Profile render={true} apiEndpoint={api} ProfileData={data} HandleModal={function (): void {
              throw new Error('Function not implemented.');
            }} /> : null 
            }


            { type === 'Blog'? <AddBlog open={open} setOpen={onClose} type='blogs' data={data}/> : null }

            { type === 'Service'? <AddBlog open={open} setOpen={onClose} type='service' data={data}/> : null }

            { type === 'Feature'? <AddBlog open={open} setOpen={onClose} type='feature' data={data}/> : null }

            {/* {type === 'Appointment'? 
              <AddBlog open={open} setOpen={onClose} type='Service' data={data}/> : null 
            } */}

            { type === 'Review'?  <ViewReview data={data}/> : null } 

            { type === 'Gallery'? <GalleryView data={data as any[]}/>: null }

            { type === 'Chatbot'? <AddQA open={open} setOpen={onClose} data={data}/> : null }

            { type === 'Brand'? <PartnersView data={data as any[]}/>: null }

            { type === 'Newsletter'? <NewsLetterView data={data as any} />: null }

            { type === 'Model'? <AddModel open={open} setOpen={onClose} data={data} /> : null }
            { type === 'Home'? <GalleryView data={data as any[]}/>: null }
            { type === 'Timeline'? <AddTimeline open={open} setOpen={onClose} data={data}/> : null }
            { type === 'Image'? <PageContent type='image' closeModal={onClose} data={data}/> : null }


          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default TransitionsModal;