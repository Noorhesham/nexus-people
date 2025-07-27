import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import useMediaQuery from '@mui/material/useMediaQuery';
import Image from 'next/image';
import { House } from '@mui/icons-material';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { Typography } from '@mui/material';
import CrudComponent from "@/helpers/CRUD";
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';

interface timeline {
    image: string,
    content: {
        date: string,
        title: {ar:string, en:string},
        description: {ar:string, en:string},
    }
}

export default function CustomizedTimeline() {
    const { isRTL } = React.useContext(LanguageDirectionContext);
    const isLargeScreen = useMediaQuery('(min-width:600px)');
    const apiEndpoint = `${process.env.BACKEND}timeline`;
    const [ProjectTimeline, setProjectTimeline] = useState<timeline[]>([])
    
    const {
        data,
        fetchData,
    } = CrudComponent({});

    useEffect(() => {
        fetchData(apiEndpoint, "Timeline")
    }, [apiEndpoint]);



    useEffect(() => {
        // Sort the ProjectTimeline array by date in ascending order
        const sortedTimeline = [...data].sort((a:any, b:any) => {
            // Assuming that your date is a string in the format 'YYYY'
            const dateA = parseInt(a.content.date);
            const dateB = parseInt(b.content.date);
    
            return dateA - dateB;
        });
    
        setProjectTimeline(sortedTimeline as timeline[]);
    }, [data]);
    
  return (
    <Timeline className='w-full max-h-[120vh] overflow-auto' position={isLargeScreen? 'alternate' : 'right'}>
        <div className='py-4 grid'>
        {ProjectTimeline.map((event, i) => (
            <TimelineItem key={i}>
                <TimelineOppositeContent
                    sx={{ m: 'auto 0', display: isLargeScreen? 'flex' : 'none' }}
                    variant="body2"
                >
                    <div className='flex justify-center w-full'>
                        <Image src={event?.image} alt='' width={500} height={500} className='rounded-xl'/>
                    </div>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineConnector />
                        <TimelineDot className='h-[3.5rem] md:h-[3rem] flex bg-primary items-center'>
                            <Typography variant='h6' className='[text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]'>
                                {Number(event?.content?.date).toLocaleString(isRTL? 'ar-EG' : 'en-GB', {useGrouping: false})}
                            </Typography>
                        </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className='flex justify-center items-center scale-100 md:scale-75' sx={{ py: '12px', px: 2 }}>
                    <div className='space-y-4'>
                        {isLargeScreen? null : 
                        (
                            <Image src={event?.image} alt='' width={500} height={500} className='rounded-xl'/>
                        )}
                        <div className='space-y-2'>
                            <Typography variant='h2'>
                                {isRTL? event?.content?.title?.ar : event?.content?.title?.en}
                            </Typography>
                            <Typography variant='h6'>
                                {isRTL? event?.content?.description?.ar : event?.content?.description?.en}
                            </Typography>
                        </div>
                    </div>
                </TimelineContent>
            </TimelineItem>
        ))}
        </div>

    </Timeline>
  );
}