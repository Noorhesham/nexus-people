import { Delete, Visibility } from "@mui/icons-material";
import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import DataTable from "../content/Table";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { FormattedMessage } from "react-intl";
import { GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";
import CrudComponent from "@/helpers/CRUD";
import IconButton from '@mui/material/IconButton';
import Cookies from "js-cookie";

const Testimonials:React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [testi, setTesti]: any = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const apiEndpoint = `${process.env.BACKEND}auth/admin/reviews`;

    const {
      data,
      fetchData,
      handleDelete,
      handleEdit,
    } = CrudComponent({apiEndpoint: `${process.env.BACKEND}`});
    
    useEffect(() => {
      fetchData(apiEndpoint, "Reviews", Cookies.get('token'))
        .then(() => {
          setIsLoading(false);
        });
    }, [apiEndpoint, isLoading, isOpen]);
  
    useEffect(() => {
      setTesti(data as [])
    }, [data]);
      
      const columns : any = [
        { field: 'Name', headerName: 'Name', width: 200, resizable: true, valueGetter: (params: any) => params.row.user?.name?.en },
        { field: 'ArabicName', headerName: 'Arabic Name', width: 200, resizable: true, valueGetter: (params: any) => params.row.user?.name?.ar },
        { field: 'Content', headerName: 'Content', width: 200, resizable: true, valueGetter: (params: any) => params.row.text?.en || params.row.text?.ar },
        { field: 'rate', headerName: 'Rate', width: 50 },
        { field: 'Actions', headerName: '', type :'actions', width: 70,
        renderCell: ({ row }: Partial<GridRowParams>) =>
          <IconButton className="hover:text-red-500" onClick={() => 
            {handleDelete(row._id, apiEndpoint, Cookies.get('token'))
              setTesti((prevRows:any) => prevRows.filter((pat:any) => pat._id !== row._id));
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
            <FormattedMessage id="navbar.testimonials" />
          </Typography>
        </Divider>
        <div className="flex space-x-4">
        {/* <Button className="bg-red-500 text-white hover:text-Baige" variant="contained">
          <FormattedMessage id="admin.delete"/>
        </Button> */}

        </div>

      </div>
      <div className="h-[72vh]">
      <DataTable
        fetchedData={testi}
        columns={columns}
        isLoading={isLoading}
        api={`${process.env.BACKEND}reviews`}
        type="Review"
      />

        </div>
      </div>

    </div>
    );
}
 
export default Testimonials;