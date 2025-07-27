import { Delete, Visibility } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "../content/Table";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { FormattedMessage } from "react-intl";
import { GridRowParams } from "@mui/x-data-grid";
import CrudComponent from "@/helpers/CRUD";
import Cookies from "js-cookie";
import IconButton from '@mui/material/IconButton';
import AddBlog from "../content/newBlog";

interface Blog {
  _id: string
  image: File | null;
  title: {
    ar?: string;
    en?: string;
  };
  sections: Array<{
    title: {
      ar: string;
      en: string;
    };
    content: {
      ar: string;
      en: string;
    };
  }>;
}

const Blogs = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [AllBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const apiEndpoint = `${process.env.BACKEND}auth/admin/blogs`;

  const {
    data,
    fetchData,
    handleDelete,
    handleEdit,
  } = CrudComponent({apiEndpoint: `${process.env.BACKEND}`});

  const columns =  [
    { field: 'Title', headerName: 'Title (English)', width: 150, resizable: true, valueGetter: (params: any) => params.row.title?.en || '' },
    { field: 'ArabicTitle', headerName: 'Title (Arabic)', width: 150, resizable: true, valueGetter: (params: any) => params.row.title?.ar || '' },
    { field: 'ar', headerName: 'Description (Arabic)', width: 200, resizable: true, valueGetter: (params: any) => params.row.description?.ar || '' },
    { field: 'en', headerName: 'Description (English)', width: 200, resizable: true, valueGetter: (params: any) => params.row.description?.en || '' },
    { field: 'imageCover', headerName: 'Cover Url', width: 150, resizable: true },
    { field: 'Actions', type :'actions', width: 70,
      renderCell: ({ row }: Partial<GridRowParams>) =>
        <IconButton className="hover:text-red-500" onClick={() => 
          {handleDelete(row._id, `${process.env.BACKEND}blogs`, Cookies.get('token'))
            setAllBlogs((prevRows) => prevRows.filter((serv) => serv._id !== row._id));
          }}>
          <Delete />
        </IconButton>,
    }
  ]

  useEffect(() => {
    fetchData(apiEndpoint, "Blogs", Cookies.get('token'))
      .then(() => {
        setIsLoading(false);
      });
  }, [apiEndpoint, isLoading, isOpen]);

  useEffect(() => {
    setAllBlogs(data as Blog[])
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
              <FormattedMessage id="navbar.news" />
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
            fetchedData={AllBlogs}
            columns={columns}
            isLoading={isLoading}
            api={`${process.env.BACKEND}blogs`}
            type="Blog"
          />
        </div>
      </div>
  
      <AddBlog open={isOpen} setOpen={setIsOpen} type="blogs" />

    </div>
  );
}
 
export default Blogs;