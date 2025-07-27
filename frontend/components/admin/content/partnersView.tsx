import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CrudComponent from "@/helpers/CRUD";
import Cookies from 'js-cookie';

interface ViewProps {
  data: any[]
}

interface Brand {
  _id: string
  images: [{
      _id: string,
      image: string;
      alt: {
          ar: string;
          en: string;
      };
  }]
}

const PartnersView = ({data}: ViewProps) => {
    const [cols, setCols] = useState(4); // Initial number of columns
    const [AllBrands, setAllBrands] = useState<Brand[]>([{
      _id: '',
      images: [{
        _id: '',
        image: '',
        alt: {ar: '', en: ''}
      }]
    }]);

    const {
      handleDelete
    } = CrudComponent({apiEndpoint: `${process.env.BACKEND}`});

    useEffect(() => {
      setAllBrands(data as Brand[]);
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

  useEffect(() => {
    setColumnsBasedOnScreenSize();
    window.addEventListener('resize', setColumnsBasedOnScreenSize);

    return () => {
      window.removeEventListener('resize', setColumnsBasedOnScreenSize);
    };
  }, []);

  const handleDeleteItem = async (id: string, api: string, token: string | undefined) => {
    try {
      // Delete the item from the backend
      await handleDelete(id, api, token);

      // Filter out the deleted item from shuffledItemData
      setAllBrands((prevData) => prevData.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (  
    <div className='w-full space-y-8 overflow-auto'>
      <Box sx={{ width: '100%',  }}>
        <ImageList variant="masonry" className='max-h-[70vh]' cols={cols} gap={8}>
          {AllBrands[0]?.images.map((item, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <IconButton
                className='bg-darkGrey z-[2]'
                style={{ position: 'absolute', top: 0, right: 0 }}
                onClick={() => handleDeleteItem(item._id, `${process.env.BACKEND}brands/image`, Cookies.get('token'))}
                color='error'
              >
                <DeleteIcon />
              </IconButton>

              <ImageListItem key={index}>
                <img
                  className='rounded-xl'
                  srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.image}?w=248&fit=crop&auto=format`}
                  alt={item.alt?.en}
                  loading="eager"
                />
              </ImageListItem>
            </div>
          ))}
        </ImageList>
      </Box>
    </div>
  );
}
 
export default PartnersView;