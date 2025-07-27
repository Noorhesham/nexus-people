import React, { useContext } from "react";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Typography from '@mui/material/Typography';
import { FormattedMessage, useIntl } from "react-intl";
import { LanguageDirectionContext } from "@/helpers/langDirection";
import { Card, CardContent, Button, TextField } from "@mui/material";
import CrudComponent from "@/helpers/CRUD";

interface values {
    name: string;
    email: string;
    phone: string;
    message: string;
} 

interface FormProps {
    Booking?: string;
}

const ContactForm : React.FC<FormProps> = ({Booking}) => {
    const { isRTL } = useContext(LanguageDirectionContext);
    const { formatMessage } = useIntl();

    const {
        handleInputChange,
        handleSubmit,
      } = CrudComponent({ apiEndpoint: `${process.env.BACKEND}` });

    const validationSchema = Yup.object({
        name: Yup.string().min(3).max(50).required(formatMessage({ id: 'contact.name.error' })),
        email: Yup.string().email(formatMessage({ id: 'contact.email.invalid' })).required(formatMessage({ id: 'contact.email.error' })),
        phone: Yup.string().matches(/^\+(?:[0-9] ?){6,14}[0-9]$/, formatMessage({ id: 'contact.phone.invalid' }))
            .required(formatMessage({ id: 'contact.phone.error' })),
        message: Yup.string().min(5).max(350).required(formatMessage({ id: 'contact.message.error' }))
    });

    const initialValues = {
        name: "",
        email: "",
        phone: "",
        message: ""
    };

    const BookData = {
        name: "",
        email: "",
        phone: "",
        message: Booking as string
    }

    const handleSubmitData = async (values: values, { resetForm }: FormikHelpers<values>) => {
        validationSchema
            .validate(values)
            .then(async () => {

                handleSubmit(`${process.env.BACKEND}contact`, false).then(() => {
                    toast.success(formatMessage({ id: 'contact.toast.success' }));
                    resetForm();
                })
            })
            .catch(() => {
                toast.error(formatMessage({ id: 'contact.toast.error' }));
            });
    };

    return (
        <main dir={isRTL? 'rtl' : 'ltr'} className="space-y-6">
            <div className="w-full max-w-md mx-auto space-y-2">
                <Typography variant='h2'  className=''>
                    <FormattedMessage id="navbar.contact" />
                </Typography>

                {Booking? null : (
                    <Typography variant='body1' className=''>
                        <FormattedMessage id="contact.info" />
                    </Typography>
                )}

            </div>

            <Card className="w-full max-w-md mx-auto" sx={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}>
                <CardContent>
                    <Formik<values>
                        initialValues={Booking? BookData : initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmitData}
                    >
                        <Form className="space-y-5">

                            <Field name='name'>
                                {({ field }: any) =>(
                                    <div className="text-darkBlue space-y-2">
                                        <TextField
                                            fullWidth
                                            {...field}
                                            color="secondary"
                                            onChange={(e) => {field.onChange(e); handleInputChange('name', e.target.value, false)}}
                                            label={formatMessage({ id: 'contact.name' })}
                                            variant="outlined"
                                        />
                                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>                                    
                                )}
                            </Field>

                            <Field name='phone'>
                                {({ field }: any) =>(
                                    <div className="text-darkBlue space-y-2">
                                        <TextField
                                            fullWidth
                                            id="phone"
                                            name="phone"
                                            color="secondary"
                                            {...field}
                                            onChange={(e) => {field.onChange(e); handleInputChange('phone', e.target.value, false)}}
                                            label={formatMessage({ id: 'contact.phone' })}
                                            variant="outlined"
                                        />
                                        <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>                                  
                                )}
                            </Field>

                            <Field name='email'>
                                {({ field }: any) =>(
                                    <div className="text-darkBlue space-y-2">
                                        <TextField
                                            fullWidth
                                            id="email"
                                            name="email"
                                            color="secondary"
                                            {...field}
                                            onChange={(e) => {field.onChange(e); handleInputChange('email', e.target.value, false)}}
                                            label={formatMessage({ id: 'contact.email' })}
                                            variant="outlined"
                                        />
                                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                )}
                            </Field>

                            <Field name='message'>
                                {({ field }: any) =>(
                                    <div className="text-darkBlue space-y-2">
                                        <TextField
                                            fullWidth
                                            id="message"
                                            name="message"
                                            color="secondary"
                                            {...field}
                                            onChange={(e) => {field.onChange(e); handleInputChange('message', e.target.value, false)}}
                                            label={formatMessage({ id: 'contact.message' })}
                                            variant="outlined"
                                            multiline
                                            rows={4}
                                        />
                                        <ErrorMessage name="message" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                )}
                            </Field>

                            <Button
                                type="submit"
                                variant="contained"
                                className="rounded-2xl bg-primary"
                            >
                                <Typography variant='button'>
                                    <FormattedMessage id="contact.submit" />
                                </Typography>
                            </Button>
                        </Form>
                    </Formik>
                </CardContent>
            </Card>

            <ToastContainer
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                className='mt-40 lg:mt-20'
                theme="light"
            />
        </main>
    );
};

export default ContactForm;
