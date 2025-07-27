import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import Button from '@mui/material/Button';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import CrudComponent from "@/helpers/CRUD";
import { useRouter } from 'next/router';

interface Doctor {
    _id: string;
    profilePic: string;
    name: { ar: string; en: string; };
    specialization: { ar: string; en: string; };
}

const Team = () => {
    const { isRTL } = React.useContext(LanguageDirectionContext);
    const apiEndpoint = 'http://localhost:4000/auth/admin/getAllDoctors';
    const [AllDoctors, setAllDoctors] = useState<Doctor[]>([])

    const router = useRouter()
    const {
      data,
      fetchData,
    } = CrudComponent<Doctor>({apiEndpoint: "http://localhost:4000"});

    useEffect(() => {
        fetchData(apiEndpoint, "Doctors")
    }, [apiEndpoint]);


    useEffect(() => {
        setAllDoctors(data as Doctor[]);
    }, [data]);
    
    return (  
        <main dir={isRTL? 'rtl' : 'ltr'} className=" bg-white space-y-8 flex flex-col items-center py-8 w-full">
            <div className='w-10/12 space-y-8'>
            <div className='w-full'>
                <Divider className='w-full'>
                    <Typography variant='h4' className='text-Baige'>
                        <FormattedMessage id='doctors.head'/>
                    </Typography>
                    <Typography variant='subtitle1' className='text-darkBlue'>
                        <FormattedMessage id='doctors.sub'/>
                    </Typography>
                </Divider>
            </div>

            <div className='h-full w-full grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 place-items-center gap-4'>
                {AllDoctors.slice(-4).map((member, index) => (
                    <Card key={index} className='w-full' sx={{ maxWidth: 345 }}>
                            <div className='relative'>
                                {/* CardMedia for the image */}
                                <CardMedia
                                    className='max-h-96 h-80 w-full'
                                    component="img"
                                    image={member.profilePic}
                                    alt={isRTL? member.name.ar : member.name.en}
                                />
                                {/* Overlay with "Know More" button */}
                                <div className='absolute inset-0 flex items-center bg-opacity-75 bg-darkBlue justify-center opacity-0 hover:opacity-100 transition-opacity duration-300'>
                                    <button className='bg-Baige hover:bg-darkBlue text-white px-4 py-2 rounded-lg'>
                                        <Link href={`/doctors/${member._id}`}>
                                            <Typography variant='button'>
                                                <FormattedMessage id='knowMore'/>
                                            </Typography>
                                        </Link>
                                    </button>
                                </div>
                            </div>
                            <CardContent className='flex flex-col h-20 items-center justify-center bg-darkBlue text-white'>
                                <Typography gutterBottom variant="h5" component="div">
                                    {isRTL? `د/ ${member.name?.ar}` : `Dr. ${member.name?.en}`}
                                </Typography>
                                <Typography variant="body2">
                                    {isRTL? member.specialization?.ar : member.specialization?.en}
                                </Typography>
                            </CardContent>
                    </Card>
                ))}
            </div>
            <div className='flex justify-end w-full '>
                <Button variant='text' className='text-darkBlue hover:text-Baige hover:bg-darkBlue' onClick={() => router.push('/doctors')}>
                    <Typography variant='button'>
                        <FormattedMessage id='viewMore'/> {'>>>'}
                    </Typography>
                </Button>
            </div>
            </div>

        </main>
    );
}

export default Team;