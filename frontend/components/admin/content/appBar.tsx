import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { FormattedMessage } from 'react-intl';
import Divider from '@mui/material/Divider';
import { AdminPanelSettings, AdminPanelSettingsOutlined, Architecture, ArchitectureOutlined, Collections, CollectionsOutlined, Logout, MeetingRoom, MeetingRoomOutlined, Newspaper, NewspaperOutlined, Person, PersonOutline, Store, StoreOutlined, SupportAgent, SupportAgentOutlined, Textsms, TextsmsOutlined, Menu, LocationCityOutlined, HandshakeOutlined, EmailOutlined, Email, Handshake, LocationCity } from '@mui/icons-material';
import { useCallback, useContext, useEffect, useState } from 'react';
import NestedList from '../sidebar';
import { AuthContext } from '@/helpers/AuthContext';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import Image from 'next/image'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import Drawer from '@mui/material/Drawer';
import ListItemIcon from '@mui/material/ListItemIcon';
import Cookies from 'js-cookie';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

interface Props {
  window?: () => Window;
  onSelectButton: (item: string)=> void
}

const drawerWidth = 240;


function ResponsiveAppBar(props: Props) {
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const {isRTL} = useContext(LanguageDirectionContext)
  const {user, logout} = useContext(AuthContext)
  const [toggleNav, setToggleNav] = useState<boolean>(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setDroppedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    const uploadFile = async () => {
      if (droppedFile) {
        try {
          const formData = new FormData();
          formData.append('profilePic', droppedFile);

          const response = await axios.put(`${process.env.BACKEND}auth/${user?.role}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              token: Cookies.get('token'),
            },
          });

        } catch (error) {
          console.error('Error uploading file', error);
        }
      }
    };

    uploadFile();
  }, [droppedFile, user?.role]);
  
  const [selectedButton, setSelectedButton] = useState('Patients');

  const handleSelectButton = (buttonName: string): void => {
    props.onSelectButton(buttonName)
    setSelectedButton(buttonName);
  }
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const container = window !== undefined ? () => window().document.body : undefined;

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
            onClick={(e)=> handleSelectButton(item.title)}
            className={`${selectedButton === item.title? 'bg-secondary text-white' : 'text-secondary'}`} key={index} 
          >
            <ListItemIcon  className={`${selectedButton === item.title? 'text-white' : 'text-secondary'}`}>
              {selectedButton === item.title? item.selectedIcons : item.icon}
            </ListItemIcon>
            <ListItemText primary={<FormattedMessage id={item.text}/>} />
          </ListItemButton>
        ))}
      </List>

      <List className='w-full bg-white'>
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
          className={`${selectedButton === item.title? 'bg-secondary text-white' : 'text-secondary'}`} key={index} 
          onClick={(e) => logout(Cookies.get('token') as string, true)}
        >
          <ListItemIcon className={`${selectedButton === item.title? 'text-white' : 'text-secondary'}`}>{item.icon}</ListItemIcon>
          <ListItemText primary={<FormattedMessage id={item.text}/>} />
        </ListItemButton>
      ))}
    </List>
    </div>
  );

  return (
    <AppBar className='bg-white' position="static">
      <Container maxWidth="xl">
        <Toolbar  className='flex justify-between bg-white text-secondary' disableGutters>

          <IconButton className='text-secondary lg:hidden' onClick={(e) =>setMobileOpen(true)}>
            <Menu />
          </IconButton>
          
          <Typography variant='h6'>
            {isRTL? user?.name?.ar : user?.name?.en }
          </Typography>

          <div className='grid place-items-center h-fit'>
            <Image src={'/logo.svg'} alt='' width={80} height={50}/>
          </div>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton {...getRootProps()}  sx={{ p: 0 }}>
              <Avatar variant='rounded' 
                alt={isRTL? user?.name?.ar : user?.name?.en } 
                src={droppedFile ? URL.createObjectURL(droppedFile) : user?.profilePic}
              />
            </IconButton>

            <input {...getInputProps()} />
          </Box>

        </Toolbar>
      </Container>
      {/* {toggleNav && <NestedList onSelectButton={handleSelectButton} ToggleNav={toggleNav} setToggleNav={setToggleNav}/>} */}
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
    </AppBar>
  );
}
export default ResponsiveAppBar;

const NavItems = [
  {icon: <AdminPanelSettingsOutlined />, selectedIcons: <AdminPanelSettings />, text: "admin.admins", title: "Admins"},
  {icon: <PersonOutline />, selectedIcons: <Person />, text: "admin.patients", title: "Patients"},
  {icon: <MeetingRoomOutlined />, selectedIcons: <MeetingRoom />, text: "admin.appointments", title: "Appointments"},
  {icon: <NewspaperOutlined />, selectedIcons: <Newspaper />, text: "navbar.news", title: "Blog"},
  {icon: <CollectionsOutlined />, selectedIcons: <Collections />, text: "admin.gallery", title: "Gallery"},
  {icon: <StoreOutlined />, selectedIcons: <Store />, text: "admin.models", title: "Models"},
  {icon: <ArchitectureOutlined />, selectedIcons: <Architecture />, text: "admin.services", title: "Services"},
  {icon: <LocationCityOutlined />, selectedIcons: <LocationCity />, text: "admin.mall", title: "Mall"},  
  {icon: <TextsmsOutlined />, selectedIcons: <Textsms />, text: "navbar.testimonials", title: "Testimonials"},
  {icon: <EmailOutlined />, selectedIcons: <Email />, text: "admin.newsletter", title: "Newsletter"},
  {icon: <SupportAgentOutlined />, selectedIcons: <SupportAgent />, text: "bot.admin", title: "Chatbot"},
  {icon: <HandshakeOutlined />, selectedIcons: <Handshake />, text: "admin.partners", title: "Partners"},
]

const bottomNav = [
  {icon: <Logout />, text: "profile.logout",title: "Logout"},
]