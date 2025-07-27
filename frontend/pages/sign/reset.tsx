import { FormattedMessage, useIntl } from "react-intl";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { useContext, useState } from "react";
import { CloseSharp } from '@mui/icons-material';
import { LanguageDirectionContext } from "@/helpers/langDirection";
import Backdrop from '@mui/material/Backdrop';
import { useRouter } from "next/router";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CrudComponent from "@/helpers/CRUD";
import { TextField, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

interface ResetProps {
  open: boolean;
  close: () => void;
  setSentMail: (value: boolean) => void
}

const PasswordRester :React.FC<ResetProps> = ( {open, close, setSentMail}) => {
  const { isRTL } = useContext(LanguageDirectionContext);

  const [email, setEmail] = useState('')

  const router = useRouter()

  const {formatMessage} = useIntl();

  const validationSchema = Yup.object({
    email: Yup.string().email(formatMessage({ id: 'contact.email.invalid' })).required(formatMessage({ id: 'contact.email.error' })),
  });

  let initial = {
    email: ''
  }

  const apiEndpoint = `${process.env.BACKEND}auth/forget`
  const {
    handleSubmit,
    handleInputChange,
  } = CrudComponent({});

  const submitForm = () => {
    handleSubmit(apiEndpoint, false).then(() => setSentMail(true)).then(()=> close())
  }

  return ( 
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={close}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
        
      <Fade in={open}>
        <Box className='space-y-8' sx={style}>
          <div className='flex mb-8 flex-row-reverse w-60 sm:w-full '>
            <CloseSharp className='relative right-0 hover:text-primary cursor-pointer' onClick={close} />
          </div>
            <div>
                <Divider variant="fullWidth" className="w-full">
                    <Typography variant="h6">
                        <FormattedMessage id="login.reset"/>
                    </Typography>
                    <Typography variant="subtitle2">
                        {isRTL? "سوف نرسل لك رسالة بالبريد الإلكتروني":"We will send you an email"}
                    </Typography>
                </Divider>

            </div>

          <Formik initialValues={initial} validationSchema={validationSchema} onSubmit={submitForm}>
            <Form className='w-60 sm:w-96 space-y-4'>
                <Field name="email" >
                {({ field, meta }: any) => (
                <div>
                    <TextField
                    label={<FormattedMessage id='form.email' />}
                    variant="outlined"
                    fullWidth
                    {...field}
                    onChange={(e:any) => {field.onChange(e); handleInputChange('email', e.target.value, false); () => close}}
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500" />
                </div>
                )}
                </Field>

                <Button 
                    type="submit"
                    variant='contained' 
                    className='bg-secondary w-full text-white hover:bg-primary py-2'
                >
                    <FormattedMessage id='contact.submit'/>
                </Button>
            </Form >
          </Formik>

        </Box>
      </Fade>
    </Modal> 
  );
}
 
export default PasswordRester;

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: '80%',
    borderRadius: '20px',
    // height: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };