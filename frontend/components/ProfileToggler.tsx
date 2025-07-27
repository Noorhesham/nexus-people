import Avatar from '@mui/material/Avatar';
import Cookies from "js-cookie";
import { useState, useRef, useEffect, useContext } from 'react';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from 'react-intl';
import { AuthContext } from '@/helpers/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LanguageDirectionContext } from '@/helpers/langDirection';

interface LanguageProps {
    backgroundColor: string,
}

const ProfileToggler: React.FC<LanguageProps> = ({backgroundColor}) => {
    const { isRTL } = useContext(LanguageDirectionContext);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const optionsRef = useRef<any>(null);
    const {user, logout } = useContext(AuthContext)
    const [logged, setisLogged] = useState(false)
    const router = useRouter()
    
    const openMenu = () => {
        setShowOptions(true)
    }

    const closeMenu = () => {
        setShowOptions(false)
    }

    useEffect(() => {
        user? setisLogged(true) : setisLogged(false)
    }, [user]);
      
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
            closeMenu();
          }
        };
    
        if (showOptions) {
          document.addEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showOptions]);

    const handleButton = () => {
        if (!logged && user===null) {
            router.push('/sign')
        }
        else {
            if (showOptions) {
                closeMenu()
            }
            else{
                openMenu()
            }
        }
    }


    const logoutFunction = async () => {
        await logout(Cookies.get('token') as string, true).then(() => {
            closeMenu()
        })
    }

    return (  
        <main>
            <div className='relative md:mx-2'>
                <button title='Profile Toggler' className={`${backgroundColor} flex items-center hover:text-primary`} onClick={handleButton} ref={optionsRef} >
                    <Avatar variant='rounded' className={`text-inherit bg-transparent cursor-pointer scale-[0.8] md:scale-100 text-3xl`}
                        alt={user !== null ? (isRTL ? Cookies.get('ArabicName') : Cookies.get('Name')) : 'Profile'}
                        src={user?.profilePic? user?.profilePic : undefined} 
                    />
                </button>

                {showOptions && (
                    <div ref={optionsRef} className={`absolute ${isRTL? 'left-1':'right-1'} py-2 w-32 bg-white text-secondary  rounded shadow z-10`}>
                        <Link href={user?.role === 'user'? `/profile/${Cookies.get('ID')}` :`doctors/profile/${Cookies.get('ID')}` } onClick={closeMenu}>
                            <button
                                title='Profile'
                                className="block w-full px-4 py-2 text-sm text-left hover:bg-primary hover:text-white focus:outline-none"
                            >
                                <Typography variant='body1'>
                                    <FormattedMessage id='profile.profile'/>
                                </Typography>
                            </button>
                        </Link>
                        <button
                            title='Logout'
                            onClick={logoutFunction}
                            className="block w-full px-4 py-2 text-sm text-left hover:bg-primary hover:text-white focus:outline-none"
                        >
                            <Typography variant='body1'>
                                <FormattedMessage id='profile.logout'/>
                            </Typography>
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}

export default ProfileToggler