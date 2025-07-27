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
import AddQA from "../content/newChatbotQA";

interface QA {
  _id: string
  question: { ar?: string; en?: string; };
  answer: { ar?: string; en?: string; };
}

const Chatbot = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [AllQA, setAllQA] = useState<QA[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
  
    const apiEndpoint = `${process.env.BACKEND}chatbot`;

    const {
      data,
      fetchData,
      handleDelete,
      handleEdit,
    } = CrudComponent({apiEndpoint: `${process.env.BACKEND}`});

    const columns =  [
        { field: 'Question', headerName: 'Question', width: 200, resizable: true, valueGetter: (params: any) => params.row.question?.en || '' },
        { field: 'ArabicQuestion', headerName: 'Arabic Question', width: 200, resizable: true, valueGetter: (params: any) => params.row.question?.ar || '' },
        { field: 'Answer', headerName: 'Answer', width: 200, valueGetter: (params: any) => params.row.answer?.en || ''},
        { field: 'ArabicAnswer', headerName: 'Arabic Answer', width: 200, valueGetter: (params: any) => params.row.answer?.ar || ''},
        { field: 'actions', type :'actions', width: 70,
          renderCell: ({ row }: Partial<GridRowParams>) =>
            <IconButton className="hover:text-red-500" onClick={() => 
              {handleDelete(row._id, apiEndpoint, Cookies.get('token'))
                setAllQA((prevRows) => prevRows.filter((serv) => serv._id !== row._id));
              }}>
              <Delete />
            </IconButton>,
        }
    ]

    useEffect(() => {
      fetchData(apiEndpoint, "Chatbot", Cookies.get('token'))
        .then(() => {
          setIsLoading(false);
        });
    }, [apiEndpoint, isLoading, isOpen]);
    
    useEffect(() => {
      setAllQA(data as QA[])
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
                <FormattedMessage id="bot.admin" />
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
              fetchedData={AllQA}
              columns={columns}
              isLoading={isLoading}
              type="Chatbot"
              api={`${process.env.BACKEND}chatbot`}
            />
          </div>
        </div>

        <AddQA open={isOpen} setOpen={setIsOpen} />
      </div>
    );
}
 
export default Chatbot;