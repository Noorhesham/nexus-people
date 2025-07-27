import Button from '@mui/material/Button';
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import { useDropzone } from 'react-dropzone';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from 'react-intl';
import { CloseSharp, Delete, PhotoCamera } from '@mui/icons-material';
import { useCallback, useContext, useEffect, useState } from 'react';
import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import CrudComponent from "@/helpers/CRUD";
import Cookies from "js-cookie";
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

interface Service {
    _id: string;
    image: File | string | null;
    content : {
        date: string,
        title: { ar?: string; en?: string; };
        description: { ar?: string; en?: string; };
    }
}

interface AddBlogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setState? : any
    data?: any
}

const isFormData = true;

const AddTimeline = ({ open, setOpen, setState, data }: AddBlogProps) => {
    const { isRTL } = useContext(LanguageDirectionContext);
    const [selectedTab, setSelectedTab] = useState<'ar' | 'en'>('en');
    
    const [postData, setPostData] = useState<Service>({
        _id: '',
        image: null,
        content: {
            date: '',
            title: { ar: '', en: '' },
            description: { ar: '', en: '' },
        }

    });

    const initialValues = {
        _id: '',
        image: null,
        content: {
            date: '',
            title: { ar: '', en: '' },
            description: { ar: '', en: '' },
        }

    }

    const apiEndpoint = `${process.env.BACKEND}timeline`;

    const {
        handleInputChange,
        handleCancel,
        submitFormData,
        handleEdit
    } = CrudComponent({ apiEndpoint: `${process.env.BACKEND}` });

    useEffect(() =>{ 
        setPostData(data as Service)
        handleEdit(data?._id)
    }, [data])

    const closeModal = () => {
        setOpen(false);
        setPostData({
            _id:'',
            image: null,
            content : {
                date: '',
                title: { ar: '', en: '' },
                description: { ar: '', en: '' },
            }
        })
        handleCancel()
    };

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: 'ar' | 'en') => {
        setSelectedTab(newValue);
    };
    
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        // handleInputChange('imageCover', file, isFormData);
        setPostData((prevData) => ({
            ...prevData,
            image: file,
        }));    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const Submit = () => {
        const data = new FormData();
        if (postData.image && typeof postData.image !== 'string') {
            data.append('image', postData.image as File);
        }
        data.append('date', postData.content.date as string);
        data.append('title[en]', postData.content.title.en as string);
        data.append('title[ar]', postData.content.title.ar as string);
        data.append('description[en]', postData.content.description.en as string);
        data.append('description[ar]', postData.content.description.ar as string);


        submitFormData(apiEndpoint, data, Cookies.get('token')).then(() => {
            closeModal();
        })

    }

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
                            <div className="flex mb-8 flex-row-reverse w-60 sm:w-full ">
                                <CloseSharp className="relative right-0 hover:text-primary cursor-pointer" onClick={closeModal} />
                            </div>

                            <div dir={isRTL ? 'rtl' : 'ltr'} {...getRootProps()} className={`grid place-items-center w-full h-40 rounded-xl ${postData?.image ? "" : "border"} border-dashed border-darkBlue cursor-pointer `}>
                                <input {...getInputProps()} />
                                {postData?.image && (
                                    <Card className='w-full h-full'>
                                        <CardMedia
                                            className='w-full h-full'
                                            component="img"
                                            image={       typeof postData?.image === 'string'
                                            ? postData?.image
                                            : URL.createObjectURL(postData?.image as File)}
                                            alt=""
                                        />
                                    </Card>
                                )}
                                {!postData?.image && (
                                    <>
                                        <PhotoCamera className='text-6xl text-darkBlue' />
                                        <Typography className='text-darkBlue'>
                                            {isRTL ? 'الانواع المدعومة' : 'Supported Types '} : JPG, PNG
                                        </Typography>
                                    </>
                                )}
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

                            <Formik 
                                initialValues={data? data : initialValues} 
                                validationSchema={''}
                                // validationSchema={type === 'Blog'? BlogValidationSchema : validationSchema} 
                                onSubmit={Submit}
                            >
                                {({ setFieldValue }) => {

                                    return (
                                        <Form className='space-y-4'>
                                            <Field
                                                name={`date`}
                                                type="text"
                                                as={TextField}
                                                label={<FormattedMessage id="form.date" />}
                                                variant="outlined"
                                                fullWidth
                                                value={postData?.content?.date}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setFieldValue('date', e.target.value)
                                                    setPostData((prevData) => ({
                                                        ...prevData,
                                                        content : {
                                                            ...prevData?.content,
                                                            date: e.target.value
                                                        }
                                                    }))
                                                }}
                                            />
                                            <ErrorMessage name={`title.ar`} component="div" className="error" />
                                            {selectedTab === 'ar'? (
                                                <div className='space-y-4'>
                                                    <Field
                                                        name={`title.ar`}
                                                        type="text"
                                                        as={TextField}
                                                        label={<FormattedMessage id="blog.title" />}
                                                        variant="outlined"
                                                        fullWidth
                                                        value={postData?.content?.title?.ar||""}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            setFieldValue('title.ar', e.target.value)
                                                            setPostData((prevData) => ({
                                                                ...prevData,
                                                                content: {
                                                                    ...prevData?.content,
                                                                    title: {
                                                                        ...prevData?.content?.title,
                                                                        ar: e.target.value
                                                                    }                       
                                                                }
                                             
                                                            }))
                                                        }}
                                                    />
                                                    <ErrorMessage name={`title.ar`} component="div" className="error" />
    
                                                    <Field
                                                        name={`description.ar`}
                                                        type="text"
                                                        as={TextField}
                                                        value={postData?.content?.description?.ar||""}
                                                        label={<FormattedMessage id="form.description" />}
                                                        variant="outlined"
                                                        fullWidth
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            setFieldValue('description.ar', e.target.value)
                                                            setPostData((prevData) => ({
                                                                ...prevData,
                                                                content:{
                                                                    ...prevData?.content,
                                                                    description: {
                                                                        ...prevData?.content?.description,
                                                                        ar: e.target.value
                                                                    }
                                                                }
                                                            }))
                                                        }}
                                                    />
                                                    <ErrorMessage name={`description.ar`} component="div" className="error" />
                        
                                                </div>
                                            ) : (
                                                <div className='space-y-4'>
                                                    <Field
                                                        name={`title.en`}
                                                        type="text"
                                                        as={TextField}
                                                        label={<FormattedMessage id="blog.title" />}
                                                        variant="outlined"
                                                        fullWidth
                                                        value={postData?.content?.title?.en||""}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            setFieldValue('title.en', e.target.value)
                                                            setPostData((prevData) => ({
                                                                ...prevData,
                                                                content: {
                                                                    ...prevData?.content,
                                                                    title: {
                                                                        ...prevData?.content?.title,
                                                                        en: e.target.value
                                                                    }                       
                                                                }
                                                            }))
                                                        }}
                                                    />
                                                    <ErrorMessage name={`title.en`} component="div" className="error" />
    
                                                    <Field
                                                        name={`description.en`}
                                                        type="text"
                                                        as={TextField}
                                                        value={postData?.content?.description?.en||""}
                                                        label={<FormattedMessage id="form.description" />}
                                                        variant="outlined"
                                                        fullWidth
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            setFieldValue('description.en', e.target.value)
                                                            setPostData((prevData) => ({
                                                                ...prevData,
                                                                content:{
                                                                    ...prevData?.content,
                                                                    description: {
                                                                        ...prevData?.content?.description,
                                                                        en: e.target.value
                                                                    }
                                                                }
                                                            }))
                                                        }}
                                                    />
                                                    <ErrorMessage name={`description.en`} component="div" className="error" />
                        
    
                                                </div>
                                            )}

            
    
                                        <div className={`w-full flex justify-end`}>
                                            <Button type='submit' variant='contained' className='bg-primary'>
                                                <FormattedMessage id='profile.publish' />
                                            </Button>
                                        </div>
                                    </Form>
                                    )
                                }

                            }

                            </Formik>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </main>
    );
}

export default AddTimeline;

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
