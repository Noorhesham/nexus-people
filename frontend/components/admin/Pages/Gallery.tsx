import { Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import DataTable from "../content/Table";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { FormattedMessage } from "react-intl";
import { GridRowParams } from "@mui/x-data-grid";
import NewModal from "../content/NewModal";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import NewGallery from "../views/NewGallery";
import CrudComponent from "@/helpers/CRUD";
import Cookies from "js-cookie";
import IconButton from '@mui/material/IconButton';

const Gallery = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [AllGallery, setAllGallery]: any = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [selectedTab, setSelectedTab] = useState('Image');
  const apiEndpoint = `${process.env.BACKEND}gallery`;

  const {
    data,
    fetchData,
    handleDelete,
    handleEdit,
  } = CrudComponent({apiEndpoint: `${process.env.BACKEND}`});

  useEffect(() => {
    fetchData(apiEndpoint, "Gallery", Cookies.get('token'))
    .then(() => setIsLoading(false))
  }, [apiEndpoint, isLoading, isOpen]);
    
  useEffect(() => {
    const galleryArray: any = data;

    const imagesArray = galleryArray
      .map((gallery:any) => gallery.images)
      .flat();
      imagesArray?.forEach((image: any) => {
        image.Type = 'image'
      })

    const videosArray = galleryArray
      .map((gallery: any) => gallery.videos)
      .flat();
      videosArray?.forEach((image: any) => {
        image.Type = 'video'
      })

    const combinedArray = [...imagesArray, ...videosArray];

    setAllGallery(combinedArray);
      
  },  [data])

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedTab(newValue);
  };

  const ModalHandler = () => {
    setIsEdit(false);
    setIsOpen(!isOpen);
  };

  const columns : any = [
    { field: 'Description', headerName: 'Description', width: 150, resizable: true, valueGetter: (params: any) => params.row.alt?.en || '' },
    { field: 'ArabicDescription', headerName: 'Arabic Description', width: 200, resizable: true, valueGetter: (params: any) => params.row.alt?.ar || '' },
    { field: 'Type', headerName: 'Type', width: 100},
    { field: 'Url', headerName: 'Url', width: 150, resizable: true, valueGetter: (params: any) => params.row?.image || params.row?.video  },
    { field: 'Actions', headerName: '', type :'actions', width: 70,
    renderCell: ({ row }: Partial<GridRowParams>) =>
      <IconButton className="hover:text-red-500" onClick={() => 
        {handleDelete(row._id, `${process.env.BACKEND}gallery/${row.Type}`, Cookies.get('token'))
          setAllGallery((prevRows:any) => prevRows.filter((pat:any) => pat._id !== row._id));
        }}>
        <Delete />
      </IconButton>,
    }
  ];
  
  return (
    <div className="relative w-full  h-full overflow-y-auto">
      <div className="h-full">

        <div className='flex items-center justify-between mb-8'>
          <Divider textAlign="left" variant="middle" className="w-4/12"
            sx={{
              "&::before, &::after": {
                borderColor: "#ffffff",
            }}} 
          >    
            <Typography variant="h4" className="text-white">
              <FormattedMessage id="admin.gallery" />
            </Typography>
          </Divider>
          
          <div className="flex space-x-4">        
            <Button className="bg-primary" variant="contained" onClick={ModalHandler}>
              <FormattedMessage id="admin.new"/>
            </Button>
          </div>
        </div>

        <div className="h-[72vh]">
          <DataTable
            fetchedData={AllGallery}
            columns={columns}
            isLoading={isLoading}
            api={`${process.env.BACKEND}gallery`}
            type="Gallery"
          />
        </div>
      </div>

      <NewModal open={isOpen} onClose={ModalHandler}>
        <div>
          <div className="mb-8">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label={<FormattedMessage id='form.image'/>} value="Image" />
                <Tab label={<FormattedMessage id='form.video'/>} value="Video" />
              </Tabs>
            </Box>
          </div>

          {selectedTab === 'Image' ? <NewGallery type="Image" closeModal={ModalHandler}/> : null}
          {selectedTab === 'Video' ? <NewGallery type="Video" closeModal={ModalHandler}/> : null}

        </div>
      </NewModal>
    </div>
  );
}
 
export default Gallery;