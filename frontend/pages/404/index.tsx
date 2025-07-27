import { LanguageDirectionContext } from "@/helpers/langDirection";
import Link from "next/link";
import { useContext } from "react";
import { FormattedMessage } from "react-intl";

const NotFound = () => {
  const { isRTL } = useContext(LanguageDirectionContext);

  return (  
    <div dir={isRTL? 'rtl' : 'ltr'} className="flex flex-col items-center justify-center h-screen bg-secondary">
      <h1 className="text-5xl font-bold text-primary">404</h1>
      <p className="text-xl text-gray-300 mb-8"><FormattedMessage id="404.oops"/></p>
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4"><FormattedMessage id="404.find"/></h2>
        <p className="text-gray-600 mb-4"><FormattedMessage id="404.move"/></p>
        <p className="text-gray-600 mb-4"><FormattedMessage id="404.back"/> <Link href="/" className="text-primary"><FormattedMessage id="404.home"/></Link></p>
      </div>
    </div>
  );
}
 
export default NotFound;
