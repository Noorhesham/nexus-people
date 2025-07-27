import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState } from 'react';
import { FormattedMessage } from "react-intl";
import { mod } from 'react-swipeable-views-core';
import { autoPlay } from 'react-swipeable-views-utils';
import useMediaQuery from '@mui/material/useMediaQuery';
import SwipeableViews from 'react-swipeable-views';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import Image from "next/image";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const Shots = () => {
    const { isRTL } = useContext(LanguageDirectionContext);
    const [activeStep, setActiveStep] = useState(0);
    const [maxSteps, setMaxSteps] = useState(2);
    const screenSize = useMediaQuery('(min-width:600px)') ? 'sm' : 'xs';
    const numImagesPerSlide = { xs: 1, sm: 3, md: 3, lg: 3, xl: 3 }[screenSize];
  
    useEffect(() => {
      setMaxSteps(Math.ceil(Images?.length / numImagesPerSlide));
    }, [Images]);
  
    const handleStepChange = (step: number) => {
      setActiveStep(mod(step, Math.ceil(Images?.length / numImagesPerSlide)));
    };

    function slideRenderer(params: any) {
        const { index, key } = params;
    
        return (
          <div key={key}>
            <div dir={isRTL? 'rtl' : 'ltr'} key={index} className='grid w-full grid-cols-1 place-items-center gap-2'>
              <div className='grid gap-4 md:grid-cols-3 w-full'>
                {Images.slice(index * numImagesPerSlide, (index + 1) * numImagesPerSlide).map((image, i: number) => (
                  <div key={i} className='flex flex-col justify-center px-4 items-center'>
                    <Image src={image} alt={'Interior'} width={1000} height={1000} className='rounded-xl h-80 min-[1800px]:h-[500px]' />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
    
    return (  
        <div id="interior" className="w-full space-y-4 md:pt-16">
        <Typography textAlign={'center'} variant="h2">
            <FormattedMessage id="project.interior" />
        </Typography>
        <AutoPlaySwipeableViews
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
        >
            {Array.from({ length: maxSteps }).map((_, index) => (
                <div key={index}>{slideRenderer({ index, key: index })}</div>
            ))}
        </AutoPlaySwipeableViews>
    </div>
    );
}
 
export default Shots;

const Images = [
    '/3d/1.webp',
    '/3d/2.webp',
    '/3d/3.webp',
    '/3d/7.webp',
    '/3d/8.webp',
    '/3d/9.webp',
    '/3d/10.webp',
    '/3d/11.webp',
    '/3d/12.webp',
    '/3d/13.webp',
    '/3d/14.webp',
    '/3d/15.webp',
]