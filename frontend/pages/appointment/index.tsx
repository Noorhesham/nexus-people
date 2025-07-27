import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Button } from '@mui/material';
import { useContext, useEffect, useState } from "react";
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import CardActions from '@mui/material/CardActions';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormattedMessage, useIntl } from 'react-intl';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import CrudComponent from "@/helpers/CRUD";
import { AuthContext } from '@/helpers/AuthContext';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Formik, Form, ErrorMessage, Field, FormikHelpers } from 'formik';
import * as Yup from "yup";
import axios from 'axios';

interface values {
    mainType: string,
    secondaryType: {
        en: string
    },
    name: string;
    email: string;
    phone: string;
    message: string;
} 

interface RenderProps {
    render: boolean
}

interface modelProps {
    model: {
        _id: string
        mainType: string;
        secondaryType: { ar?: string; en?: string; };
        details: {
        images: string[],
        length: number,
        width: number,
        height: number,
        squareMeter: number,
        description: { ar?: string; en?: string; };
        }
    }
  }

const Options = [
    { value: 'Commercial', name: <FormattedMessage id='floor.commercial'/>},
    { value: 'Medical', name: <FormattedMessage id='floor.medical'/>},
    { value: 'Administrative', name: <FormattedMessage id='floor.adminstrative'/>},
]

const Appointment: React.FC<RenderProps> = ({render}) => {
    const { isRTL } = useContext(LanguageDirectionContext);
    const [selectedType, setSelectedType] = useState('Commercial');
    const [selectedUnit, setSelectedUnit] = useState('')
    const [loading, setLoading] = useState(false);
    const {user} = useContext(AuthContext)
    const modelApiEndpoint = `${process.env.BACKEND}mall/get/data`;
    const {formatMessage} = useIntl();
    const [models, setModels] = useState<modelProps[]>([])
    const [filteredModels, setFilteredModels] = useState<modelProps[]>([]);
    
    const {
      handleSubmit,
      handleInputChange
    } = CrudComponent({});

    useEffect(() => {
        const fetchModels = async () => {
            try {
                await axios.get(modelApiEndpoint).then((res) => {
                    setModels(res.data.mall as  modelProps[])
                })                 
            } catch (error) {
            
            }

        }
        fetchModels()
    }, [])

    const validationSchema = Yup.object({
        name: Yup.string().min(3).max(50).required(formatMessage({ id: 'contact.name.error' })),
        email: Yup.string().email(formatMessage({ id: 'contact.email.invalid' })).required(formatMessage({ id: 'contact.email.error' })),
        phone: Yup.string().matches(/^\+(?:[0-9] ?){6,14}[0-9]$/, formatMessage({ id: 'contact.phone.invalid' }))
            .required(formatMessage({ id: 'contact.phone.error' })),
        message: Yup.string().min(5).max(350).required(formatMessage({ id: 'contact.message.error' }))
    });

    const initialValues = {
        mainType: '',
        secondaryType: {
            en: ""
        },
        name: "",
        email: "",
        phone: "",
        message: ""
    };
    
    const handleSubmitData = async (values: values, { resetForm }: FormikHelpers<values>) => {
        validationSchema
            .validate(values)
            .then(async () => {
                handleSubmit(`${process.env.BACKEND}appointment`, false).then(() => {
                    toast.success(formatMessage({ id: 'contact.toast.success' }));
                    resetForm();
                })
            })
            .catch(() => {
                toast.error(formatMessage({ id: 'contact.toast.error' }));
            });
    };

    const filterModelsByType = (models: modelProps[], selectedType: string) => {
        return models?.filter((model) => model.model.mainType === selectedType);
    };

    useEffect(() => {
        setFilteredModels(filterModelsByType(models, selectedType));
    }, [models, selectedType]);

    return (  
        <main dir={isRTL? 'rtl' : 'ltr'} className={render? '' : "min-h-screen bg-darkGrey"}>
            <div className="min-h-[60vh] w-screen relative bg-cover bg-center flex items-center justify-center"
                style={{backgroundImage: 'url("/3d/10.webp")'}}
            >
                <div className={`absolute inset-0 bg-secondary opacity-50`}/>
                <div className={`flex flex-col items-center ${isRTL? 'space-y-4' : ''} justify-center z-[3]`}>
                    <Typography textAlign={'center'} fontSize={isRTL? 150 : 60} fontWeight={'normal'} variant={'h1'} className="text-white">
                        <FormattedMessage id='navbar.appointment'/>
                    </Typography>

                    <Breadcrumbs className="text-gray-300" aria-label="breadcrumb">
                        <Link href="/" className="hover:text-white">
                            <FormattedMessage id='navbar.home' />
                        </Link>
                        <Typography color=""><FormattedMessage id='navbar.appointment'/></Typography>
                    </Breadcrumbs>
                </div>
            </div>

            <div className="whiteUp grid place-items-center bg-secondary py-20">
                <Card className={`${render? 'w-full' : "w-10/12 sm:w-8/12 lg:w-4/12 py-8 grid place-items-center"}`}>
                    <CardContent className="grid place-items-center w-full space-y-8">
                        {render? null : (
                            <Divider className="w-10/12">
                                <Typography variant="h4">
                                    <FormattedMessage id='appointment.book' />
                                </Typography>
                                <Typography variant="subtitle1">
                                    <FormattedMessage id='appointment.fill' />
                                </Typography>
                            </Divider>
                        )}

                        <div dir={isRTL? 'rtl' : 'ltr'} className="space-y-8 grid w-10/12 place-items-center">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmitData}
                            >
                                <Form className="space-y-5 w-full">

                                    <Field name='mainType'>
                                        {({ field }: any) =>(
                                            <div className="text-secondary space-y-2">
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label">{<FormattedMessage id='floor.selectType'/>}</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        name='mainType'
                                                        value={selectedType}
                                                        {...field}
                                                        label={<FormattedMessage id='floor.selectType'/>}          
                                                        onChange={(e) => {field.onChange(e); handleInputChange('mainType', e.target.value, false); setSelectedType(e.target.value as string)}}
                                                        >
                                                        {Options.map((option, index) => (
                                                            <MenuItem key={index} value={option.value}>
                                                                {option.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>                              
                                        )}
                                    </Field>

                                    <Field name='secondaryType.en'>
                                        {({ field }: any) =>(
                                            <div className="text-darkBlue space-y-2">
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label">{<FormattedMessage id='floor.selectModel'/>}</InputLabel>
                                                    <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={selectedUnit}
                                                    name='secondaryType.en'
                                                    {...field}
                                                    disabled={selectedType === ''}
                                                    label={<FormattedMessage id='floor.selectModel'/>}          
                                                    onChange={(e) => {field.onChange(e); handleInputChange('secondaryType.en', e.target.value, false); setSelectedUnit(e.target.value as string)}}
                                                    >
                                                        {filteredModels?.map((model, index) => (
                                                            <MenuItem key={index} value={model.model.secondaryType.en}>
                                                                {isRTL? model.model.secondaryType.ar : model.model.secondaryType.en}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>                                  
                                        )}
                                    </Field>
                                    
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
                                            </div>                                    
                                        )}

                                    </Field>
                                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />

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
                                            </div>                                  
                                        )}

                                    </Field>
                                    <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />

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
                                            </div>
                                        )}

                                    </Field>
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />

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
                                            </div>
                                        )}

                                    </Field>
                                    <ErrorMessage name="message" component="div" className="text-red-500 text-sm mt-1" />

                            <CardActions className='w-full grid place-items-center'>
                        {loading ? (
                            <LoadingButton
                                variant='contained'
                                loading={loading}
                                className='bg-secondary text-white p-3 hover:bg-primary hover:text-secondary'
                            >
                                <span>
                                    <Typography variant='button'>
                                        <FormattedMessage id='appointment.book' />
                                    </Typography>
                                </span>

                            </LoadingButton>
                        ) : (
                            <Button
                                variant='contained'
                                type='submit'
                                // onClick={(e) => handleSendData}
                                disabled={
                                    !selectedType ||
                                    !selectedUnit  
                                
                                }
                                className='bg-secondary text-white p-3 hover:bg-primary'
                            >
                                <Typography variant='button'>
                                    <FormattedMessage id='appointment.book' />
                                </Typography>
                            </Button>
                        )}
                    </CardActions>

                                </Form>
                            </Formik>

                        </div>
                    </CardContent>

                </Card>
            </div>

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
                theme="light"
            />
        </main>
    );
}

export default Appointment;