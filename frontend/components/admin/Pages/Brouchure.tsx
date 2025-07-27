import { Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import DataTable from "../content/Table";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { FormattedMessage } from "react-intl";
import { GridRowParams } from "@mui/x-data-grid";
import NewModal from "../content/NewModal";
import CrudComponent from "@/helpers/CRUD";
import Cookies from "js-cookie";
import IconButton from '@mui/material/IconButton';
import AddBrouchure from "../content/addBrouchure";

const Brouchure = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [AllGallery, setAllGallery]: any = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const apiEndpoint = `${process.env.BACKEND}portfolio`;

  const {
    data,
    fetchData,
    handleDelete,
  } = CrudComponent({apiEndpoint: `${process.env.BACKEND}`});

  useEffect(() => {
    fetchData(apiEndpoint, "Portfolios", Cookies.get('token'))
    .then(() => setIsLoading(false))
  }, [apiEndpoint, isLoading, isOpen]);
    
  useEffect(() => {
    setAllGallery(data);
  },  [data])


  const ModalHandler = () => {
    setIsEdit(false);
    setIsOpen(!isOpen);
  };

  const columns : any = [
    { field: 'Category', headerName: 'Category', width: 150, resizable: true, valueGetter: (params: any) => params.row?.portfolio?.category || '' },
    { field: 'Url', headerName: 'Url', width: 150, resizable: true, valueGetter: (params: any) => params.row?.portfolio.pdf || params.row?.portfolio?.pdf  },
    { field: 'Actions', headerName: '', type :'actions', width: 70,
    renderCell: ({ row }: Partial<GridRowParams>) =>
      <IconButton className="hover:text-red-500" onClick={() => 

        {handleDelete(row._id, `${process.env.BACKEND}portfolio`, Cookies.get('token'))
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
              Brouchure
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
            api={`${process.env.BACKEND}home`}
            type="Home"
          />
        </div>
      </div>

      <NewModal open={isOpen} onClose={ModalHandler}>
        <div>
           <AddBrouchure type="image" closeModal={ModalHandler}/>
        </div>
      </NewModal>
    </div>
  );
}
 
export default Brouchure;