import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { FormattedMessage } from 'react-intl';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CrudComponent from "@/helpers/CRUD";
import Cookies from 'js-cookie';
import { TextField, Button } from '@mui/material';

interface NewsProps {
  _id: string,
  email: string
}

interface ViewProps {
  data: NewsProps
}

const NewsLetterView = ({data}: ViewProps) => {
  return (  
    <div className='w-80 space-y-8 py-2 overflow-auto'>
      <TextField
        label={<FormattedMessage id='form.email' />}
        variant="outlined"
        defaultValue={data.email}
        fullWidth
        disabled
      />   
    </div>
  );
}
 
export default NewsLetterView;