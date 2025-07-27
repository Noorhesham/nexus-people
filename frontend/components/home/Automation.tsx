import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from 'react-intl';
import { autoPlay } from 'react-swipeable-views-utils';
import SwipeableViews from 'react-swipeable-views';
import useMediaQuery from '@mui/material/useMediaQuery';
import { mod } from 'react-swipeable-views-core';
import {useState, useEffect, useContext} from 'react';
import CrudComponent from "@/helpers/CRUD";
import { LanguageDirectionContext } from '@/helpers/langDirection';
import Image from 'next/image';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

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

function TextMobileStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(2);
  const [AllFeatures, setAllFeatures] = useState<Service[]>([{
    _id: '',
    title: {ar: '', en: ''},
    description: {ar: '', en: ''},
    section: [{title: {ar: '', en: ''}, content: {ar: '', en: ''}}],
    imageCover: '',
    createdAt: ''
  }]);

  const apiEndpoint = `${process.env.BACKEND}feature`;
  const { isRTL } = useContext(LanguageDirectionContext);

  const {
    data,
    fetchData,
  } = CrudComponent({});

  useEffect(() => {
    fetchData(apiEndpoint, "Features")  
  }, [apiEndpoint]);

  useEffect(() => {
    setAllFeatures(data as Service[]);
  }, [data]);

  const screenSize = useMediaQuery('(min-width:600px)') ? 'sm' : 'xs';
  const numImagesPerSlide = { xs: 1, sm: 3, md: 3, lg: 3, xl: 3 }[screenSize];

  useEffect(() => {
    setMaxSteps(Math.ceil(AllFeatures?.length / numImagesPerSlide));
  }, [AllFeatures]);

  const handleStepChange = (step: number) => {
    setActiveStep(mod(step, Math.ceil(AllFeatures?.length / numImagesPerSlide)));
  };

  function slideRenderer(params: any) {
    const { index, key } = params;

    return (
      <div key={key}>
        <div dir='rtl' key={index} className='grid w-full grid-cols-1 place-items-center gap-2'>
        <div className='grid place-items-center gap-4 md:grid-cols-3'>
          {AllFeatures.slice(index * numImagesPerSlide, (index + 1) * numImagesPerSlide).map((card: Service) => (
              <Card key={card._id} className='pt-10 bg-transparent border-none h-[31rem]' sx={{ maxWidth: 345, position: 'relative', boxShadow: 0 }}>
                <Image src={card.imageCover} alt={isRTL? card.title.ar : card.title.en} width={800} height={600} />
                <CardContent className='w-full flex flex-col items-center space-y-4'>
                  <Typography textAlign={'center'} variant='h4' color='textSecondary'>
                    {isRTL? card.title.ar : card.title.en}
                  </Typography>
                  <Typography textAlign={'center'} color='textSecondary'>
                    {isRTL? card.description.ar : card.description.en}
                  </Typography>
                </CardContent>
              </Card>
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

const Automation = () => {

  return (
    <main id='automation' className='md:min-h-screen bg-cover bg-center ' style={{ backgroundImage: 'url("/3d/15.webp")' }}>
      {/* <div className="absolute inset-0 bg-white opacity-80"></div> */}
        <div className='grid place-items-center z-[2]'>
          <div className='z-[1] mt-20 md:mt-24'>
            <Typography textAlign={'center'} variant='h2' color='black'>
              <FormattedMessage id='home.automation'/>
            </Typography>
          </div>

          <TextMobileStepper />
        </div>
    </main>
  );
};

export default Automation;
