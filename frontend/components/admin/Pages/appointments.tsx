import { CloseOutlined, Delete, Edit, Visibility } from "@mui/icons-material";
import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import DataTable from "../content/Table";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { FormattedMessage } from "react-intl";
import { GridActionsCellItem } from "@mui/x-data-grid";
import NewModal from "../content/NewModal";
import Appointment from "@/pages/appointment";
import CrudComponent from "@/helpers/CRUD";
import Cookies from "js-cookie";
import IconButton from '@mui/material/IconButton';
import { GridRowParams } from "@mui/x-data-grid";

interface Appoint {
  _id: string
  mainType: string,
  secondaryType: string,
  name: string,
  email: string,
  phone: string,
  message: string
}
const Appointments = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [Appointments, setAppointments] = useState<Appoint[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  const apiEndpoint = `${process.env.BACKEND}auth/admin/appointments`;

  const {
    data,
    fetchData,
    handleDelete,
    handleEdit,
  } = CrudComponent({apiEndpoint: `${process.env.BACKEND}`});

  useEffect(() => {
    fetchData(apiEndpoint, "Appointments", Cookies.get('token'))
  }, [apiEndpoint]);
    
  const ModalHandler = () => {
    setIsEdit(false);
    setIsOpen(!isOpen);
  };
  
  const columns = [
    { field: 'Type', headerName: 'Type', width: 150, resizable: true },
    { field: 'Unit', headerName: 'Unit', width: 150, resizable: true },
    { field: 'Name', headerName: 'Name', width: 150, resizable: true },
    { field: 'Email', headerName: 'Email', width: 150, resizable: true},
    { field: 'Phone', headerName: 'Phone', width: 150, resizable: true},
    { field: 'Message', headerName: 'Message', width: 150, resizable: true},
    // { field: 'Actions', headerName: '', type :'actions', width: 70,
    //     renderCell: ({ row }: Partial<GridRowParams>) =>
    //       <IconButton className="hover:text-red-500" onClick={() => 
    //         {handleDelete(row._id, apiEndpoint, Cookies.get('token'))
    //           setAppointments((prevRows) => prevRows.filter((serv) => serv._id !== row._id));
    //         }}>
    //         <Delete />
    //       </IconButton>,
    //   }
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
                <FormattedMessage id="admin.appointments" />
              </Typography>
            </Divider>
          </div>

          <div className="h-[72vh]">
            <DataTable
              isLoading={isLoading}
              fetchedData={Appointments}
              columns={columns}
              type={"Appointment"}               
            />
          </div>
        </div>
      <NewModal open={isOpen} onClose={ModalHandler}>
        <Appointment render/>
      </NewModal>
  </div>
  );
}
 
export default Appointments;

