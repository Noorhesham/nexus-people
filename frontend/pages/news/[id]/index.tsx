import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Bookmark, Share } from '@mui/icons-material';
import CardHeader from '@mui/material/CardHeader';
import Link from 'next/link';
import Button from '@mui/material/Button';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useRouter } from 'next/router';
import CrudComponent from "@/helpers/CRUD";
import Cookies from 'js-cookie';
import { AuthContext } from '@/helpers/AuthContext';
import axios, { AxiosRequestConfig } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Divider from '@mui/material/Divider';
import AlignItemsList from '../list';
import ReadList from '../ReadList';

interface Post {
    _id: string,
    imageCover: string,
    title: { ar: string, en: string}
    description: { ar: string, en: string}
    section: [{
        _id: string,
        title: { ar: string, en: string},
        content: { ar: string, en: string},
    }]
    doctor: {
        _id: string,
        name: { ar: string, en: string}
        profilePic: string
        specialization: { ar: string, en: string}
    }
    createdAt: string
}

var options: any = {day: 'numeric', month: 'long', year: 'numeric' };

const BlogPost = () => {
    const {user, fetchUser} = useContext(AuthContext);
    const { isRTL } = useContext(LanguageDirectionContext);
    const [isToggled, setIsToggled] = useState<any>({
        like: user?.likedBlogs,
        save: user?.savedBlogs
    })

    const router = useRouter();
    const [post, setPost] = useState<Post>({
        _id: '',
        imageCover: '',
        title: { ar: '', en: ''},
        description: { ar: '', en: ''},
        section: [{_id: '', title: { ar: '', en: ''}, content: { ar: '', en: ''}}],
        doctor: {
            _id: '',
            name: {ar: '',en: ''},
            profilePic: '',
            specialization: { ar: '', en: ''}
        },
        createdAt: ""
    })
    const apiEndpoint = `${process.env.BACKEND}blogs`;

    const {
        dataObject,
        fetchById,
    } = CrudComponent<Post>({});

    useEffect(() => {
        const { id } = router.query;
        if (id) {
        fetchById(apiEndpoint, id as string, 'Blog')}
    }, [apiEndpoint, router.query]);

    useEffect(() => {
        setPost(dataObject as Post)
    }, [dataObject]);

    const parseDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return null;
        }
        return date;
    };

    const handleToggle = async (postId: string, action: string, token?: string) => {
        try {
          const response = await axios.put(
            `${process.env.BACKEND}user/toggle${action}/${postId}`, {}, { headers: { token }}
          );
      
          // Check if the post ID is in the list
          const isInList = isToggled[action.toLowerCase()]?.includes(postId);
      
          // Update the state to reflect the change
          setIsToggled((prev:any) => ({
            ...prev,
            [action.toLowerCase()]: isInList
              ? prev[action.toLowerCase()]?.filter((id:string) => id !== postId) // Remove from the list
              : [...(prev[action.toLowerCase()] || []), postId], // Add to the list
          }));

          fetchUser(Cookies.get('token') as string)
        } catch (error) {
          console.error('Error toggling:', error);
        }
    };
      
    return (  
        <main dir={isRTL? 'rtl' : 'ltr'} className="min-h-screen bg-secondary grid place-items-center space-y-8">
            <div className="min-h-[80vh] border-b-4 w-screen relative bg-cover bg-center flex items-center justify-center"
                style={{backgroundImage: 'url("/3d/10.webp")'}}
            >
                <div className={`absolute inset-0 bg-secondary opacity-50`}></div>
                <div className={`flex flex-col items-center ${isRTL? 'space-y-4' : ''} justify-center z-[3]`}>
                    <Typography textAlign={'center'} variant="h1" className="text-white">
                        {isRTL? post?.title?.ar : post?.title?.en}
                    </Typography>

                    <Breadcrumbs className="text-gray-300" aria-label="breadcrumb">
                        <Link href="/" className="hover:text-white">
                            <FormattedMessage id='navbar.home' />
                        </Link>
                        <Link href="/news" className="hover:text-white">
                            <FormattedMessage id='navbar.news' />
                        </Link>
                        <Typography color="">{isRTL? post?.title?.ar : post?.title?.en}</Typography>
                    </Breadcrumbs>
                </div>
            </div>

            <div className='w-full py-20 md:px-20 flex'>
                <div className={`min-[200px]:hidden md:flex flex-col space-y-8 pt-20 h-fit sticky top-8 ${isRTL? 'ml-8' : 'mr-8'}`}>
                    <IconButton 
                        className={`${isToggled.like && isToggled.like?.includes(post._id)? 'text-primary hover:text-white' : 'text-white hover:text-primary'}`}
                        aria-label="Like" 
                        onClick={(e) => handleToggle(post._id, 'Like', Cookies.get('token'))}>
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="Share"
                        className='text-white hover:text-primary'
                        onClick={(e) => navigator.share({
                            title: isRTL? post.title.ar : post.description.en,
                            text: isRTL? post.description.ar : post.description.en,
                            url: `${window.location.origin}/news/${post._id}`,
                          })}                     >
                        <Share />
                    </IconButton>
                    <IconButton
                        className={`${isToggled.save && isToggled.save?.includes(post._id)? 'text-primary hover:text-white' : 'text-white hover:text-primary'}`}
                        aria-label="Save" onClick={(e) => handleToggle(post._id, 'Save', Cookies.get('token'))}>
                        <Bookmark />
                    </IconButton>
                </div>
                
                <div className=" grid gap-8 lg:grid-cols-4 w-full">
                    <div className='col-span-3 w-full flex space-x-8'>
                
                        <Card className='w-full' >
                            <div className='relative w-full'>
                                {/* CardMedia for the image */}
                                <CardMedia
                                    className='w-full h-80'
                                    component="img"
                                    image={post.imageCover}
                                    alt=""
                                />

                                <CardContent className='bg-white text-darkBlue w-full'>
                                    <div className=''>
                                        <div className='py-2'>
                                            <Typography  variant="subtitle2" component="div">
                                            <FormattedMessage id='blog.posted'/>&nbsp;
                                            {parseDate(post?.createdAt)?.toLocaleDateString(`${isRTL? 'ar-EG': 'en-US'}`, options)}

                                        </Typography>
                                        </div>
                                        <Typography gutterBottom variant="h2" component="div">
                                            {isRTL? post.title?.ar : post.title?.en}
                                        </Typography>
                                        <Typography variant="body1" component="div" className='py-4'>
            {isRTL ? post.description?.ar : post.description?.en}
        </Typography>
                                    </div>

                                    {post.section?.map((section, i) => (
                                        <div key={i} className='py-2 space-y-2'>
                                            <Typography variant="h6" component="div">
                                                {isRTL? section.title?.ar : section.title?.en}
                                            </Typography>
                                            <Typography variant="body2" component="div">
                                                {isRTL? section.content?.ar : section.content?.en}
                                            </Typography>
                                        </div>
                                    ))}
                                    
                                </CardContent>
                                
                            </div>         
                        </Card>
                    </div>

                    <div className='space-y-8 sticky top-20 h-fit grid place-items-center col-span-3 lg:col-span-1'>
                        <Card className='bg-white w-full h-fit max-h-72 py-4' >
                            <CardActions className='w-full flex flex-col justify-center'>
                                <Divider className='w-full'>
                                    <Typography variant='h6'>
                                        <FormattedMessage id='blog.alsoRead'/>
                                    </Typography>
                                </Divider>
                                <ReadList PostId={post._id}/>
                            </CardActions>
                        </Card>
                        <Card className='bg-white w-full py-4 h-fit max-h-72 overflow-y-auto' >
                            <CardActions className='w-full flex flex-col justify-center'>
                                <Divider className='w-full'>
                                    <Typography variant='h6'>
                                        <FormattedMessage id='blog.saved'/>
                                    </Typography>
                                </Divider>
                                <AlignItemsList />
                            </CardActions>
                        </Card>

                    </div>
                </div>
            </div>

            <ToastContainer 
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </main>
    );
}
 
export default BlogPost;