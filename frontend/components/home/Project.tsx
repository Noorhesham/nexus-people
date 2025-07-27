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
import ProjectInfo from './projectInfo';
import ProjectFacilities from './projectFacilities';

const Project = () => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = 2;
  
    const handleStepChange = (step: number) => {
      setActiveStep(step);
    };

    return (  
        <main id="project" className="min-h-screen bg-white">
            <Box id='Units' className="min-h-screen">
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={activeStep}
                    onChangeIndex={handleStepChange}
                    enableMouseEvents
                    className="h-full"
                >
                    <ProjectInfo />
                    <ProjectFacilities />
                </SwipeableViews>

                <div className="w-full bg-white flex justify-center">
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

            </Box>
        </main>
    );
}
 
export default Project;