import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { FormattedMessage } from 'react-intl';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useContext, useState } from 'react';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
};

const ProjectInfo = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { isRTL } = useContext(LanguageDirectionContext);
    const controls = useAnimation();
    const ref = React.useRef(null)
    const inView = useInView(ref)

    const variants = {
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 100 },
    };

    const sectionVariant= {
        hidden: { opacity: 0,  transition: { delay: 0, duration: 0 }  },
        visible: { opacity: 1 },
        exit: { opacity: 0,  transition: { delay: 0, duration: 0 } },
    }

    React.useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
        // else {
        //     controls.start('hidden')
        // }
    }, [inView, controls]);

    const matches = useMediaQuery('(min-width:600px)');

    const handleDownloadBrochure = async () => {
        try {
            // Get the PDF URL from the API
            const response = await axios.get(`${process.env.BACKEND}portfolio/Home`);
            const pdfUrl = response.data?.portfolio[0]?.portfolio?.pdf;
    
            // Check if PDF URL exists
            if (pdfUrl) {
                // Fetch the PDF content as a Blob
                const pdfBlob = await axios.get(pdfUrl, { responseType: 'blob' });
                // Create a Blob URL for the PDF content
                const blobUrl = URL.createObjectURL(pdfBlob.data);
                // Create a temporary anchor element
                const link = document.createElement('a');
                link.href = blobUrl;
                // Set the download attribute to specify the filename
                link.setAttribute('download', 'Portfolio.pdf');
                // Simulate a click on the anchor element to trigger the download
                document.body.appendChild(link);
                link.click();
                // Cleanup: revoke the Blob URL
                URL.revokeObjectURL(blobUrl);
                // Cleanup: remove the anchor element
                document.body.removeChild(link);
            } else {
                console.error('PDF URL not found in the API response');
            }
        } catch (error) {
            console.error('Error downloading brochure:', error);
        }
    };
    

    return (  
        <main ref={ref} dir={isRTL? 'rtl' : 'ltr'} id='project' className="bg-white grid place-items-center min-h-screen py-8">
            <AnimatePresence mode='wait'>

                <motion.div key="motionDiv"
                    initial="hidden"
                    animate={controls}
                    variants={variants}
                    transition={{ duration: 1.5 }}
                    exit="exit" 
                    className='grid gap-8'
                >

                <div className="grid md:grid-cols-3 gap-4 gap-y-12">
                    <div className='px-4 md:px-8 flex flex-col items-center  space-y-4 md:space-y-4'>
                        <Image src={'/nexus.svg'} alt='Nexus' width={400} height={200} />
                        <Button variant='contained' onClick={handleDownloadBrochure} className={`bg-secondary hover:bg-primary text-white transition duration-300 ease relative w-11/12  ${isRTL? 'md:mx-24' : 'md:right-0'}`}>
                            <FormattedMessage id='brochure.download'/>
                        </Button>
                    </div>

                    <div className="md:col-span-2 px-8 md:px-4 py-4 space-y-4">
                        <Typography  fontSize={matches? 35 : 34.7} variant='h2' className='text-primary'>
                            {isRTL? "مكان مبتكر للتواصل" : "Innovative Spot to Connect"}
                        </Typography>
                        <Typography className={`${isRTL? 'md:pl-16' : 'md:pr-16'}`}  lineHeight={2} variant='h6'>
                            {isRTL? Description.ar : Description.en}
                        </Typography>
                    </div>

                    <motion.div
                        key="Section-1"                    
                        initial="hidden"
                        animate={controls}
                        variants={sectionVariant}
                        transition={{ delay: 1, duration: 1 }}
                        exit={{ opacity: 0,  transition: { delay: 0, duration: 0 } }}
                    >
                        <div dir='ltr'>
                            <Typography variant='h6' textAlign={'center'} className='[text-shadow:_1px_1px_0px_rgb(0_0_0_/_40%)]' fontSize={40}>
                                2841 m<sup>2</sup>
                            </Typography>
                        </div>

                        <Typography textAlign={'center'} variant='h4'>
                            <FormattedMessage id='project.area'/>
                        </Typography>
                    </motion.div>

                    <motion.div
                        key="Section-2"                    
                        initial="hidden"
                        animate={controls}
                        variants={sectionVariant}
                        transition={{ delay: 2, duration: 1 }}
                        exit={{ opacity: 0,  transition: { delay: 0, duration: 0 } }}
                        className='px-4'
                    >
                        <Typography variant='h6' textAlign={'center'} className='[text-shadow:_1px_1px_0px_rgb(0_0_0_/_40%)]' fontSize={40}>
                            7
                        </Typography>
                        <Typography textAlign={'center'} variant='h4'>
                            <FormattedMessage id='project.floors' />
                        </Typography>
                    </motion.div>

                    <motion.div
                        key="Section-3"                    
                        initial="hidden"
                        animate={controls}
                        variants={sectionVariant}
                        transition={{ delay: 3, duration: 1 }}
                        exit={{ opacity: 0,  transition: { delay: 0, duration: 0 } }}
                        className='px-4'
                    >
                        <Typography variant='h6' textAlign={'center'} className='[text-shadow:_1px_1px_0px_rgb(0_0_0_/_40%)]' fontSize={40} >
                            2
                        </Typography>
                        <Typography textAlign={'center'} variant='h4'>
                            <FormattedMessage id='project.parking' />
                        </Typography>
                    </motion.div>
                </div>

                <div className="grid w-full text-white gap-8 my-12 py-8 bg-secondary bg-[url('/lightPattern.png')]">
                    <div>
                        <Typography textAlign={'center'} fontSize={35} variant='h2' letterSpacing={isRTL? 0:4} className='animate-pulse'>
                            <FormattedMessage id='project.closer' />
                        </Typography>
                    </div>

                    <div className='grid place-items-center md:grid-cols-4 gap-4'>
                        <motion.div 
                            key="Section-4"                    
                            initial="hidden"
                            animate={controls}
                            variants={sectionVariant}
                            transition={{ delay: 4, duration: 1 }}
                            exit={{ opacity: 0,  transition: { delay: 0, duration: 0 } }}
                            className='px-4 cursor-pointer w-fit hover:text-primary' onClick={handleOpen}
                        >
                            <Typography fontSize={40} textAlign={'center'} variant='h6' className='[text-shadow:_1px_1px_0px_rgb(0_0_0_/_40%)]'>
                                1&nbsp;
                            </Typography>
                            <Typography variant='h5' textAlign={'center'} className='w-60 sm:w-32 lg:w-40'>
                                {isRTL? 'دقيقة من فندق دوسيت' : 'Minute From Dusit Hotel'}
                            </Typography>
                        </motion.div>

                        <motion.div 
                            key="Section-5"                    
                            initial="hidden"
                            animate={controls}
                            variants={sectionVariant}
                            transition={{ delay: 5, duration: 1 }}
                            exit={{ opacity: 0,  transition: { delay: 0, duration: 0 } }} 
                            className='px-4 cursor-pointer w-fit hover:text-primary' onClick={handleOpen}
                        >
                            <Typography fontSize={40} textAlign={'center'} variant='h6' className='[text-shadow:_1px_1px_0px_rgb(0_0_0_/_40%)]' >
                                5&nbsp;
                            </Typography>
                            <Typography variant='h5' textAlign={'center'} className='w-60 sm:w-32 lg:w-40'>
                                {isRTL? 'دقائق من الجامعة الامريكية' : 'Minutes From The AUC'}
                            </Typography>
                        </motion.div>

                        <motion.div 
                            key="Section-6"                    
                            initial="hidden"
                            animate={controls}
                            variants={sectionVariant}
                            transition={{ delay: 6, duration: 1 }}
                            exit={{ opacity: 0,  transition: { delay: 0, duration: 0 } }}
                            className='px-4 cursor-pointer w-fit hover:text-primary' onClick={handleOpen}
                        >
                            <Typography fontSize={40} textAlign={'center'} variant='h6' className='[text-shadow:_1px_1px_0px_rgb(0_0_0_/_40%)]'>
                                10&nbsp;
                            </Typography>
                            <Typography variant='h5' textAlign={'center'} className='w-60 sm:w-32 lg:w-40'>
                                {isRTL? 'دقائق من منطقة النوادي' : 'Minutes From Clubs Area '}
                            </Typography>
                        </motion.div>

                        <motion.div 
                            key="Section-6"                    
                            initial="hidden"
                            animate={controls}
                            variants={sectionVariant}
                            transition={{ delay: 7, duration: 1 }}
                            exit={{ opacity: 0,  transition: { delay: 0, duration: 0 } }}
                            className='px-4 cursor-pointer w-fit hover:text-primary' onClick={handleOpen}
                        >
                            <Typography fontSize={40} textAlign={'center'} variant='h6' className='[text-shadow:_1px_1px_0px_rgb(0_0_0_/_40%)]'>
                                10&nbsp;
                            </Typography>
                            <Typography variant='h5' textAlign={'center'} className='w-60 sm:w-32 lg:w-40'>
                                {isRTL? 'دقائق من الطريق الدائري' : 'Minutes From ring road'}
                            </Typography>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="rounded-xl w-11/12 md:w-8/12 lg:w-6/12" sx={style}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3454.362090524099!2d31.4655146!3d30.0264682!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145823dfcc15ea0d%3A0xeebd01f17acd6fff!2sNexus%20Business%20HUB!5e0!3m2!1sar!2seg!4v1710871154912!5m2!1sar!2seg"                        className="w-full h-96 rounded-xl"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="eager"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </Box>
            </Modal>
            </AnimatePresence>
        </main>
    );
}
 
export default ProjectInfo;

const Description = {
    ar: 'مرحبًا بك في مولنا الذكي المبتكر، حيث تتقاطع التكنولوجيا الحديثة مع الراحة الفائقة. يتميز مولنا بتصميم مبتكر تم تصميمه بعناية ليتسع لمجموعة متنوعة من الاحتياجات، مما يجعل الوحدات الإدارية والطبية والتجارية تندمج بسلاسة. تم تجهيز كل وحدة بعناية فائقة بميزات ذكية على أحدث مستوى، مما يضع معايير جديدة للكفاءة وتجربة المستخدم.',
    en: 'Welcome to our groundbreaking smart mall, where cutting-edge technology intersects with unparalleled convenience. Our mall boasts an innovative design meticulously crafted to accommodate a wide array of requirements, seamlessly blending administrative, medical, and commercial units. Each unit is meticulously outfitted with top-of-the-line smart features, setting new standards for efficiency and user experience.'
}