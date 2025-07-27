import React, { useContext, useState } from "react";
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

interface Type {
  type: string;
  closeModal : () => void;
}

interface Post {
  image?: File | null;
  video?: File | null,
  text: {
    ar: string | null;
    en: string | null;
  };
}

const isFormData = true

const NewGallery: React.FC<Type> = ({ type, closeModal }) => {
  const { isRTL } = useContext(LanguageDirectionContext);

  const [postData, setPostData] = useState<Post>({
    image: null,
    video: null,
    text: {
      ar: null,
      en: null,
    },
  });

  const apiEndpoint = `${process.env.BACKEND}gallery/${type === 'Image'? 'images': 'videos'}`
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
  
  return (
    <main className="space-y-4">
      {type === "Image" ? (
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

      {type === 'Video' && (
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
        value={postData.text.en}
        onChange={(e) => handleInputChange("en", e.target.value, isFormData)}
      />
      <TextField
        label={"Arabic Alt Tag"}
        variant="outlined"
        fullWidth
        value={postData.text.ar}
        onChange={(e) => handleInputChange('ar', e.target.value, isFormData)}
      />

      <Button
        variant="contained"
        className="bg-secondary hover:bg-primary w-full mt-8"
        onClick={() => handleSubmit(apiEndpoint, isFormData, Cookies.get('token'))
        .then(() => {setPostData({ image: null, video: null, text: { ar: null, en: null }}); closeModal()})}
      >
        <FormattedMessage id="contact.submit" />
      </Button>
    </main>
  );
};

export default NewGallery;