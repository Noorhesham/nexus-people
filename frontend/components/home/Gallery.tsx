import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { FormattedMessage } from 'react-intl';
import CrudComponent from "@/helpers/CRUD";
import { useRouter } from 'next/router';
  
function shuffleArray(array: Array<any>) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}
    
export default function Gallery() {
    const { isRTL } = React.useContext(LanguageDirectionContext);
    const [shuffledItemData, setShuffledItemData] = useState<Array<any>>([]);
    const [cols, setCols] = useState(4); // Initial number of columns
    const [selectedTab, setSelectedTab] = useState('all');
    const router = useRouter()

    const apiEndpoint = `${process.env.BACKEND}gallery`;

    const {
      data,
      fetchData,
    } = CrudComponent({});

    useEffect(() => {
      fetchData(apiEndpoint, "Gallery")
    }, [apiEndpoint]);

    useEffect(() => {
      const galleryArray: any = data;
  
      const imagesArray = galleryArray
        .map((gallery:any) => gallery.images)
        .flat();
        imagesArray?.forEach((image: any) => {
          image.type = 'Image'
        })
      const videosArray = galleryArray
        .map((gallery: any) => gallery.videos)
        .flat();
        videosArray?.forEach((image: any) => {
          image.type = 'Video'
        })
      const combinedArray = [...imagesArray, ...videosArray];

      // setAllGallery(combinedArray);
      const shuffledArray = shuffleArray(combinedArray);
      setShuffledItemData(shuffledArray);

  },  [data])

    const setColumnsBasedOnScreenSize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1280) {
        setCols(4);
      } else if (screenWidth >= 960) {
        setCols(3);
      } else {
        setCols(2);
      } 
    };

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
      setSelectedTab(newValue);
    };
  
    useEffect(() => {
      setColumnsBasedOnScreenSize();
      window.addEventListener('resize', setColumnsBasedOnScreenSize);
  
      return () => {
        window.removeEventListener('resize', setColumnsBasedOnScreenSize);
      };
    }, []);

    const filteredItems = selectedTab === 'all' ? shuffledItemData : shuffledItemData.filter(item => item.type === selectedTab);

  return (
    <main dir={isRTL? 'rtl' : 'ltr'} className='min-h-screen bg-darkGrey space-y-8 flex flex-col items-center py-8 w-full'>
      <div className='w-10/12  space-y-8'>
        <div className='w-full flex flex-col items-center'>
        <Divider className='w-full'>
            <Typography variant='h4' className='text-Baige'>
                <FormattedMessage id='gallery.head'/>
            </Typography>
            <Typography variant='subtitle1' className='text-darkBlue'>
                <FormattedMessage id='gallery.sub'/>
            </Typography>
        </Divider>
        </div>


        <div className='flex justify-center md:justify-start'>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>

          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            className='w-full'
          >
            <Tab label={<FormattedMessage id='gallery.all' />} value="all" />
            <Tab label={<FormattedMessage id='gallery.pictures' />} value="Image" />
            <Tab label={<FormattedMessage id='gallery.videos' />} value="Video" />
          </Tabs>

          </Box>
        </div>
        

      <Box sx={{ width: '100%', overflowY: 'scroll' }}>
        <ImageList className='min-h-screen' variant="masonry" cols={cols} gap={8}>
          {filteredItems.slice(-15).map((item, index) => (
            <ImageListItem key={index}>
              {item.type === 'Image' ? (
                <img
                  className='rounded-xl'
                  srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.image}?w=248&fit=crop&auto=format`}
                  alt={item.alt.en}
                  loading="eager"
                />
              ) : item.type === 'video' ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={item.src}
                  title={item.title}
                  allowFullScreen
                ></iframe>
              ) : null}
            </ImageListItem>
            ))}
        </ImageList>
      </Box>

      <div className='flex justify-end w-full'>
        <Button variant='text' className='text-darkBlue hover:text-Baige hover:bg-darkBlue' onClick={() => router.push('/gallery')}>
            <Typography variant='button'>
                <FormattedMessage id='viewMore'/> {'>>>'}
            </Typography>
        </Button>
        </div>
      </div>
    </main>
  );
}