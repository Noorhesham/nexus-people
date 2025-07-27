import { Delete, Visibility } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "../content/Table";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { FormattedMessage } from "react-intl";
import CrudComponent from "@/helpers/CRUD";
import Cookies from "js-cookie";
import AddBlog from "../content/newBlog";
import { GridRowParams } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';

interface Service {
  _id: string
  image: File | null;
  title: { ar?: string; en?: string; };
  description: { ar?: string; en?: string; };
  sections: Array<{
      title: { ar: string; en: string;};
      content: { ar: string; en: string; };
  }>;
}

const Mall = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [AllFeatures, setAllFeatures] = useState<Service[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
  
    const apiEndpoint = `${process.env.BACKEND}feature`;

    const {
      data,
      fetchData,
      handleDelete,
      handleEdit,
    } = CrudComponent({apiEndpoint: `${process.env.BACKEND}`});

    const columns =  [
      { field: 'Title', headerName: 'Title', width: 150, resizable: true, valueGetter: (params: any) => params.row.title?.en || '' },
      { field: 'ArabicTitle', headerName: 'Arabic Title', width: 150, resizable: true, valueGetter: (params: any) => params.row.title?.ar || '' },
      { field: 'Description', headerName: 'Description', width: 200, valueGetter: (params: any) => params.row.description?.en || ''},
      { field: 'ArabicDescription', headerName: 'Arabic Description', width: 200, valueGetter: (params: any) => params.row.description?.ar || ''},
      { field: 'imageCover', headerName: 'Cover Url', width: 150, resizable: true },
      { field: 'actions', type :'actions', width: 70,
        renderCell: ({ row }: Partial<GridRowParams>) =>
          <IconButton className="hover:text-red-500" onClick={() => 
            {handleDelete(row._id, `${process.env.BACKEND}feature`, Cookies.get('token'))
              setAllFeatures((prevRows) => prevRows.filter((serv) => serv._id !== row._id));
            }}>
            <Delete />
          </IconButton>,
      }
    ]

    useEffect(() => {
      fetchData(apiEndpoint, "Features", Cookies.get('token'))
        .then(() => {
          setIsLoading(false);
        });
    }, [apiEndpoint, isLoading, isOpen]);
    
    useEffect(() => {
      setAllFeatures(data as Service[])
    }, [data]);

    const ModalHandler = () => {
      setIsEdit(false);
      setIsOpen(!isOpen);
    };
  
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
                <FormattedMessage id="admin.mall" />
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
              fetchedData={AllFeatures}
              columns={columns}
              isLoading={isLoading}
              type="Feature"
              api={`${process.env.BACKEND}feature`}
            />
          </div>
        </div>

        <AddBlog open={isOpen} setOpen={setIsOpen} type="Feature"/>
      </div>
    );
}
 
export default Mall;