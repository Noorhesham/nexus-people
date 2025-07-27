import { CloseOutlined, Delete, Edit, Visibility } from "@mui/icons-material";
import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import DataTable from "../content/Table";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { FormattedMessage } from "react-intl";
import { GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";
import NewModal from "../content/NewModal";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Profile from "@/pages/profile/[id]/Profile";
import CrudComponent from "@/helpers/CRUD";
import Cookies from "js-cookie";
import IconButton from '@mui/material/IconButton';

var options: any = {day: 'numeric', month: 'numeric', year: 'numeric' };

const Patients = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [AllPatients, setAllPatients]: any = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedTab, setSelectedTab] = useState('Profile');
    const apiEndpoint = `${process.env.BACKEND}auth/admin/getAllUsers`;

    const {
      data,
      fetchData,
      handleDelete,
      handleEdit,
    } = CrudComponent({apiEndpoint: `${process.env.BACKEND}`});

    useEffect(() => {
      fetchData(apiEndpoint, "Users", Cookies.get('token'))
    }, [apiEndpoint, isLoading, isOpen]);
    
    useEffect(() => {
      setAllPatients(data)
    }, [data]);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTab(newValue);
    };
  
    const ModalHandler = () => {
      setIsEdit(false);
      setIsOpen(!isOpen);
    };
  
    const parseDate = (dateString: string) => {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
          // Invalid date
          return null;
      }
      return date;
  };  
    
    const columns =  [
      { field: 'name', headerName: 'English Name', width: 150, resizable: true, valueGetter: (params: any) => params.row.name?.en || ''  },
      { field: 'ArabicName', headerName: 'Arabic Name', width: 150, resizable: true, valueGetter: (params: any) => params.row.name?.ar || '' },
      { field: 'DOB', headerName: 'DOB', width: 100, valueGetter: (params: any) =>parseDate(params.row.DOB)?.toLocaleDateString(`en-GB`, options) as string},
      { field: 'email', headerName: 'Email', width: 150, resizable: true },
      { field: 'phone', headerName: 'Phone', width: 150, resizable: true },
      { field: 'gender', headerName: 'Gender', width: 100},
      { field: 'address', headerName: 'Address', width: 150, resizable: true },
      { field: 'actions', type :'actions', width: 70,
        renderCell: ({ row }: Partial<GridRowParams>) =>
          <IconButton className="hover:text-red-500" onClick={() => 
            {handleDelete(row._id, `${process.env.BACKEND}auth/admin/deleteUser`, Cookies.get('token'))
              setAllPatients((prevRows:any) => prevRows.filter((pat:any) => pat._id !== row._id));
            }}>
            <Delete />
          </IconButton>,
      }
  ]
    
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
              <FormattedMessage id="admin.patients" />
            </Typography>
          </Divider>
          <div className="flex space-x-4">        
            <Button className="bg-primary" variant="contained" onClick={ModalHandler}>
              <FormattedMessage id="admin.new"/>
            </Button>
            {/* <Button className="bg-red-500 text-white hover:text-Baige" variant="contained" onClick={ModalHandler}>
              <FormattedMessage id="admin.delete"/>
            </Button> */}
          </div>
        </div>

        <div className="h-[72vh]">
          <DataTable
            fetchedData={AllPatients}
            columns={columns}
            isLoading={isLoading}
            api={`${process.env.BACKEND}auth/admin/getUser`}
            type="User"
            // fetchModalData={async (id) => {
            //   const response = await axios.get(`your-api-endpoint/${id}`);
            //   return ({
            //     title: response.data.title,
            //     content: response.data.content,
            //   });
            // }}
          />
        </div>
      </div>

      <NewModal open={isOpen} onClose={ModalHandler}>
        <div >
          <div className="mb-8">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label={<FormattedMessage id='profile.profile'/>} value="Profile" />
              </Tabs>
            </Box>
          </div>

          {selectedTab === 'Profile' ? <Profile render={false} apiEndpoint={`${process.env.BACKEND}auth/admin/addUser`} HandleModal={ModalHandler}/>  : null}
        </div>
      </NewModal>
    </div>
  );
}
 
export default Patients;