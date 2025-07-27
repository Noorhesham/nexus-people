import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { FormattedMessage, useIntl } from 'react-intl';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import dayjs from 'dayjs';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CrudComponent from "@/helpers/CRUD";
import Divider from '@mui/material/Divider';
import EmailVerificationModal from './MailModal';

const steps = [
  { id: 'personal', label: <FormattedMessage id='form.personal' /> },
  { id: 'contact', label: <FormattedMessage id='form.contact' /> },
  { id: 'review', label: <FormattedMessage id='form.review' /> },
];
var options: any = {day: 'numeric', month: 'long', year: 'numeric' };

interface UserProps {
  name: {ar: string; en: string},
  DOB: Date | null,
  email: string,
  password: string,
  repeat_password: string,
  gender: string,
  phone: string,
  address: string,
}

function SignupForm() {
  const { isRTL } = useContext(LanguageDirectionContext);
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [User, setUser] = useState<any>({
    name: {ar: '', en: ''},
    email: '',
    password: '',
    repeat_password: '',
    phone: '',
    address: '',
    gender: '',
    DOB: null,
  })
  const [isValidStep1, setIsValidStep1] = useState(false);
  const [dirtyStep1, setDirtyStep1] = useState(false);
  const [isValidStep2, setIsValidStep2] = useState(false);
  const [dirtyStep2, setDirtyStep2] = useState(false);
  const {formatMessage} = useIntl();
  const apiEndpoint = `${process.env.BACKEND}auth/signup`;
  const [isVerificationModalOpen, setVerificationModalOpen] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.object().shape({
      en: Yup.string().min(5, formatMessage({id: 'name.short'})).required(formatMessage({id: 'required.nameEn'})),
      ar: Yup.string().min(5, formatMessage({id: 'name.short'})).required(formatMessage({id: 'required.nameAr'})),
    }),
    gender: Yup.string().required(formatMessage({id: 'required.gender'})),
    DOB: Yup.date().required(formatMessage({id: 'required.dob'})),
    address: Yup.string().required(formatMessage({id: 'required.address'}))
  });

  const ConnectionValidationSchema = Yup.object({
    email: Yup.string()
      .email(formatMessage({ id: 'contact.email.invalid' }))
      .required(formatMessage({ id: 'contact.email.error' }))
    //   .test(formatMessage({ id: 'form.exist' }), formatMessage({ id: 'form.exist' }), async function (value, context) {

    //     if (value) {
    //       // Assuming there is an API endpoint to check email existence
    //       const response = await axios.post(`${process.env.BACKEND}auth/admin/checkEmail`, {email : value});
  
    //       // If email exists, the validation fails
    //       if (response.data.Error === 'User already exists' ) {
    //         return false;
    //       }
    //     }

    //   // If email doesn't exist or if there's an issue with the API call, validation passes
    //   return true;
    // }),
    ,
    phone: Yup.string().required(formatMessage({ id: 'required.phone' })),
    password: Yup.string()
      .required(formatMessage({ id: 'required.password' }))
      .min(8, formatMessage({ id: 'password.min' }))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        formatMessage({ id: 'password.complexity' })
      ),
    repeat_password: Yup.string()
      .required(formatMessage({ id: 'required.password' }))
      .oneOf([Yup.ref('password')], formatMessage({ id: 'password.match' })),
  });

  const handleVerificationModalClose = () => {
    setVerificationModalOpen(false);
  };

  const parseDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        // Invalid date
      return null;
    }
    return date;
  };

  const {
    handleInputChange,
    handleSubmit
  } = CrudComponent({apiEndpoint: `${process.env.BACKEND}`});

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSignup = () => {
    handleSubmit(apiEndpoint, false).then(() => {
      setVerificationModalOpen(true)
    })
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    setDirtyStep1(true);
  }, [User.name, User.gender, User.address, User.DOB]);
  
  useEffect(() => {
    setDirtyStep2(true);
  }, [User.email, User.password, User.repeat_password, User.phone]);
  
  const handleChange = (name: string, value: any) => {
    handleInputChange(name, value, false);
    setUser((prevData: any) => {
      if (name.includes('.')) {
        const [objectName, propertyName] = name.split('.');
        return {
          ...prevData,
          [objectName]: {
            ...(prevData[objectName] as Record<string, any>),
            [propertyName]: value,
          },
        };
      } else {
        return {
          ...prevData,
          [name]: value,
        };
      }
    });
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="space-y-8 grid place-items-center w-full">
      <Typography variant="h4"><FormattedMessage id='signup.join'/></Typography>
      <div className='flex flex-col items-center justify-center w-10/12'>
        <Stepper className='max-w-screen' activeStep={activeStep} alternativeLabel>
          {steps.map((step) => (
            <Step key={step.id}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      <div className="space-y-8 grid place-items-center w-full">
        {activeStep === 0 && (
          <Formik 
          key={0}
          validateOnMount={dirtyStep1}
          initialValues={User}
          validationSchema={validationSchema}
          onSubmit={() => {}}  
        >
          {({ isValid, dirty, setFieldValue }) => {
            setIsValidStep1(isValid)
            return (
            <Form className='space-y-8 flex flex-col justify-center w-full'>
              <Field name='name[en]' >
                {({ field }: any) => (
                  <div className='w-full'>
                    <TextField
                      label={<FormattedMessage id='form.name'/>}
                      variant="outlined"
                      fullWidth
                      {...field}
                      color='secondary'
                      value={User.name.en}
                      onChange={(e) => {field.onChange(e);handleChange('name.en', e.target.value)}}
                    />
                    <ErrorMessage name="name[en]" component="div" className="text-red-500" />
                  </div>
                )}
              </Field>
  
              <Field name='name[ar]' >
                {({ field }: any) => (
                  <div className='w-full'>
                    <TextField
                      label={<FormattedMessage id='form.arabicName'/>}
                      variant="outlined"
                      fullWidth
                      {...field}
                      color='secondary'
                      value={User.name.ar}
                      onChange={(e) => {field.onChange(e); handleChange('name.ar', e.target.value)}}
                    />
                    <ErrorMessage name="name[ar]" component="div" className="text-red-500" />
                  </div>
                )}
              </Field>
                
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" color='secondary'><FormattedMessage id='form.gender'/></InputLabel>
                <Field name='gender'>
                  {({ field }: any) => (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={User.gender}
                      {...field}
                      color='secondary'
                      label={<FormattedMessage id='form.gender'/>}
                      onChange={(e) => {field.onChange(e); handleChange('gender', e.target.value)}}
                    >
                      <MenuItem value={'male'}><FormattedMessage id='form.male'/></MenuItem>
                      <MenuItem value={'female'}><FormattedMessage id='form.female'/></MenuItem>
                    </Select>
                  )}
                </Field>
              </FormControl>
  
              <LocalizationProvider  dateAdapter={AdapterDayjs}>
                <Field type='date'  name="DOB" component={DatePicker}>
                  {({ field }: any) => (
                    <DatePicker
                    format='DD/MM/YYYY'
                    label={<FormattedMessage id='form.dob' />}
                    className='w-full'
                    slotProps={{
                      textField: {
                        color: 'secondary',
                        sx: {
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'secondary.main',
                            outlineColor: 'secondary.main',
                            borderColor: 'secondary.main'
                          },
                          '& input' : {
                            borderColor: 'secondary.main'
                          }
                        }
                    }}}
                    disableFuture
                    value={User.DOB? dayjs(User.DOB) : null}
                    defaultValue={null}
                    // {...field}
                    onChange={(e: any) => {
                      // field.onChange(e);
                      setFieldValue("DOB", dayjs(e).toISOString())
                      handleChange('DOB', dayjs(e).toISOString());
                    }}                  
                    />
                  )}
                </Field>
              </LocalizationProvider>

              <Field name='address' >
                {({ field, meta }: any) => (
                  <div className='w-full'>
                    <TextField
                      label={<FormattedMessage id='form.address'/>}
                      variant="outlined"
                      fullWidth
                      color='secondary'
                      {...field}
                      value={User.address}
                      onChange={(e) => {field.onChange(e); handleChange('address', e.target.value)}}
                    />
                    <ErrorMessage name="address" component="div" className="text-red-500" />
                  </div>
                )}
              </Field>

            </Form>
          )}}
        </Formik>
        )}

        {activeStep === 1 && (
          <Formik 
          key={1}
            validateOnMount={dirtyStep2} 
            // validateOnChange={false} 
            initialValues={User} 
            validationSchema={ConnectionValidationSchema} 
            onSubmit={() => {}}
          >
            {({ isValid, dirty }) => {
              setIsValidStep2(isValid)
              return (

            <Form className='space-y-8 flex flex-col justify-center w-full'>

              <Field name='email'>
                {({ field, meta, form: {touched, errors} }: any) => (
                  <div>
                    <TextField
                      label={<FormattedMessage id='form.email' />}
                      variant="outlined"
                      fullWidth
                      color='secondary'
                      {...field}
                      onChange={(e:any) => { field.onChange(e); handleChange('email', e.target.value)}}
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500" />
                  </div>
                )}
              </Field>

              <FormControl variant="outlined" className="w-full">
               <InputLabel color='secondary' htmlFor="outlined-adornment-password"><FormattedMessage id='form.password'/></InputLabel>
               <Field name='password'>
                {({ field, meta }: any) => (
                  <div>
                    <OutlinedInput
                      // value={User.password}
                      id="outlined-adornment-password"
                      className='w-full'
                      {...field}
                      color='secondary'
                      onChange={(e:any) => { field.onChange(e); handleChange('password', e.target.value)}}
                      type={showPassword ? 'text' : 'password'}
                      slotProps={{
                        textField: {
                          sx: {
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#13263d',
                            },
                          }
                      }}} 
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
                      label={<FormattedMessage id='form.password'/>}
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500" />
                  </div>
                )}
               </Field>
            </FormControl>

             <FormControl variant="outlined" className="w-full">
               <InputLabel color='secondary' htmlFor="outlined-adornment-password"><FormattedMessage id='form.confirm'/></InputLabel>
               <Field name='repeat_password'>
                {({ field, meta }: any) => (
                  <div>
                    <OutlinedInput
                      // value={User.repeat_password}
                      id="outlined-adornment-password"
                      {...field}
                      color='secondary'
                      className='w-full'
                      
                      onChange={(e:any) => { field.onChange(e); handleChange('repeat_password', e.target.value)}}
                      type={showPassword ? 'text' : 'password'}
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
                    <ErrorMessage name="repeat_password" component="div" className="text-red-500" />
                  </div>
                )}
               </Field>
            </FormControl>

              <Field name='phone'>
                {({ field, meta }: any) => (
                  <div>
                    <TextField
                      label={<FormattedMessage id='form.phone' />}
                      variant="outlined"
                      fullWidth
                      color='secondary'
                      {...field}
                      onChange={(e:any) => { field.onChange(e); handleChange('phone', e.target.value)}}
                    />
                    <ErrorMessage name="phone" component="div" className="text-red-500" />
                  </div>
                )}
              </Field>

            </Form>
          )}}
          </Formik>
        )}

        {activeStep === 2 && (
          <div key={2} className="w-full text-center">
            <Divider variant='fullWidth' className='mb-4'>
              <Typography variant="h5" className=''><FormattedMessage id='form.data'/></Typography>
            </Divider>
            <div className='w-fit justify-end space-y-2'>
              <div className='flex items-center'>
                <Typography variant='body1' className='font-bold'><FormattedMessage id='form.name'/>:&nbsp;</Typography>
                <Typography variant='body2'>{User.name.en}</Typography>
              </div>

              <div className='flex items-center'>
                <Typography variant='body1' className='font-bold'><FormattedMessage id='form.arabicName'/>:&nbsp;</Typography>
                <Typography variant='body2'>{User.name.ar}</Typography>
              </div>

              <div className='flex items-center'>
                <Typography variant='body1' className='font-bold'><FormattedMessage id='form.gender'/>:&nbsp;</Typography>
                <Typography variant='body2'>{User.gender}</Typography>
              </div>

              <div className='flex items-center'>
                <Typography variant='body1' className='font-bold'><FormattedMessage id='form.dob'/>:&nbsp;</Typography>
                <Typography>{parseDate(User.DOB as any)?.toLocaleDateString(`${isRTL? 'ar-EG': 'en-US'}`, options) as string}</Typography> 
              </div>

              <div className='flex items-center'>
                <Typography variant='body1' className='font-bold'><FormattedMessage id='form.email'/>:&nbsp;</Typography>
                <Typography variant='body2'>{User.email}</Typography>
              </div>

              <div className='flex items-center'>
                <Typography variant='body1' className='font-bold'><FormattedMessage id='form.phone'/>:&nbsp;</Typography>
                <Typography variant='body2'>{User.phone}</Typography>
              </div>
            </div>
          </div>
        )}

        <div className={`flex items-center justify-between w-full ${isRTL ? '' : ''}`}>
          <Button
            color="inherit"
            variant='contained'
            className='bg-primary text-white hover:bg-secondary'
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            <FormattedMessage id='form.back'/>
          </Button>
          {activeStep === 0 && (
            <Button
              variant='contained'
              className='bg-secondary text-white hover:bg-primary'
              onClick={handleNext}
              disabled={!isValidStep1 || !dirtyStep1}
            >
              <FormattedMessage id='form.next'/>
            </Button>
          )}
          {activeStep === 1 && (
            <Button
              variant='contained'
              className='bg-secondary text-white hover:bg-primary'
              onClick={handleNext}
              disabled={!isValidStep2 || !dirtyStep2}
            >
              <FormattedMessage id='form.next'/>
            </Button>
          )}
          {activeStep === steps.length - 1 && (
            <Button
              onClick={handleSignup}
              variant="contained"
              className='bg-secondary text-white hover:bg-primary'
              color="primary"
            >
              <FormattedMessage id='form.finish'/>
            </Button>
          )}

          <EmailVerificationModal
            open={isVerificationModalOpen}
            handleClose={handleVerificationModalClose}
          />
        </div>
      </div>
    </div>
  );
}

export default SignupForm;