import Box from '@mui/material/Box';
import React, { ReactNode } from 'react';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { CloseSharp } from '@mui/icons-material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50vw',
  borderRadius: '20px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

interface TransitionsModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const NewModal: React.FC<TransitionsModalProps> = ({ open, onClose, children }) => {
  return (
    <main>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={onClose}
        closeAfterTransition
        className='overflow-y-auto'
      >
        <Fade in={open} className="text-black">
          <Box sx={style}>
            <div className="flex flex-row-reverse w-full">
              <CloseSharp className="relative right-0 hover:text-primary cursor-pointer" onClick={onClose} />
            </div>
            <div className='overflow-y-auto h-fit'>
                {children}
            </div>
          </Box>
        </Fade>
      </Modal>
    </main>
  );
};

export default NewModal;