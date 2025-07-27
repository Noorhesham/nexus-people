import { LanguageDirectionContext } from "@/helpers/langDirection";
import { useContext, useEffect, useState } from "react";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Balance, CloudDownload, RocketLaunch, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from "next/link";
import AlternateTimeline from "./Timeline";
import Image from "next/image";
import { Button } from "@mui/material";
import Card from '@mui/material/Card';
import axios from "axios";
import CrudComponent from "@/helpers/CRUD";

interface DataProps{
  _id: string,
  image: string,
  page: string
}

const About = () => {
  const { isRTL } = useContext(LanguageDirectionContext);
  const apiEndpoint = `${process.env.BACKEND}background`;
  const [Data, setData] = useState<DataProps[]>()
  const [AboutObject, setAboutObject] = useState<DataProps>()
  const [type, setType] = useState<'image' | 'video' | null>()
  const {
    data,
    fetchData,
  } = CrudComponent({ apiEndpoint: `${process.env.BACKEND}` });

  useEffect(() => {
    fetchData(apiEndpoint, "Background Images")
  }, [apiEndpoint]);

  useEffect(() => {
    setData(data as any);
  }, [data]);

  useEffect(() => {
    // Filter the Data array to get the object where the page value is 'about'
    const aboutData = Data?.filter((item) => item.page === 'about') || [];

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

  const handleDownloadBrochure = async () => {
    try {
      // Get the PDF URL from the API
      const response = await axios.get(`${process.env.BACKEND}portfolio/Company`);
      const pdfUrl = response.data?.portfolio[0]?.portfolio?.pdf;

      // Check if PDF URL exists
      if (pdfUrl) {
        // Fetch the PDF content as a Blob
        const pdfBlob = await axios.get(pdfUrl, { responseType: 'blob' });
        // Create a Blob URL for the PDF content
        const blobUrl = URL.createObjectURL(pdfBlob.data);
        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = blobUrl;
        // Set the download attribute to specify the filename
        link.setAttribute('download', 'Portfolio.pdf');
        // Simulate a click on the anchor element to trigger the download
        document.body.appendChild(link);
        link.click();
        // Cleanup: revoke the Blob URL
        URL.revokeObjectURL(blobUrl);
        // Cleanup: remove the anchor element
        document.body.removeChild(link);
      } else {
        console.error('PDF URL not found in the API response');
      }
    } catch (error) {
      console.error('Error downloading brochure:', error);
    }
  };

  return (  
    <main dir={isRTL? 'rtl' : 'ltr'} className="min-h-screen bg-secondary flex flex-col items-center text-white space-y-8">
      <div className="min-h-[80vh] w-screen relative border-b-4 border-white bg-cover bg-center flex items-center justify-center"
        style={{backgroundImage: type === 'image'? `url("${AboutObject?.image}")`: 'transparent'}}
      >
        {type === 'video' && AboutObject?.image && (
    <video autoPlay muted loop className="min-h-[78vh] max-h-[78vh] w-screen absolute inset-0 object-cover">
      <source src={AboutObject?.image} type="video/mp4" />
    </video>)}
        <div className={`absolute inset-0 bg-secondary opacity-50`}></div>

        <div className={`flex flex-col items-center ${isRTL? 'space-y-4' : ''} justify-center z-[3]`}>
          <Typography textAlign={'center'} variant="h1" className="text-white">
            <FormattedMessage id="navbar.about"/>
          </Typography>

          <Breadcrumbs className="text-gray-300" aria-label="breadcrumb">
            <Link href="/" className="hover:text-white">
              <FormattedMessage id="navbar.home"/>
            </Link>
            <Typography color=""><FormattedMessage id="navbar.about"/></Typography>
          </Breadcrumbs>
        </div>
      </div>

      <div className=" bg-secondary w-11/12 grid space-y-6">
        <div className="w-full bg-secondary space-y-8 py-32">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="md:col-span-3 p-4">
              <div className="w-full flex justify-center">
                <Image src={'/Ibtkar-v.svg'} alt="Ibtkar" width={300} height={400} />
              </div>

              <div>
              <Typography className="pt-4 flex" variant="body1">
                <div className="space-y-8">
                  <Typography textAlign={'center'}>
                    {isRTL? CompanyDetails.ar : CompanyDetails.en}
                  </Typography>

                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
                    <Button variant="contained" size="large" className={`${isRTL? 'md:ml-4' : ''}`} href="https://ibtkarre.com/">
                      <FormattedMessage id="knowMore" />
                    </Button>
                    <Button className="bg-secondary" onClick={handleDownloadBrochure} size="large" variant="contained" endIcon={<CloudDownload />}>
                      <FormattedMessage id="company.profile" />
                    </Button>
                  </div>
                </div>
              </Typography>
              </div>
            </Card>

            <Card>
              <div className="w-full space-y-8 px-4 py-8">
                <div className="flex w-full space-x-4 items-center mb-6">
                  <RocketLaunch className="text-4xl text-primary"/>
                  <Divider   
                    sx={{
                      "&::before, &::after": {
                        borderColor: "#8D0507",
                    }}} 
                    className="w-1/2" textAlign="left">
                    <Typography variant="h6">
                      <FormattedMessage id="about.mission" />
                    </Typography>
                  </Divider>
                </div>
                <Typography variant="body1" className={`${isRTL? "mr-5" : "ml-5"}`}>
                  {isRTL? Mission.ar : Mission.en}
                </Typography>
              </div>
            </Card>

            <Card className="md:col-span-3 lg:col-span-2 row-span-3 order-last lg:order-none">
              <AlternateTimeline />
            </Card>

            <Card>
            <div className="px-4 py-8">
            <div className="flex w-full items-center space-x-4 mb-6">
              <Visibility className="text-4xl text-primary"/>
              <Divider
                sx={{
                  "&::before, &::after": {
                    borderColor: "#8D0507",
                }}} 
                className="w-1/2" textAlign="left">
                <Typography variant="h6">
                  <FormattedMessage id="about.vision" />
                </Typography>
              </Divider>
            </div>
            <Typography variant="body1" className={`${isRTL? "mr-5" : "ml-5"}`}>
              {isRTL? vision.ar : vision.en}
            </Typography>
          </div>
            </Card>

            <Card>
            <div className="px-4 py-8">
            <div className="flex w-full items-center space-x-4 mb-6">
              <Balance className="text-4xl text-primary"/>
              <Divider
                sx={{
                  "&::before, &::after": {
                    borderColor: "#8D0507",
                }}} 
              className="w-1/2" textAlign="left">
                <Typography variant="h6">
                  <FormattedMessage id="about.goals" />
                </Typography>
              </Divider>
            </div>
            {Values.map((value) => (
              <div className={`${isRTL? "mr-5" : "ml-5"} mb-2`} key={value.title.en}>
                <Typography fontWeight={'bold'}>
                  {isRTL? value.title.ar : value.title.en}:
                </Typography>
                <Typography>
                  {isRTL? value.description.ar : value.description.en}
                </Typography>
              </div>

            ))}
            {/* <Typography variant="body1" className={`${isRTL? "mr-5" : "ml-5"}`}>
              {isRTL? Values.ar : Values.en}
            </Typography> */}
          </div>
            </Card>

            

          </div>
        </div>
      </div>

    </main>
  );
}
 
export default About;

const vision = {
  ar: 'رؤيتنا هي السعي المستمر للتميز من خلال تقديم خدمات سكنية وتجارية وطبية وإدارية شاملة تلبي جميع احتياجات العملاء.',
  en: 'Our vision is to consistently strive for excellence by delivering comprehensive residential, commercial, medical and administrative services that cater to all customer needs.'
}

const Mission = {
  ar: 'مهمتنا هي ترسيخ أنفسنا كشركة تطوير عقاري من الدرجة الأولى تتفوق في تقديم خدمات استثنائية. نحن نسعى جاهدين لوضع معايير جديدة في الصناعة، ونقدم باستمرار خدمات استثنائية تتجاوز توقعات العملاء وتترك أثرًا دائمًا.',
  en: 'Our mission is to establish ourselves as a top-tier real estate development firm that excels in delivering exceptional services. We strive to set new benchmarks in the industry, consistently delivering exceptional services that surpass customer expectations and leave a lasting impact.'
}

const Values = [
  {
    title: { ar: 'النزاهة والنزاهة', en: 'Honesty and Integrity' },
    description: { ar: 'هذه هي أساس ثقافتنا الشركاتية ونضع هذه الفضائل فوق كل شيء آخر.', en: 'These are the foundation of our company culture and we place these virtues above all else.' }
  },
  {
    title: { ar: 'الاحترافية', en: 'Professionalism' },
    description: { ar: 'من خلال أفعالنا وكلماتنا وسلوكنا ، نظهر أننا قادرون وواثقون ومحترمون ، نمثل دائمًا إبتكار بطريقة مواتية.', en: 'Through our actions, words and demeanor, we demonstrate that we are capable, confident, and respectful., always representing Ibtkar in a favorable manner.' }
  },
  {
    title: { ar: 'النتائج', en: 'Results' },
    description: { ar: 'نحن نفهم أننا مستأجرون لتقديم النتائج. نحن نسعى لتجاوز توقعات العملاء', en: 'We understand that we’re hired to deliver results. We strive to exceed client expectations' }
  }
];


const CompanyDetails ={
  ar: 'شركة ابتكار العقارية واحدة من اقدم الشركات العقارية ايضا الافضل بين شركات التطوير العقارية في مصر، ابتكار صاحبة اكبر سابقة اعمال على أرض الواقع، بداية شركة ابتكار العقارية بدأت منذ عام 2004 حتى الآن حجم الأعمال و المباني المدرجة لدينا هنا بتاريخ ذات صلة بأصول الاعمار الحديث والأعمال المعمارية المتميزة, حيث قامت الشركة ببناء أكثر من 80 مشروع وتعمل الشركة ايضاً كمنفذ لمشروعات متنوعة سكنية وإدارية وتجارية، ابتكار سهولة الاختيار.',
  en: 'IBTKAR Real Estate Company is one of the oldest real estate companies and also the best among real estate development companies in Egypt. IBTKAR has the largest business precedent on the ground. The beginning of IBTKAR Real Estate Company began in 2004 until now. The volume of business and buildings listed here have a history related to the origins of modern construction and business. Distinctive architecture, as the company has built more than 80 projects and the company also works as an implementer of various residential, administrative and commercial projects, creating ease of choice.'
}