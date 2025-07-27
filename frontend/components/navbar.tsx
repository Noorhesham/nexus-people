import React, { useContext, useState, useEffect } from "react";
import { LanguageDirectionContext } from "@/helpers/langDirection";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Image from "next/image";
import ProfileToggler from "./ProfileToggler";
import LanguageSwitcher from "./languageSwitcher";
import Link from "next/link";
import { FormattedMessage, useIntl } from "react-intl";
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { Phone } from "@mui/icons-material";
import { Typography } from '@mui/material';
import { useRouter } from "next/router";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface Props {
  windows?: () => Window;
}

const drawerWidth = 240;

const Navbar = (props: Props) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const {formatMessage} = useIntl();
  const { isRTL } = useContext(LanguageDirectionContext);
  const router = useRouter();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const { windows } = props;
  const container = windows !== undefined ? () => windows().document.body : undefined;
  const controls = useAnimation();

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  const navItems = [
    {label: formatMessage({id: 'navbar.home'}), link: '/'}, 
    {label: formatMessage({id: 'navbar.about'}), link: '/about'},
    {label: formatMessage({id: 'floor.units'}), link: '/units'},
    {label: formatMessage({id: 'navbar.contact'}), link: '/contact'},
    {label: formatMessage({id: 'navbar.news'}), link: '/news'},
    {label: formatMessage({id: 'navbar.media'}), link: '/media'}
  ];

  const unitsMenu = [
    {label: formatMessage({id: 'floor.adminstrative'}), link: '/adminstrative'},  
    {label: formatMessage({id: 'floor.medical'}), link: '/medical'}, 
    {label: formatMessage({id: 'floor.commercial'}), link: '/commercial'}, 
  ]

  const DrawerLinks = [
    {id: formatMessage({id: 'navbar.home'}), link: '/'}, 
    {id: formatMessage({id: 'navbar.about'}), link: '/about'},
    {id: formatMessage({id: 'navbar.contact'}), link: '/contact'},
    {id: formatMessage({id: 'floor.adminstrative'}), link: '/adminstrative'},  
    {id: formatMessage({id: 'floor.medical'}), link: '/medical'}, 
    {id: formatMessage({id: 'floor.commercial'}), link: '/commercial'}, 
    {id: formatMessage({id: 'navbar.news'}), link: '/news'},
    {id: formatMessage({id: 'navbar.media'}), link: '/media'},
    {id: formatMessage({id: 'navbar.testimonials'}), link: '/reviews' },
  ]

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setIsScrolled(scrollPosition > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [windows]);

  const drawer = (
    <div dir={isRTL? 'rtl' : 'ltr'} onClick={handleDrawerToggle}>
      <div className="w-full flex justify-center">
        <Image src={'/nexus.svg'} alt="" width={100} height={100} />
      </div>
      <Divider />
      <List>
        {DrawerLinks.map((item, index) => (
          <ListItem key={index} disablePadding>
            <Link href={item.link}>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText primary={item.id} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const variants = {
    hidden: {height: 0, opacity: 0},
    visible: {height: '7.5rem', opacity: 100},
    exit: {height: 0 ,opacity: 0}
  }

  const DropdownMenu = () => {
    return (
      <AnimatePresence>
        {isDropdownVisible && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: '7.5rem', opacity: 100}}
            exit={{height: 0 ,opacity: 0}}
            transition={{ duration: 0.5 }}
            className="bg-white absolute overflow-hidden shadow shadow-md"
          >
            <ul>
              {unitsMenu.map((unit, index) =>(
                <li key={index} onClick={() => {handleMouseLeave();router.push(unit.link)}} className="text-secondary hover:bg-secondary hover:text-white cursor-pointer p-2 px-4">
                  {unit.label}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence >
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        dir={isRTL ? "rtl" : "ltr"}
        component="nav"
        className={`h-16 w-full ${isScrolled ? "bg-white" : "bg-transparent"}`}
        sx={{
          boxShadow: isScrolled ? 3 : 0,
          transition: "background-color 0.3s ease",
        }}
      >
        <Toolbar className="flex justify-between w-full">
          <IconButton
            className={`${isScrolled? 'text-secondary' : 'text-white'}`}
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <motion.div
            initial={ isRTL?{ x: 100 } : {x: -100}}
            animate={{ x: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          >
            <Image src={isScrolled? '/nexus.svg' :"/nexusWhite.svg"} alt="" width={100} height={100} />
          </motion.div>

          <Box className={`lg: ${isRTL? 'mr-8' : 'ml-8'}`}  sx={{ display: { xs: "none", lg: "block" } }}>
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="flex items-center"
            >
              {navItems.map((item, index) => (
                <div key={index} className="flex w-full">
                  {index === 2? (
                    <div  
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className="relative"
                    >
                      <Button
                        id="basic-button"
                        variant="text" 
                        size="large"
                        className={` ${router.asPath === '/adminstrative' || router.asPath ===  '/medical' || router.asPath ===  '/commercial'? 'text-primary': isScrolled? 'text-secondary' : 'text-white' } hover:text-primary hover:bg-transparent`} 
                      >
                        <FormattedMessage id="floor.units" />
                      </Button>

                      <DropdownMenu />
                    </div>
                  ) : (
                    <Link href={item.link} key={index}>
                      <Button 
                        variant="text" 
                        size="large"
                        className={` ${router.asPath === item.link? 'text-primary': isScrolled? 'text-secondary' : 'text-white' } hover:text-primary hover:bg-transparent`} 
                        sx={{ color: "#000", fontSize: 16 }}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </motion.div>
          </Box>

          <motion.div 
            initial={ isRTL? { x: -100 } : { x:100 }}
            animate={{ x: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            className={`flex scale-75 md:scale-100 items-center  ${isScrolled? 'text-secondary' : 'text-white'}`} 
          >
            <div className="flex cursor-pointer hover:text-primary  space-x-2 items-center">
              <a href="tel:16321" target="_blank" className="flex items-center">
              <Typography className="hidden md:flex" variant="h6">
                {isRTL? "۱٦۳۲۱" : 16321}
              </Typography>
              <Phone className="md:text-3xl text-inherit"/>
              </a>

            </div>
            
            <ProfileToggler backgroundColor={isScrolled? 'text-secondary' : 'text-white'}/>
            <LanguageSwitcher backgroundColor={isScrolled? 'text-secondary' : 'text-white'}/>

          </motion.div>
        </Toolbar>
      </AppBar>

      <nav dir={isRTL? 'rtl': 'ltr'}>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "flex", lg: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
};

export default Navbar;