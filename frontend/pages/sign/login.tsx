import { useContext, useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import { FormattedMessage, useIntl } from "react-intl";
import { LanguageDirectionContext } from "@/helpers/langDirection";
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import { AuthContext } from "@/helpers/AuthContext";
import PasswordRester from "./reset";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const { isRTL } = useContext(LanguageDirectionContext);
    const [showPassword, setShowPassword] = useState(false);
    const { login, errorMessage } = useContext(AuthContext)
    const {formatMessage} = useIntl();
    const [forgot, setForgot] = useState(false)
    const [sentForgetMail, setSentForgetMail] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const openForgot = () => {
        setForgot(true)
    }
    
    const closeForgot = () => {
        setForgot(false)
    }

    const ValidationSchema = Yup.object({
        email: Yup.string()
            .email(formatMessage({ id: 'contact.email.invalid' }))
            .required(formatMessage({ id: 'contact.email.error' })),

        password: Yup.string()
            .min(8, formatMessage({ id: 'password.min.length' }))
            .required(formatMessage({ id: 'required.password'})),
    })

    const initialValues = {
        email: '',
        password: '',
    }

    const handleSubmit = async (values:any, {resetForm}:any) => {
        try {
            ValidationSchema.validate(values).then(async () => {
                login(values.email, values.password).catch(() => {

                })
            }).then(async () => {
                // fetchUser(Cookies.get('token') as string)
            })
            
        } catch (error) {
            
        }
    }

    useEffect(() => {
        sentForgetMail === true? toast.success(formatMessage({ id: 'login.resetEmail' }))
        : null
    }, [sentForgetMail])

  return (  
    <main dir={isRTL ? 'rtl' : 'ltr'}>
        
        <div className="space-y-8 grid place-items-center">
            <Typography variant="h4">
                <FormattedMessage id="login.welcome"/>
            </Typography>
            <Formik
                initialValues={initialValues}
                validationSchema={ValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => ( // Add errors and touched here
                    <Form className="space-y-8 flex flex-col justify-center w-full">
                        <Field
                            type="text"
                            name="email"
                            as={TextField}
                            label={<FormattedMessage id="form.email" />}
                            variant="outlined"
                            fullWidth
                            color='secondary'
                            // value={Email}
                            error={errors.email && touched.email}
                            helperText={touched.email && errors.email} 
                            // onChange={(e:any) => setEmail(e.target.value)}
                        />

                        <Field
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            as={TextField}
                            label={<FormattedMessage id="form.password" />}
                            variant="outlined"
                            fullWidth
                            color='secondary'
                            // value={Password}
                            error={errors.password && touched.password}
                            helperText={touched.password && errors.password}
                            // onChange={(e:any) => setPassword(e.target.value)}
                            >
                            <InputLabel htmlFor="outlined-adornment-password">
                                <FormattedMessage id="form.password" />
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                name="password"
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
                            />
                        </Field>
                            {errorMessage !== ''? <Typography className="text-red-500">{errorMessage}</Typography> : null}
                        <div className={`flex justify-between `}>
                            <Typography>
                                <FormattedMessage id="login.forget" />
                            </Typography>
                            <Typography onClick={openForgot} className="cursor-pointer underline text-darkBlue hover:text-primary">
                                <FormattedMessage id="login.reset" />
                            </Typography>
                        </div>

                        {forgot? <PasswordRester open={forgot} close={closeForgot} setSentMail={setSentForgetMail}/> : null}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className="bg-secondary hover:text-white hover:bg-primary"
                        >
                            <Typography variant="button">
                                <FormattedMessage id="login.login" />
                            </Typography>
                        </Button>
                    </Form>
                )}
            </Formik>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={isRTL? true: false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className='mt-40 lg:mt-20'
        theme="light"
      />
    </main>
  );
};
 
export default Login;
