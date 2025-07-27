import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Profile from './Profile';
import { Button } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import Cookies from 'js-cookie';
import ProfilePicture from './Picture';
import CrudComponent from "@/helpers/CRUD";
import { useRouter } from 'next/router';
import { AuthContext } from '@/helpers/AuthContext';

var options: any = {day: 'numeric', month: 'long', year: 'numeric' };

const UserProfile = () => {
    const {user, logout} = useContext(AuthContext)
    const [User, setUser] = useState<any>(user)
    const [selectedTab, setSelectedTab] = useState('Profile');
    const { isRTL } = useContext(LanguageDirectionContext);
    const router = useRouter();
    const apiEndpoint = `${process.env.BACKEND}user`;

    const {
        data,
        fetchData,
        handleDelete
    } = CrudComponent({});

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTab(newValue);
    };

    useEffect(() => {
        setUser(data)
    }, [data])

    useEffect(() => {
        const { id } = router.query;
        fetchData(apiEndpoint, 'User', Cookies.get('token')).catch((error) => {
            router.push('/404');
        })
    }, [])

    const parseDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return null;
        }
        return date;
    };

    return (  
        <>
        {user && user?.role === 'user'? 
            <main dir={isRTL? 'rtl' : 'ltr'} className="min-h-screen bg-cover bg-fixed bg-center py-20 flex justify-center" style={{ backgroundImage: 'url("/3d/13.jpg")' }}>
                <Card className='w-10/12 py-8'>
                    <CardContent className='w-full'>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 place-items-center w-full">
                            <div className="col-span-1 flex flex-col items-center justify-center space-y-4 w-full  md:w-10/12">
                                <ProfilePicture profilePicture={user.profilePic as string} />
                                <div className='space-y-0 grid place-items-center'>
                                    <Typography variant='h5'>
                                        {isRTL? user?.name?.ar : user?.name?.en}
                                    </Typography>

                                    <Typography variant='subtitle1'>
                                        <FormattedMessage id='profile.member'/> {parseDate(User?.createdAt)?.toLocaleDateString(`${isRTL? 'ar-EG': 'en-US'}`, options)}
                                    </Typography>
                                </div>

                                <div className='space-y-4 flex flex-col'>
                                    <Button 
                                        onClick={(e) => logout(Cookies.get('token') as string, true)}
                                        variant='contained' className='bg-darkBlue hover:bg-primary w-40'>
                                        <FormattedMessage id='profile.logout'/>
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="col-span-2 w-10/12 space-y-8">
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs
                                    value={selectedTab}
                                    onChange={handleTabChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    >
                                        <Tab label={<FormattedMessage id='profile.profile'/>} value="Profile" />
                                    </Tabs>
                                </Box>
                                 <Profile ProfileData={user} render={true} apiEndpoint={`${process.env.BACKEND}user/changePassword` } HandleModal={() => {}}/>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main> : null}
        </>
    );
}

export default UserProfile;