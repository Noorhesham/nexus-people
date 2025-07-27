import Rating, { IconContainerProps } from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { useContext, useEffect, useState } from 'react';

interface Rev {
  text: {ar: string; en: string},
  rate: number;
  profilePic: string;
  name: {
    ar: string;
    en: string;
  }
}

interface ViewProps {
    data: any
}

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

const ViewReview = ({data}: ViewProps) => {
    const { isRTL } = useContext(LanguageDirectionContext);
    const [Review, setCurrentReview] = useState<Rev>({ 
        text: {ar: '', en: ''},
        rate: 3,
        profilePic: '',
        name: {ar: '', en: ''}
    })

    useEffect(() => {
      setCurrentReview(data)
    }, [data])

    return (  
        <Card className="mb-4 min-w-[345px] col-span-1 row-span-1">
            <CardContent>
                  <div className="flex items-center mb-2">
                      <Avatar className="mr-2" src={Review?.profilePic}></Avatar>
                      <Typography className='text-darkBlue' variant="h5" gutterBottom>
                      {isRTL? Review?.name?.ar : data.name?.en}
                      </Typography>
                  </div>
                  <StyledRating highlightSelectedOnly IconContainerComponent={IconContainer} name="read-only" value={Review?.rate} readOnly />
                  <Typography className='text-darkBlue' variant="body1">{Review?.text?.en}</Typography>
            </CardContent>
        </Card>
    );
}
 
export default ViewReview;