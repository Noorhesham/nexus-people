import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import { useDropzone } from "react-dropzone";
import Typography from "@mui/material/Typography";
import { LanguageDirectionContext } from "@/helpers/langDirection";
import { Article, PhotoCamera } from "@mui/icons-material";
import { Button } from "@mui/material";
import CrudComponent from "@/helpers/CRUD";
import Cookies from "js-cookie";
import axios from "axios";
import LoadingButton from '@mui/lab/LoadingButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface Type {
  type: string;
  closeModal : () => void;
}

enum Categories {
    "Administrative", "Medical", "Commercial", "Home", "Company",
}  

interface Post {
  pdf?: File | null;
  category: Categories | null
}

const options = ["Administrative", "Medical", "Commercial", "Home", "Company"]

const isFormData = true

const AddBrouchure: React.FC<Type> = ({ type, closeModal }) => {
  const { isRTL } = useContext(LanguageDirectionContext);
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState<Post>({
    pdf: null,
    category: null
  });

  const apiEndpoint = `${process.env.BACKEND}portfolio`
  const {
    handleInputChange,
    handleSubmit,
  } = CrudComponent({ apiEndpoint: `${process.env.BACKEND}` });

  const onImageDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    handleInputChange('pdf', file, isFormData);
    setPostData((prevData) => ({
      ...prevData,
      pdf: file,
    }));
  };


  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({ onDrop: onImageDrop });
  

  const handleSubmitData = () => {
    setLoading(true);
    handleSubmit(apiEndpoint, isFormData, Cookies.get('token')) 
   .then(() => {setPostData({pdf: null, category: null}); 
   closeModal()}).catch(() => setLoading(false))
  }

  return (
    <main className="space-y-4 max-h-[60vh]">
      {type === "image" ? (
        <div
          dir={isRTL ? "rtl" : "ltr"}
          {...getImageRootProps()}
          className={`grid place-items-center w-full h-60 rounded-xl ${
            postData.pdf ? "" : "border"
          } border-dashed border-darkBlue cursor-pointer `}
        >
          <input {...getImageInputProps()} />
          {postData.pdf && (
            <>
            <Article className="text-6xl text-darkBlue" />
            <Typography className="text-darkBlue">
               {postData.pdf.name}
            </Typography>
          </>
          )}
          {!postData.pdf && (
            <>
              <Article className="text-6xl text-darkBlue" />
              <Typography className="text-darkBlue">
                {isRTL
                  ? "الانواع المدعومة"
                  : "Supported Types "} : PDF
              </Typography>
            </>
          )}
        </div>
      ) : null}

    <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={postData.category}
            label="Category"
            onChange={(e) => {setPostData((prev:any) => ({
            ...prev,
            category: e.target.value
            }));handleInputChange("category", e.target.value, isFormData)}}      
            >
            {options.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
        </Select>
    </FormControl>


      {loading ? (
        <LoadingButton
          variant='contained'
          loading={loading}
          className="bg-secondary hover:bg-primary w-full mt-8"
        >
          <span>
            <Typography variant='button'>
              <FormattedMessage id='contact.submit' />
            </Typography>
          </span>
        </LoadingButton>
      ) : (
        <Button
          variant="contained"
          className="bg-secondary hover:bg-primary w-full mt-8"
          onClick={() => handleSubmitData()}
        >
          <FormattedMessage id="contact.submit" />
        </Button>
      )}
    </main>
  );
};

export default AddBrouchure;