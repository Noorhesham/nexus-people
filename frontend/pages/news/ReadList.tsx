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

var options: any = {day: 'numeric', month: 'long', year: 'numeric' };

interface ReadProps {
    PostId: string    
}

export default function ReadList({PostId} : ReadProps) {
  const { isRTL } = useContext(LanguageDirectionContext);
  
  const [Posts, setPosts] = useState<Post[]>([
    {
        _id: '',
        imageCover: '',
        title: { ar: '', en: ''},
        description: { ar: '', en: ''},
        section: [{ title: { ar: '', en: ''},
            content: {ar: '', en: ''}}],
        createdAt: ""
    }
]);

  useEffect(() => {
    axios
      .get(`${process.env.BACKEND}blogs?page=1`)
      .then((res) => setPosts(res.data.response.Blogs))
      .catch((err) => console.error(err));
  }, []);
    
  const parseDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return null;
    }
    return date;
};

const filteredPosts = Posts.filter((post) => post._id !== PostId);

  return (
    <List className='max-h-80 overflow-y-auto' dir={isRTL? 'rtl': 'ltr'} sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {filteredPosts?.slice(0, 3).map((post) => (
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