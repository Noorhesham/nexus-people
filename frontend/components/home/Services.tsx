import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from 'react-intl';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import Link from 'next/link';
import Image from 'next/image';

export default function Services() {
    const { isRTL } = React.useContext(LanguageDirectionContext);
    const smallScreen = useMediaQuery('(min-width:770px)');
    const controls = useAnimation();
    const ref = React.useRef(null)
    const inView = useInView(ref)

    const variants = {
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
        // exit: { opacity: 0, y: 100 },
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
        <main dir={isRTL? 'rtl' : 'ltr'} id='services' ref={ref} className='w-full grid place-items-center min-h-screen bg-white py-20 md:py-0'>
            <AnimatePresence mode='wait'>
                <motion.div
                    key="motionDiv"
                    initial="hidden"
                    animate={controls}
                    variants={variants}
                    transition={{ duration: 1 }}
                    // exit="exit"  // Add exit animation
                    className='grid place-items-center gap-6 md:gap-20'
                >
                    <div className='w-full flex justify-center'>
                        <Typography fontSize={35} variant='h2'>
                            <FormattedMessage id='floor.plans'/>
                        </Typography>
                    </div>
                    <div className='px-8 md:px-20'>
                        <ImageList cols={smallScreen? 3 : 1} gap={smallScreen? 40 : 20} className='overflow-visible'>
                            {itemData.map((item, i) => (
                                <Link key={i} href={item.link} className='relative hover:scale-[1.1] transition durtion-300 ease'>
                                    <ImageListItem className='cursor-pointer grayscale hover:grayscale-0 transition durtion-300 ease ' key={item.img}>
                                        <Image
                                            src={`${item.img}`}
                                            loading="lazy"
                                            alt={item.link}
                                            width={600}
                                            height={600}
                                            className='rounded-xl'
                                        />
                                        <ImageListItemBar
                                            className='bg-transparent'
                                            title={item.title}
                                            position="bottom"
                                            sx={{ ".MuiImageListItemBar-title": {
                                                fontSize: 32
                                            } }} 
                                        />
                                    </ImageListItem>
                                </Link>

                            ))}
                        </ImageList>
                    </div>
                </motion.div>
            </AnimatePresence>
        </main>
    );
}

const itemData = [
  {
    img: '/Admin Cover.jpg',
    title: <FormattedMessage id='floor.adminstrative'/>,
    link: '/adminstrative'
  },
  {
    img: '/Medical Cover.jpg',
    title: <FormattedMessage id='floor.medical'/>,
    link: '/medical'
  },
  {
    img: '/Comm Cover.jpg',
    title: <FormattedMessage id='floor.commercial'/>,
    link: '/commercial'
  },
];
