import React, { useEffect, useState, useRef } from 'react';
import Typography from '@mui/material/Typography';
import { Face3 } from '@mui/icons-material';

const AnimatedNumbers: React.FC<{ value: number }> = ({ value }) => {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const valueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 } // Adjust this threshold as needed
    );

    if (valueRef.current) {
      observer.observe(valueRef.current);
    }

    return () => {
      if (valueRef.current) {
        observer.unobserve(valueRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let startValue = 0;
    let endValue = value;
    let duration = Math.floor(2000 / endValue);
    let interval: NodeJS.Timeout | null = null;

    const updateCount = () => {
      if (startValue < endValue) {
        startValue += 1;
        setCount(startValue);
      } else {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      }
    };

    if (isInView) {
      interval = setInterval(updateCount, duration);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [value, isInView]);

  return (
    <Typography variant="h3" className="text-Baige" ref={valueRef}>
      {count}+
    </Typography>
  );
};

const Numbers: React.FC = () => {
  return (
    <main className="bg-cover bg-[url('/num.jpg')] w-full">
      <div className='flex items-center px-8 py-16 bg-opacity-75 bg-white justify-center h-full w-full'>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 w-full">
        <div className="flex flex-col items-center justify-center">
          <Typography variant="h1">
            <Face3 className="text-6xl text-Baige" />
          </Typography>
          <div className="flex flex-col items-center justify-center space-y-4">
            <AnimatedNumbers value={200} />
            <Typography variant="h6" className="text-darkBlue">
              Hair transplant
            </Typography>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <Typography variant="h1">
            <Face3 className="text-6xl text-Baige" />
          </Typography>
          <div className="flex flex-col items-center justify-center space-y-4">
            <AnimatedNumbers value={200} />
            <Typography variant="h6" className="text-darkBlue">
              Hair transplant
            </Typography>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <Typography variant="h1">
            <Face3 className="text-6xl text-Baige" />
          </Typography>
          <div className="flex flex-col items-center justify-center space-y-4">
            <AnimatedNumbers value={200} />
            <Typography variant="h6" className="text-darkBlue">
              Hair transplant
            </Typography>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <Typography variant="h1">
            <Face3 className="text-6xl text-Baige" />
          </Typography>
          <div className="flex flex-col items-center justify-center space-y-4">
            <AnimatedNumbers value={200} />
            <Typography variant="h6" className="text-darkBlue">
              Hair transplant
            </Typography>
          </div>
        </div>

        {/* Add more items with AnimatedNumber */}
      </div>
        </div>
    </main>
  );
};

export default Numbers;
