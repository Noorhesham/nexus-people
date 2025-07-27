import {Delete} from "@mui/icons-material";
import { useEffect, useState } from "react";
import DataTable from "../content/Table";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from "react-intl";
import { GridRowParams } from "@mui/x-data-grid";
import CrudComponent from "@/helpers/CRUD";
import Cookies from "js-cookie";
import IconButton from '@mui/material/IconButton';


const Newsletter = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [AllEmails, setAllEmails]: any = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  
  const apiEndpoint = `${process.env.BACKEND}newsletter`;

  const {
    data,
    fetchData,
    handleDelete,
  } = CrudComponent({apiEndpoint: `${process.env.BACKEND}`});
  
  useEffect(() => {
    fetchData(apiEndpoint, "Subscribers", Cookies.get('token'))
  }, [apiEndpoint, isLoading, isOpen]);

  useEffect(() => {
    setAllEmails(data)
  }, [data]);
    
  const columns =  [
    { field: 'email', headerName: 'Email', width: 250, resizable: true },
    // { field: 'actions', type :'actions', width: 70,
    //   renderCell: ({ row }: Partial<GridRowParams>) =>
    //     <IconButton className="hover:text-red-500" onClick={() => 
    //       {handleDelete(row._id, `${process.env.BACKEND}newsletter`, Cookies.get('token'))
    //         setAllEmails((prevRows:any) => prevRows.filter((pat:any) => pat._id !== row._id));
    //       }}>
    //       <Delete />
    //     </IconButton>,
    // }
  ]
  
  return (
    <div className="relative w-full  h-full overflow-y-auto">
       <div className="h-full">
          <div className='flex items-center justify-between mb-8'>
            <Divider  textAlign="left" variant="middle" className="w-4/12"
              sx={{
                "&::before, &::after": {
                  borderColor: "#ffffff",
              }}} 
            >    
              <Typography variant="h4" className="text-white">
                <FormattedMessage id="admin.newsletter" />
              </Typography>
            </Divider>

          </div>

          <div className="h-[72vh]">
            <DataTable
              fetchedData={AllEmails}
              columns={columns}
              isLoading={isLoading}
              api={`${process.env.BACKEND}newsletter`}
              type="Newsletter"
            />
          </div>
        </div>
    </div>
    );
}
 
export default Newsletter;