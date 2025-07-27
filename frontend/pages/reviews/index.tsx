import React, { useState, useEffect, useContext } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { FormattedMessage, useIntl } from 'react-intl';
import { styled } from '@mui/material/styles';
import Rating, { IconContainerProps } from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';
import CrudComponent from "@/helpers/CRUD";
import Cookies from 'js-cookie';
import { AuthContext } from '@/helpers/AuthContext';
import { Delete, Edit } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';

interface Review {
  _id: string;
  user: {
    name: {ar: string, en: string},
    profilePic: string
    _id: string;
  };
  text: {
    en: string;
  },
  rate: number | null;
}


interface DataProps{
  _id: string,
  image: string,
  page: string
}

const LoadingSkeleton = () => (
  <Card className='bg-white mt-4'>
  <CardHeader
    avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
    title={<Skeleton animation="wave" height={10} width="40%" style={{ marginBottom: 6 }} />}
    subheader={<Skeleton animation="wave" height={10} width="50%" />}
  />
  <Skeleton animation="wave" variant="rectangular" height={194} />
  <CardContent>
    <Skeleton animation="wave" height={20} width="80%" style={{ marginBottom: 6 }} />
    <Skeleton animation="wave" height={10} width="60%" />
  </CardContent>
</Card>
);

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
    color: theme.palette.action.disabled,
  },
}));

const customIcons: {
  [index: string]: {
    icon: React.ReactElement;
    label: {ar: string, en: string};
  };
} = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: { ar: 'مستاء جدا', en: 'Very Dissatisfied'},
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label: { ar: 'غير راض', en:'Dissatisfied'},
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: {ar: 'حيادي', en: 'Neutral'},
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: {ar: 'راضي', en: 'Satisfied'},
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: {ar: 'راض جدا', en: 'Very Satisfied'},
  },
};

function IconContainer(props: IconContainerProps) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

const Testimonials: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<Review>({ 
    _id: '', 
    user: {name : {ar: '', en: ''}, profilePic: '', _id: ''}, 
    text: {en: ''}, 
    rate: null
  });
  const { isRTL } = useContext(LanguageDirectionContext);
  const { user } = useContext(AuthContext);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true)
  const ReviewApiEndpoint = `${process.env.BACKEND}reviews`
  const [userHasReview, setUserHasReview] = useState(true)
  const [editReview, setEditReview] = useState<Review | null>(null); // New state for the review to be edited
  const [isEdit, setIsEdit] = useState(false);

  const apiEndpoint = `${process.env.BACKEND}background`;
  const [Data, setData] = useState<DataProps[]>()
  const [AboutObject, setAboutObject] = useState<DataProps>()
  const [type, setType] = useState<'image' | 'video' | null>()

  const {formatMessage} = useIntl();

  const {
    data, 
    fetchData,
    handleSubmit,
    handleInputChange,
    handleDelete,
    handleEdit
  } = CrudComponent({apiEndpoint: `${process.env.BACKEND}`});

  useEffect(() => {
    fetchData(apiEndpoint, "Background Images")
  }, [apiEndpoint]);

  useEffect(() => {
    setData(data as any);
  }, [data]);

  useEffect(() => {
    // Filter the Data array to get the object where the page value is 'about'
    const aboutData = Data?.filter((item) => item.page === 'reviews') || [];

    // Check if there's any data after filtering
    if (aboutData.length > 0) {
      // Assuming you want to get the first object if there are multiple
      const firstAboutItem = aboutData[0];
      // Do something with the filtered data...
      setAboutObject(firstAboutItem)
    }

    
  }, [Data]);

  useEffect(() => {
    // Function to determine the type of URL (image or video)
    const determineType = (url: any) => {
      if (url?.endsWith('.mp4') || url?.endsWith('.wav')) {
        setType('video');
      } else if (url?.endsWith('.png') || url?.endsWith('.jpg') || url?.endsWith('.jpeg') || url?.endsWith('.gif') || url?.endsWith('.webp')) {
        setType('image');
      } else {
        // Default to null if the type cannot be determined
        setType(null);
      }
    };

    determineType(AboutObject?.image)
  }, [Data, AboutObject]);

  
  useEffect(() => {
    
    if(reviews.some((review) => review.user?._id === user?._id) && isEdit === false){
      setUserHasReview(true)
    }
    else(
      setUserHasReview(false)
    )

  }, [reviews, isEdit])
  
  useEffect(() => {
    axios
      .get(`${process.env.BACKEND}reviews?page=1`)
      .then((res) => setReviews(res.data.response.Reviews))
      .catch((err) => console.error(err));
  }, []);

  const fetchMoreData = () => {
    axios
      .get(`${process.env.BACKEND}reviews?page=${page}`)
      .then((res) => {
        setReviews((prevItems) => [...prevItems, ...res.data.response.Reviews]);

        res.data.response.length > 0 ? setHasMore(true) : setHasMore(false);
        
      })
      .catch((err) => setHasMore(false));

    setPage((prevIndex) => prevIndex + 1);
  };



  const handleEditReview = async (
    values: { rate: number; text: { en: string } },
    { setSubmitting, resetForm }: FormikHelpers<typeof values>
  ) => {
    if (!editReview) {
      return;
    }

    let Data = {
      rate: values.rate,
      text: {
        en: values.text.en,
      },
    };
    
    try {
      await axios.put(`${ReviewApiEndpoint}/${editReview._id}`, Data, {
        headers: { token: Cookies.get('token') },
      });

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === editReview._id
            ? {
                ...review,
                text: { en: values.text.en },
                rate: values.rate,
              }
            : review
        )
      );

      setEditReview(null); // Reset the review to be edited
      setNewReview({
        _id: '',
        user: { _id: '', name: { ar: '', en: '' }, profilePic: '' },
        text: { en: '' },
        rate: null,
      });

      resetForm(); // Reset the form
    } catch (error) {
      console.error('Error updating review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = (_id: string) => {
    handleDelete(_id, ReviewApiEndpoint, Cookies.get('token') as string).then(() => {
      setReviews(prev => ( prev.filter(review => review._id !== _id)))
    })
  }
  
  const handleAddReview = async (
    values: { rate: number; text: { en: string } },
    { setSubmitting, resetForm }: FormikHelpers<typeof values>
  ) => {
    setNewReview((prevReview) => ({
      ...prevReview,
      author: isRTL ? (user?.name?.ar as string) : (user?.name?.en as string),
    }));

    let Data = {
      rate: values.rate,
      text: {
        en: values.text.en,
      },
    };

    try {
      const res = await axios.post(ReviewApiEndpoint, Data, {
        headers: { token: Cookies.get('token') },
      });

      setReviews((prevReviews) => [
        ...prevReviews,
        {
          _id: res.data.review._id,
          user: {
            _id: user?._id as string,
            name: {
              ar: user?.name?.ar as string,
              en: user?.name?.en as string,
            },
            profilePic: user?.profilePic as string,
          },
          text: { en: values.text.en },
          rate: values.rate,
        },
      ]);

      setNewReview({
        _id: '',
        user: { _id: '', name: { ar: '', en: '' }, profilePic: '' },
        text: { en: '' },
        rate: null,
      });

      resetForm(); // Reset the form
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const reviewSchema = Yup.object().shape({
    rate: Yup.number().min(1, formatMessage({ id: "review.rate.required"})).required(formatMessage({ id: "review.rate.required"})),
    text: Yup.object({
      en: Yup.string().required(formatMessage({ id: "review.text.required"})),
    }),
  });

  return (
    <main dir={isRTL? 'rtl' : 'ltr'} className='min-h-screen bg-secondary space-y-8 flex flex-col items-center w-full'>

      <div className="min-h-[80vh] border-b-4  w-screen relative bg-cover bg-center flex items-center justify-center"
        style={{backgroundImage: type === 'image'? `url("${AboutObject?.image}")`: 'transparent'}}
      >
        {type === 'video' && AboutObject?.image && (
          <video autoPlay muted loop className="min-h-[78vh] max-h-[78vh] w-screen absolute inset-0 object-cover">
            <source src={AboutObject?.image} type="video/mp4" />
          </video>
        )}
        <div className={`absolute inset-0 bg-secondary opacity-50`}></div>
          <div className={`flex flex-col items-center ${isRTL? 'space-y-4' : ''} justify-center z-[3]`}>
            <Typography textAlign={'center'} variant="h1" className="text-white">
              <FormattedMessage id='navbar.testimonials'/>
            </Typography>

            <Breadcrumbs className="text-gray-300" aria-label="breadcrumb">
              <Link href="/" className="hover:text-white">
                <FormattedMessage id='navbar.home' />
              </Link>
              <Typography color=""><FormattedMessage id='navbar.testimonials'/></Typography>
            </Breadcrumbs>
          </div>
      </div>

    <div className='w-full grid place-items-center py-16 md:py-20 bg-secondary'>
      <div className="w-11/12 md:w-8/12 grid md:grid-cols-3 gap-8">        
        <div className='md:col-span-2'>
          <InfiniteScroll
            dataLength={reviews?.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<LoadingSkeleton />}
          >
            <div className='grid md:grid-cols-2 grid-row-4 gap-4'>
              {reviews?.map((review) => (
                <Card key={review._id} className="mb-4 col-span-1 row-span-1">
                  <CardContent className='w-full'>
                    <div className="flex items-center mb-2 w-full">
                      <Avatar src={review.user?.profilePic} className="mr-2">{isRTL? review?.user?.name?.ar.charAt(0) : review?.user?.name?.en.charAt(0)}</Avatar>
                      <Typography className='text-secondary w-full' variant="h6" gutterBottom>
                        {isRTL? review?.user?.name?.ar : review?.user?.name?.en}
                      </Typography>
                        { user?._id === review?.user?._id? (
                          <div className='flex justify-end w-full'>
                            <div>
                              <IconButton className='hover:text-yellow-500' onClick={() => {setIsEdit(!isEdit); setEditReview(review)}}>
                                <Edit fontSize='small'/>
                              </IconButton>
                              <IconButton className='hover:text-red-500' onClick={() => handleDeleteReview(review._id)}>
                                <Delete fontSize='small'/>
                              </IconButton>
                            </div>
                          </div>
                        ) : null}
                    </div>
                    
                    <StyledRating 
                      highlightSelectedOnly 
                      IconContainerComponent={IconContainer} 
                      name="read-only" 
                      value={review.rate}
                      defaultValue={review.rate as number} 
                      readOnly 
                    />
                    
                    <Typography className='text-darkBlue' variant="body1">
                      {review.text.en}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          </InfiniteScroll>
        </div>

        <Card className='h-fit order-first md:sticky md:top-20'>
          <CardContent>
            {user? (
              <Formik 
                initialValues={{
                  rate: isEdit ? editReview?.rate || 0 : 0,
                  text: { en: isEdit ? editReview?.text.en || '' : '' },
                }}                
                validationSchema={reviewSchema} 
                onSubmit={isEdit ? handleEditReview : handleAddReview}
                >
                <Form className="mb-4 space-y-4 flex flex-col ">
                  <div className='flex items-center '>
                    <Field name="rate">
                      {({ field }: any) => (
                        <div>
                          <StyledRating
                            name="rate"
                            // defaultValue={null}
                            className='w-fit'
                            {...field}
                            disabled={userHasReview}
                            value={isEdit? editReview?.rate : newReview.rate}
                            IconContainerComponent={IconContainer}
                            getLabelText={(value: number) => isRTL ? customIcons[value].label.ar : customIcons[value].label.en}
                            onChange={(e, newValue) => {
                              field.onChange(e);
                              if(newValue !== null) {
                                isEdit?
                                  setEditReview((prevReview: Review | null) => ({ 
                                    ...prevReview!,
                                    rate: newValue
                                  })):
                                setNewReview((prevReview) => ({ ...prevReview, rate: newValue || null }));
                              }
                            }}
                            highlightSelectedOnly
                          />
                        </div>
                      )}
                    </Field>

                    <Typography variant="caption" className="mx-2">
                      {newReview.rate === null? null : (isRTL? customIcons[newReview.rate]?.label.ar : customIcons[newReview.rate]?.label.en)}
                    </Typography>
                  </div>

                  <ErrorMessage name="rate" component="div" className="text-red-500" />

                  <Field name="text.en">
                    {({ field }: any) => (
                      <TextField
                        {...field}
                        label={<FormattedMessage id='review.label' />}
                        multiline
                        color='secondary'
                        rows={4}
                        fullWidth
                        disabled={userHasReview}
                        value={isEdit? editReview?.text.en : newReview.text.en}
                        margin="normal"
                        variant='outlined'
                        className='bg-white'
                        onChange={(e) => {
                          field.onChange(e);
                          isEdit? 
                            setEditReview((prevReview: Review | null) => ({ 
                              ...prevReview!,
                              text: { en: e.target.value}
                            })):
                            setNewReview((prevReview) => ({ 
                              ...prevReview,
                              text: { en: e.target.value}
                            }))
                          }
                        }
                      />
                    )}
                  </Field>
                  <ErrorMessage name="text.en" component="div" className="text-red-500" />

                  <Button 
                    disabled={userHasReview}
                    type='submit' 
                    variant="contained" 
                    className='bg-secondary w-fit hover:bg-primary' 
                    color="primary" 
                  >
                    <FormattedMessage id='contact.submit'/>
                  </Button>
                </Form>
              </Formik>

            ) : (
              <div className='grid place-items-center gap-2'>
                <Typography variant='h6' className='font-bold'>
                  <FormattedMessage id='review.question' />
                </Typography>
                <div className='flex'>
                  <Link href={'/sign'}>
                    <Typography className='text-primary font-bold'>
                      <FormattedMessage id='login.login'/>
                    </Typography>
                  </Link>
                  <Typography>
                    &nbsp;<FormattedMessage id='review.login' />
                  </Typography>
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  </main>
  );
};

export default Testimonials;