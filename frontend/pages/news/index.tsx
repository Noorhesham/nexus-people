import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from 'react-intl';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Bookmark, Share } from '@mui/icons-material';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import AlignItemsList from './list';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import axios from 'axios';
import { AuthContext } from '@/helpers/AuthContext';
import Cookies from 'js-cookie';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from '@mui/material/Skeleton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import CrudComponent from "@/helpers/CRUD";

const LoadingSkeleton = () => (
    <Card className='bg-white mt-4'>
    <CardHeader
      avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
      title={<Skeleton animation="wave" height={10} width="40%" style={{ marginBottom: 6 }} />}
      subheader={<Skeleton animation="wave" height={10} width="50%" />}
    />
    <Skeleton animation="wave" variant="rectangular" height={194} />
    <CardContent>
      <Skeleton animation="wave" height={20} width="80%" style={{ marginBottom: 6 }} />
      <Skeleton animation="wave" height={10} width="60%" />
    </CardContent>
  </Card>
);

interface Post {
    _id: string,
    imageCover: string,
    title: { ar: string, en: string }
    description: { ar: string, en: string }
    section: [
        { title: { ar: string, en: string},
        content: { ar: string, en: string},}
    ],
    createdAt: string
}

interface DataProps{
  _id: string,
  image: string,
  page: string
}

var options: any = {day: 'numeric', month: 'long', year: 'numeric' };

const Blog = () => {
  const {user, fetchUser} = useContext(AuthContext);
  const { isRTL } = useContext(LanguageDirectionContext);
  const [isToggled, setIsToggled] = useState<any>({
    like: user?.likedBlogs,
    save: user?.savedBlogs
  })

  const [Posts, setPosts] = useState<Post[]>([]);

  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true)

  const apiEndpoint = `${process.env.BACKEND}background`;
  const [Data, setData] = useState<DataProps[]>()
  const [AboutObject, setAboutObject] = useState<DataProps>()
  const [type, setType] = useState<'image' | 'video' | null>()
  const {
    data,
    fetchData,
  } = CrudComponent({ apiEndpoint: `${process.env.BACKEND}` });

  useEffect(() => {
    fetchData(apiEndpoint, "Background Images")
  }, [apiEndpoint]);

  useEffect(() => {
    setData(data as any);
  }, [data]);

  useEffect(() => {
    // Filter the Data array to get the object where the page value is 'about'
    const aboutData = Data?.filter((item) => item.page === 'news') || [];

    // Check if there's any data after filtering
    if (aboutData.length > 0) {
      // Assuming you want to get the first object if there are multiple
      const firstAboutItem = aboutData[0];
      // Do something with the filtered data...
      setAboutObject(firstAboutItem)
    }

    
  }, [Data]);

  useEffect(() => {
    // Function to determine the type of URL (image or video)
    const determineType = (url: any) => {
      if (url?.endsWith('.mp4') || url?.endsWith('.wav')) {
        setType('video');
      } else if (url?.endsWith('.png') || url?.endsWith('.jpg') || url?.endsWith('.jpeg') || url?.endsWith('.gif') || url?.endsWith('.webp')) {
        setType('image');
      } else {
        // Default to null if the type cannot be determined
        setType(null);
      }
    };

    determineType(AboutObject?.image)
  }, [Data, AboutObject]);


  useEffect(() => {
    axios
      .get(`${process.env.BACKEND}blogs?page=1`)
      .then((res) => setPosts(res.data.response.Blogs))
      .catch((err) => console.error(err));
  }, []);

  const fetchMoreData = () => {
    axios
      .get(`${process.env.BACKEND}blogs?page=${page}`)
      .then((res) => {
        setPosts((prevItems) => [...prevItems, ...res.data.response.Blogs]);

        res.data.response.length > 0 ? setHasMore(true) : setHasMore(false);
        
      })
      .catch((err) => setHasMore(false));

    setPage((prevIndex) => prevIndex + 1);
  };
    
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
        `${process.env.BACKEND}user/toggle${action}/${postId}`,
        {},
        {
          headers: { token },
        }
      );
  
      // Check if the post ID is in the list
      const isInList = isToggled[action.toLowerCase()]?.includes(postId)
  
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
    <main dir={isRTL? 'rtl' : 'ltr'} className="min-h-screen bg-secondary flex flex-col items-center justify-center space-y-8">

      <div className="min-h-[80vh] border-b-4 w-screen relative bg-cover bg-center flex items-center justify-center"
        style={{backgroundImage: type === 'image'? `url("${AboutObject?.image}")`: 'transparent'}}
        >
      {type === 'video' && AboutObject?.image && (
    <video autoPlay muted loop className="min-h-[78vh] max-h-[78vh] w-screen absolute inset-0 object-cover">
      <source src={AboutObject?.image} type="video/mp4" />
    </video>)}
        <div className={`absolute inset-0 bg-secondary opacity-50`}></div>
        <div className={`flex flex-col items-center ${isRTL? 'space-y-4' : ''} justify-center z-[3]`}>
            <Typography textAlign={'center'} variant="h1" className="text-white">
                <FormattedMessage id='navbar.news'/>
            </Typography>

            <Breadcrumbs className="text-gray-300" aria-label="breadcrumb">
                <Link href="/" className="hover:text-white">
                  <FormattedMessage id='navbar.home' />
                </Link>
                <Typography color=""><FormattedMessage id='navbar.news'/></Typography>
            </Breadcrumbs>
        </div>
      </div>

      <div className="w-full py-20 md:px-20 grid">
        <div className='grid grid-cols-3 gap-8 py-8'>
          <div className='col-span-4 row-start-1 md:col-span-2 order-last lg:col-span-1'>
            <Card className='bg-white w-full h-fit py-4 sticky top-20' >
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
          <div className='col-span-4 lg:col-span-2 lg:row-start-1 h-fit space-y-4'>
            <InfiniteScroll
              dataLength={Posts.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<LoadingSkeleton />}
            >
              <div className='space-y-4'>
                {Posts.map((post, index) => (
                <Card key={index} className='bg-white'>
                  <Link href={`/news/${post._id}`}>
                  <CardMedia
                    component="img"
                    height="194"
                    image={post.imageCover}
                    alt=""
                    className='h-80'
                  />
                  
                  <CardContent>
                    <Typography variant="subtitle2" component="div">
                      <FormattedMessage id='blog.posted'/>&nbsp;
                      {parseDate(post?.createdAt)?.toLocaleDateString(`${isRTL? 'ar-EG': 'en-US'}`, options)}
                    </Typography>

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
                  </Link>
                  <CardActions disableSpacing>
                      <IconButton aria-label="Like" 
                          className={`${isToggled.like && isToggled.like?.includes(post._id)? 'text-primary' : ''}`}
                          onClick={(e) => handleToggle(post._id, 'Like', Cookies.get('token'))}>
                          <FavoriteIcon />
                      </IconButton>
                      <IconButton aria-label="Share"
                        onClick={(e) => navigator.share({
                          title: isRTL? post.title.ar : post.description.en,
                          text: isRTL? post.description.ar : post.description.en,
                          url: `${window.location.origin}/news/${post._id}`,
                        })} 
                        >
                          <Share />
                      </IconButton>
                      <IconButton aria-label="Share"
                          className={`${isToggled.save && isToggled.save?.includes(post._id)? 'text-primary' : ''}`}
                          onClick={(e) => handleToggle(post._id, 'Save', Cookies.get('token'))}>
                      
                          <Bookmark />
                      </IconButton>
                  </CardActions>
                </Card>
            ))}
                </div>
      
            </InfiniteScroll>
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
      </div>
    </main>
  );
}
 
export default Blog;