import { FormattedMessage } from "react-intl";
import { TextField } from '@mui/material';
import { ChangeEvent, useContext, useState } from "react";
import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import { useDropzone } from 'react-dropzone';
import Typography from '@mui/material/Typography';
import { LanguageDirectionContext } from "@/helpers/langDirection";
import { PhotoCamera } from "@mui/icons-material";
import {styled} from "@mui/material/styles";
import { Rating, IconContainerProps } from "@mui/lab";
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

interface Review {
    id: number;
    author: string;
    body: string;
    rating: number;
  }

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
      color: theme.palette.action.disabled,
    },
  }));
  
  const customIcons: {
    [index: string]: {
      icon: React.ReactElement;
      label: string;
    };
  } = {
    1: {
      icon: <SentimentVeryDissatisfiedIcon color="error" />,
      label: 'Very Dissatisfied',
    },
    2: {
      icon: <SentimentDissatisfiedIcon color="error" />,
      label: 'Dissatisfied',
    },
    3: {
      icon: <SentimentSatisfiedIcon color="warning" />,
      label: 'Neutral',
    },
    4: {
      icon: <SentimentSatisfiedAltIcon color="success" />,
      label: 'Satisfied',
    },
    5: {
      icon: <SentimentVerySatisfiedIcon color="success" />,
      label: 'Very Satisfied',
    },
  };
  
  function IconContainer(props: IconContainerProps) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
  }
const NewTestimonial = () => {
    const { isRTL } = useContext(LanguageDirectionContext);
    const [ArabicContent, setArabicContent] = useState('');
    const [Image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [newReview, setNewReview] = useState<Review>({ id: 0, author: '', body: '', rating: 3 });

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedImage = event.target.files[0];
            setImage(selectedImage);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(selectedImage);
        }
    };

    const onDrop = (acceptedFiles: File[]) => {
        // Handle dropped files here (upload or process)
        const file = acceptedFiles[0];

        setImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };


    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <main className="space-y-5">
            <div dir={isRTL ? 'rtl' : 'ltr'} {...getRootProps()} className={`grid place-items-center w-full h-40 rounded-xl ${Image ? "" : "border"} border-dashed border-darkBlue cursor-pointer `}>
                <input {...getInputProps()}
                    onChange={handleInputChange}
                />
                {Image && (
                    <Card className='w-full h-full'>
                        <CardMedia
                            className='w-full h-full'
                            component="img"
                            image={previewImage || ''}
                            src=""
                            alt=""
                        />
                    </Card>
                )}
                {!Image && (
                    <>
                        <PhotoCamera className='text-6xl text-darkBlue' />
                        <Typography className='text-darkBlue'>
                            {isRTL ? 'الانواع المدعومة' : 'Supported Types '} : JPG, PNG
                        </Typography>
                    </>
                )}
            </div>

            <StyledRating
              name="highlight-selected-only"
              defaultValue={3}
              className='w-fit'
              IconContainerComponent={IconContainer}
              getLabelText={(value: number) => customIcons[value].label}
              onChange={(event, newValue) => setNewReview((prevReview) => ({ ...prevReview, rating: newValue || 0 }))}
              highlightSelectedOnly
            />

            <TextField
                label={<FormattedMessage id='contact.message' />}
                variant="outlined"
                fullWidth
                multiline
                rows={5}
                value={ArabicContent}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setArabicContent(e.target.value)}
            />
        </main>
    );
}

export default NewTestimonial;
