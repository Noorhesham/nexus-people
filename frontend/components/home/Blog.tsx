import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Bookmark, Share } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import Button from '@mui/material/Button';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { FormattedMessage } from 'react-intl';
import { useContext, useEffect, useState } from 'react';
import CrudComponent from "@/helpers/CRUD";
import { CardActionArea } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext } from '@/helpers/AuthContext';
import { useRouter } from 'next/dist/client/router';

interface Post {
    _id: string,
    imageCover: string,
    title: { ar: string, en: string }
    description: { ar: string, en: string }
    section: [
        {
            title: { ar: string, en: string },
            content: { ar: string, en: string},
        }
    ]
    doctor: {
        _id: string,
        name: { ar: string, en: string }
        profilePic: string
    }
    createdAt: string
}

var options: any = {day: 'numeric', month: 'long', year: 'numeric' };

const Blog = () => {
    const {user, fetchUser} = useContext(AuthContext);
    const { isRTL } = useContext(LanguageDirectionContext);
    const router = useRouter()
    const apiEndpoint = `${process.env.BACKEND}blogs?page=1`;
    const [isToggled, setIsToggled] = useState<any>({
        like: user?.likedBlogs,
        save: user?.savedBlogs
    })
    const [Posts, setPosts] = useState<Post[]>([
        {
            _id: '',
            imageCover: '',
            title: { ar: '', en: '' },
            description: { ar: '', en: '' },
            section: [
                {
                    title: { ar: '', en: '' },
                    content: { ar: '', en: '' }
                }
            ],
            doctor: {
                _id: '',
                name: { ar: '', en: ''},
                profilePic: ''
            },
            createdAt: ""
        }
    ]);

    const {
        data,
        fetchData,
      } = CrudComponent<Post>({});

      useEffect(() => {
        fetchData(apiEndpoint, "Blogs")
        
    }, [apiEndpoint]);

    useEffect(() => {
        setPosts(data as Post[]);
    }, [data]);

    const parseDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // Invalid date
            return null;
        }
        return date;
    };

    const CopyUrl = (postId: string) => {
        const postUrl = `${window.location.origin}/news/${postId}`;
    
        navigator.clipboard.writeText(postUrl)
          .then(() => {
            toast.success(<FormattedMessage id='blog.copy'/>)
          })
          .catch((error) => {
            console.error('Error copying URL to clipboard:', error);
          });
      };

      const handleToggle = async (postId: string, action: string, token?: string) => {
        try {
          const response = await axios.put(
            `${process.env.BACKEND}user/toggle${action}/${postId}`,
            {},
            {
              headers: { token },
            }
          );
      
          // Check if the post ID is in the list
          const isInList = isToggled[action.toLowerCase() ]?.includes(postId)
      
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
    <main dir={isRTL? 'rtl': 'ltr'} className='bg-white space-y-8 flex flex-col items-center py-8 w-full'>
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
        <div className='w-10/12 flex flex-col items-center justify-center space-y-8'>
            <Divider className='w-full'>
                <Typography variant='h4' className='text-Baige'>
                    <FormattedMessage id='blog.head'/>
                </Typography>
                <Typography variant='subtitle1' className='text-darkBlue'>
                    <FormattedMessage id='blog.sub'/>
                </Typography>
            </Divider>

            <div className='grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4'>
            {Posts.slice(-4).map((post, i) => (
                <Card key={i} className='bg-darkGrey' sx={{ maxWidth: 345 }}>
                <CardHeader
                     sx={{'.MuiCardHeader-title:hover': {color: '#dbc18e', cursor: 'pointer'}}}
                    avatar={
                        <Avatar src={post.doctor?.profilePic} alt={isRTL? post.doctor?.name?.ar : post.doctor?.name?.en} className='bg-darkBlue' aria-label="" />
                    }
                    onClick={(e) => router.push(`doctors/${post.doctor._id}`)}
                    title={isRTL? `د/ ${post.doctor?.name?.ar}` : `Dr. ${post.doctor?.name?.en}` }
                    subheader={parseDate(post.createdAt)?.toLocaleDateString(`${isRTL? 'ar-EG': 'en-US'}`, options) as string}
                />
                <CardActionArea href={`/news/${post._id}`}>

                <CardMedia
                    component="img"
                    height="194"
                    className='h-60'
                    image={post.imageCover}
                    alt={isRTL? post.title?.ar : post.title?.en}
                />
                <CardContent>
                    <Typography variant='h6'>
                        {isRTL? post.title.ar : post.title.en}
                    </Typography>
                    {isRTL? (
                    <Typography variant="body2" color="text.secondary">
                    {post.description.ar?.substring(0, 150)} &nbsp;
                        {post.description.ar?.length > 150 && (
                            <Link
                                href={`/news/${post._id}`}
                                className='text-Baige'
                            >
                                <FormattedMessage id='readMore'/>...
                            </Link>
                        )}
                </Typography>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                        {post.description.en?.substring(0, 150)} &nbsp;
                            {post.description.en?.length > 150 && (
                                <Link
                                    href={`/news/${post._id}`}
                                    className='text-Baige'
                                >
                                    <FormattedMessage id='readMore'/>...
                                </Link>
                            )}
                    </Typography>
                    )}

                </CardContent>
                </CardActionArea>

                <CardActions disableSpacing>
                    <IconButton aria-label="Like" 
                        className={`${isToggled.like && isToggled.like?.includes(post._id)? 'text-Baige' : ''}`}
                        onClick={(e) => handleToggle(post._id, 'Like', Cookies.get('token'))}>
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="Share"
                        onClick={(e) => CopyUrl(post._id)}>
                        <Share />
                    </IconButton>
                    <IconButton aria-label="Share"
                        className={`${isToggled.save && isToggled.save?.includes(post._id)? 'text-Baige' : ''}`}
                        onClick={(e) => handleToggle(post._id, 'Save', Cookies.get('token'))}>
                    
                        <Bookmark />
                    </IconButton>
                </CardActions>
                    </Card>
            ))}
            </div>
            <div className='flex justify-end w-full'>
                <Button variant='text' className='text-darkBlue hover:text-Baige hover:bg-darkBlue' onClick={() => router.push('/blog')}>
                    <Typography variant='button'>
                        <FormattedMessage id='viewMore'/> {'>>>'}
                    </Typography>
                </Button>
            </div>

        </div>

    </main>

  );
}
 
export default Blog;