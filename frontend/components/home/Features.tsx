import React, { useContext, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { AcUnit, AutoFixHigh, Camera, EmojiObjects, Lock, RollerShades, Sensors, SettingsRemote, SmartScreen, Tv, Videocam } from '@mui/icons-material';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { FormattedMessage } from 'react-intl';
import { useInView } from "framer-motion"
import Button from '@mui/material/Button';

interface FeatureProps {
    changeStep: React.Dispatch<React.SetStateAction<number>>;
}

const Features : React.FC<FeatureProps> = ({changeStep}) => {
    const { isRTL } = useContext(LanguageDirectionContext);
    const controls = useAnimation();
    const ref = useRef(null)
    const inView = useInView(ref)

    const variants = {
        hidden: { opacity: 0, x: isRTL ? -100 : 100 },
        visible: { opacity: 1, x: 0 },
        // exit:  { opacity: 0, x: isRTL ? -100 : 100 },

    };

    React.useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
        // else {
        //     controls.start('hidden')
        // }
    }, [inView, controls]);

    return (  
        <div
            ref={ref}
            dir={isRTL ? 'rtl' : 'ltr'}
            className="h-full  text-white py-8 px-2 md:px-16"
        >

            <div className="relative h-full overflow-hidden flex justify-center z-5" >
                
                <motion.div className="space-y-8 h-full grid place-items-center py-8"
                    initial="hidden"
                    animate={controls}
                    variants={variants}
                    transition={{ duration: 1 }}
                >
                    <div className='space-y-4 flex flex-col justify-center md:px-8'>
                        <Typography textAlign={'center'} variant='h2'>
                            <FormattedMessage id='home.smart'/>
                        </Typography>
                        <Typography textAlign={'center'} className='w-full lg:w-[40rem]'>
                            <FormattedMessage id='features.description'/>
                        </Typography>
                    </div>

                    <div className={`lg:w-1/2 grid place-items-center grid-cols-3 gap-4 md:gap-10`}>

                        <div className={`space-y-6 flex flex-col items-center ${isRTL? 'ml-8' : ''}`}>
                            <IconButton title={''} className='bg-white md:scale-[1.15] w-16 h-16 hover:bg-white hover:text-primary' sx={{boxShadow: 3}}>
                                <EmojiObjects className='text-4xl'/>
                            </IconButton>
                            <Typography className='text-center'>
                                <FormattedMessage id='smart.light' />
                            </Typography>
                        </div>

                        <div className={`space-y-6 flex flex-col items-center ${isRTL? 'ml-8' : ''}`}>
                            <IconButton title='' className='bg-white md:scale-[1.15] w-16 h-16 hover:bg-white hover:text-primary' sx={{boxShadow: 3}}>
                                <Lock className='text-4xl'/>
                            </IconButton>
                            <Typography className='text-center'>
                                <FormattedMessage id='smart.lock' />
                            </Typography>
                        </div>

                        <div className={`space-y-6 flex flex-col items-center ${isRTL? 'ml-8' : ''}`}>
                            <IconButton title='' className='bg-white  md:scale-[1.15] w-16 h-16 hover:bg-white hover:text-primary' sx={{boxShadow: 3}}>
                                <RollerShades className='text-4xl'/>
                            </IconButton>
                            <Typography className='text-center'>
                                <FormattedMessage id='smart.blinds' />
                            </Typography>
                        </div>

                        <div className={`space-y-6 flex flex-col items-center ${isRTL? 'ml-8' : ''}`}>
                            <IconButton title='' className={`bg-white md:scale-[1.15] w-16 h-16 hover:bg-white hover:text-primary ${isRTL? '' : ''} `} sx={{boxShadow: 3}}>
                                <AcUnit className='text-4xl'/>
                            </IconButton>
                            <Typography className='text-center'>
                                <FormattedMessage id='smart.ac' />
                            </Typography>
                        </div>

                        <div className={`space-y-6 flex flex-col items-center ${isRTL? 'ml-8' : ''}`}>
                            <IconButton title='' className='bg-white  md:scale-[1.15] w-16 h-16 hover:bg-white hover:text-primary' sx={{boxShadow: 3}}>
                                <Videocam className='text-4xl'/>
                            </IconButton>
                            <Typography className='text-center'>
                                <FormattedMessage id='smart.cctv' />
                            </Typography>
                        </div>

                        <div className={`space-y-6 flex flex-col items-center ${isRTL? 'ml-8' : ''}`}>
                            <IconButton title='' className='bg-white md:scale-[1.15] w-16 h-16 hover:bg-white hover:text-primary' sx={{boxShadow: 3}}>
                                <Sensors className='text-4xl'/>
                            </IconButton>
                            <Typography className='text-center'>
                                <FormattedMessage id='smart.sensor' />
                            </Typography>
                        </div>
                    </div>

                    <div>
                        <Button endIcon={<AutoFixHigh/>} onClick={() => changeStep(1)} className='bg-white text-gray-700 hover:text-primary hover:bg-white px-8 hover:scale-[1.2] transition duration-300 ease'>
                            <FormattedMessage id='feature.button' />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Features;
