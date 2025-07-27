import 'react-toastify/dist/ReactToastify.css';
import React, { useContext, useEffect, useState } from "react";
import { LanguageDirectionContext } from "@/helpers/langDirection";
import ContactForm from "@/components/ContactForm";
import Typography from '@mui/material/Typography';
import { Email, LocalPhone, Place } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from "next/link";
import Card from '@mui/material/Card';
import CrudComponent from "@/helpers/CRUD";

interface DataProps{
    _id: string,
    image: string,
    page: string
}

const Contact: React.FC = () => {
    const { isRTL } = useContext(LanguageDirectionContext);
    const apiEndpoint = `${process.env.BACKEND}background`;
    const [Data, setData] = useState<DataProps[]>()
    const [AboutObject, setAboutObject] = useState<DataProps>()
    const [type, setType] = useState<'image' | 'video' | null>()
    const {
      data,
      fetchData,
    } = CrudComponent({ apiEndpoint: `${process.env.BACKEND}` });
  
    useEffect(() => {
      fetchData(apiEndpoint, "Background Images")
    }, [apiEndpoint]);
  
    useEffect(() => {
      setData(data as any);
    }, [data]);
  
    useEffect(() => {
      // Filter the Data array to get the object where the page value is 'about'
      const aboutData = Data?.filter((item) => item.page === 'contact') || [];
  
      // Check if there's any data after filtering
      if (aboutData.length > 0) {
        // Assuming you want to get the first object if there are multiple
        const firstAboutItem = aboutData[0];
        // Do something with the filtered data...
        setAboutObject(firstAboutItem)
      }
  
      
    }, [Data]);
  
    useEffect(() => {
      // Function to determine the type of URL (image or video)
      const determineType = (url: any) => {
        if (url?.endsWith('.mp4') || url?.endsWith('.wav')) {
          setType('video');
        } else if (url?.endsWith('.png') || url?.endsWith('.jpg') || url?.endsWith('.jpeg') || url?.endsWith('.gif') || url?.endsWith('.webp')) {
          setType('image');
        } else {
          // Default to null if the type cannot be determined
          setType(null);
        }
      };
  
      determineType(AboutObject?.image)
    }, [Data, AboutObject]);
    return (  
        <div dir={isRTL? 'rtl' : 'ltr'} className={"min-h-screen bg-secondary flex flex-col items-center text-white space-y-8 "}>
            <div className="min-h-[79vh] border-b-4 border-white w-screen relative bg-cover bg-center flex items-center justify-center"
                style={{backgroundImage: type === 'image'? `url("${AboutObject?.image}")`: 'transparent'}}
        >
                {type === 'video' && AboutObject?.image && (
                    <video autoPlay muted loop className="min-h-[78vh] max-h-[78vh] w-full w-screen absolute inset-0 object-cover">
                        <source src={AboutObject?.image} type="video/mp4" />
                    </video>
                )}
                <div className={`absolute inset-0 bg-secondary opacity-50`}></div>
                <div className={`flex flex-col items-center ${isRTL? 'space-y-4' : ''} justify-center z-[3]`}>
                    <Typography textAlign={'center'} variant="h1" className="text-white">
                        <FormattedMessage id='navbar.contact' />
                    </Typography>

                    <Breadcrumbs className="text-gray-300" aria-label="breadcrumb">
                        <Link href="/" className="hover:text-white">
                            <FormattedMessage id='navbar.home' />
                        </Link>
                        <Typography color=""><FormattedMessage id='navbar.contact' /></Typography>
                    </Breadcrumbs>
                </div>
            </div>

            <div className="bg-secondary w-full px-2 md:px-0 space-y-6 py-20 grid place-items-center lg:py-32">
                <Card className='grid place-items-center md:w-10/12 gap-8'>
                    <div className='w-full'>
                        <video autoPlay muted loop className='w-full'>
                            <source src='/Contact-1080p.mp4' type='video/mp4'/>
                        </video>
                    </div>

                    <div className='grid grid-cols-2 place-items-center w-full'>

                        <div className='w-10/12 md:w-full grid place-items-center'>
                            <div className=''>
                                <ContactForm />
                            </div>
                        </div>

                        <div className='w-full h-full space-y-8'>
                            <div className='grid md:grid-cols-3 gap-4 place-items-center'>
                                <div className='space-x-2 grid place-items-center gap-4'>
                                    <Place className='text-3xl text-primary md:mt-6'/>
                                    <Typography textAlign={'center'} className={`${isRTL? 'pr-2' : ''}`}>
                                        <FormattedMessage id='company.address' />
                                    </Typography>
                                </div>

                                <div className='space-x-2 grid place-items-center gap-4'>
                                    <LocalPhone className='text-3xl text-primary'/>
                                    <div dir='ltr'>
                                        <Typography textAlign={'center'} className={`${isRTL? 'pr-2' : ''}`}>
                                            {isRTL? "۱٦۳۲۱" : 16321 }
                                        </Typography>
                                    </div>
                                </div>

                                <div className='space-x-2 grid place-items-center gap-4'>
                                    <Email className='text-3xl text-primary'/>
                                    <Typography textAlign={'center'} className={`${isRTL? 'pr-2' : ''}`}>
                                        info@ibtkaree.com
                                    </Typography>
                                </div>
                            </div>
                        <iframe
                            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1550.0467958740708!2d31.51576106981842!3d30.022513502366273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145822160cae7185%3A0x503d5a511ab5617f!2z2KXYqNiq2YPYp9ixINmE2YTYqti32YjZitixINin2YTYudmC2KfYsdmKIC0gSUJUS0FSIERFVkVMT1BNRU5UUw!5e0!3m2!1sen!2seg!4v1705395815162!5m2!1sen!2seg'
                            className="w-full h-[72%]"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="eager"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
         
                    </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default Contact;