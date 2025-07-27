import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { FormattedMessage } from 'react-intl';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';

const Terms: React.FC = () => {
  const { isRTL } = React.useContext(LanguageDirectionContext);
  
  return (
    <div dir={isRTL? 'rtl' : 'ltr'} className="min-h-screen bg-secondary flex flex-col items-center justify-center space-y-8">
      <div className="min-h-[60vh] w-screen relative bg-cover bg-center flex items-center justify-center"
        style={{backgroundImage: 'url("/3d/10.jpg")'}}
      >
        <div className={`absolute inset-0 bg-secondary opacity-50`}></div>
        <div className={`flex flex-col items-center ${isRTL? 'space-y-4' : ''} justify-center z-[3]`}>
          <Typography textAlign={'center'} variant="h1" className="text-white">
            <FormattedMessage id='footer.terms'/>
          </Typography>

          <Breadcrumbs className="text-gray-300" aria-label="breadcrumb">
            <Link href="/" className="hover:text-white">
              <FormattedMessage id='navbar.home' />
            </Link>
            <Typography color=""><FormattedMessage id='footer.terms'/></Typography>
          </Breadcrumbs>
        </div>
      </div>

      <div className="whiteUp w-10/12 space-y-8 py-20 px-8 text-darkBlue">
        <div className='space-y-6'>
          {conditions.map((term, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6 space-y-4">
              <Typography variant='body1'>
                  {index + 1} - {isRTL? term.ar : term.en}
              </Typography>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Terms;

const conditions = [
  {ar: "التعامل مع موظفي العيادة والمرضى والأخرين بأسلوب لائق واحترام خصوصياتهم.", en: "You have responsibility to deal with clinic staff and other patients in a decent manner and respect their privacy."},
  {ar: "اتباع تعليمات الامن والسلامة المعتمدة في العيادة وحماية واحترام ممتلكات العيادة.", en: "You are responsible to observe safety and security regulations in the health facility and protecting and respecting the center's properties."},
  {ar: "احترام سياسات وإجراءات المركز والالتزام بها مثل سياسات مكافحة العدوى، وسياسات عدم التدخين، وسياسات السلامة.... إلخ.", en: "Respecting and abiding by the center policies and procedures such as infection control policies, no smoking policy, safety policies….etc."},
  {ar: "إعطاء معلومات دقيقه عن حالتك المرضية السابقة والراهنة ومعلومات عن أي تغيرات في الحالة.", en: "You are responsible to provide accurate and complete information about present and past illness history and any change in your health."},
  {ar: "توفير معلومات دقيقة وكاملة، عن الشكاوى الطبية، والأمراض السابقة، والاستشفاء، والأدوية، والألم، وغير ذلك من الأمور المتعلقة بصحتك.", en: "Providing, to the best of their knowledge, accurate and complete information about medical complaints, past illnesses, hospitalizations, medications, pain, and other matters relating to their health."},
  {ar: "فهم حالتك المرضية قبل توقيع أي تعهد او موافقه مسبقة للعلاج.", en: "You are responsible for understanding your health problem before giving any consent for treatment."},
  {ar: "اتباع سياسة عدم التدخين المعمول بها في المنشاة والتدخين في الأماكن المخصصة لذلك.", en: "Following the clinic rules and regulations."},
  {ar: "اتباع قواعد ولوائح العيادة.", en: "You are responsible to adopt no smoking policy in the health facility except in specialized places for smoking."},
  {ar: "اتباع تعليمات الكادر الطبي المسؤول عن حالتك والابلاغ في حاله عدم القدرة على اتباع الخطة العلاجية والتعليمات الطبية.", en: "You are responsible to follow the instructions and medical order of your treating team and to tell them if you are unable to follow or not willing to follow the treatment plan."},
  {ar: "المسؤولية عن عواقب رفض العلاج او جزء منه.", en: "You are responsible for the consequences of refusing the treatment."},
  {ar: "المسؤولية عن حضورك على موعدك في العيادة وعليك ابلاغ قسم المواعيد في حاله الرغبة بعدم الحضور على الموعد او تأجيله.", en: "You are responsible for keeping your appointment if you cannot keep the appointment office/ call center as early as possible."},
  {ar: "دفع التكاليف العلاجية والخدمات المقدمة على نفقتك الخاصة.", en: "You assume the financial responsibility of either paying for all services rendered through third party payers (your insurance company) or being personally liable."},
  {ar: "في حال عدم التزام المريض او من يمثله بتعليمات العيادة وانظمته سواء الطبية او الإدارية فانه يحق لإدارة العيادة إلزامه بالمغادرة مباشره.", en: "In case you do not comply with our clinic rules and regulations either medical administrative or financial we have the right to ask you to leave."},
]