import React, { useContext, useState } from 'react';
import Link from "next/link"
import {FormattedMessage, useIntl} from "react-intl"
import classNames from 'classnames';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import {Facebook, Instagram, Twitter, ArrowRight, ArrowLeft, Send, Place, LocalPhone, Email, Pinterest, YouTube, LinkedIn, MusicNote} from "@mui/icons-material"
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CrudComponent from "@/helpers/CRUD";
import Image from 'next/image';
import { Button, SvgIcon } from '@mui/material';
import TextField from '@mui/material/TextField';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';

const links = [
  {id: 'navbar.home', link: '/' },
  {id: 'navbar.about', link: '/about' },
  {id: 'floor.adminstrative', link: '/adminstrative' },
  {id: 'floor.medical', link: '/medical' },
  {id: 'floor.commercial', link: '/commercial' },
  {id: 'navbar.contact', link: '/contact' },
  // {id: 'navbar.appointment', link: '/appointment' },
  {id: 'navbar.testimonials', link: '/reviews' },
  {id: 'gallery.head',  link: '/media'},
  {id: 'navbar.news',  link: '/news'}
]

const Footer: React.FC = () => {
  const { isRTL } = useContext(LanguageDirectionContext);
  const apiEndpoint = `${process.env.BACKEND}newsletter`;
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [email, setEmail] = useState('')
  const {
    handleInputChange,
    handleSubmit
  } = CrudComponent({});

  const {formatMessage} = useIntl();

  const ConnectionValidationSchema = Yup.object({
    email: Yup.string()
      .email(formatMessage({ id: 'contact.email.invalid' }))
      .required(formatMessage({ id: 'contact.email.error' })),
  });
  
  return (
    <footer id='footer' dir={isRTL? 'rtl' : 'ltr'} className= {classNames(`${isRTL ? 'arabic' : 'english'}`,"  justify-center bg-secondary border-t-2 border-white w-full py-6 px-4")}>
      <div className='grid md:grid-col-2 lg:grid-cols-4 gap-8 bg-white w-full py-4 px-4 rounded-xl  '>
        <div className='col-span-1 md:mt-6'>
          <div className='flex justify-center mb-4'>
            <Image src={'/nexus.svg'} alt='' width={130} height={100} />
          </div>
          <div className='space-y-4 grid'>

            <div className={`space-x-2 ${isRTL? 'lg:pr-20': 'lg:pl-20'} flex items-center`}>
              <Place className='text-2xl text-primary'/>
              <Typography className={`${isRTL? 'pr-2' : ''}`}>
                {isRTL? 'شارع محجوب - التسعين الجنوبي - التجمع الخامس': 'Mahgoub st, Southern Teseen, Fifth Settlement'}
              </Typography>
            </div>

            <div className={`space-x-2 ${isRTL? 'lg:pr-20': 'lg:pl-20'} flex items-center`}>
              <LocalPhone className='text-2xl text-primary'/>
              <div dir='ltr'>
                <Typography className={`${isRTL? 'pr-2' : ''}`}>
                  {isRTL? "۱٦۳۲۱" : 16321}
                </Typography>
              </div>
            </div>

            <div className={`space-x-2 ${isRTL? 'lg:pr-20': 'lg:pl-20'} flex items-center`}>
              <Email className='text-2xl text-primary'/>
              <Typography className={`${isRTL? 'pr-2' : ''}`}>
                info@ibtkaree.com
              </Typography>
            </div>

            {/* <Typography>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
            </Typography> */}

            <Divider variant='middle'/>

              <div dir='ltr' className='space-x-4 flex justify-center'>
                <a href="https://www.pinterest.com/ibtkarofficial" target='_blank'>
                  <Pinterest className='text-secondary hover:text-primary cursor-pointer scale-125'/>
                </a>

                <a href="https://www.instagram.com/ibtkar.official" target='_blank'>
                  <Instagram className='text-secondary hover:text-primary cursor-pointer scale-125'/>
                </a>

                <a href="https://www.tiktok.com/@ibtkarr" target='_blank'>
                  <SvgIcon className='text-secondary hover:text-primary cursor-pointer scale-125'>
                    <svg width="24" height="24" viewBox="0 0 512 512" id="icons" xmlns="http://www.w3.org/2000/svg"><path d="M412.19,118.66a109.27,109.27,0,0,1-9.45-5.5,132.87,132.87,0,0,1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14,23.9,350,16,350.13,16H267.69V334.78c0,4.28,0,8.51-.18,12.69,0,.52-.05,1-.08,1.56,0,.23,0,.47-.05.71,0,.06,0,.12,0,.18a70,70,0,0,1-35.22,55.56,68.8,68.8,0,0,1-34.11,9c-38.41,0-69.54-31.32-69.54-70s31.13-70,69.54-70a68.9,68.9,0,0,1,21.41,3.39l.1-83.94a153.14,153.14,0,0,0-118,34.52,161.79,161.79,0,0,0-35.3,43.53c-3.48,6-16.61,30.11-18.2,69.24-1,22.21,5.67,45.22,8.85,54.73v.2c2,5.6,9.75,24.71,22.38,40.82A167.53,167.53,0,0,0,115,470.66v-.2l.2.2C155.11,497.78,199.36,496,199.36,496c7.66-.31,33.32,0,62.46-13.81,32.32-15.31,50.72-38.12,50.72-38.12a158.46,158.46,0,0,0,27.64-45.93c7.46-19.61,9.95-43.13,9.95-52.53V176.49c1,.6,14.32,9.41,14.32,9.41s19.19,12.3,49.13,20.31c21.48,5.7,50.42,6.9,50.42,6.9V131.27C453.86,132.37,433.27,129.17,412.19,118.66Z"/></svg>
                  </SvgIcon>
                </a>

                <a href="https://www.youtube.com/@ibtkar.official" target='_blank'>
                  <YouTube className='text-secondary hover:text-primary cursor-pointer scale-125'/>
                </a>

                <a href="https://www.linkedin.com/company/ibtkarofficial" target='_blank'>
                  <LinkedIn className='text-secondary hover:text-primary cursor-pointer scale-125'/>
                </a>
              </div>
          </div>
        </div>

        <div className='grid lg:grid-cols-2 lg:items-center md:ml-6 lg:col-span-2 relative lg:-top-2'>
          <div className='col-span-1 space-y-4 md:grid md:pt-5'>
            <Divider variant='middle' textAlign='left' className='w-1/2'>
              <Typography variant='h5'>
                <FormattedMessage id='footer.pages'/>
              </Typography>
            </Divider>

            <div className='space-y-8'>
              <div className='grid grid-cols-2 gap-y-1 md:w-10/12'>
                {links.map((link) => {
                  return (
                    <Link href={link.link} key={link.id} className='text-darkBlue  w-fit hover:text-primary cursor-pointer'>
                      <Typography variant='subtitle1'>
                        {isRTL? <ArrowLeft className='text-primary'/> :<ArrowRight className='text-primary'/>}
                        <FormattedMessage id={link.id} />
                      </Typography>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>


          <div className='space-y-4 md:mt-3 grid place-items-center md:place-items-start'>
            <Divider variant='middle' textAlign={isSmallScreen? 'center' : 'left'} className='w-1/2'>
              <Typography variant='h5'>
                <FormattedMessage id='footer.member'/>
              </Typography>
            </Divider>

            <div className='space-y-5 grid'>
              <Typography textAlign={`${isSmallScreen? 'center' : 'left'}`} className='lg:w-8/12 md:ml-4'>
                <FormattedMessage id='newsletter.description'/>
              </Typography>
              
              <div className='relative  md:ml-4'>
                <Formik
                  initialValues={{email: ''}}
                  validationSchema={ConnectionValidationSchema}
                  onSubmit={() => {
                    handleSubmit(apiEndpoint, false).then(() => {
                      setEmail('')
                    })
                  }}
                >
                  <Form>
                    <div className='flex justify-center md:justify-start'>
                      <Field name='email'>
                        {({ field }: any) => (
                          <div className='flex'>
                            <TextField
                              label={<FormattedMessage id='form.email' />}
                              variant="standard"
                              fullWidth
                              value={email}
                              color='secondary'
                              {...field}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { field.onChange(e); setEmail(e.target.value); handleInputChange('email', e.target.value, false)}}
                            />
                          </div>
                        )}
                      </Field>

                      <Button  type='submit' aria-label="Newsletter" className='bg-primary text-white h-14 scale-75 hover:bg-secondary w-fit'>
                        <Send className={`${isRTL? '-rotate-[135deg] -translate-x-1 -translate-y-1' : '-rotate-[35deg] translate-x-1 -translate-y-1'} scale-125 `}/>
                      </Button>
                    </div>

                    <ErrorMessage name="email" component="div" className="text-red-500" />
                  </Form>
                </Formik>
              </div>
            </div>
          </div>
        </div>

        <div className='col-span-1 md:mt-4'>
          <div className='flex justify-center mb-4'>
            <Image src={'/Ibtkar.svg'} alt='' width={135} height={100} />
          </div>
          <div className='space-y-4'>
            <div className={`space-x-2 ${isRTL? 'lg:pr-20': 'lg:pl-20'} flex items-center`}>
              <Place className='text-2xl text-primary'/>
              <Typography className={`${isRTL? 'pr-2' : ''}`}>
                <FormattedMessage id='company.address' />
              </Typography>
            </div>

            <div className={`space-x-2 ${isRTL? 'lg:pr-20': 'lg:pl-20'} flex items-center`}>
              <LocalPhone className='text-2xl text-primary'/>
              <div dir='ltr'>
                <Typography className={`${isRTL? 'pr-2' : ''}`}>
                  {isRTL? "۱٦۳۲۱" : 16321}
                </Typography>
              </div>
            </div>

            <div className={`space-x-2 ${isRTL? 'lg:pr-20': 'lg:pl-20'} flex items-center`}>
              <Email className='text-2xl text-primary'/>
              <Typography className={`${isRTL? 'pr-2' : ''}`}>
                info@ibtkaree.com
              </Typography>
            </div>

            <Divider variant='middle'/>

            <div dir='ltr' className='space-x-4 flex justify-center'>
              <a href="https://www.pinterest.com/ibtkarofficial" target='_blank'>
                <Pinterest className='text-secondary hover:text-primary cursor-pointer scale-125'/>
              </a>

              <a href="https://www.instagram.com/ibtkar.official" target='_blank'>
                <Instagram className='text-secondary hover:text-primary cursor-pointer scale-125'/>
              </a>

              <a href="https://www.tiktok.com/@ibtkarr" target='_blank'>
                <SvgIcon className='text-secondary hover:text-primary cursor-pointer scale-125'>
                  <svg width="24" height="24" viewBox="0 0 512 512" id="icons" xmlns="http://www.w3.org/2000/svg"><path d="M412.19,118.66a109.27,109.27,0,0,1-9.45-5.5,132.87,132.87,0,0,1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14,23.9,350,16,350.13,16H267.69V334.78c0,4.28,0,8.51-.18,12.69,0,.52-.05,1-.08,1.56,0,.23,0,.47-.05.71,0,.06,0,.12,0,.18a70,70,0,0,1-35.22,55.56,68.8,68.8,0,0,1-34.11,9c-38.41,0-69.54-31.32-69.54-70s31.13-70,69.54-70a68.9,68.9,0,0,1,21.41,3.39l.1-83.94a153.14,153.14,0,0,0-118,34.52,161.79,161.79,0,0,0-35.3,43.53c-3.48,6-16.61,30.11-18.2,69.24-1,22.21,5.67,45.22,8.85,54.73v.2c2,5.6,9.75,24.71,22.38,40.82A167.53,167.53,0,0,0,115,470.66v-.2l.2.2C155.11,497.78,199.36,496,199.36,496c7.66-.31,33.32,0,62.46-13.81,32.32-15.31,50.72-38.12,50.72-38.12a158.46,158.46,0,0,0,27.64-45.93c7.46-19.61,9.95-43.13,9.95-52.53V176.49c1,.6,14.32,9.41,14.32,9.41s19.19,12.3,49.13,20.31c21.48,5.7,50.42,6.9,50.42,6.9V131.27C453.86,132.37,433.27,129.17,412.19,118.66Z"/></svg>
                </SvgIcon>
              </a>

              <a href="https://www.youtube.com/@ibtkar.official" target='_blank'>
                <YouTube className='text-secondary hover:text-primary cursor-pointer scale-125'/>
              </a>

              <a href="https://www.linkedin.com/company/ibtkarofficial" target='_blank'>
                <LinkedIn className='text-secondary hover:text-primary cursor-pointer scale-125'/>
              </a>

            </div>
          </div>
        </div>
      </div> 
      <div className="p-4 text-white bg-secondary w-full text-center space-y-4">
        <div className='space-y-1'>
          <Typography variant='body1' className='font-bold flex justify-center'>
            &copy; {new Date().getFullYear()}&nbsp; <Image src={'/nexusWhite.svg'} alt='Nexus' width={64} height={64} />. <FormattedMessage id="footer.copyrights" />
          </Typography>

          {/* <Typography variant='body2'>
            <Link className='hover:text-primary' href={"/terms"}><FormattedMessage id="footer.terms" /></Link> | <Link className='hover:text-primary' href="/privacy"><FormattedMessage id="footer.privacy" /></Link> | <Link className='hover:text-primary' href="/faq"><FormattedMessage id="footer.faq" /></Link>
          </Typography> */}
        </div>

        <Divider className='w-full bg-white'/>

        <div className='flex flex-col sm:flex-row justify-center sm:space-x-8'>
          <div className='space-y-1'>
            <div className='flex items-center space-x-2 justify-center'>
              <Typography className={`mt-2 ${isRTL? 'ml-1': ''}`}>
                <FormattedMessage id='footer.project' />
              </Typography>
              <Link title='Ibtkar' href={'https://ibtkarre.com/'}>
                <Image src={'/ibtkarWhite.svg'} className='hover:scale-[1.1] transition duration-300 ease' alt='' width={100} height={100} />
              </Link>
            </div>
          </div>
          <div className='space-y-1'>
            <div className='flex items-center space-x-2 justify-center'>
              <Typography className={`mt-2 ${isRTL? 'ml-1 mr-4': ''}`}>
                <FormattedMessage id='footer.developedBy' />
              </Typography>
              <Link title='Megazoon' href={'https://megazoon.com/'}>
                <Image src={'/megazoon.svg'} className='hover:scale-[1.1] transition duration-300 ease' alt='' width={100} height={100} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;