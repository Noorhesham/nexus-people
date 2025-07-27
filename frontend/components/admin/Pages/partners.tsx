import { Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import DataTable from "../content/Table";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { FormattedMessage } from "react-intl";
import { GridRowParams } from "@mui/x-data-grid";
import NewModal from "../content/NewModal";
import Box from '@mui/material/Box';
import CrudComponent from "@/helpers/CRUD";
import Cookies from "js-cookie";
import IconButton from '@mui/material/IconButton';
import NewBrand from "../views/newPartner";

interface Brand {
    _id: string
    images: [{
        _id: string,
        image: File | string | null;
        alt: {
            ar: string;
            en: string;
        };
    }]
}

const Partners = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [AllBrands, setAllBrands] = useState<Brand[]>([{
        _id: '',
        images: [{
            _id: '',
            image: null,
            alt: {ar: '', en: ''}
        }]
    }]);
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const apiEndpoint = `${process.env.BACKEND}brands`;

    const {
      data,
      fetchData,
      handleDelete,
      handleEdit,
    } = CrudComponent({apiEndpoint: `${process.env.BACKEND}`});

    useEffect(() => {
      fetchData(apiEndpoint, "Brands", Cookies.get('token'))
      .then(() => setIsLoading(false))
    }, [apiEndpoint, isLoading, isOpen]);
    
    useEffect(() => {
        const galleryArray: any = data;
  
        const imagesArray = galleryArray
          .map((gallery:any) => gallery.images)
          .flat();

        setAllBrands(imagesArray as Brand[]);
    },  [data])

    const ModalHandler = () => {
      setIsEdit(false);
      setIsOpen(!isOpen);
    };

    const columns : any = [
      { field: 'Name', headerName: 'Name', width: 150, resizable: true, valueGetter: (params: any) => params.row.alt?.en || '' },
      { field: 'ArabicName', headerName: 'Arabic Name', width: 200, resizable: true, valueGetter: (params: any) => params.row.alt?.ar || '' },
      { field: 'Url', headerName: 'Url', width: 150, resizable: true, valueGetter: (params: any) => params.row?.image || '' },
      { field: 'Actions', headerName: '', type :'actions', width: 70,
      renderCell: ({ row }: Partial<GridRowParams>) =>
        <IconButton className="hover:text-red-500" onClick={() => 
          {handleDelete(row._id, `${process.env.BACKEND}brands/image`, Cookies.get('token'))
            setAllBrands((prevRows:any) => prevRows.filter((pat:any) => pat._id !== row._id));
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
                <FormattedMessage id="admin.partners" />
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
              fetchedData={AllBrands}
              columns={columns}
              isLoading={isLoading}
              api={`${process.env.BACKEND}brands`}
              type="Brand"
              // ID={data?._id}
            />
          </div>
        </div>

        <NewModal open={isOpen} onClose={ModalHandler}>
          <div>
            <div className="mb-8">
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>

              </Box>
            </div>

              <NewBrand closeModal={ModalHandler}/>
          </div>
        </NewModal>
    </div>
    );
}
 
export default Partners;