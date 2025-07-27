import React, { useEffect, useState } from 'react';
import { Link } from 'react-scroll';
import { AccountBalance, Architecture, DesignServices, Handshake, Home, Info, PhoneAndroid, Place } from '@mui/icons-material';
import { motion } from 'framer-motion'
import { LanguageDirectionContext } from '@/helpers/langDirection';
import Tooltip from '@mui/material/Tooltip';
import { FormattedMessage } from 'react-intl';

const sections = [
  {section: 'info', title: 'floor.info'},
  {section: 'interior', title: 'floor.interior'},
  {section: 'plan', title: 'floor.plan'},
  {section: 'location', title: 'floor.location'},
];

const ProjectNavigation = () => {
  const [activeSection, setActiveSection] = useState(sections[0].section);
  const { isRTL } = React.useContext(LanguageDirectionContext);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
    
  const getIconColor = (sectionName: string) => {
    return sectionName === activeSection ? 'text-primary' : 'text-secondary';
  };

  const getIconScale = (sectionName: string) => {
    return sectionName === activeSection ? 'scale-[1.5]' : 'scale-[1]';
  };

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    for (const section of sections) {
      const element = document.getElementById(section.section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
          setActiveSection(section.section);
          break;
        }
      }
    }
  };

  return (
    <main className='min-h-screen flex items-center fixed z-[8]'>
      <nav dir={isRTL? 'rtl' : 'ltr'} className={`fixed hidden md:grid ${isRTL? "left-4" : "right-4"} w-16  z-[8]`}>
        <div className="border border-white rounded-3xl shadow-md bg-white">
          <div className="items-center justify-between py-4">
            <div className="flex flex-col justify-center items-center space-y-4">
              {sections.map((section) => (
                <Link
                  key={section.section}
                  to={section.section}
                  href={section.section}
                  smooth={true}
                  className={`hover:text-primary cursor-pointer ${getIconColor(section.section)}`}
                >
                  <Tooltip title={<FormattedMessage id={section.title}/>} arrow placement='left'>
                    <motion.div className={`${getIconScale(section.section)} hover:scale-150 transiton ease duration-300`}>
                      {section.section === 'info' && <Info />}
                      {section.section === 'interior' && <DesignServices />}
                      {section.section === 'plan' && <Architecture />}
                      {section.section === 'location' && <Place />}
                    </motion.div>
                  </Tooltip>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </main>
  );
}
 
export default ProjectNavigation;