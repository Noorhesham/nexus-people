import React, { useContext, useRef } from "react";
import { LanguageDirectionContext } from "@/helpers/langDirection";
import ContactForm from "../ContactForm";
import { motion, useAnimation, useInView } from 'framer-motion';

const Contact: React.FC = () => {
  const { isRTL } = useContext(LanguageDirectionContext);
  const controls = useAnimation();
  const ref = useRef(null)
  const inView = useInView(ref)

  const variants = {
    hidden: { opacity: 0, x: isRTL ? 100 : -100 },
    visible: { opacity: 1, x: 0 },
  };

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [inView, controls]);
  
  return (
    <div id="contact" className="relative bg-white Auto md:min-h-screen bg-cover bg-center">

      <div className="relative flex justify-center lg:justify-between z-5 overflow-hidden">
        <div className="absolute h-screen inset-0 w-full scale-[1.1] top-40 lg:top-16 lg:-left-20 bg-[url('/contact.webp')] bg-cover bg-center"/>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={variants}
          transition={{ duration: 1 }}
          className="w-10/12 sm:w-8/12 lg:col-start-2 mt-8 lg:col-span-2 z-[5]"
        >
          <ContactForm />
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
