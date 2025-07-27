import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/helpers/AuthContext';
import CrudComponent from "@/helpers/CRUD";
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

var options: any = {day: 'numeric', month: 'long', year: 'numeric' };

export default function AlignItemsList() {
  const { isRTL } = useContext(LanguageDirectionContext);
  const {user} = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [savedBlogs, setSavedBlogs] = useState<any[]>([])

  const parseDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return null;
    }
    return date;
};

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${process.env.BACKEND}user/savedBlogs`, { headers: { token: Cookies.get('token') } });
        setSavedBlogs(response.data.response[0].savedBlogs || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlogs()
  }, [user?.savedBlogs]);

  return (
    <List className='' dir={isRTL? 'rtl': 'ltr'} sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {savedBlogs?.map((post) => (
        <>
          <Link href={`/news/${post._id}`}>
            <ListItem className='hover:bg-secondary hover:text-white cursor-pointer'>
              <ListItemAvatar>
                <Avatar variant='rounded' alt={isRTL? post?.title?.ar : post?.title?.en} src={post?.imageCover} />
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography variant='body1'>
                      {isRTL? post?.title?.ar : post?.title?.en}
                    </Typography>
                    <Typography fontSize={12} variant='subtitle2'>
                      {parseDate(post?.createdAt)?.toLocaleDateString(`${isRTL? 'ar-EG': 'en-US'}`, options)}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          </Link>
          <Divider variant="fullWidth" component="li" />
        </>
      ))}
    </List>
  );
}