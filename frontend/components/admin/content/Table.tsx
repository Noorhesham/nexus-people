import * as React from 'react';
import { DataGrid, GridColDef, GridOverlay, gridClasses } from '@mui/x-data-grid';
import TransitionsModal from './modal';
import { useEffect, useState } from 'react';
import { Skeleton } from '@mui/lab';
import CrudComponent from "@/helpers/CRUD";
import Cookies from 'js-cookie';

interface DataTableProps {
  fetchedData: any[];
  columns: GridColDef[];
  fetchModalData?: (id: number) => Promise<{ title: string; content: string }>;
  isLoading: boolean;
  api?: string
  type: string;
  ID?: string
}
  
const CustomLoadingOverlay= () => (
  <GridOverlay className='flex flex-col '>
    {[...Array(10)].map((_, index) => (
      <div key={index} className='w-full h-full'>
        <Skeleton variant="rectangular" width="100%" height="95%" animation="wave" />
      </div>
    ))}
  </GridOverlay>
)
  
export default function DataTable({ fetchedData, columns, fetchModalData, isLoading, type, api, ID }: DataTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setID] = useState(null);
  const [isLoadingOverlay, setIsLoading] = useState(true)
  var dataType = type === "Gallery" ? "Gallery" : "Brands";
  dataType = type === "Home"? "Data" : dataType
  const {
    data,
    dataObject,
    fetchData,
    fetchById,
    handleEdit,
  } = CrudComponent({apiEndpoint: `${process.env.BACKEND}`});

  const handleOpenModal = (params: any) => {
    if (type !== 'Gallery' && type !== 'Brand' && type !== 'Home') {
      fetchById(api as string, params.row._id as unknown as string, type, Cookies.get('token'))
      .then(() => {
        // Update the editObject when the data is available
        handleEdit(dataObject._id)
      })
      .finally(() => {
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error('Error fetching data by ID', error);
      });
    }
    else{
      fetchData(api as string, dataType)
      .finally(() => {
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error('Error fetching data by ID', error);
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    {isLoading? setIsLoading(true) : setIsLoading(false)}
  }, [isLoadingOverlay, isLoading]);

  return (
    <div className='h-[100vh] md:h-[120vh] xl:h-full' style={{ width: '100%', maxWidth: '100%', background: 'white', borderRadius: '20px', border: '1px solid #1b2d45' }}>
      <DataGrid
        sx={{
          [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
            outline: 'transparent',
          },
          [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: {
            outline: 'none',
          },
        }}
        slots={{
          loadingOverlay: CustomLoadingOverlay,
        }}
        className='min-h-[80%] '
        onCellDoubleClick={handleOpenModal}
        disableRowSelectionOnClick
        // onCellClick={handleOpenModal}
        style={{ border: 'none' }}
        rows={fetchedData}
        columns={columns}
        getRowId={(row) => row._id}
        initialState={{pagination: { paginationModel: { page: 0, pageSize: 10 }}}}
        loading={isLoadingOverlay}
        pageSizeOptions={[10, 20]}
      />
      <TransitionsModal type={type} ID={id} api={api as string} data={type === 'Gallery' || type === 'Brand' || type === 'Home'? data && data :dataObject && dataObject} open={isModalOpen} onClose={handleCloseModal}/>
    </div>
  );
}