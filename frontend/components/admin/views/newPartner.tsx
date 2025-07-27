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

interface newBrandProps {
  closeModal: () => void;
}

interface Post {
  image: File | null;
  alt: {
    ar: string | null;
    en: string | null;
  };
}

const isFormData = true

const NewBrand: React.FC<newBrandProps> = ({closeModal}) => {
  const { isRTL } = useContext(LanguageDirectionContext);

  const [BrandData, setBrandData] = useState<Post>({
    image: null,
    alt: {
      ar: null,
      en: null,
    },
  });

  const apiEndpoint = `${process.env.BACKEND}brands/images`
  const {
    handleInputChange,
    handleSubmit,
  } = CrudComponent({ apiEndpoint: `${process.env.BACKEND}` });

  const onImageDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    handleInputChange('image', file, isFormData);
    setBrandData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({ onDrop: onImageDrop });
  
  return (
    <main className="space-y-4">

        <div
          dir={isRTL ? "rtl" : "ltr"}
          {...getImageRootProps()}
          className={`grid place-items-center w-full h-60 rounded-xl ${
            BrandData.image ? "" : "border"
          } border-dashed border-darkBlue cursor-pointer `}
        >
          <input {...getImageInputProps()} />
          {BrandData.image && (
            <Card className="w-full h-full">
              <CardMedia
                className="w-full h-full"
                component="img"
                image={URL.createObjectURL(BrandData.image)}
                alt=""
              />
            </Card>
          )}
          {!BrandData.image && (
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

      <TextField
        label={<FormattedMessage id="brand.name" />}
        variant="outlined"
        fullWidth
        value={BrandData.alt.en}
        onChange={(e) => handleInputChange("en", e.target.value, isFormData)}
      />

      <TextField
        label={<FormattedMessage id="brand.arabicName" />}
        variant="outlined"
        fullWidth
        value={BrandData.alt.ar}
        onChange={(e) => handleInputChange('ar', e.target.value, isFormData)}
      />

      <Button
        variant="contained"
        className="bg-secondary hover:bg-primary w-full mt-8"
        onClick={() => handleSubmit(apiEndpoint, isFormData, Cookies.get('token'))
        .then(() => {setBrandData({ image: null, alt: { ar: null, en: null }}); closeModal()})}
      >
        <FormattedMessage id="contact.submit" />
      </Button>
    </main>
  );
};

export default NewBrand;