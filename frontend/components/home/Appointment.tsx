import * as React from 'react';
import Link from 'next/link';
import { Face2 } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from 'react-intl';

const Appointment = () => {
  return (
    <main className="min-h-screen bg-[url('/contact.jpg')] bg-opacity-75 flex items-center justify-center bg-fixed bg-center bg-cover">
      <div className="space-y-8 flex flex-col items-center justify-center text-darkBlue">
        <Face2  className='text-8xl text-darkBlue'/>
        <Typography variant='h2'>
          <FormattedMessage id='appointment.head'/>
        </Typography>
        <Typography variant='h6'>
          <FormattedMessage id='appointment.sub'/>
        </Typography>
        <Link className="bg-darkBlue hover:bg-Baige text-white font-bold py-2 px-4 rounded" href="/appointment">
          <Typography variant='button'>
            <FormattedMessage id='appointment.book'/>
          </Typography>
        </Link>
      </div>
    </main>
  );
};

export default Appointment;
