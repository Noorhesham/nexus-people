import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SendIcon from '@mui/icons-material/Send';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { FormattedMessage } from 'react-intl';
import { AccessTime, AccessTimeFilledOutlined, AccessTimeOutlined, AdminPanelSettings, AdminPanelSettingsOutlined, Architecture, ArchitectureOutlined, Article, ArticleOutlined, Collections, CollectionsOutlined, Email, EmailOutlined, Handshake, HandshakeOutlined, Home, HomeOutlined, LocalHospital, LocationCity, LocationCityOutlined, Logout, LogoutOutlined, MedicalInformation, MedicalServices, MedicalServicesOutlined, MeetingRoom, MeetingRoomOutlined, Newspaper, NewspaperOutlined, Person, PersonOutline, Settings, Store, StoreOutlined, SupportAgent, SupportAgentOutlined, Textsms, TextsmsOutlined, Web, WebOutlined, Weekend, WeekendOutlined } from '@mui/icons-material';
import { useState } from 'react';
import Image from 'next/image';
import Divider from '@mui/material/Divider';
import { AuthContext } from '@/helpers/AuthContext';
import Cookies from 'js-cookie';
import Drawer from '@mui/material/Drawer';

interface SidebarProps {
  onSelectButton: (buttonName: string) => void;
  ToggleNav?: boolean
  setToggleNav?: React.Dispatch<React.SetStateAction<boolean>>; // Add this line
  window?: () => Window;
}

 const NestedList : React.FC<SidebarProps> = ({onSelectButton, ToggleNav, window, setToggleNav}) =>   {
  const [selectedButton, setSelectedButton] = useState('Home');
  const { isRTL } = React.useContext(LanguageDirectionContext);
  const {user, logout} = React.useContext(AuthContext)

    const handleButtonClick = (buttonName: string) => {
    setSelectedButton(buttonName);
    onSelectButton(buttonName);
  };

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  React.useEffect(() => {
    {ToggleNav? setMobileOpen(true) : setMobileOpen(false)}
  },[ToggleNav])

  const drawer = (
    <div onClick={handleDrawerToggle} className='bg-white h-full'>
      <Divider />
      <List className='bg-white'>
      {NavItems.map((item, index) => (
        <ListItemButton   
          sx={{
            '&:hover': {
              '& .MuiListItemIcon-root': {
                color: selectedButton === item.title ? '' : '#1b2d45',
              },
            },
          }}
          onClick={(e)=> onSelectButton(item.title)}
          // onTouchStart={(e) => handleButtonClick(item.title)}
          // onTouchEnd={(e) => handleButtonClick(item.title)}
          className={`${selectedButton === item.title? 'bg-secondary text-white hover:text-white hover:bg-secondary' : 'hover:bg-secondary hover:text-white'}`} key={index} 
        >
          <ListItemIcon  className={`${selectedButton === item.title? 'text-white' : 'text-white'}`}>{item.icon}</ListItemIcon>
          <ListItemText className='text-white' primary={<FormattedMessage id={item.text}/>} />
        </ListItemButton>
      ))}
      </List>

      <List className='w-full'>
    <Divider variant='middle' className='bg-white mb-2' />

    {bottomNav.map((item, index) => (
        <ListItemButton   
          sx={{
            '&:hover': {
              '& .MuiListItemIcon-root': {
                color: selectedButton === item.title ? '' : '#1b2d45',
              },
            },
          }}
          className={`${selectedButton === item.title? 'bg-secondary text-white hover:text-white hover:bg-secondary' : 'hover:bg-secondary hover:text-white'}`} key={index} 
          onClick={(e) => logout(Cookies.get('token') as string, true)}
        >
          <ListItemIcon  className={`${selectedButton === item.title? 'text-white' : 'text-white'}`}>{item.icon}</ListItemIcon>
          <ListItemText className='text-white' primary={<FormattedMessage id={item.text}/>} />
        </ListItemButton>
      ))}
    </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <main className={'min-[200px]:hidden lg:grid bg-white w-full text-secondary min-h-screen '}>
    <List  
      component="nav" 
      aria-labelledby="nested-list-subheader"
    >
      {/* <div className='w-full grid place-items-center h-fit'>
        <Image src={'/logo.svg'} alt='' width={50} height={50}/>
      </div> */}

      {/* <Divider className='bg-white mb-2' /> */}
      {NavItems.map((item, index) => (
        <ListItemButton   
          sx={{
            '&:hover': {
              '& .MuiListItemIcon-root': {
                color: selectedButton === item.title ? '' : '#ffffff',
              },
            },
          }}
          className={`${selectedButton === item.title? 'bg-secondary text-white hover:text-white hover:bg-secondary' : 'hover:bg-primary hover:text-white'}`} 
          key={index} 
          onClick={(e)=>handleButtonClick(item.title)}
        >
          <ListItemIcon  className={`${selectedButton === item.title? 'text-white' : 'text-secondary'}`}>
            {selectedButton === item.title? item.selectedIcons : item.icon}
          </ListItemIcon>
          <ListItemText primary={<FormattedMessage id={item.text}/>} />
        </ListItemButton>
      ))}
    </List>

    <List className='w-full'>
      <Divider variant='middle' className='bg-white mb-2' />

      {bottomNav.map((item, index) => (
        <ListItemButton   
          sx={{
            '&:hover': {
              '& .MuiListItemIcon-root': {
                color: selectedButton === item.title ? '' : '#ffffff',
              },
            },
          }}

          className={`${selectedButton === item.title? 'bg-secondary text-white hover:text-white hover:bg-secondary' : 'hover:bg-secondary hover:text-white'}`} 
          key={index} 
          onClick={(e) => logout(Cookies.get('token') as string, true)}
        >
          <ListItemIcon className={`${selectedButton === item.title? 'text-white' : 'text-secondary'}`}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={<FormattedMessage id={item.text}/>} />
        </ListItemButton>
      ))}
    </List>

    <Drawer
      dir='rtl'
      container={container}
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
      }}
    >
      {drawer}
    </Drawer>
    </main>
  );
}

export default NestedList

const NavItems = [
  {icon: <HomeOutlined />, selectedIcons: <Home />, text: "navbar.home", title: "Home"},
  {icon: <AdminPanelSettingsOutlined />, selectedIcons: <AdminPanelSettings />, text: "admin.admins", title: "Admins"},
  {icon: <PersonOutline />, selectedIcons: <Person />, text: "admin.patients", title: "Patients"},
  // {icon: <MeetingRoomOutlined />, selectedIcons: <MeetingRoom />, text: "admin.appointments", title: "Appointments"},
  {icon: <NewspaperOutlined />, selectedIcons: <Newspaper />, text: "navbar.news", title: "Blog"},
  {icon: <CollectionsOutlined />, selectedIcons: <Collections />, text: "admin.gallery", title: "Gallery"},
  {icon: <StoreOutlined />, selectedIcons: <Store />, text: "admin.models", title: "Models"},
  {icon: <TextsmsOutlined />, selectedIcons: <Textsms />, text: "navbar.testimonials", title: "Testimonials"},
  {icon: <EmailOutlined />, selectedIcons: <Email />, text: "admin.newsletter", title: "Newsletter"},
  {icon: <SupportAgentOutlined />, selectedIcons: <SupportAgent />, text: "bot.admin", title: "Chatbot"},
  {icon: <AccessTimeOutlined />, selectedIcons: <AccessTime />, text: "admin.timeline", title: "Timeline"},
  {icon: <HandshakeOutlined />, selectedIcons: <Handshake />, text: "admin.partners", title: "Partners"},
  {icon: <ArticleOutlined />, selectedIcons: <Article />, text: "Brouchure", title: "Brouchure"},
  {icon: <WebOutlined />, selectedIcons: <Web />, text: "Pages", title: "Pages"},
]

const bottomNav = [
  {icon: <LogoutOutlined />, text: "profile.logout",title: "Logout"},
]