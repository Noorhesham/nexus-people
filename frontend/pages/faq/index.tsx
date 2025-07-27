import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { FormattedMessage } from 'react-intl';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';

interface FAQItem {
  question: {ar: string, en: string}
  answer: {ar: string, en: string}
}

const faqs: FAQItem[] = [
  {
    question: {
      ar: 'أوقات عمل العيادة؟',
      en: 'Clinic Working Hours?'
    },
    answer: {
      ar: 'جميع أيام الاسبوع من الساعة 1 مساء الي 9 مساء عدا الجمعة',
      en: 'Everyday from 1 PM till 9 PM except Friday'
    }
  },
  {
    question: {
      ar: 'أرقام للتواصل؟',
      en: 'Phone numbers to contact?'
    },
    answer: {
      ar: '+96 650 644 2831',
      en: '+96 650 644 2831'
    }
  },
];

const FAQ: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { isRTL } = React.useContext(LanguageDirectionContext);

  const toggleAccordion = (index: number) => {
    setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <div dir={isRTL? 'rtl' : 'ltr'} className="min-h-screen bg-secondary flex flex-col space-y-8">
            <div className="min-h-[60vh] w-screen relative bg-cover bg-center flex items-center justify-center"
        style={{backgroundImage: 'url("/3d/10.webp")'}}
      >
        <div className={`absolute inset-0 bg-secondary opacity-50`}></div>
        <div className={`flex flex-col items-center ${isRTL? 'space-y-4' : ''} justify-center z-[3]`}>
          <Typography textAlign={'center'} variant="h1" className="text-white">
            <FormattedMessage id='footer.faq'/>
          </Typography>

          <Breadcrumbs className="text-gray-300" aria-label="breadcrumb">
            <Link href="/" className="hover:text-white">
              <FormattedMessage id='navbar.home' />
            </Link>
            <Typography color=""><FormattedMessage id='footer.faq'/></Typography>
          </Breadcrumbs>
        </div>
      </div>

      <div className="whiteUp w-10/12 space-y-8 py-20 px-8 text-darkBlue">
          <div className='w-full space-y-4'>   
               {faqs.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expandedIndex === index}
            onChange={() => toggleAccordion(index)}
            sx={{
              
              backgroundColor: 'white',
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`faq-panel-${index}-content`}
              id={`faq-panel-${index}-header`}
            >
              <Typography variant="h6">{isRTL? faq.question.ar : faq.question.en}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1"><span dir='ltr'>{isRTL? faq.answer.ar : faq.answer.en}</span></Typography>
            </AccordionDetails>
          </Accordion>
        ))}

          </div>
      </div>


    </div>
  );
};

export default FAQ;
