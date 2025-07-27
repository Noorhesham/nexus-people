import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, Typography, Button, IconButton } from '@mui/material';
import { AcUnit, LightMode, Add, Remove, RollerShades, RollerShadesClosed, DoorFront, MeetingRoom, Restore, Reply } from '@mui/icons-material';
import Slider from '@mui/material/Slider';
import SwipeableViews from 'react-swipeable-views';
import { FormattedMessage } from 'react-intl';
import { useInView } from "framer-motion"
import Image from 'next/image';
import Phone from '../../public/tablet.png';
import Tablet from '../../public/tablet.png';
import Fab from '@mui/material/Fab';
import useMediaQuery from '@mui/material/useMediaQuery';

interface FeatureProps {
  changeStep: React.Dispatch<React.SetStateAction<number>>;
}

const Office : React.FC<FeatureProps> = ({changeStep}) => {
  const [playDoorAudio, setPlayDoorAudio] = useState(false);
  const [playACAudio, setPlayACAudio] = useState(false);
  const [playBlindsAudio, setPlayBlindsAudio] = useState(false);
  const [blindsOpen, setBlindsOpen] = useState(true);
  const [acTemperature, setAcTemperature] = useState(20);
  const [lastAcTemperature, setLastAcTemperature] = useState(20);

  const [brightnessTransitioning, setBrightnessTransitioning] = useState(false);
  const [brightnessLevel, setBrightnessLevel] = useState(100);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [doorOpen, setDoorOpen] = useState(false);
  const [Play, setPlay] = useState(false);
  const ref = useRef(null)
  const inView = useInView(ref)
  const [imageLoaded, setImageLoaded] = useState(false);
  const largeScreen = useMediaQuery('(min-width:770px)');
  const [selectedFeature, setSelectedFeature] = useState<null | String>(null);
  const [acUnitPositions, setAcUnitPositions] = useState<{ x: number; y: number }[]>([]);


  useEffect(() => {
    if (inView) {
      setPlay(true);
    }
  }, [inView, Play])

  useEffect(() => {
    const handleResize = () => {
      setCanvasDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

  
    window.addEventListener('resize', handleResize);
    handleResize();
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {  
    const canvas = canvasRef.current as HTMLCanvasElement | null;
  
    if (!canvas) {
      // Canvas not available, skip further processing
      return;
    }
  
    const context = canvas.getContext('2d');

  
    if (!context) {
      // Canvas context not available, skip further processing
      return;
    }
  

    const drawAcUnitIcons = (context: CanvasRenderingContext2D, count: number) => {
      const icons: { x: number; y: number; opacity: number }[] = [];
    
      for (let i = 0; i < count; i++) {
        const x = Math.random() * canvasDimensions.width;
        const y = Math.random() * canvasDimensions.height; // Start above the canvas
        const opacity = 1;
    
        icons.push({ x, y, opacity });
      }
    
      const animate = () => {
        context.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);
    
        // Draw the existing content (temperature text, background, etc.)
        context.drawImage(officeImage, 0, 0, canvas.width, canvas.height);
        context.font = '24px Arial';
        context.fillStyle = 'white';
        context.fillText(`${acTemperature}°C`, 10, 30);
    
        const newIcons: { x: number; y: number; opacity: number }[] = [];
    
        icons.forEach((icon) => {
          context.font = '32px Arial';
          context.fillStyle = `${acTemperature == lastAcTemperature || acTemperature < lastAcTemperature? `rgba(0, 0, 255,${icon.opacity}` : `rgba(255, 0, 0,${icon.opacity}`}`; // Blue color with opacity
          context.fillText('❆', icon.x, icon.y);
    
          // Update icon position for the fall animation
          const newY = icon.y + 1; // You can adjust the falling speed as needed
          const newOpacity = icon.opacity - 0.005; // Adjust the fading speed as needed
    
          // Add the icon to newIcons if it hasn't faded out completely
          if (newOpacity > 0) {
            newIcons.push({ ...icon, y: newY, opacity: newOpacity });
          }
        });
    
        icons.length = 0; // Clear the old icons
        icons.push(...newIcons); // Use the new set of icons
    
        if (icons.length > 0) {
          requestAnimationFrame(animate);
        }
      };
    
      animate();
      setLastAcTemperature(acTemperature)
    };
    

    // Load office background image
    const officeImage = new window.Image();
    officeImage.src = '/interior/3.webp';
  
    // Ensure the image is loaded before attempting to draw on the canvas
    const handleImageLoad = () => {
      // Update state to indicate that the image has been loaded
      setImageLoaded(true);
  

      // Draw office background image
      context.drawImage(officeImage, 0, 0, canvas.width, canvas.height);
  
      // Draw the temperature text at the top-left of the canvas
      context.font = '24px Arial';
      context.fillStyle = 'white';
      context.fillText(`${acTemperature}°C`, 10, 30);

      drawAcUnitIcons(context, 15); // You can adjust the count as needed

    };
  
    // Use window.onload to ensure the image is loaded before drawing
    officeImage.onload = handleImageLoad;
  
    // Draw the image when it's already loaded (e.g., when changing temperature)
    if (canvas && context) {
      context.drawImage(officeImage, 0, 0, canvas.width, canvas.height);
      // context.font = '24px Arial';
      // context.fillStyle = 'white';
      // context.fillText(`${acTemperature}°C`, 10, 30);
          
    }
  
    return () => {
      officeImage.onload = null;
    };
  }, [acTemperature, imageLoaded]);
  
    
  useEffect(() => {
    const canvas = canvasRef.current;
  
    if (canvas) {
      canvas.style.filter = `brightness(${brightnessLevel}%)`;
    }
  }, [brightnessLevel]);
  

  useEffect(() => {
    brightnessLevel> 25? setBlindsOpen(true) : setBlindsOpen(false)
  }, [brightnessLevel]);

  const toggleBlinds = () => {
    setBlindsOpen((prev) => !prev);
    setBrightnessTransitioning(true);
    setPlayBlindsAudio(true);

    const targetBrightness = blindsOpen ? 25 : 100;
    const interval = setInterval(() => {
      setBrightnessLevel((prev) =>
        blindsOpen ?  Math.max(prev - 1, targetBrightness) :  Math.min(prev + 1, targetBrightness)
      );
    }, 20);
    
    setTimeout(() => {
      clearInterval(interval);
      setBrightnessTransitioning(false);
    }, 2000);
  };

  const increaseTemperature = () => {
    setAcTemperature((prev) => Math.min(prev + 1, 24));
    setPlayACAudio(true);
  };

  const decreaseTemperature = () => {
    setAcTemperature((prev) => Math.max(prev - 1, 16));
    setPlayACAudio(true);
  };

  const toggleDoor = () => {
    setDoorOpen((prev) => !prev)
    setPlayDoorAudio(true);
  }

  useEffect(() => {
    if (playACAudio) {
      const audioElement = new Audio('/beep.mp3');
      audioElement.play();
      audioElement.addEventListener('ended', () => setPlayACAudio(false));

      // Cleanup the audio element
      return () => {
        audioElement.pause();
        audioElement.removeEventListener('ended', () => setPlayACAudio(false));
      };
    }
  }, [playACAudio]);

  useEffect(() => {
    if (playBlindsAudio) {
      const audioElement = new Audio('/blinds.mp3');
      audioElement.play();
      audioElement.addEventListener('ended', () => setPlayBlindsAudio(false));

      // Cleanup the audio element
      return () => {
        audioElement.pause();
        audioElement.removeEventListener('ended', () => setPlayBlindsAudio(false));
      };
    }
  }, [playBlindsAudio]);

  return (
    <div id='office' className="w-full h-full overflow-hidden grid place-items-center py-4">
      <div className={'relative flex justify-center items-center w-full h-full  overflow-hidden'}>
        <canvas ref={canvasRef} width={canvasDimensions.width} height={canvasDimensions.height} className='w-full md:w-11/12 border-[15px] md:border-[25px] rounded-xl border-black max-w-screen h-[60vh] md:h-full' />



        <div className='absolute flex grid-cols-2 w-10/12 justify-end gap-4 z-[2] h-full'>
        <div className='flex items-center w-full z-[3]'>
          <div>
            <IconButton size={largeScreen? 'large' : 'small'} className='bg-white hover:bg-white hover:text-primary' onClick={() => changeStep(0)}>
              <Reply />
            </IconButton>
          </div>
        </div>
          <div className='grid place-items-center'>
            <Card className={`h-24 w-24 flex items-center ${selectedFeature === null? 'hidden' : ''}`}>
              <CardContent className="space-y-6 flex items-center justify-center w-full">
                {selectedFeature === 'Door'? (
                  <Button title='Toggle Door' onClick={toggleDoor} variant="contained" className='bg-secondary'>
                    {doorOpen ? <FormattedMessage id='office.open'/> : <FormattedMessage id='office.close'/>}
                    <audio autoPlay={playDoorAudio} src={doorOpen? '/closeDoor.mp3' : 'openDoor.mp3'} onEnded={() => setPlayDoorAudio(false)}/>
                  </Button>
                ) : null}

                {selectedFeature === 'Lights'? (
                  <div className='flex justify-end items-center w-full pt-4'>
                    <Typography className='w-1/2'>{brightnessLevel}%</Typography>
                    <Slider
                      orientation='vertical'
                      value={brightnessLevel}
                      onChange={(event, newValue) => setBrightnessLevel(newValue as number)}
                      aria-labelledby="brightness-slider"
                      valueLabelDisplay="off"
                      color='secondary'
                      className='h-16'
                    />
                  </div>

                ) : null}

                {selectedFeature === 'Blinds'? (
                  <Button title='Toggle Blinds' onClick={toggleBlinds} variant="contained" className='bg-secondary'>
                    {blindsOpen?  <FormattedMessage id='office.close'/>  : <FormattedMessage id='office.open'/>}
                  </Button>
                ) : null}

                {selectedFeature === 'AC'? (
                  <div className='flex w-full flex-col items-center justify-between'>
                    <IconButton size='small' title='Increase Temprature' onClick={increaseTemperature} color="secondary" disabled={acTemperature === 24}>
                      <Add />
                    </IconButton>
                    <Typography  variant="body2">{acTemperature}°C</Typography>
                    <IconButton size='small' title='Decrease Temprature' onClick={decreaseTemperature} color="secondary" disabled={acTemperature === 16}>
                      <Remove />
                    </IconButton>
                </div>
                ) : null}

              </CardContent>
            </Card>
          </div>

          <div className='grid place-items-center justify-end'>
            <div className='grid gap-4 justify-end'>
              <IconButton size={largeScreen? 'large' : 'small'} onClick={() => {selectedFeature === 'Door'? setSelectedFeature(null) : setSelectedFeature('Door')}} className={`bg-white hover:bg-white hover:text-primary ${selectedFeature === 'Door'? 'text-primary' : ''}`}>
                {doorOpen ? <DoorFront /> : <MeetingRoom />}
              </IconButton>

              <IconButton size={largeScreen? 'large' : 'small'} onClick={() => {selectedFeature === 'Lights'? setSelectedFeature(null) : setSelectedFeature('Lights')}} className={`bg-white hover:bg-white hover:text-primary ${selectedFeature === 'Lights'? 'text-primary' : ''}`}>
                <LightMode/>
              </IconButton>

              <IconButton size={largeScreen? 'large' : 'small'} onClick={() => {selectedFeature === 'Blinds'? setSelectedFeature(null) : setSelectedFeature('Blinds')}} className={`bg-white hover:bg-white hover:text-primary ${selectedFeature === 'Blinds'? 'text-primary' : ''}`}>
                {blindsOpen && brightnessLevel >0?  ( <RollerShades />) : (<RollerShadesClosed />)}
              </IconButton>

              <IconButton size={largeScreen? 'large' : 'small'} onClick={() => {selectedFeature === 'AC'? setSelectedFeature(null) : setSelectedFeature('AC')}} className={`bg-white hover:bg-white hover:text-primary ${selectedFeature === 'AC'? 'text-primary' : ''}`}>
                <AcUnit />
              </IconButton>
            </div>            
          </div>
        </div>  
      </div>
    </div>
  );
};

export default Office;