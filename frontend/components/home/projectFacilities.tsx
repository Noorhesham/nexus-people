import Typography from '@mui/material/Typography';
import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FormattedMessage } from 'react-intl';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent } from '@mui/material';

const ProjectFacilities = () => {
    const isSmallScreen = useMediaQuery('(min-width:600px)');
    const { isRTL } = React.useContext(LanguageDirectionContext);
    const controls = useAnimation();
    const ref = React.useRef(null)
    const inView = useInView(ref)

    const variants = {
      hidden: { opacity: 0, y: 100 },
      visible: { opacity: 1, y: 0 },
      // exit: { opacity: 0, y: 100 },
    };

    const sectionVariant= {
      hidden: { opacity: 0,  transition: { delay: 0, duration: 0 }  },
      visible: { opacity: 1 },
      // exit: { opacity: 0,  transition: { delay: 0, duration: 0 } },
  }

    React.useEffect(() => {
      if (inView) {
        controls.start('visible');
      }
      // else {
      //   controls.start('hidden')
      // }
    }, [inView, controls]);

    return (  
      <main ref={ref} dir={isRTL? 'rtl' : 'ltr'} id='project' className="min-h-screen bg-white px-4 md:px-20 py-8">
        <motion.div
          key="motionDiv"
          initial="hidden"
          animate={controls}
          variants={variants}
          transition={{ duration: 1.5 }}
          // exit="exit"
          className='space-y-8'
        >
          <Typography textAlign={'center'} variant='h2'>
            <FormattedMessage id='project.facilities' />
          </Typography>
          <ImageList className='' variant="standard" cols={isSmallScreen? 5:2} gap={20}>
            {itemData.map((item, i) => (
                <ImageListItem key={i} className='pb-2'>
                  <motion.div
                    key={i}
                    initial="hidden"
                    animate={controls}
                    variants={sectionVariant}
                    transition={{ delay: i /2 , duration: 0.5 }}
                    // exit={{ opacity: 0,  transition: { delay: 0, duration: 0 } }}
                  >
                    <Card className={`${i%2 !==0? 'pt-4' : 'pb-4'} space-y-4`}>
                    {i%2 !==0? (<Typography variant='h5' textAlign={'center'}>
                          {isRTL? item.title.ar: item.title.en}
                      </Typography>):null}
                      <Image
                          src={`${item.img}`}
                          alt={isRTL? item.title.ar: item.title.en}
                          width={600}
                          height={600}
                      />
                      {/* <ImageListItemBar position={i %2 ==0? 'top' : 'bottom'} title={item.title} /> */}
                      {i%2 ==0? (<Typography variant='h5' textAlign={'center'}>
                        {isRTL? item.title.ar: item.title.en}
                      </Typography>):null}                        
                    </Card>
                  </motion.div>
                </ImageListItem>
            ))}
          </ImageList>
        </motion.div>
      </main>
    );
}
 
export default ProjectFacilities;



const itemData = [
  {
    img: '/facilities/Two-Level-Parking.webp',
    title: { ar: 'موقف سيارات متعدد الطوابق', en: 'Two level parking' },
  },
  {
    img: '/facilities/water-Features.webp',
    title: { ar: 'ميزات مائية', en: 'Water features' },
  },
  {
    img: '/facilities/Smart-Gates.webp',
    title: { ar: 'بوابات ذكية', en: 'Smart gates' },
  },
  {
    img: '/facilities/Safety-and-security.webp',
    title: { ar: 'السلامة والأمان', en: 'Safety and security' },
  },
  {
    img: '/facilities/cctv.webp',
    title: { ar: 'كاميرات المراقبة بدقة عالية على مدار الساعة', en: '24/7 CCTV surveillance cameras' },
  },
  // {
  //   img: '/facilities/Security-Cam.webp',
  //   title: { ar: 'ميزات المباني الذكية', en: 'Smart building features' },
  // },
  {
    img: '/facilities/Smart-Systems.webp',
    title: { ar: 'أنظمة ذكية فعالة من حيث استهلاك الطاقة', en: 'Smart Energy efficient systems' },
  },
  {
    img: '/facilities/Modern-Interior-Finishes.webp',
    title: { ar: 'تشطيبات داخلية عصرية', en: 'Modern interior finishes' },
  },
  {
    img: '/facilities/Large-Storefront-windows.webp',
    title: { ar: 'نوافذ المعرض الكبيرة', en: 'Large storefront windows' },
  },
  {
    img: '/facilities/Retail-Plaza.webp',
    title: { ar: 'ساحة بيع بالتجزئة', en: 'Retail Plaza' },
  },
  {
    img: '/facilities/Outdoor-Areas.webp',
    title: { ar: 'مناطق خارجية', en: 'Outdoor areas' },
  },
  // {
  //   img: '/facilities/Security Cam.jpg',
  //   title: { ar: 'تصميم يسهل الوصول إليه', en: 'Accessible design' },
  // },
];
