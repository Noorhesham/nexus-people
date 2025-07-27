import { FormattedMessage, useIntl } from "react-intl";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { useContext, useState } from "react";
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { VisibilityOff, Visibility, CloseSharp } from '@mui/icons-material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { LanguageDirectionContext } from "@/helpers/langDirection";
import { Button } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from "@/helpers/AuthContext";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

interface Cahnger {
  oldPassword: string;
  newPassword: string;
  repeat_password: string
}

interface PasswordChangerProps {
  open: boolean;
  close: () => void;
  apiEndPoint: string;
}

const PasswordChanger :React.FC<PasswordChangerProps> = ( {open, close,apiEndPoint}) => {
  const { isRTL } = useContext(LanguageDirectionContext);
  const [EditPassword, setEditPassword] = useState(false);
  const {user, logout} = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false);
  const {formatMessage} = useIntl();
  const [password, setPassword] = useState<Cahnger>({
    oldPassword: '',
    newPassword: '',
    repeat_password: ''
  });

  const validationSchema = Yup.object({
    oldPassword: Yup.string()
      .required(formatMessage({ id: 'required.password' })),
    newPassword: Yup.string()
      .required(formatMessage({ id: 'required.password' }))
      .min(8, formatMessage({ id: 'password.min.length' }))
      .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/, formatMessage({ id: 'password.requirements' }))
      .notOneOf([Yup.ref('oldPassword'), null], formatMessage({ id: 'newPassword.same.as.old' })),
    repeat_password: Yup.string()
      .required(formatMessage({ id: 'required.password' }))
      .oneOf([Yup.ref('newPassword')], formatMessage({ id: 'passwords.must.match' })),
  });
  
  const ChangePassword =async (values:any, {resetForm}:any) => {
    validationSchema.validate(values).then(async() => {
      try {
        await axios.put(`${apiEndPoint}`, password, {headers: { token : Cookies.get('token')}})
        .then(() => {
          logout(Cookies.get('token') as string, false)
          setPassword({
            oldPassword: '',
            newPassword: '',
            repeat_password: ''
          }) 
          closeEditPassword()
          
        })
      } catch (error) {
        
      }
    })
    
  }

  const closeEditPassword = () => {
    setEditPassword(false)
  }
  
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
  };

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

          <div className="flex justify-center space-y-2">
            <Divider variant="fullWidth" className="w-full">
              <Typography variant="h6">
                <FormattedMessage id="form.changePassword"/>
              </Typography>
            </Divider>
          </div>

          <Formik initialValues={password} validationSchema={validationSchema} onSubmit={ChangePassword}>
          {({ isValid, dirty }) => (

            <Form dir={isRTL? 'rtl': 'ltr'} className='w-60 sm:w-96 space-y-4'>
              <FormControl variant="outlined" className="w-full">
                <InputLabel htmlFor="oldPassword"><FormattedMessage id='form.current'/></InputLabel>
                <Field name="oldPassword" >
                  {({ field, meta }: any) => (
                    <OutlinedInput
                    id="oldPassword"
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                    onChange={(e:any) => {field?.onChange(e); setPassword((prev) => ({...prev, oldPassword: e.target.value}))}}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label={<FormattedMessage id='form.current'/>}
                    />
                  )}
                </Field>
                <ErrorMessage name="oldPassword" component="div" className="text-red-500" />
              </FormControl>

              <FormControl variant="outlined" className="w-full">
                <InputLabel htmlFor="newPassword"><FormattedMessage id='form.new'/></InputLabel>
                <Field name="newPassword" >
                  {({ field, meta }: any) => (
                    <OutlinedInput
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                    onChange={(e:any) => {field?.onChange(e); setPassword((prev) => ({...prev, newPassword: e.target.value}))}}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label={<FormattedMessage id='form.new'/>}
                    />
                )}
                </Field>
                <ErrorMessage name="newPassword" component="div" className="text-red-500" />
              </FormControl>

              <FormControl variant="outlined" className="w-full">
                <InputLabel htmlFor="repeat_password"><FormattedMessage id='form.confirm'/></InputLabel>
                <Field name="repeat_password" >
                  {({ field, meta }: any) => (
                    <OutlinedInput
                    id="repeat_password"
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                    onChange={(e:any) => {field?.onChange(e); setPassword((prev) => ({...prev, repeat_password: e.target.value}))}}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label={<FormattedMessage id='form.confirm'/>}
                    />
                )}
                </Field>
                <ErrorMessage name="repeat_password" component="div" className="text-red-500" />
              </FormControl>

              <Button 
                type="submit"
                variant='contained' 
                className='bg-secondary w-full text-white hover:bg-primary py-2'
                disabled={!isValid || !dirty}
              >
                <FormattedMessage id='form.changePassword'/>
              </Button>
            </Form >
          )}
          </Formik>
        </Box>
      </Fade>
    </Modal> 
  );
}
 
export default PasswordChanger;

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