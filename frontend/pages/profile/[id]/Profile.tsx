import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import React, { useContext, useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { FormattedMessage, useIntl } from 'react-intl';
import CrudComponent from "@/helpers/CRUD";
import Cookies from 'js-cookie';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import dayjs from 'dayjs';
import PasswordChanger from '@/components/PasswordChanger';
import { AuthContext } from '@/helpers/AuthContext';

interface RenderProps {
  render: boolean;
  ProfileData?: any;
  apiEndpoint: string;
  HandleModal: () => void;
}

interface User {
  _id: string;
  name?: { ar: string, en: string };
  role?: string;
  likedBlogs?: Array<string>;
  savedBlogs?: Array<string>;
  reviews?: Array<string>;
  createdAt?: Date;
  updatedAt?: Date;
  verified?: boolean;
  phone?: string;
  email?: string;
  password?: string;
  gender?: string;
  isActive?: boolean;
  isBlocked?: boolean;
  address: Array<string>;
  appointments?: Array<string>;
  profilePic?: string;
  __v?: number;
  provider?: string;
  contactForm?: Array<string>
}

interface user {
  _id: string;
  name: { ar: string | null; en: string; };
  gender: string | null;
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
  newPassword?: string | null;
  DOB: Date | null;
  phone: string | null;
  address: string | null;
  role: string | null;
}

const Profile: React.FC<RenderProps> = ({ render, ProfileData, apiEndpoint, HandleModal }) => {
  const { isRTL } = useContext(LanguageDirectionContext);
  const [EditPassword, setEditPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [EmailError, setEmailError] = useState(false);
  const { user, fetchUser, updateUser } = useContext(AuthContext)
  const { formatMessage } = useIntl();

  const validationSchema = Yup.object({
    name: Yup.object().shape({
      en: Yup.string().min(5, formatMessage({ id: 'name.short' })).required(formatMessage({ id: 'required.nameEn' })),
      ar: Yup.string().min(5, formatMessage({ id: 'name.short' })).required(formatMessage({ id: 'required.nameAr' })),
    }),
    gender: Yup.string().required(formatMessage({ id: 'required.gender' })),
    DOB: Yup.date().required(formatMessage({ id: 'required.dob' })),
    email: Yup.string().email(formatMessage({ id: 'contact.email.invalid' })).required(formatMessage({ id: 'contact.email.error' })),
    phone: Yup.string().required(formatMessage({ id: 'required.phone' })),
    password: Yup.string()
      .required(formatMessage({ id: 'required.password' }))
      .min(8, formatMessage({ id: 'password.min' }))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        formatMessage({ id: 'password.complexity' })
      ),
    address: Yup.string().required(formatMessage({ id: 'required.address' })),
  });

  const {
    handleSubmit,
    handleInputChange,
    handleEdit
  } = CrudComponent({ apiEndpoint: `${process.env.BACKEND}` });

  const openEditPassword = () => {
    setEditPassword(true)
  }

  const closeEditPassword = () => {
    setEditPassword(false)
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmitData = async (values: any, { resetForm }: any) => {
    try {
      const response = await axios.post(`${process.env.BACKEND}auth/admin/checkEmail`, { email: values.email })

      if (response.data.Error === 'User already exists') {
        setEmailError(true)
      }
      else if (!response.data.exists) {
        await validationSchema.validate(values);
        await handleSubmit(apiEndpoint, false, Cookies.get('token')).then(() => {
          setEmailError(false)
          HandleModal()
        })
      }

    } catch (error) {
      // Handle validation errors
      console.error('Validation error:', error);
    }
  }

  useEffect(() => {
    if (user?.role !== 'admin') {
      handleEdit(user?._id)
    }
  }, [])

  const handleUpdateData = async () => {
    await handleEdit(user?._id).then(async () => {
      await handleSubmit(`${process.env.BACKEND}${user?.role}`, false, Cookies.get('token')).then(() => {
        fetchUser(Cookies.get('token') as string)
      })
    })
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className='space-y-4 min-h-96'>

      {render && user?.provider === 'System' ? (
        <div className='w-full flex justify-end'>
          <Button
            onClick={openEditPassword}
            className='bg-primary'
            variant='contained'>
            <FormattedMessage id='form.changePassword' />
          </Button>
        </div>
      ) : null}

      <Formik
        validateOnMount
        enableReinitialize
        initialValues={ProfileData ? ProfileData : {}}
        validationSchema={validationSchema}
        onSubmit={handleSubmitData}
      >
        {({ isValid, dirty, setFieldValue, resetForm }) => (
          <Form className="gap-4 md:grid-cols-2 grid w-full">
            <Field name="name[en]" >
              {({ field, meta }: any) => (
                <div>
                  <TextField
                    label={<FormattedMessage id='form.name' />}
                    variant="outlined"
                    fullWidth
                    {...field}
                    disabled={ProfileData && user?.role === 'admin' ? true : false}
                    onChange={(e: any) => { field.onChange(e); handleInputChange('name.en', e.target.value, false) }}
                  />
                  <ErrorMessage name="name[en]" component="div" className="text-red-500" />
                </div>
              )}
            </Field>

            <Field name="name[ar]">
              {({ field, meta }: any) => (
                <div>
                  <TextField
                    label={<FormattedMessage id='form.arabicName' />}
                    variant="outlined"
                    fullWidth
                    {...field}
                    disabled={ProfileData && user?.role === 'admin' ? true : false}
                    onChange={(e: any) => { field.onChange(e); handleInputChange('name.ar', e.target.value, false) }}
                  />
                  <ErrorMessage name="name[ar]" component="div" className="text-red-500" />
                </div>
              )}
            </Field>

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label"><FormattedMessage id='form.gender' /></InputLabel>
              <Field name="gender" >
                {({ field }: any) => (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label={<FormattedMessage id='form.gender' />}
                    {...field}
                    disabled={ProfileData && user?.role === 'admin' ? true : false}
                    onChange={(e: any) => { field.onChange(e); handleInputChange('gender', e.target.value, false) }}
                  >
                    <MenuItem value={'male'}><FormattedMessage id='form.male' /></MenuItem>
                    <MenuItem value={'female'}><FormattedMessage id='form.female' /></MenuItem>
                  </Select>
                )}
              </Field>
              <ErrorMessage name="gender" component="div" className="text-red-500" />
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Field type='date' name="DOB" component={DatePicker}>
                {({ field }: any) => (
                  <DatePicker
                    format='DD/MM/YYYY'
                    label={<FormattedMessage id='form.dob' />}
                    className='w-full'
                    disableFuture
                    disabled={ProfileData && user?.role === 'admin' ? true : false}
                    onChange={(e: any) => {
                      setFieldValue("DOB", dayjs(e).toISOString())
                      handleInputChange('DOB', dayjs(e).toISOString(), false);
                    }}
                  />
                )}
              </Field>
            </LocalizationProvider>

            <Field name="email" >
              {({ field, meta }: any) => (
                <div>
                  <TextField
                    label={<FormattedMessage id='form.email' />}
                    variant="outlined"
                    fullWidth
                    {...field}
                    disabled={ProfileData && user?.role === 'admin' ? true : false}
                    onChange={(e: any) => { field.onChange(e); handleInputChange('email', e.target.value, false); }}
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500" />
                  {EmailError ? <div className="text-red-500">Email Already exists</div> : null}
                </div>
              )}
            </Field>

            <Field name="phone" >
              {({ field, meta }: any) => (
                <div>
                  <TextField
                    label={<FormattedMessage id='form.phone' />}
                    variant="outlined"
                    fullWidth
                    {...field}
                    disabled={ProfileData && user?.role === 'admin' ? true : false}
                    onChange={(e: any) => { field.onChange(e); handleInputChange('phone', e.target.value, false) }}
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-500" />
                </div>
              )}
            </Field>

            <Field name="address" >
              {({ field, meta }: any) => (
                <div>
                  <TextField
                    label={<FormattedMessage id='form.address' />}
                    variant="outlined"
                    fullWidth
                    {...field}
                    disabled={ProfileData && user?.role === 'admin' ? true : false}
                    onChange={(e: any) => { field.onChange(e); handleInputChange('address', e.target.value, false) }}
                  />
                  <ErrorMessage name="address" component="div" className="text-red-500" />
                </div>
              )}
            </Field>

            {render ? (
              <>
                <Button
                  onClick={(e) => handleUpdateData()}
                  disabled={!isValid || !dirty}
                  variant='contained'
                  className='bg-secondary md:col-span-2 text-white hover:bg-primary py-2'
                >
                  <FormattedMessage id='form.updateProfile' />
                </Button>
              </>
            ) :
              <div className='space-y-4'>

                <FormControl variant="outlined" className="w-full">
                  <InputLabel htmlFor="outlined-adornment-password"><FormattedMessage id='form.password' /></InputLabel>
                  <Field name='password'>
                    {({ field, meta }: any) => (
                      <div>
                        <OutlinedInput
                          id="outlined-adornment-password"
                          className='w-full'
                          {...field}
                          onChange={(e: any) => { field.onChange(e); handleInputChange('password', e.target.value, false) }}
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
                          label={<FormattedMessage id='form.password' />}
                        />
                        <ErrorMessage name="password" component="div" className="text-red-500" />
                      </div>
                    )}
                  </Field>
                </FormControl>

                <Button
                  variant='contained'
                  className='bg-primary w-full'
                  type='submit'
                  disabled={!isValid}
                >
                  <FormattedMessage id='admin.new' />
                </Button>
              </div>
            }
          </Form>
        )}
      </Formik>

      {EditPassword ? <PasswordChanger open={EditPassword} close={closeEditPassword} apiEndPoint={apiEndpoint} /> : null}
    </div>
  );
}

export default Profile;
