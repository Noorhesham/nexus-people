import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Circle } from '@mui/icons-material';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { FormattedMessage } from 'react-intl';

interface Testimonial {
  id: number;
  image: string;
  name: string;
  body: string;
}

const Testimonials = () => {
  const { isRTL } = React.useContext(LanguageDirectionContext);
  const [value, setValue] = useState<number>(0);
  const testimonials: Testimonial[] = [
    {
      id: 1,
      image: '/d3.jpg',
      name: 'Mohamed Soliman',
      body:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ',
    },
    {
      id: 2,
      image: '/d2.jpg',
      name: 'John Doe',
      body:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ',
    },
    {
      id: 3,
      image: '/d3.jpg',
      name: 'Jane Doe',
      body:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ',
   },
  ];

  useEffect(() => {
    // Auto-navigate testimonials every 5 seconds
    const interval = setInterval(() => {
      const nextValue = (value + 1) % testimonials.length;
      setValue(nextValue);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [value, testimonials.length]);

  const handleChange = (newValue: number) => {
    setValue(newValue);
  };

  return (
    <main dir={isRTL? 'rtl' : 'ltr'} className="min-h-screen bg-cover bg-[url('/contact.jpg')] w-full">
      <div className="flex flex-col items-center py-8 bg-opacity-75 bg-white justify-center min-h-screen w-full">
        <div className="w-10/12 flex flex-col items-center space-y-8 ">
          <Divider className=''>
            <Typography variant="h4" className='text-Baige'><FormattedMessage id='review.head'/></Typography>
            <Typography variant="subtitle1" className='text-darkBlue'><FormattedMessage id='review.sub'/></Typography>
          </Divider>
          <Box sx={{ width: '100%' }}>
            <div className="flex flex-col items-center justify-center space-y-8">
              <div className="flex flex-col items-center justify-center space-y-8 md:w-6/12 sm:w-full">
                <img
                  style={{ borderRadius: '50%' }}
                  src={testimonials[value].image}
                  alt=""
                  className='w-48 h-48'
                />
                <Typography variant="body1" textAlign={'center'}>
                  {testimonials[value].body}
                </Typography>
                <Typography variant="h6">{testimonials[value].name}</Typography>
              </div>
              <div className="flex space-x-2 ">
                {testimonials.map((_, index) => (
                  <IconButton
                    key={index}
                    aria-label={`${index}`}
                    onClick={() => handleChange(index)}
                    className={`${value === index? 'text-darkBlue' : 'text-Baige'}`}
                  >
                    <Circle />
                  </IconButton>
                ))}
              </div>
            </div>
          </Box>
        </div>
      </div>
    </main>
  );
};

export default Testimonials;
