import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { Card, Button, Typography, Divider } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Reset = () => {
    const [token, setToken] = useState('');
    const router = useRouter();
    const [newPassword, setPassword] = useState('');
    const {formatMessage} = useIntl();

    const validationSchema = Yup.object({
        newPassword: Yup.string()
        .required(formatMessage({ id: 'required.password' }))
        .min(8, formatMessage({ id: 'password.min' }))
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          formatMessage({ id: 'password.complexity' })
        ),
    })

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    useEffect(() => {
      const { query } = router;
      const tokenParam = query.token;
  
      if (tokenParam) {
        setToken(tokenParam as string);
      }
    }, [router.query]);

    const Reset = async(Token: string) => {
        try {
            await axios.post(`${process.env.BACKEND}auth/reset/${token}`, {newPassword}, {headers: { token: Token }})
        } catch (error) {
            console.error(error)
        }
    }
    
    return (  
        <main className="min-h-screen flex items-center justify-center">
            <Card className="w-10/12 h-60 grid place-items-center md:w-6/12 lg:w-4/12">
                <Divider className="w-10/12">
                    <Typography variant="h6">
                        <FormattedMessage id="login.reset" />
                    </Typography>
                </Divider>

                <Formik initialValues={{newPassword}} validationSchema={validationSchema} onSubmit={() => {}}>
                    {({ isValid }) => {
                        return(
                            <Form className="w-10/12 space-y-4 grid place-items-center">
                                <FormControl variant="outlined" className="w-full flex justify-center border">
                                    <InputLabel htmlFor="outlined-adornment-password"><FormattedMessage id='form.password'/></InputLabel>
                                    <Field name='newPassword' >
                                        {({ field, meta }: any) => (
                                        <div className="grid place-items space-y-2">
                                            <OutlinedInput
                                            // value={User.password}
                                            id="outlined-adornment-password"
                                            className=''
                                            {...field}
                                            onChange={(e:any) => { field.onChange(e); setPassword(e.target.value)}}
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
                                            label={<FormattedMessage id='form.password'/>}
                                            />
                                            <ErrorMessage name="newPassword" component="div" className="text-red-500" />
                                        </div>
                                        )}
                                    </Field>
                                </FormControl>

                                <Button type='submit' disabled={!isValid} onClick={(e) => Reset(token)} variant='contained' className='bg-Baige'>
                                    <FormattedMessage id='contact.submit' />
                                </Button>
                            </Form>
                    )}}
                </Formik>
            </Card>
        </main>
    );
}
 
export default Reset;