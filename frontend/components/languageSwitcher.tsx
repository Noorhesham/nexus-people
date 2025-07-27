import React, { useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { Language } from '@mui/icons-material';
import classNames from 'classnames';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

interface LanguageProps {
  backgroundColor: string,
}

const LanguageSwitcher: React.FC<LanguageProps> = ({backgroundColor}) => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const { locale }:any = router;
  const [selectedLocale, setSelectedLocale] = useState<string>(locale);
  const optionsRef = useRef<any>(null);

  const handleLanguageChange = (event:any) => {
    const newLocale = event.target.value;
    setSelectedLocale(newLocale);

    router.replace(router.pathname, router.asPath, { locale: newLocale });
  };


  const isRTL = selectedLocale === 'ar';


  return (
    <div dir={isRTL? 'rtl' : 'ltr'} className={classNames({ 'english': selectedLocale === 'en', 'arabic': selectedLocale === 'ar' })}>
      <div className='relative'>
        <div className=''>
          <button ref={optionsRef} className='mt-2 scale-[0.75] md:scale-100' aria-label='Language' onClick={() => handleLanguageChange({ target: {value: selectedLocale === 'ar'? 'en' : 'ar'}})}>
            {selectedLocale === 'ar' ? <Image src={'/egypt.webp'} alt='arabic' width={400} height={400} className='w-8'/> : null}
            {selectedLocale === 'en' ? <Image src={'/uk.webp'} alt='english' width={400} height={400} className='w-8'/> : null}

            {/* <Language className={`${backgroundColor} cursor-pointer hover:text-primary scale-125 mt-1`} /> */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;