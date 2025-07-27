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

interface ViewProps {
    data: any[]
}

function shuffleArray(array: Array<any>) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

const GalleryView = ({data}: ViewProps) => {
    const [selectedTab, setSelectedTab] = useState('all');
    const [cols, setCols] = useState(4); // Initial number of columns
    const [shuffledItemData, setShuffledItemData] = useState<Array<any>>([]);

    const {
      handleDelete
    } = CrudComponent({apiEndpoint: `${process.env.BACKEND}`});

    useEffect(() => {
      // setAllGallery(data as gallery[]);

      const galleryArray: any = data;
  
      const imagesArray = galleryArray
        .map((gallery:any) => gallery.images)
        .flat();
        imagesArray.forEach((image: any) => {
          image.type = 'image'
        })
      const videosArray = galleryArray
        .map((gallery: any) => gallery.videos)
        .flat();
        videosArray.forEach((image: any) => {
          image.type = 'video'
        })
      const combinedArray = [...imagesArray, ...videosArray];

      const shuffledArray = shuffleArray(combinedArray);
      setShuffledItemData(shuffledArray);

  },  [data])

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedTab(newValue);
  };
  
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

  useEffect(() => {
    setColumnsBasedOnScreenSize();
    window.addEventListener('resize', setColumnsBasedOnScreenSize);

    return () => {
      window.removeEventListener('resize', setColumnsBasedOnScreenSize);
    };
  }, []);

  const filteredItems = selectedTab === 'all' ? shuffledItemData : shuffledItemData.filter(item => item.type === selectedTab);

  const handleDeleteItem = async (id: string, api: string, token: string | undefined) => {
    try {
      // Delete the item from the backend
      await handleDelete(id, api, token);

      // Filter out the deleted item from shuffledItemData
      setShuffledItemData((prevData) => prevData.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (  
    <div className='w-full space-y-8 overflow-auto'>

      <div className='flex justify-center md:justify-start overflow-y-auto'>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>

          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            className='w-full'
          >
            <Tab label={<FormattedMessage id='gallery.all' />} value="all" />
            <Tab label={<FormattedMessage id='gallery.pictures' />} value="image" />
            <Tab label={<FormattedMessage id='gallery.videos' />} value="video" />
          </Tabs>

        </Box>
      </div>
      
      <Box sx={{ width: '100%',  }}>
        <ImageList variant="masonry" className='max-h-[70vh]' cols={cols} gap={8}>
          {filteredItems.map((item, index) => (
            <div key={index} style={{ position: 'relative' }}>
            <IconButton
            className='bg-darkGrey z-[2]'
                style={{ position: 'absolute', top: 0, right: 0 }}
                onClick={() => handleDeleteItem(item._id, `${process.env.BACKEND}gallery/${item.type}`, Cookies.get('token'))}
                color='error'
            >
                <DeleteIcon />
            </IconButton>
            <ImageListItem key={index}>
              {item.type === 'image' ? (
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
            </div>
          ))}
        </ImageList>
      </Box>
    </div>
  );
}
 
export default GalleryView;