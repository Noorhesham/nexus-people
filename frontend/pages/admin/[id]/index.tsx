import NestedList from '@/components/admin/sidebar';
import { useContext, useEffect, useState } from 'react';
import Testimonials from '@/components/admin/Pages/testimonials';
import ResponsiveAppBar from '@/components/admin/content/appBar';
import Patients from '@/components/admin/Pages/users';
import Gallery from '@/components/admin/Pages/Gallery';
import Blog from '@/components/admin/Pages/blogs';
import Dashboard from '@/components/admin/Pages/dashboard';
import Appointments from '@/components/admin/Pages/appointments';
import Admins from '@/components/admin/Pages/admins';
import Services from '@/components/admin/Pages/services';
import { AuthContext } from '@/helpers/AuthContext';
import { useRouter } from 'next/router';
import Chatbot from '@/components/admin/Pages/chatbot';
import Partners from '@/components/admin/Pages/partners';
import Mall from '@/components/admin/Pages/mall';
import Newsletter from '@/components/admin/Pages/newsletter';
import Models from '@/components/admin/Pages/models';
import Timeline from '@/components/admin/Pages/timeline';
import Home from '@/components/admin/Pages/home';
import Brouchure from '@/components/admin/Pages/Brouchure';
import Pages from '@/components/admin/Pages/Pages';

const AdminPage = () => {
    const [selectedButton, setSelectedButton] = useState('Home');
    const {user} = useContext(AuthContext)
    const handleSelectButton = (buttonName: string): void => {
      setSelectedButton(buttonName);
    }

    const router = useRouter()

    useEffect(() => {
        const { id } = router.query;
        if(user?.role !== 'admin' && user?._id != id) {
            router.push('/404')
        }
    }, [router.query])
    
    return (
        <>
            {user?.role === 'admin'? (
                <div className='w-full grid bg-inherit md:grid-cols-5 w-full'>
                    <div className='col-span-1'>
                        <NestedList onSelectButton={handleSelectButton}/>
                    </div>
                    <div className='col-span-5 lg:col-span-4 w-full h-full lg:h-5/6'>
                        <ResponsiveAppBar onSelectButton={handleSelectButton}/>
                        
                        <div className='px-8 w-full mt-8 h-full'>                            
                            {selectedButton === 'Home' && <Home />}
                            {selectedButton === 'Dashboard' && <Dashboard />}
                            {selectedButton === 'Testimonials' && <Testimonials />}
                            {selectedButton === 'Patients' && <Patients />}
                            {selectedButton === 'Gallery' && <Gallery />}
                            {selectedButton === 'Blog' && <Blog />}
                            {selectedButton === 'Services' && <Services />}
                            {selectedButton === 'Appointments' && <Appointments />}
                            {selectedButton === 'Admins' && <Admins />}
                            {selectedButton === 'Chatbot' && <Chatbot />}
                            {selectedButton === 'Partners' && <Partners />}
                            {selectedButton === 'Mall' && <Mall />}
                            {selectedButton === 'Newsletter' && <Newsletter />}
                            {selectedButton === 'Models' && <Models />}
                            {selectedButton === 'Timeline' && <Timeline />}
                            {selectedButton === 'Brouchure' && <Brouchure />}
                            {selectedButton === 'Pages' && <Pages />}


                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
 
export default AdminPage;