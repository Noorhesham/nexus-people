import React, { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { GridRowId } from '@mui/x-data-grid';

interface CrudComponentProps<T> {}

interface CrudFunctions<T> {
  data: T[];
  dataObject: Record<string, any>; // Change here
  fetchData: (apiEndpoint: string, key: string, token?: string) => Promise<void>;
  fetchById: (apiEndpoint: string, id: string, key:string, token?: string) => Promise<void>;
  handleCancel: () => void;
  handleInputChange: (name: any, value: any, IsFormData: boolean) => void;
  handleSubmit: (apiEndpoint: string, isFormData: boolean, token?: string) => Promise<void>;
  submitFormData: (apiEndpoint: string, formData: FormData, token?: string) => Promise<void>;
  handleDelete: (id: string | GridRowId, apiEndpoint: string, token?: string) => Promise<void>;
  handleEdit: (item: T) => Promise<void>;
  handleLike: (apiEndpoint: string, id: string, token?: string) => void;
}

const useCrudComponent = <T,>(props: CrudComponentProps<T>): CrudFunctions<T> => {
  const [data, setData] = useState<T[]>([]);
  const [dataObject, setDataObject] = useState<Record<string, any>>({}); // Change here
  const [formData, setFormData] = useState<any>({} as T);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchData = async (apiEndpoint: string, key: string, token?: string, ) => {
    try {
      const config: AxiosRequestConfig = token ? { headers: { token } } : {};
      const response = await axios.get<{ response: Record<string, T[]> }>(apiEndpoint, config);
  
      // Extract the array using the provided key or default to 'Reviews'
      const dataKey = key;
      const dataArray = response.data.response[dataKey];

      setData(dataArray); // Set only the array to the data state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const fetchById = async (apiEndpoint: string, id: string, key: string, token?: string) => {
    try {
      const config: AxiosRequestConfig = token ? { headers: { token } } : {};
      const response = await axios.get<{ response: Record<string, any> }>(`${apiEndpoint}/${id}`, config);

      const dataKey = key;
      const dataObject = response.data.response[dataKey];

      setDataObject(dataObject)
    } catch (error) {
      console.error('Error fetching data by ID:', error);
      return undefined;
    }
  };

  const handleInputChange = (name: string, value: any, isFormData: boolean) => {
    setFormData((prevData:any) => {
  
      if (name.includes('.')) {
        // Handle nested property
        const [objectName, propertyName] = name.split('.');
        return {
          ...prevData,
          [objectName]: {
            ...(prevData[objectName] as Record<string, any>),
            [propertyName]: value,
          },
        }
      } else {
        return {
          ...prevData,
          [name]: value,
        }
      }
    });
  };
  
  const handleCancel = () => {
    setFormData({} as T);
  }

  const handleSubmit = async (apiEndpoint: string, isFormData: boolean, token?: string) => {
    try {
      const config: AxiosRequestConfig = token ? { headers: { token } } : {};
      const FileFormData = new FormData();
      if (isFormData) {
        for (const [key, value] of Object.entries(formData as { [s: string]: any })) {
          FileFormData.append(key, value);
        }
      }

      if (editingId) {
        await axios.put(apiEndpoint, isFormData? FileFormData : formData, config)
      } else {
        await axios.post(apiEndpoint, isFormData? FileFormData : formData, config)
      }

      setFormData({} as T);
      setEditingId(null);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const submitFormData = async (apiEndpoint: string, formData: FormData, token? :string) => {
    try {
      const config: AxiosRequestConfig = token ? { headers: { token } } : {};

      if (editingId) {
        await axios.put(`${apiEndpoint}/${editingId}`, formData, config)
      } else {
        await axios.post(apiEndpoint, formData, config)
      }

    } catch (error) {
      console.error('Error submitting data:', error);

    }
  }

  const handleDelete = async (id: string | GridRowId, apiEndpoint: string, token?: string) => {
    try {
      const config: AxiosRequestConfig = token ? { headers: {token} }  : {};
      await axios.delete(`${apiEndpoint}/${id}`, config);

      // await fetchData(apiEndpoint, token);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEdit = async (item: T) => {
    // setFormData(item);
    // setEditingId((item as any)._id);
    setEditingId(item as any)
  };

  const handleLike = async (apiEndpoint:string, id:string, token?: string) => {
    try {
      await axios.put(`${apiEndpoint}/${id}`, '', {headers: { token }})
    } catch (error) {
      
    }
  }

  return {
    data,
    dataObject,
    fetchData,
    fetchById,
    handleCancel,
    handleInputChange,
    handleSubmit,
    submitFormData,
    handleDelete,
    handleEdit,
    handleLike,
  };
};

export default useCrudComponent;
