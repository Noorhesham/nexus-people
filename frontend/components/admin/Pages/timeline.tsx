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
import AddTimeline from "../views/addTimeline";

const Timeline:React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [Line, setLine]: any = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const apiEndpoint = `${process.env.BACKEND}timeline`;

    const {
      data,
      fetchData,
      handleDelete,
      handleEdit,
    } = CrudComponent({apiEndpoint: `${process.env.BACKEND}`});
    
    useEffect(() => {
      fetchData(apiEndpoint, "Timeline", Cookies.get('token'))
        .then(() => {
          setIsLoading(false);
        });
    }, [apiEndpoint, isLoading, isOpen]);
  
    useEffect(() => {
      setLine(data as [])
    }, [data]);
      
    const ModalHandler = () => {
        setIsEdit(false);
        setIsOpen(!isOpen);
    };

    const columns : any = [
        { field: 'Date', headerName: 'Date', width: 200, resizable: true, valueGetter: (params: any) => params.row.content?.date },
        { field: 'Title', headerName: 'Title', width: 200, resizable: true, valueGetter: (params: any) => params.row.content?.title?.en },
        { field: 'ArabicTitle', headerName: 'Arabic Title', width: 200, resizable: true, valueGetter: (params: any) => params.row.content?.title?.ar },
        { field: 'Description', headerName: 'Description', width: 200, resizable: true, valueGetter: (params: any) => params.row.content?.description?.en },
        { field: 'ArabicDescription', headerName: 'Arabic Description', width: 200, resizable: true, valueGetter: (params: any) => params.row.content?.description?.ar },
        { field: 'Actions', headerName: '', type :'actions', width: 70,
        renderCell: ({ row }: Partial<GridRowParams>) =>
            <IconButton className="hover:text-red-500" onClick={() => 
            {handleDelete(row._id, apiEndpoint, Cookies.get('token'))
                setLine((prevRows:any) => prevRows.filter((pat:any) => pat._id !== row._id));
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
                            <FormattedMessage id="admin.timeline" />
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
                        fetchedData={Line}
                        columns={columns}
                        isLoading={isLoading}
                        api={`${process.env.BACKEND}timeline`}
                        type="Timeline"
                    />
                </div>
            </div>

            <AddTimeline open={isOpen} setOpen={setIsOpen}/>
        </div>
    );
}
 
export default Timeline;