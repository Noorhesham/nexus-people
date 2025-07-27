import { Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import DataTable from "../content/Table";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { FormattedMessage } from "react-intl";
import CrudComponent from "@/helpers/CRUD";
import Cookies from "js-cookie";
import { GridRowParams } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import AddModel from "../content/addModel";
import Checkbox from '@mui/material/Checkbox';

interface modelProps {
  _id: string
  mainType: string;
  secondaryType: { ar?: string; en?: string; };
  details: {
    images: string[],
    length: number,
    width: number,
    height: number,
    squareMeter: number,
    description: { ar?: string; en?: string; };
  }
}

const Models = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [AllModels, setAllModels] = useState<modelProps[]>([]);    
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  const apiEndpoint = `${process.env.BACKEND}mall`;

  const {
    data,
    fetchData,
    handleDelete,
    handleEdit,
  } = CrudComponent({apiEndpoint: `${process.env.BACKEND}`});

  const columns =  [
    { field: 'mainType', headerName: 'Type', width: 150, resizable: true, valueGetter: (params: any) => params.row.model.mainType || ''  },
    { field: 'unit', headerName: 'Unit', width: 100, resizable: true, valueGetter: (params: any) => params.row.model.details.unitIdentifier || ''  },
    { field: 'secondaryType.en', headerName: 'English Name', width: 150, resizable: true, valueGetter: (params: any) => params.row.model.secondaryType?.en || ''  },
    { field: 'secondaryType.ar', headerName: 'Arabic Name', width: 150, resizable: true, valueGetter: (params: any) => params.row.model.secondaryType?.ar || ''  },
    { field: 'length', headerName: 'Length', width: 100, valueGetter: (params: any) => params.row.model.details?.length || '' },
    { field: 'width', headerName: 'Width', width: 100, valueGetter: (params: any) => params.row.model.details?.width || '' },
    { field: 'height', headerName: 'Height', width: 100, valueGetter: (params: any) => params.row.model.details?.height || '' },
    { field: 'squareMeter', headerName: 'SQM', width: 100, valueGetter: (params: any) => params.row.model.details?.squareMeter || ''},
    { field: 'availability', headerName: 'Availability', width: 150, resizable: true, type: 'boolean', 
    renderCell: ({ row }: Partial<GridRowParams>) => 
      <Checkbox checked={row?.model?.details?.availability } disabled/> 
    },

    { field: 'actions', type :'actions', width: 70,
      renderCell: ({ row }: Partial<GridRowParams>) =>
        <IconButton className="hover:text-red-500" onClick={() => 
          {handleDelete(row._id, apiEndpoint, Cookies.get('token'))
            setAllModels((prevRows) => prevRows.filter((serv) => serv._id !== row._id));
          }}>
          <Delete />
        </IconButton>,
    }
  ]

  useEffect(() => {
    fetchData(apiEndpoint, "Models", Cookies.get('token'))
      .then(() => {
        setIsLoading(false);
      });
  }, [apiEndpoint, isLoading, isOpen]);
    
  useEffect(() => {
    setAllModels(data as modelProps[])
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
                <FormattedMessage id="admin.models" />
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
              fetchedData={AllModels}
              columns={columns}
              isLoading={isLoading}
              type="Model"
              api={`${process.env.BACKEND}mall`}
            />
          </div>
        </div>
        <AddModel open={isOpen} setOpen={setIsOpen}/>
      </div>
    );
}
 
export default Models;