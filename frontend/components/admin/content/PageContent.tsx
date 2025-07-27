import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import { useDropzone } from "react-dropzone";
import Typography from "@mui/material/Typography";
import { LanguageDirectionContext } from "@/helpers/langDirection";
import { PhotoCamera } from "@mui/icons-material";
import { Button } from "@mui/material";
import CrudComponent from "@/helpers/CRUD";
import Cookies from "js-cookie";
import LoadingButton from '@mui/lab/LoadingButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

interface Type {
  type: string;
  closeModal : () => void;
  data?: any
}

interface Post {
  image?: File | string | null;
  page: string | null;
}

const options = [
  {link: 'about', text: 'About'},
  {link: 'contact', text: 'Contact'},
  {link: 'news', text: 'News'},
  {link: 'media', text: 'Media'},
  {link: 'commercial', text: 'Commercial'},
  {link: 'medical', text: 'Medical'},
  {link: 'adminstrative', text: 'Adminstrative'},
  {link: 'reviews', text: 'Reviews'}
]

const isFormData = true

const PageContent: React.FC<Type> = ({ type, closeModal, data }) => {
  const { isRTL } = useContext(LanguageDirectionContext);
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState<Post>({
    image: null,
    page: null
  });



  const apiEndpoint = `${process.env.BACKEND}background`
  const {
    handleInputChange,
    handleSubmit,
    handleEdit
  } = CrudComponent({ apiEndpoint: `${process.env.BACKEND}` });

  useEffect(() => {
    data? handleEdit(data._id) : null
    setPostData(data);

  }, [data])

  const onImageDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    handleInputChange('image', file, isFormData);
    setPostData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({ onDrop: onImageDrop });
  
  const handleSubmitData = () => {
    setLoading(true);
    data? handleSubmit(`${apiEndpoint}/${data._id}`, isFormData, Cookies.get('token')).then(() => {setPostData({ image: null, page: null}); 
    closeModal()}).catch(() => setLoading(false))
     : 
    handleSubmit(apiEndpoint, isFormData, Cookies.get('token')) 
   .then(() => {setPostData({ image: null, page: null}); 
   closeModal()}).catch(() => setLoading(false))
  }

  return (
    <main className="space-y-4 max-h-[60vh]">
      {type === "image" ? (
        <div
          dir={isRTL ? "rtl" : "ltr"}
          {...getImageRootProps()}
          className={`grid place-items-center w-full h-60 rounded-xl ${
            postData?.image ? "" : "border"
          } border-dashed border-darkBlue cursor-pointer `}
        >
          <input {...getImageInputProps()} />
          {postData?.image && (
            <Card className="w-full h-full">
              <CardMedia
                className="w-full h-full"
                component="img"
                image={typeof postData.image === 'string'? postData?.image : URL.createObjectURL(postData?.image)}
                alt=""
              />
            </Card>
          )}
          {!postData?.image && (
            <>
              <PhotoCamera className="text-6xl text-darkBlue" />
              <Typography className="text-darkBlue">
                {isRTL
                  ? "الانواع المدعومة"
                  : "Supported Types "} : JPG, PNG
              </Typography>
            </>
          )}
        </div>
      ) : null}

      {type === 'video' && (
        <div
          dir={isRTL ? 'rtl' : 'ltr'}
          {...getImageRootProps()}
          className={`grid place-items-center w-full h-60 rounded-xl ${postData?.image ? '' : 'border'} border-dashed border-darkBlue cursor-pointer `}
        >
          <input {...getImageInputProps()} />
          {postData?.image && (
            <Card className="w-full h-full">
              {/* You can customize the display for the video thumbnail here if needed */}
              <CardMedia className="w-full h-full" component="video" src={URL.createObjectURL(postData?.image as File)} />
            </Card>
          )}
          {!postData?.image && (
            <>
              <PhotoCamera className="text-6xl text-darkBlue" />
              <Typography className="text-darkBlue">Supported Types: MP4, AVI, etc.</Typography>
            </>
          )}
        </div>
      )}


        <div className="space-y-4">

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Page</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={postData?.page}
              label="Page"
              onChange={(e) => {setPostData((prev) => ({
                ...prev,
                page: e.target.value
              }));handleInputChange("page", e.target.value, isFormData)}}      
              >
                {options.map((option) => (
                  <MenuItem key={option.link} value={option.link}>{option.text}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>


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

export default PageContent;