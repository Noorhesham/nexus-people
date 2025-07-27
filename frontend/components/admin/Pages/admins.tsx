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

var options: any = { day: 'numeric', month: 'numeric', year: 'numeric' };

const Admins = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [AllAdmins, setAllAdmins]: any = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({});  // State for form data

  const [selectedTab, setSelectedTab] = useState('Profile');

  const apiEndpoint = `${process.env.BACKEND}auth/admin/getAllAdmins`;

  const {
    data,
    fetchData,
    handleDelete,
    handleEdit,
  } = CrudComponent({ apiEndpoint: `${process.env.BACKEND}` });

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    fetchData(apiEndpoint, "Admins", Cookies.get('token'))
  }, [apiEndpoint, isLoading, isOpen]);

  useEffect(() => {
    setAllAdmins(data)
  }, [data]);

  const ModalHandler = () => {
    setIsEdit(false);
    setFormData({});  // Reset form data when opening the modal for adding a new admin
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

  const columns = [
    { field: 'name', headerName: 'English Name', width: 150, resizable: true, valueGetter: (params: any) => params.row.name?.en || '' },
    { field: 'ArabicName', headerName: 'Arabic Name', width: 150, resizable: true, valueGetter: (params: any) => params.row.name?.ar || '' },
    { field: 'DOB', headerName: 'DOB', width: 100, valueGetter: (params: any) => parseDate(params.row.DOB)?.toLocaleDateString(`en-GB`, options) as string },
    { field: 'email', headerName: 'Email', width: 150, resizable: true },
    { field: 'phone', headerName: 'Phone', width: 150, resizable: true },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { field: 'address', headerName: 'Address', width: 150, resizable: true },
    {
      field: 'actions', type: 'actions', width: 70,
      renderCell: ({ row }: Partial<GridRowParams>) =>
        <IconButton className="hover:text-red-500" onClick={() => {
          handleDelete(row._id, `${process.env.BACKEND}auth/admin/deleteAdmin`, Cookies.get('token'))
          setAllAdmins((prevRows: any) => prevRows.filter((pat: any) => pat._id !== row._id));
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
              }
            }}
          >
            <Typography variant="h4" className="text-white">
              <FormattedMessage id="admin.admins" />
            </Typography>
          </Divider>

          <div className="flex space-x-4">
            <Button className="bg-primary" variant="contained" onClick={ModalHandler}>
              <FormattedMessage id="admin.new" />
            </Button>
          </div>
        </div>

        <div className="h-[72vh]">
          <DataTable
            fetchedData={AllAdmins}
            columns={columns}
            isLoading={isLoading}
            api={`${process.env.BACKEND}auth/admin/getAdmin`}
            type="Admin"
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
                <Tab label={<FormattedMessage id='profile.profile' />} value="Profile" />
              </Tabs>
            </Box>
          </div>

          {selectedTab === 'Profile' ? <Profile apiEndpoint={`${process.env.BACKEND}auth/admin/addAdmin`} render={false} HandleModal={ModalHandler}  /> : null}

        </div>
      </NewModal>
    </div>
  );
}

export default Admins;
