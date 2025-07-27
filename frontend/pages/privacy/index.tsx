import React from 'react';
import Typography from '@mui/material/Typography';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { FormattedMessage } from 'react-intl';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';

const Privacy: React.FC = () => {
  const { isRTL } = React.useContext(LanguageDirectionContext);

  return (

    <div dir={isRTL? 'rtl' : 'ltr'} className="min-h-screen bg-secondary flex flex-col items-center justify-center space-y-8">
      <div className="min-h-[60vh] w-screen relative bg-cover bg-center flex items-center justify-center"
        style={{backgroundImage: 'url("/3d/10.webp")'}}
      >
        <div className={`absolute inset-0 bg-secondary opacity-50`}></div>
        <div className={`flex flex-col items-center ${isRTL? 'space-y-4' : ''} justify-center z-[3]`}>
          <Typography textAlign={'center'} variant="h1" className="text-white">
            <FormattedMessage id='footer.privacy'/>
          </Typography>

          <Breadcrumbs className="text-gray-300" aria-label="breadcrumb">
            <Link href="/" className="hover:text-white">
              <FormattedMessage id='navbar.home' />
            </Link>
            <Typography color=""><FormattedMessage id='footer.privacy'/></Typography>
          </Breadcrumbs>
        </div>
      </div>
      
      <div className="whiteUp w-10/12 space-y-8 py-20 px-8 text-darkBlue">
        <div className='space-y-6'> 

        {policy.map((Policy, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6 space-y-4">
              <Typography variant='body1'>
                  {index + 1} - {isRTL? Policy.ar : Policy.en}
              </Typography>
            </div>
          ))}

        </div>

      </div>
    </div>

    
  );
};

export default Privacy;

const policy = [
  {
    ar: "فتح ملف بون مقابل عند أي مؤسسه صحية خاصه.",
    en: "Open a medical file at no expenses in any private hospitals."
  },
  {
    ar: "الاطلاع على قائمه أسعار الخدمات الصحية.",
    en: "Access to services pricing lists in advance."
  },
  {
    ar: "الحصول على الوصفة الطبية الورقية إذا كان نظام المؤسسة الكتروني وان تكون بالاسم العلمي.",
    en: "Receive a printed copy of your medical prescription if the hospital is using an electronic system and to have all the medications Witten in their generic names. "
  },
  {
    ar: "الحصول على تقرير طبي مجاني.",
    en: "Receive your medical report at no expenses."
  },
  {
    ar: "الحصول على قيمة التكاليف المتوقعة قبل البدء بالعلاج وتزويدك بفاتورة دقيقه بالخدمة المقدمة وتكاليفها والعلاج المقترح والتشخيص بطريقة ولغة يفهمونها.",
    en: "Receive in advance all the expected expenses of treatment with a detailed bill about the delivered service and their cost."
  },
  {
    ar: "عدم إلزام المريض التوجه الا صيدليه معينه او مستشفى او مختبر محدد وللمريض حق الاختيار.",
    en: "Prohibit limiting patients to a specific pharmacy hospital or laboratory without giving them the right to choose."
  },
  {
    ar: "الحفاظ على خصوصيتك وستر العورة الا في الضرورة التي يحددها الطبيب.",
    en: "your privacy should be protected and never expose any part of unless is needed."
  },
  {
    ar: "الطلب من الطبيب او الكوادر الطبية الأخرى ان يقوم الطبيب او الكادر الطبي بتعقيم اليدين ولبس القفاز الطبي عند الكشف عليك.",
    en: "doctors and all the others health care providers are required to disinfect their hands and wear medical gloves."
  },
  {
    ar: "ان تكون على علم بتشخيص حالتك وخطه علاجك واي تأخير او مضاعفات او تأثيرات جانبيه محتمله.",
    en: "Be aware of diagnosis treatment plan, and all possible complications and side effects."
  },
  {
    ar: "الحق في معرفه اسم الطبيب المعالج او اسم الممرض والفريق الطبي المساعد.",
    en: "to know the name of your treating physician and of those who are taking care of you."
  },
  {
    ar: "عدم تصوير حالتك الا بموافقتك وان تكون لأغراض علمية.",
    en: "Naver take any picture of you or your condition without your permission and to be used only for scientific purposes."
  },
  {
    ar: "الحصول على نسخه من تقرير الخروج لتسهيل متابعتك مع الطبيب او المستشفى المحلي عند الحاجة للحصول على راي طبي اخر دون تأثير ذلك على استمراريه علاجك في المستشفى.",
    en: "Receive a copy of your discharge report to facilitate your follow up with your doctor or the local hospital if needed or to take a second medical opinion without affecting your continuing of receiving medical treatment at the hospital."
  },
  {
    ar: "ان تكون المراجعة بشكل مجاني في المؤسسات الصحية الخاصة خلال أربعة عشر يوما من تاريخ الكشف الأولي.",
    en: "A follow-up visits free of charge within fourteen days of the initial visit."
  },
  {
    ar: "للمرضى / عائلاتهم الحق في الحصول على الرعاية.",
    en: "Patients/families have the right to access to care."
  },
  {
    ar: "لمرضى / عائلاتهم الحق في أن يعاملوا باحترام، وكرامة، واحترام قيمهم، ومعتقداتهم.",
    en: "Patients/families have the right to be treated with respect, dignity, and respecting their values and believes."
  },
  {
    ar: "للمرضى / عائلاتهم الحق في الحفاظ على سرية سجلاتهم الطبية ومعلوماتهم الصحية.",
    en: "Patients/families have the right to security and confidentiality of their medical record and health information."
  },
  {
    ar: "للمرضى / عائلاتهم الحق في المشاركة في اتخاذ القرار بشأن خطط الرعاية الخاصة بهم.",
    en: "Patients/families have the right to be involved in the decision making of their care plans."
  },
  {
    ar: "للمرضى / عائلاتهم الحق في التقييم المهني وإدارة الألم.",
    en: "Patients/families have the right to professional assessment and management of pain."
  },
  {
    ar: "يحق للمرضى / عائلاتهم رفض العلاج أو التوقف عنه أو طلب رأي ثانٍ دون خوف من تعرض رعايتهم للخطر.",
    en: "Patients/families have the right to refuse or discontinue treatment or ask for a second opinion without fearing that their care may be compromised."
  },
  {
    ar: "حق للمرضى / عائلاتهم طلب تقرير طبي مفصل لتقديمه إلى المراكز الأخرى وإشعار الإجازة المرضية للأغراض التنظيمية.",
    en: "Patients/families have the right to request a detailed medical report to be presented to other centers and sick leave notification for regulatory purposes."
  },
]