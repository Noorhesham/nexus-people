import Features from "./Features";
import Office from "./Office";

import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

function SmartSystem() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = 2;

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Box id='Units' className="min-h-screen bg-[url('/lightPattern.png')] grid place-items-center bg-secondary">
      <div>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
          className="h-full"
        >
          <Features changeStep={setActiveStep}/>
          <Office changeStep={setActiveStep}/>
        </SwipeableViews>

        <div className="w-full  flex justify-center">
          <MobileStepper
            steps={maxSteps}
            className="bg-transparent scale-150"
            position="static"
            activeStep={activeStep}
            nextButton={null}
            backButton={null}
            sx={{".MuiMobileStepper-dot" : { bgcolor: 'gray'}, ".MuiMobileStepper-dotActive": {bgcolor: 'primary.main'}}}
          />
        </div>
      </div>
    </Box>
  );
}

export default SmartSystem;
