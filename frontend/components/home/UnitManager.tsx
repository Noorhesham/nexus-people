import React, { useContext } from 'react';
import Typography from '@mui/material/Typography';
import { autoPlay } from 'react-swipeable-views-utils';
import SwipeableViews from 'react-swipeable-views';
import useMediaQuery from '@mui/material/useMediaQuery';
import { mod } from 'react-swipeable-views-core';
import { useEffect } from 'react';
import Image from 'next/image';
import { FormattedMessage } from 'react-intl';
import CrudComponent from "@/helpers/CRUD";
import { LanguageDirectionContext } from '@/helpers/langDirection';

interface Service {
  _id: string,
  imageCover: string,
  title: {
    ar: string,
    en: string
  }
  description: {
    ar: string,
    en: string
  }
  section: [
    {
      title: {
        ar: string,
        en: string
      },
      content: {
        ar: string,
        en: string
      },
    }
  ]
  createdAt: string
}

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function TextMobileStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [maxSteps, setMaxSteps] = React.useState(2);
  const apiEndpoint = `${process.env.BACKEND}service`;
  const [Data, setData] = React.useState<Service[]>([
    {
      _id: '',
      title: {ar: '', en: ''},
      description: {ar: '', en: ''},
      section: [{title: {ar: '', en: ''}, content: {ar: '', en: ''}}],
      imageCover: '',
      createdAt: ''
    }
  ]);

  const { isRTL } = useContext(LanguageDirectionContext);

  const {
    data,
    fetchData,
  } = CrudComponent({});

  useEffect(() => {
    fetchData(apiEndpoint, "Services")  
  }, [apiEndpoint]);

  useEffect(() => {
    setData(data as Service[]);
  }, [data]);

  const screenSize = useMediaQuery('(min-width:600px)') ? 'sm' : 'xs';
  const numImagesPerSlide = { xs: 1, sm: 3, md: 3, lg: 3, xl: 3 }[screenSize];

  useEffect(() => {
    setMaxSteps(Math.ceil(Data?.length / numImagesPerSlide));
  }, [Data]);

  const handleStepChange = (step: number) => {
    setActiveStep(mod(step, Math.ceil(Data?.length / numImagesPerSlide)));
  };

  function slideRenderer(params: any) {
    const { index, key } = params;

    return (
      <div key={key}>
        <div dir='rtl' key={index} className='grid w-full grid-cols-1 place-items-center gap-2'>
          <div className='grid gap-4 md:grid-cols-3 w-11/12'>
            {Data.slice(index * numImagesPerSlide, (index + 1) * numImagesPerSlide).map((service: Service, i: number) => (
              <div key={i} className='flex flex-col justify-center items-center'>
                <Image src={service.imageCover} alt={isRTL? service.title.ar: service.title.en} width={800} height={600} className='' />
                <div className='space-y-2 mt-4 flex flex-col items-center'>
                  <Typography textAlign={'center'} variant='h4' className='text-white'>
                    {isRTL? service.title.ar : service.title.en}
                  </Typography>
                  {/* <Typography textAlign={'center'} variant='h6' className='text-gray-300'>
                    {service.labels.sub}
                  </Typography> */}
                  <Typography textAlign={'center'} variant='body2' className='text-gray-300'>
                    {isRTL? service.description.ar : service.description.en}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full grid place-items-center relative'>
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

const UnitManager = () => {
  return (
    <main id='unitManager' className='bg-secondary pt-8 pb-20'>
      <div className='z-[20] space-y-4 flex flex-col items-center'>
        <Typography textAlign={'center'} variant='h2' className='text-white z-[30]'>
          <FormattedMessage id='home.manage'/>
        </Typography>
        
        <Typography className='w-10/12 md:w-8/12 text-gray-300' textAlign={'center'}>
          <FormattedMessage id='unitManager.description' />
        </Typography>

        <TextMobileStepper />
      </div>
    </main>
  );
};

export default UnitManager;