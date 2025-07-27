import axios, { AxiosRequestConfig } from 'axios';
import React, { PropsWithChildren, createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

interface User {
  _id: string;
  name?: {ar: string, en: string};
  role?: string;
  DOB: string | Date;
  likedBlogs?: Array<string>;
  savedBlogs?: Array<string>;
  reviews?: Array<string>;
  createdAt?: Date;
  updatedAt?: Date;
  verified?: boolean;
  phone?: string;
  email?: string;
  password?: string;
  gender?: string;
  isActive?: boolean;
  isBlocked?: boolean;
  address: Array<string>;
  appointments?: Array<string>;
  profilePic?: string;
  __v?: number;
  provider?: string;
  contactForm?: Array<string>
}

interface AuthContextData {
  user: User | null;
  accessToken: string;
  refreshToken: string;
  errorMessage: string;
  updateUser: (name: string, value: string ) => void,
  login: (email: string, password: string, role?: string) => Promise<void>;
  fetchUser: (token:string) => Promise<void>,
  fetchAdmin: (token:string) => Promise<void>,
  logout: (token:string, loged: boolean) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({
  user: null,
  accessToken: '',
  refreshToken: '',
  errorMessage: '',
  updateUser: () => {},
  login: async () => {},
  fetchUser: async () => {},
  fetchAdmin: async () => {},
  logout: async () => {},
});

interface AuthProps {
  children: React.ReactNode;
}

const AuthContextProvider = ({ children }: PropsWithChildren<AuthProps>) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const {formatMessage} = useIntl();
  const router = useRouter();

  useEffect(() => {
    const fetchData =async () => {
      if (Cookies.get('token') !== undefined) {
       await fetchUser(Cookies.get('token') as string)
      }
    }    
    fetchData()
  },  [])

  useEffect(() => {
    Cookies.set('ID', user?._id as string);
    Cookies.set('Name', user?.name?.en as string);
    Cookies.set('ArabicName', user?.name?.ar as string);
  }, [user]);

  useEffect(() => {
    const { token, refreshToken } = router.query;

    if (refreshToken) {
      const fetchUserData = async () => {
        Cookies.set('token', refreshToken as string)
        await fetchUser(refreshToken as string)
      }
      fetchUserData();
    }
  }, [router.query]);

  const updateUser = async (name: string, value: any) => {
    setUser((prevData: any) => {
      if (name.includes('.')) {
        // Handle nested property
        const [objectName, propertyName] = name.split('.');
        return {
          ...prevData,
          [objectName]: {
            ...(prevData[objectName] as Record<string, any>),
            [propertyName]: value,
          },
        }
      } else {
        return {
          ...prevData,
          [name]: value,
        }
      }
    })
  }

  const login = async (email: string, password: string, role?: string) => {
    try {
      const LoginData = { email, password };

      await axios.post(`${process.env.BACKEND}auth/login`, LoginData).then( async response => {
        setErrorMessage('')

        Cookies.set('token', response.data.refreshToken)

        setAccessToken(response.data.token);
        setRefreshToken(response.data.refreshToken);
        if(role === 'admin') {
          await fetchAdmin(response.data.token).then(() => {
            router.push(`/admin/${encodeURIComponent(user?._id as string)}`)
          })
        } else {
          await fetchUser(response.data.token).then(() => {
            router.push(`/`)
          })
        }
      })

    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage(formatMessage({id: 'login.invalid'}))
    }
  };

  const fetchUser = async (token: string) => {
    try {
      const config: AxiosRequestConfig = token ? { headers: { token } } : {};
      await axios.get(`${process.env.BACKEND}user`, config).then((response) => {
        setUser(response.data.response.User) 
      })
    } catch (error) {
      console.error('Fetch failed:', error);
    }
  }

  const fetchAdmin = async (token: string, role?: string) => {
    try {
      const config: AxiosRequestConfig = token ? { headers: { token } } : {};
      await axios.get(`${process.env.BACKEND}auth/admin/profile`, config).then(response => {
        setUser(response.data.response.Admin)
      })
    } catch (error) {
      console.error('Fetch failed:', error);
    }
  }

  useEffect(() => {
    Cookies.set('ID', user?._id as string);
    Cookies.set('Name', user?.name?.en as string);
    Cookies.set('ArabicName', user?.name?.ar as string);
  }, [user]);

  const logout = async ( token:string, loged: boolean) => {
    if(loged) {
      try {
        await axios.patch(user?.role === 'admin'? `${process.env.BACKEND}auth/admin/logout` :`${process.env.BACKEND}${user?.role}/logout`, undefined, {headers: { token}} ).then(() => {
          router.push('/')
          setUser(null);
          setAccessToken('');
          Cookies.remove('token');
          Cookies.remove('Name');
          Cookies.remove('ArabicName');
          Cookies.remove('ID')
          Cookies.remove('refresh_token');
        })
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
    else {
      router.push('/');
      setUser(null);
      setAccessToken('');
      Cookies.remove('token');
      Cookies.remove('Name');
      Cookies.remove('ArabicName');
      Cookies.remove('ID')
      Cookies.remove('refresh_token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, errorMessage, refreshToken, updateUser, login, fetchUser, fetchAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;