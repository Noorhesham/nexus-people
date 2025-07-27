import Button from '@mui/material/Button';
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import { useDropzone } from 'react-dropzone';
import Typography from '@mui/material/Typography';
import { Delete, PhotoCamera } from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import CrudComponent from "@/helpers/CRUD";
import Cookies from "js-cookie";
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';
import Image from 'next/image';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

interface Model {
    mainType: string;
    secondaryType: { ar: string; en: string; };
    details: {
      unitIdentifier: string,
      images: File[],
      length: number | null,
      width: number | null,
      height: number | null,
      squareMeter: number | null,
      description: { ar: string; en: string; };
      availability: boolean;
    }
}

interface AddModelProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setState? : any
    data?: any
}

const isFormData = true;

const AddModel = ({ open, setOpen, setState, data }: AddModelProps) => {
    const { isRTL } = useContext(LanguageDirectionContext);
    const [modelData, setModelData] = useState<Model>({
        mainType: '',
        secondaryType: { ar: '', en: '' },
        details: {
          unitIdentifier: '',
          images: [],
          length: null,
          width: null,
          height: null,
          squareMeter: null,
          description: { ar: '', en: '' },
          availability: false,
        }
    });

    const initialValues = {
        mainType: '',
        secondaryType: { ar: '', en: '' },
        details: {
          unitIdentifier: '',
          images: [],
          length: null,
          width: null,
          height: null,
          squareMeter: null,
          description: { ar: '', en: '' },
          availability: false,
        }
    }

    const apiEndpoint = `${process.env.BACKEND}mall`;

    const {
        handleInputChange,
        handleCancel,
        handleEdit
    } = CrudComponent({ apiEndpoint: `${process.env.BACKEND}` });

    const handleRemoveImage = (index: number) => {
        setModelData((prevData) => {
          const newImages = [...prevData.details.images];
          newImages.splice(index, 1);
          return {
            ...prevData,
            details: {
              ...prevData.details,
              images: newImages,
            },
          };
        });
    };

    const closeModal = () => {
        setOpen(false);
        setModelData({
            mainType: '',
            secondaryType: { ar: '', en: '' },
            details: {
              unitIdentifier: '',
              images: [],
              length: null,
              width: null,
              height: null,
              squareMeter: null,
              description: { ar: '', en: '' },
              availability: false,
            }
        })
        handleCancel()
    };
    
    useEffect(() => {
        data? setModelData(data.model) : null;
    }, [data])

    useEffect(() => {
        data? handleEdit(data.model._id) : null;
    }, [data])

    const validationSchema = Yup.object().shape({
        mainType: Yup.string().required('Main Type is required'),
        secondaryType: Yup.object().shape({
            ar: Yup.string().required('Arabic Name is required'),
            en: Yup.string().required('English Name is required'),
        }),
        details: Yup.object().shape({
            images: Yup.array()
                .min(1, 'At least one image is required')
                .of(
                    Yup.mixed().test('file', 'Invalid file format or size', async function (value) {
                        if (!(value instanceof File)) {
                            return this.createError({ message: 'Invalid file format' });
                        }
                        if (value.size > 5 * 1024 * 1024) {
                            return this.createError({ message: 'File size is too large' });
                        }
                        return true;
                    })
                ),
            unitIdentifier: Yup.string().required('Unit Identifier is required'),
            length: Yup.number().required('Length is required').min(0, 'Length must be greater than or equal to 0'),
            width: Yup.number().required('Width is required').min(0, 'Width must be greater than or equal to 0'),
            height: Yup.number().required('Height is required').min(0, 'Height must be greater than or equal to 0'),
            squareMeter: Yup.number().required('Square Meter is required').min(0, 'Square Meter must be greater than or equal to 0'),
            description: Yup.object().shape({
                ar: Yup.string().required('Arabic Description is required'),
                en: Yup.string().required('English Description is required'),
            }),
            avability: Yup.bool().required('Select Availability')
        }),
    });
    
      
    const onDrop = (acceptedFiles: File[]) => {    
        setModelData((prevData) => ({
            ...prevData,
            details: {
                ...prevData.details,
                images: [...prevData.details.images, ...acceptedFiles],
            },
        }));
    };
    
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleSubmitData = async (values: any) => {
        try {
            const formData = new FormData();
            formData.append('mainType', modelData.mainType);            
            formData.append('unitIdentifier', modelData.details.unitIdentifier);
            formData.append('secondaryType[ar]', modelData.secondaryType.ar);
            formData.append('secondaryType[en]', modelData.secondaryType.en);
            formData.append('length', modelData.details.length as unknown as string);
            formData.append('width', modelData.details.width as unknown as string);
            formData.append('height', modelData.details.height as unknown as string);
            formData.append('squareMeter', modelData.details.squareMeter as unknown as string);
            formData.append('description[ar]', modelData.details.description.ar);
            formData.append('description[en]', modelData.details.description.en);
            formData.append('availability', modelData.details.availability as unknown as string);            

            modelData.details.images.forEach((image: File, index: number) => {
                formData.append(`images`, image);
            });

            data? 
                await axios.put(`${apiEndpoint}/${data._id}`, formData, {headers: { token: Cookies.get('token')}}).then(() => {
                    setOpen(false);
                    setModelData({
                        mainType: '',
                        secondaryType: { ar: '', en: '' },
                        details: {
                            unitIdentifier: '',
                            images: [],
                            length: null,
                            width: null,
                            height: null,
                            squareMeter: null,
                            description: { ar: '', en: '' },
                            availability: false
                        }
                    })
                }) 
            :
            // Assuming you have an endpoint for adding a model
            await axios.post(apiEndpoint, formData, {headers: { token: Cookies.get('token')}}).then(() => {
                setOpen(false);
                setModelData({
                    mainType: '',
                    secondaryType: { ar: '', en: '' },
                    details: {
                        unitIdentifier: '',
                        images: [],
                        length: null,
                        width: null,
                        height: null,
                        squareMeter: null,
                        description: { ar: '', en: '' },
                        availability: false
                    }
                })
            }) 

            // Close modal or perform other actions after successful submission
        } catch (error) {
            // Handle error, e.g., show an error message
            console.error('Error submitting form:', error);
        }
    };

    const handleDataChange = (name: string, value: any) => {
        handleInputChange(name, value, false);
        setModelData((prevData) => {
            if (name.includes('.')) {
                // Handle nested property
                const keys = name.split('.');
                const nestedData = keys.reduceRight((acc, key, index) => {
                    if (index === keys.length - 1) {
                        return { [key]: value };
                    }
                    else
                    return { [key]: { ...acc } };
                }, {});
                return deepMerge(prevData, nestedData);
            } else {
                return {
                    ...prevData,
                    [name]: value,
                };
            }
        });
    };

    // Utility function to merge nested objects deeply
    const deepMerge = (target: any, source: any) => {
        if (isObject(target) && isObject(source)) {
            for (const key in source) {
                if (isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(target, { [key]: {} });
                    }
                    deepMerge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        return target;
    };

    const isObject = (item: any) => {
        return item && typeof item === 'object' && !Array.isArray(item);
    };

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
                    <Box sx={style}>
                        <Box className="grid overflow-y-auto max-h-[80vh]  space-y-8">
                            <Formik
                                initialValues={data? data : initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmitData}
                            >
                                {({isValid, dirty}) => (
                                    <Form>
                                        <Box sx={{ p: 2 }}>

                                            <div dir={isRTL ? 'rtl' : 'ltr'} {...getRootProps()} className={`grid place-items-center w-full h-40 rounded-xl border border-dashed border-darkBlue cursor-pointer mb-8`}>
                                                <input {...getInputProps()} />
                                                <>
                                                    <PhotoCamera className='text-6xl text-darkBlue' />
                                                    <Typography className='text-darkBlue'>
                                                        {isRTL ? 'الانواع المدعومة' : 'Supported Types '} : JPG, PNG
                                                    </Typography>
                                                </>
                                                <Typography className='text-darkBlue'>Drag 'n' drop some files here, or click to select files</Typography>
                                            </div>

                                            
                                            <Field name="availability">
                                                {({ field }: any) => (
                                                    <div>
                                                        <FormControlLabel 
                                                            control={<Checkbox
                                                            {...field}
                                                            checked={modelData?.details?.availability}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {field.onChange(e); setModelData((prev) => ({
                                                                ...prev, 
                                                                details: {
                                                                    ...prev.details,
                                                                    availability: !modelData?.details?.availability
                                                                }
                                                            }))} }                                                       
                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                        />} label="Availability" />

                                                        <ErrorMessage name="availability" component="span" className="text-red-500" />
                                                    </div>
                                                )}
                                            </Field>
                                            
                                            <Field name="unitIdentifier">
                                                {({ field }: any) => (
                                                    <div>
                                                        <TextField
                                                            label="Unit Identifier"
                                                            fullWidth
                                                            {...field}
                                                            color='secondary'
                                                            margin="normal"
                                                            value={modelData.details?.unitIdentifier}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {field.onChange(e); setModelData((prev) => ({
                                                                ...prev, 
                                                                details: {
                                                                    ...prev.details,
                                                                    unitIdentifier: e.target.value
                                                                }
                                                            }))}}                        
                                                        />
                                                        <ErrorMessage name="unitIdentifier" component="span" className="text-red-500" />
                                                    </div>
                                                )}
                                            </Field>

                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label" color='secondary'>Type</InputLabel>
                                                <Field name='mainType'>
                                                    {({ field }: any) => (
                                                        <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        {...field}
                                                        color='secondary'
                                                        label={'Type'}
                                                        value={modelData?.mainType}
                                                        onChange={(e) => {field.onChange(e); setModelData((prev) => ({
                                                            ...prev,
                                                            mainType: e.target.value as string
                                                        }))}}
                                                        // onChange={(e) => {field.onChange(e); handleChange('gender', e.target.value)}}
                                                        >
                                                            <MenuItem value="Commercial">Commercial</MenuItem>
                                                            <MenuItem value="Medical">Medical</MenuItem>
                                                            <MenuItem value="Administrative">Administrative</MenuItem>
                                                        </Select>
                                                    )}
                                                </Field>
                                            </FormControl>
                                            <ErrorMessage name="mainType" component="span" className="text-red-500" />

                                            <div className='grid grid-cols-2 gap-4'>
                                                
                                                <div className='grid'>
                                                    <Field name="secondaryType.en">
                                                        {({ field }: any) => (
                                                            <div>
                                                            <TextField
                                                                label="English Name"
                                                                margin="normal"
                                                                color='secondary'
                                                                {...field}
                                                                value={modelData?.secondaryType?.en}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {field.onChange(e); setModelData((prev) => ({
                                                                    ...prev, 
                                                                    secondaryType: {
                                                                        ...prev.secondaryType,
                                                                        en: e.target.value
                                                                    }
                                                                }))}}
                                                            />
                                                            <ErrorMessage name="secondaryType.en" component="span" className="text-red-500" />
                                                            
                                                            </div>
                                                        )}
                                                    </Field>
                                                </div>
                                                
                                                <div className='grid'>
                                                    <Field name="secondaryType.ar">
                                                        {({ field }: any) => (
                                                            <div>
                                                                <TextField                                                        
                                                                    label="Arabic Name"
                                                                    margin="normal"
                                                                    color='secondary'
                                                                    {...field}
                                                                    value={modelData.secondaryType?.ar}
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {field.onChange(e); setModelData((prev) => ({
                                                                        ...prev, 
                                                                        secondaryType: {
                                                                            ...prev.secondaryType,
                                                                            ar: e.target.value
                                                                        }
                                                                    }))}}
                                                                />
                                                                <ErrorMessage name="secondaryType.ar" component="span" className="text-red-500" />
                                                            </div>
                                                        )}
                                                    </Field>
                                                </div>
                                            </div>

                                            <div className='grid grid-cols-2 gap-x-4 '>
                                                <div >
                                                    <Field name="details.length">
                                                        {({ field }: any) => (
                                                            <div>
                                                                <TextField                                                        
                                                                    label="Length"
                                                                    type="number"
                                                                    margin="normal"
                                                                    color='secondary'
                                                                    {...field}
                                                                    value={modelData.details?.length}
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {field.onChange(e); setModelData((prev) => ({
                                                                        ...prev, 
                                                                        details: {
                                                                            ...prev.details,
                                                                            length: parseInt(e.target.value)
                                                                        }
                                                                    }))}} 
                                                                />
                                                                <ErrorMessage name="details.length" component="span" className="text-red-500" />
                                                            </div>
                                                        )}
                                                    </Field>
                                                </div>
                                                
                                                <div>
                                                    <Field name="details.width">
                                                        {({ field }: any) => (
                                                            <div>
                                                                <TextField 
                                                                    label="Width"
                                                                    type="number"
                                                                    color='secondary'
                                                                    margin="normal"
                                                                    {...field}
                                                                    value={modelData.details?.width}
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {field.onChange(e); setModelData((prev) => ({
                                                                        ...prev, 
                                                                        details: {
                                                                            ...prev.details,
                                                                            width: parseInt(e.target.value)
                                                                        }
                                                                    }))}} 
                                                                />
                                                                <ErrorMessage name="details.width" component="span" className="text-red-500" />
                                                            </div>
                                                        )}
                                                    </Field>
                                                </div>
                                                
                                                <div>
                                                    <Field name="details.height">
                                                        {({ field }: any) => (
                                                            <div>
                                                                <TextField
                                                                    label="Height"
                                                                    type="number"
                                                                    color='secondary'
                                                                    margin="normal"
                                                                    {...field}
                                                                    value={modelData.details?.height}
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {field.onChange(e); setModelData((prev) => ({
                                                                        ...prev, 
                                                                        details: {
                                                                            ...prev.details,
                                                                            height: parseInt(e.target.value)
                                                                        }
                                                                    }))}}  
                                                                />
                                                                <ErrorMessage name="details.height" component="span" className="text-red-500" />
                                                            </div>
                                                        )}
                                                    </Field>
                                                        
                                                                                                             
                                                </div>
                                                
                                                <div>
                                                    <Field name="details.squareMeter">
                                                        {({ field }: any) => (
                                                            <div>
                                                                <TextField
                                                                    label="Square Meter"
                                                                    type="number"
                                                                    color='secondary'
                                                                    margin="normal"
                                                                    {...field}
                                                                    value={modelData.details?.squareMeter}
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {field.onChange(e); setModelData((prev) => ({
                                                                        ...prev, 
                                                                        details: {
                                                                            ...prev.details,
                                                                            squareMeter: parseInt(e.target.value)
                                                                        }
                                                                    }))}}
                                                                />
                                                            <ErrorMessage name="details.squareMeter" component="span" className="text-red-500" />
                                                            </div>
                                                        )}
                                                    </Field>  
                                                </div>
                                            </div>

                                            <Field name="details.description.en">
                                                {({ field }: any) => (
                                                    <div>
                                                        <TextField 
                                                            label="English Description"
                                                            multiline
                                                            rows={4}
                                                            fullWidth
                                                            {...field}
                                                            color='secondary'
                                                            margin="normal"
                                                            value={modelData.details?.description?.en}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {field.onChange(e); setModelData((prev) => ({
                                                                ...prev, 
                                                                details: {
                                                                    ...prev.details,
                                                                    description:{
                                                                        ...prev.details.description,
                                                                        en: e.target.value
                                                                    }
                                                                }
                                                            }))}}         
                                                        />
                                                        <ErrorMessage name="details.description.en" component="span" className="text-red-500" />
                                                    </div>
                                                )}
                                            </Field>
                                                
                                            <Field name="details.description.ar">
                                                {({ field }: any) => (
                                                    <div>
                                                        <TextField
                                                            label="Arabic Description"
                                                            multiline
                                                            rows={4}
                                                            fullWidth
                                                            {...field}
                                                            color='secondary'
                                                            margin="normal"
                                                            value={modelData.details?.description?.ar}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {field.onChange(e); setModelData((prev) => ({
                                                                ...prev, 
                                                                details: {
                                                                    ...prev.details,
                                                                    description:{
                                                                        ...prev.details.description,
                                                                        ar: e.target.value
                                                                    }
                                                                }
                                                            }))}}                        
                                                        />
                                                        <ErrorMessage name="details.description.ar" component="span" className="text-red-500" />
                                                    </div>
                                                )}
                                            </Field>
                                                
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="subtitle1">Selected Images:</Typography>
                                                {modelData?.details?.images?.map((file, index) => (
                                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                        <Typography>{file.name}</Typography>
                                                            <Image src={typeof file === 'string'
                                            ? file
                                            : URL.createObjectURL(file as File)} alt='' width={200} height={200} />
                                                        <IconButton onClick={() => handleRemoveImage(index)}>
                                                            <Delete />
                                                        </IconButton>
                                                    </Box>
                                                ))}
                                            </Box>
                                            
                                            <Box className="flex justify-end">
                                                <Button disabled={!isValid && !dirty} onClick={handleSubmitData} variant="contained" className='bg-primary'>
                                                    Submit
                                                </Button>
                                            </Box>
                                            
                                        </Box>
                                    </Form>
                                )}
                            </Formik>          
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </main>
    );
}

export default AddModel;

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