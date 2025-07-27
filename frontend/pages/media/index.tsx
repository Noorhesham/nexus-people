import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';
import axios from 'axios';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { FormattedMessage } from 'react-intl';
import CrudComponent from '@/helpers/CRUD';
import { useRouter } from 'next/router';

interface DataProps {
  _id: string;
  image: string;
  page: string;
}

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
  const [Images, setImages] = useState<any[]>([]);
  const [shuffledItemData, setShuffledItemData] = useState<any[]>([]);
  const [cols, setCols] = useState(4); // Initial number of columns
  const [selectedTab, setSelectedTab] = useState('all');
  const router = useRouter();

  const MediaApiEndpoint = `${process.env.BACKEND}gallery`;
  const apiEndpoint = `${process.env.BACKEND}background`;

  const [Data, setData] = useState<DataProps[]>();
  const [AboutObject, setAboutObject] = useState<DataProps>();
  const [type, setType] = useState<'image' | 'video' | null>();

  const { data, fetchData } = CrudComponent({ apiEndpoint: `${process.env.BACKEND}` });

  useEffect(() => {
    fetchData(apiEndpoint, "Background Images");
  }, [apiEndpoint]);

  useEffect(() => {
    setData(data as any);
  }, [data]);

  useEffect(() => {
    const aboutData = Data?.filter((item) => item.page === 'media') || [];

    if (aboutData.length > 0) {
      const firstAboutItem = aboutData[0];
      setAboutObject(firstAboutItem);
    }
  }, [Data]);

  useEffect(() => {
    const determineType = (url: string | undefined) => {
      if (!url) return null;
      if (url.endsWith('.mp4') || url.endsWith('.wav')) {
        setType('video');
      } else if (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.gif') || url.endsWith('.webp')) {
        setType('image');
      } else {
        setType(null);
      }
    };

    determineType(AboutObject?.image);
  }, [AboutObject]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${process.env.BACKEND}gallery`);
        const galleryArray: any = res.data.response.Gallery;

        const imagesArray = galleryArray
          ?.flatMap((gallery: any) => gallery.images || [])
          .map((image: any) => ({ ...image, type: 'Image' }));

        const videosArray = galleryArray
          ?.flatMap((gallery: any) => gallery.videos || [])
          .map((video: any) => ({ ...video, type: 'Video' }));

        const combinedArray = [...imagesArray, ...videosArray];
        const shuffledArray = shuffleArray(combinedArray);

        setShuffledItemData(shuffledArray);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      }
    };

    fetchGallery();
  }, [MediaApiEndpoint]);

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
    <main dir={isRTL ? 'rtl' : 'ltr'} className='min-h-screen bg-secondary space-y-8 flex flex-col items-center w-full'>
      <div className="min-h-[80vh] border-b-4 w-screen relative bg-cover bg-center flex items-center justify-center"
        style={{backgroundImage: type === 'image' ? `url("${AboutObject?.image}")` : 'transparent'}}
      >
        {type === 'video' && AboutObject?.image && (
          <video autoPlay muted loop className="min-h-[78vh] max-h-[78vh] w-screen absolute inset-0 object-cover">
            <source src={AboutObject?.image} type="video/mp4" />
          </video>
        )}
        
        <div className={`absolute inset-0 bg-secondary opacity-50`} />
        <div className={`flex flex-col items-center ${isRTL ? 'space-y-4' : ''} justify-center z-[3]`}>
          <Typography textAlign={'center'} variant="h1" className="text-white">
            <FormattedMessage id='gallery.head'/>
          </Typography>

          <Breadcrumbs className="text-gray-300" aria-label="breadcrumb">
            <Link href="/" className="hover:text-white">
              <FormattedMessage id='navbar.home' />
            </Link>
            <Typography color=""><FormattedMessage id='gallery.head'/></Typography>
          </Breadcrumbs>
        </div>
      </div>

      <div className='w-full lg:px-8 py-20 space-y-8'>

        <div className='flex justify-center'>
          <Box>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              className='w-full'
            >
              <Tab className='text-white' label={<FormattedMessage id='gallery.all' />} value="all" />
              <Tab className='text-white' label={<FormattedMessage id='gallery.pictures' />} value="Image" />
              <Tab className='text-white' label={<FormattedMessage id='gallery.videos' />} value="Video" />
            </Tabs>
          </Box>
        </div>

        <Box sx={{ width: '100%', overflowY: 'scroll' }}>
          <ImageList variant="masonry" cols={cols} gap={8}>
            {filteredItems.map((item, index) => (
              <ImageListItem key={index}>
                {item.type === 'Image' ? (
                  <img
                    className='rounded-xl'
                    srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2`}
                    src={`${item.image}?w=248&fit=crop&auto=format`}
                    alt={item.alt?.en || 'Image Alt Text'}
                    loading="eager"
                  />
                ) : item.type === 'Video' ? (
                  <video
                    width="100%"
                    height="100%"
                    autoPlay
                    loop
                    muted
                    className='rounded-xl'
                  >
                    <source src={item.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : null}
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </div>
    </main>
  );
}
