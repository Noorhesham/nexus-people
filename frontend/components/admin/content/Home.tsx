import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { TextField } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import { useDropzone } from "react-dropzone";
import Typography from "@mui/material/Typography";
import { LanguageDirectionContext } from "@/helpers/langDirection";
import { PhotoCamera } from "@mui/icons-material";
import { Button } from "@mui/material";
import CrudComponent from "@/helpers/CRUD";
import Cookies from "js-cookie";
import axios from "axios";
import LoadingButton from '@mui/lab/LoadingButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

interface Type {
  type: string;
  closeModal : () => void;
}

interface Post {
  image?: File | null;
  video?: File | null,
  alt: {
    ar: string | null;
    en: string | null;
  };
  button : {
    hyperlink?: string | null
    text:{
      ar: string | null,
      en: string | null
    }
  }

}

const options = [
  {link: '/about', text: 'About'},
  {link: '/contact', text: 'Contact'},
  {link: '/news', text: 'News'},
  {link: '/media', text: 'Media'},
  {link: '/commercial', text: 'Commercial'},
  {link: '/medical', text: 'Medical'},
  {link: '/adminstrative', text: 'Adminstrative'}

]
const isFormData = true

const HomeContent: React.FC<Type> = ({ type, closeModal }) => {
  const { isRTL } = useContext(LanguageDirectionContext);
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showText, setShowText] = useState(false);
  const [postData, setPostData] = useState<Post>({
    image: null,
    video: null,
    alt: {
      ar: null,
      en: null,
    },
    button : {
      hyperlink: null,
      text: {
        ar: null,
        en: null
      }
    }
  });

  const apiEndpoint = `${process.env.BACKEND}home/${type}`
  const {
    handleInputChange,
    handleSubmit,
  } = CrudComponent({ apiEndpoint: `${process.env.BACKEND}` });

  const onImageDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    handleInputChange('image', file, isFormData);
    setPostData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const onVideoDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    handleInputChange('video', file, isFormData);
    setPostData((prevData) => ({
      ...prevData,
      video: file,
    }));
  };

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({ onDrop: onImageDrop });
  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({ onDrop: onVideoDrop });
  
  const handleLayerText = async () => {
    try {
        await axios.put(apiEndpoint, {en: postData.alt.en ,ar: postData.alt.ar})
        .then(() => {
            setPostData({ image: null, video: null, alt: { ar: null, en: null }, button: {hyperlink: null, text: {ar: null, en: null}}}); 
            closeModal()
        })

    } catch (error) {
        
    }
  }

  const handleSubmitData = () => {
    setLoading(true);
    handleSubmit(apiEndpoint, isFormData, Cookies.get('token')) 
   .then(() => {setPostData({ image: null, video: null, alt: { ar: null, en: null }, button: {hyperlink: null, text: {ar: null, en: null}}}); 
   closeModal()}).catch(() => setLoading(false))
  }

  return (
    <main className="space-y-4 max-h-[60vh]">
      {type === "image" ? (
        <div
          dir={isRTL ? "rtl" : "ltr"}
          {...getImageRootProps()}
          className={`grid place-items-center w-full h-60 rounded-xl ${
            postData.image ? "" : "border"
          } border-dashed border-darkBlue cursor-pointer `}
        >
          <input {...getImageInputProps()} />
          {postData.image && (
            <Card className="w-full h-full">
              <CardMedia
                className="w-full h-full"
                component="img"
                image={URL.createObjectURL(postData.image)}
                alt=""
              />
            </Card>
          )}
          {!postData.image && (
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
          {...getVideoRootProps()}
          className={`grid place-items-center w-full h-60 rounded-xl ${postData.video ? '' : 'border'} border-dashed border-darkBlue cursor-pointer `}
        >
          <input {...getVideoInputProps()} />
          {postData.video && (
            <Card className="w-full h-full">
              {/* You can customize the display for the video thumbnail here if needed */}
              <CardMedia className="w-full h-full" component="video" src={URL.createObjectURL(postData.video)} />
            </Card>
          )}
          {!postData.video && (
            <>
              <PhotoCamera className="text-6xl text-darkBlue" />
              <Typography className="text-darkBlue">Supported Types: MP4, AVI, etc.</Typography>
            </>
          )}
        </div>
      )}

      <TextField
        label={"English Alt Tag"}
        variant="outlined"
        fullWidth
        value={postData.alt.en}
        onChange={(e) => handleInputChange("alt[en]", e.target.value, isFormData)}
      />

      <TextField
        label={"Arabic Alt Tag"}
        variant="outlined"
        fullWidth
        value={postData.alt.ar}
        onChange={(e) => handleInputChange("alt[ar]", e.target.value, isFormData)}      
      />

      <div className="flex justify-between">
        <Typography>
          Button
        </Typography>
        
        <Checkbox checked={showButton} onChange={() => setShowButton(!showButton)}/>
          
      </div>

      {showButton? (
        <div className="space-y-4">
          <TextField
            label={"Text"}
            variant="outlined"
            fullWidth
            value={postData.alt.en}
            onChange={(e) => handleInputChange("text[en]", e.target.value, isFormData)}
          />

          <TextField
            label={"Arabic Text"}
            variant="outlined"
            fullWidth
            value={postData.alt.ar}
            onChange={(e) => handleInputChange("text[ar]", e.target.value, isFormData)}      
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">hyperlink</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={postData.button.hyperlink}
              label="hyperlink"
              onChange={(e) => {setPostData((prev) => ({
                ...prev,
                button : {
                  ...prev.button,
                  hyperlink: e.target.value
                }
              }));handleInputChange("hyperlink", e.target.value, isFormData)}}      
              >
                {options.map((option) => (
                  <MenuItem key={option.link} value={option.link}>{option.text}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
      ) : null}

      <div className="flex justify-between">
        <Typography>
          Text
        </Typography>
        
        <Checkbox checked={showText} onChange={() => setShowText(!showText)}/>
          
      </div>

      {showText? (
        <div className="space-y-4">
          <TextField
            label={"Title"}
            variant="outlined"
            fullWidth
            value={postData.alt.en}
            onChange={(e) => handleInputChange("title[en]", e.target.value, isFormData)}
          />

          <TextField
            label={"Arabic Title"}
            variant="outlined"
            fullWidth
            value={postData.alt.ar}
            onChange={(e) => handleInputChange("title[ar]", e.target.value, isFormData)}      
          />

          <TextField
            label={<FormattedMessage id="form.description" />}
            variant="outlined"
            fullWidth
            value={postData.alt.en}
            onChange={(e) => handleInputChange("description[en]", e.target.value, isFormData)}
          />

          <TextField
            label={<FormattedMessage id="form.arabicDescription" />}
            variant="outlined"
            fullWidth
            value={postData.alt.ar}
            onChange={(e) => handleInputChange("description[ar]", e.target.value, isFormData)}      
          />
        </div>
      ) : null}

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
          onClick={() => type === 'layertext'? handleLayerText() : handleSubmitData()}
        >
          <FormattedMessage id="contact.submit" />
        </Button>
      )}
    </main>
  );
};

export default HomeContent;