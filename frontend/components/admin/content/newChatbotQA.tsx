import Button from '@mui/material/Button';
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { FormattedMessage } from 'react-intl';
import { CloseSharp } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import CrudComponent from "@/helpers/CRUD";
import Cookies from "js-cookie";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

interface ChatbotQA {
    _id: string;
    question: { ar?: string; en?: string; };
    answer: { ar?: string; en?: string; };
}

interface AddQAProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setState? : any
    data?: any
}

const AddQA = ({ open, setOpen, setState, data }: AddQAProps) => {
    const [selectedTab, setSelectedTab] = useState<'ar' | 'en'>('en');
    const [QA, setQA] = useState<ChatbotQA>({
        _id: '',
        question: { ar: '', en: '' },
        answer: { ar: '', en: '' },
    });

    const initialValues ={
        _id: '',
        question: { ar: '', en: '' },
        answer: { ar: '', en: '' },
    }    
    const apiEndpoint = `${process.env.BACKEND}chatbot`;

    const {
        handleInputChange,
        handleCancel,
        handleEdit,
        handleSubmit
    } = CrudComponent({ apiEndpoint: `${process.env.BACKEND}` });

    useEffect(() =>{ 
        setQA(data as ChatbotQA)
        handleEdit(data?._id)
    }, [data])

    const closeModal = () => {
        setOpen(false);
        setQA({
            _id:'',
            question: { ar: '', en: '' },
            answer: { ar: '', en: '' },
        })
        handleCancel()
    };

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: 'ar' | 'en') => {
        setSelectedTab(newValue);
    };
    
    const Submit = () => {
        handleSubmit(apiEndpoint, false, Cookies.get('token'))
        closeModal();
    }

    const validationSchema = Yup.object({
        question: Yup.object().shape({
            en: Yup.string().required('English question is required'),
            ar: Yup.string().required('Arabic question is required'),
        }),
        answer: Yup.object().shape({
            en: Yup.string().required('English answer is required'),
            ar: Yup.string().required('Arabic answer is required'),
        }),
    });


    return (    
        <main>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={closeModal}
                closeAfterTransition
            >
                <Fade in={open}>
                    <Box sx={style} className='w-2/3 lg:w-1/3'>
                        <Box className="grid overflow-y-auto max-h-[80vh]  space-y-8">
                            <div className="flex flex-row-reverse w-60 sm:w-full ">
                                <CloseSharp className="relative right-0 hover:text-primary cursor-pointer" onClick={closeModal} />
                            </div>

                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    value={selectedTab}
                                    onChange={handleTabChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                >
                                    <Tab label={<FormattedMessage id='language.english' />} value="en" />
                                    <Tab label={<FormattedMessage id='language.arabic' />} value="ar" />
                                </Tabs>
                            </Box>

                            <Formik initialValues={data? data : initialValues} validationSchema={validationSchema} onSubmit={Submit}>
                                {({ setFieldValue }) => {
                                    return (
                                        <Form>
                                    
                                        {selectedTab === 'ar'? (
                                            <div className='space-y-4'>
                                            <Field
                                            name={`question.ar`}
                                            type="text"
                                            as={TextField}
                                            label={<FormattedMessage id="bot.question" />}
                                            variant="outlined"
                                            fullWidth
                                            value={QA?.question?.ar||""}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                handleInputChange(`question.ar`, e.target.value, false)
                                                setFieldValue('question.ar', e.target.value)
                                                setQA((prevData) => ({
                                                    ...prevData,
                                                    question: {
                                                        ...(prevData?.question || {}),  // Ensure prevData.question exists
                                                        ar: e.target.value
                                                    }
                                                }))
                                            }}
                                        />
                                        <ErrorMessage name={`question.ar`} component="div" className="error" />
    
                                        <Field
                                            name={`answer.ar`}
                                            type="text"
                                            as={TextField}
                                            value={QA?.answer?.ar ||"" }
                                            label={<FormattedMessage id="bot.answer" />}
                                            variant="outlined"
                                            fullWidth
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                handleInputChange(`answer.ar`, e.target.value, false)
                                                setFieldValue('answer.ar', e.target.value)
                                                setQA((prevData) => ({
                                                    ...prevData,
                                                    answer: {
                                                        ...(prevData?.answer || {}),  // Ensure prevData.question exists
                                                        ar: e.target.value
                                                    }
                                                }))
                                            }}
                                        />
                                        <ErrorMessage name={`answer.ar`} component="div" className="error" />
                                            </div>
                                        ) : (
                                            <div className='space-y-4'>
                                            <Field
                                            name={`question.en`}
                                            type="text"
                                            as={TextField}
                                            label={<FormattedMessage id="bot.question" />}
                                            variant="outlined"
                                            fullWidth
                                            value={QA?.question?.en ||""}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                handleInputChange(`question.en`, e.target.value, false)
                                                setFieldValue('question.en', e.target.value)
                                                setQA((prevData) => ({
                                                    ...prevData,
                                                    question: {
                                                        ...(prevData?.question || {}),  // Ensure prevData.question exists
                                                        en: e.target.value
                                                    }
                                                }))
                                            }}
                                        />
                                        <ErrorMessage name={`question.en`} component="div" className="error" />
    
                                        <Field
                                            name={`answer.en`}
                                            type="text"
                                            as={TextField}
                                            value={QA?.answer?.en||""}
                                            label={<FormattedMessage id="bot.answer" />}
                                            variant="outlined"
                                            fullWidth
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                handleInputChange(`answer.en`, e.target.value, false)
                                                setFieldValue('answer.en', e.target.value)
                                                setQA((prevData) => ({
                                                    ...prevData,
                                                    answer: {
                                                        ...(prevData?.answer || {}),  // Ensure prevData.question exists
                                                        en: e.target.value
                                                    }
                                                }))
                                            }}
                                        />
                                        <ErrorMessage name={`answer.en`} component="div" className="error" />
                                            </div>
                                        )}
      
    
                                        <div className='flex justify-end w-full'>
                                            <Button type='submit' variant='contained' className='bg-primary'>
                                                <FormattedMessage id='profile.publish' />
                                            </Button>
                                        </div>
                                    </Form>
                                    )
                                }}

                            </Formik>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </main>
    );
}

export default AddQA;

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '20px',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};
