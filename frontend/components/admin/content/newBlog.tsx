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
    imageCover: File | string | null;
    title: { ar?: string; en?: string; };
    description: { ar?: string; en?: string; };
    section: Array<{
        title: { ar: string; en: string; };
        content: { ar: string; en: string; };
    }>;
}

interface AddBlogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    type: string;
    setState? : any
    data?: any
}

const isFormData = true;

const AddBlog = ({ open, setOpen, type, setState, data }: AddBlogProps) => {
    const { isRTL } = useContext(LanguageDirectionContext);
    const [selectedTab, setSelectedTab] = useState<'ar' | 'en'>('en');
    
    const [postData, setPostData] = useState<Service>({
        _id: '',
        imageCover: null,
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        section: [{title: { ar: '', en: ''}, content: { ar: '', en: ''}}],
    });

    const initialValues = {
        _id: '',
        imageCover: null,
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        section: [{title: { ar: '', en: ''}, content: { ar: '', en: ''}}],
    }

    const apiEndpoint = `${process.env.BACKEND}${type.toLowerCase()}`;

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
            imageCover: null,
            title: { ar: '', en: '' },
            description: { ar: '', en: '' },
            section: [],
        })
        handleCancel()
    };

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: 'ar' | 'en') => {
        setSelectedTab(newValue);
    };

    const handleSectionChange = (index: number, field: 'title' | 'content', value: string) => {
        setPostData((prevData) => ({
            ...prevData,
            section: prevData.section.map((section, i) =>
                i === index ? { ...section, [field]: { ...section[field], [selectedTab]: value } } : section
            ),
        }));
        handleInputChange([postData.section], value, isFormData)
    };

    const handleAddSection = () => {
        setPostData((prevData) => {
            const newSection = { title: { ar: '', en: '' }, content: { ar: '', en: '' } };
            return {
                ...prevData,
                section: Array.isArray(prevData?.section) ? [...prevData.section, { ...newSection }] : [{ ...newSection }],
            };
        });
    };
    
    const handleRemoveSection = (index: number) => {
        setPostData((prevData) => ({
            ...prevData,
            section: Array.isArray(prevData?.section) ? prevData.section.filter((_, i) => i !== index) : [],
        }));
    };
    
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        // handleInputChange('imageCover', file, isFormData);
        setPostData((prevData) => ({
            ...prevData,
            imageCover: file,
        }));    
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const Submit = () => {
        const data = new FormData();
        if (postData.imageCover && typeof postData.imageCover !== 'string') {
            data.append('imageCover', postData.imageCover as File);
        }
        data.append('title[en]', postData.title.en as string);
        data.append('title[ar]', postData.title.ar as string);
        data.append('description[en]', postData.description.en as string);
        data.append('description[ar]', postData.description.ar as string);
        for (let i = 0; i < postData.section?.length; i++) {
            data.append(`section[${i}][title][en]`, postData.section[i].title.en as string);
            data.append(`section[${i}][title][ar]`, postData.section[i].title.ar as string);
            data.append(`section[${i}][content][en]`, postData.section[i].content.en as string);
            data.append(`section[${i}][content][ar]`, postData.section[i].content.ar as string);
        }

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

                            <div dir={isRTL ? 'rtl' : 'ltr'} {...getRootProps()} className={`grid place-items-center w-full h-40 rounded-xl ${postData?.imageCover ? "" : "border"} border-dashed border-darkBlue cursor-pointer `}>
                                <input {...getInputProps()} />
                                {postData?.imageCover && (
                                    <Card className='w-full h-full'>
                                        <CardMedia
                                            className='w-full h-full'
                                            component="img"
                                            image={       typeof postData?.imageCover === 'string'
                                            ? postData?.imageCover
                                            : URL.createObjectURL(postData?.imageCover as File)}
                                            alt=""
                                        />
                                    </Card>
                                )}
                                {!postData?.imageCover && (
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
                                            {selectedTab === 'ar'? (
                                                <div className='space-y-4'>
                                                    <Field
                                                        name={`title.ar`}
                                                        type="text"
                                                        as={TextField}
                                                        label={<FormattedMessage id="blog.title" />}
                                                        variant="outlined"
                                                        fullWidth
                                                        value={postData?.title?.ar||""}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            setFieldValue('title.ar', e.target.value)
                                                            setPostData((prevData) => ({
                                                                ...prevData,
                                                                title: {
                                                                    ...prevData?.title,
                                                                    ar: e.target.value
                                                                }
                                                            }))
                                                        }}
                                                    />
                                                    <ErrorMessage name={`title.ar`} component="div" className="error" />
    
                                                    <Field
                                                        name={`description.ar`}
                                                        type="text"
                                                        as={TextField}
                                                        value={postData?.description?.ar||""}
                                                        label={<FormattedMessage id="form.description" />}
                                                        variant="outlined"
                                                        fullWidth
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            setFieldValue('description.ar', e.target.value)
                                                            setPostData((prevData) => ({
                                                                ...prevData,
                                                                description: {
                                                                    ...prevData?.description,
                                                                    ar: e.target.value
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
                                                        value={postData?.title?.en||""}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            setFieldValue('title.en', e.target.value)
                                                            setPostData((prevData) => ({
                                                                ...prevData,
                                                                title: {
                                                                    ...prevData?.title,
                                                                    en: e.target.value
                                                                }
                                                            }))
                                                        }}
                                                    />
                                                    <ErrorMessage name={`title.en`} component="div" className="error" />
    
                                                    <Field
                                                        name={`description.en`}
                                                        type="text"
                                                        as={TextField}
                                                        value={postData?.description?.en||""}
                                                        label={<FormattedMessage id="form.description" />}
                                                        variant="outlined"
                                                        fullWidth
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            setFieldValue('description.en', e.target.value)
                                                            setPostData((prevData) => ({
                                                                ...prevData,
                                                                description: {
                                                                    ...prevData?.description,
                                                                    en: e.target.value
                                                                }
                                                            }))
                                                        }}
                                                    />
                                                    <ErrorMessage name={`description.en`} component="div" className="error" />
                        
    
                                                </div>
                                            )}

                                                    {postData?.section?.map((section, index) => (
                                                        <div key={index} className='space-y-4 flex justify-between'>
                                                            {index + 1} -
                                                            <div className='space-y-4 w-10/12'>
                                                                <Field
                                                                    label={<FormattedMessage id='profile.sectionTitle' />}
                                                                    as={TextField}
                                                                    type='text'
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    value={section?.title?.[selectedTab] || ''}
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSectionChange(index, 'title', e.target.value)}
                                                                />
                
                                                                <Field
                                                                    label={<FormattedMessage id='profile.sectionContent' />}
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    as={TextField}
                                                                    multiline
                                                                    rows={4}
                                                                    value={section?.content?.[selectedTab] || ''}
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSectionChange(index, 'content', e.target.value)}
                                                                />
                
                                                            </div>
                                                            <div className=''>
                                                                <IconButton color='error' onClick={() => handleRemoveSection(index)}>
                                                                    <Delete />
                                                                </IconButton>
                                                            </div>
                
                                                        </div>
                                                    ))}
    
                                        <div className={`w-full flex ${type === 'blogs'? 'justify-between' : 'justify-end' }`}>
                                            {type === 'blogs'? (
                                                <Button variant='contained' className='bg-secondary' onClick={handleAddSection}>
                                                    <FormattedMessage id='profile.newSection' />
                                                </Button>
                                            ) : null}
    
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

export default AddBlog;
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
