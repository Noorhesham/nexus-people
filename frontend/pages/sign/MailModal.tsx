import React, { useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LanguageDirectionContext } from '@/helpers/langDirection';

interface EmailVerificationModalProps {
  open: boolean;
  handleClose: () => void;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({ open, handleClose }) => {
  const { isRTL } = useContext(LanguageDirectionContext);

  const handleModalClose = () => {
    handleClose();
    // Reload the page on modal close
    window.location.reload();
  };

  return (
    <Dialog open={open} onClose={handleModalClose} dir={isRTL ? 'rtl' : 'ltr'}>
      <DialogTitle>{isRTL? 'تحقق من البريد الإلكتروني' : 'Email Verification'}</DialogTitle>
      <DialogContent>
        <p>
            {isRTL? 'شكرًا للتسجيل! يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك':
            'Thank you for signing up! Please check your email to activate your account.'}
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalClose} color="primary">
          {isRTL? 'إغلاق' : 'Close' } 
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailVerificationModal;
