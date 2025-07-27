import Login from "./login";
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Button } from '@mui/material';
import { Apple, Close, Facebook, Google } from "@mui/icons-material";
import { useContext, useState } from "react";
import SignupForm from "./signup";
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import { FormattedMessage } from "react-intl";
import { LanguageDirectionContext } from "@/helpers/langDirection";
import { useRouter } from "next/router";

const Sign = () => {
    const { isRTL } = useContext(LanguageDirectionContext);
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();
    const handleLogin = () => {
        setIsLogin(!isLogin);
    };

    const handleGoogleLogin = async () => {
        try {
            window.open(`${process.env.BACKEND}auth/google`, "_self");
        } catch (error) {
            console.error('Error logging in with Google:', error);
        }
    };

    return (  
        <main className="min-h-screen w-screen py-20 bg-cover bg-fixed bg-center" style={{backgroundImage: 'url("/3d/15.jpg")'}}>
            <div className="grid place-items-center">
                <Card className = 'sm:w-8/12 lg:w-4/12 py-8'>
                    <CardContent className="grid place-items-center">
                        <div className="flex w-full justify-end relative hover:text-primary -top-4">
                            <IconButton className="hover:text-primary" onClick={() => router.push('/')}>
                                <Close />
                            </IconButton>
                        </div>
                        <div className="space-y-8 md:w-10/12">
                            {isLogin? <Login /> : <SignupForm /> }
                    
                            <Divider>
                                <Typography variant="body1">
                                    <FormattedMessage id="form.or"/>
                                </Typography>
                            </Divider>

                            <div className={`flex w-full ${isLogin? 'flex-col space-y-4 ' : 'justify-around'}`}>
                                <Button variant="contained" onClick={handleGoogleLogin} className={`bg-red-500 hover:bg-secondary w-full hover:text-white`}>
                                    <Typography variant="button" className={`flex items-center justify-around space-x-4 w-full md:w-7/12`}>
                                        <Google  />
                                        <FormattedMessage id="form.google"/>
                                    </Typography>
                                </Button>
                            </div>

                            <div className={`space-x-2 flex items-center justify-center ${isRTL? 'flex-row-reverse' : ''}`}>
                                <Typography variant="body1">
                                    {isLogin? <FormattedMessage id="login.question"/> : <FormattedMessage id="signup.question"/>} 
                                </Typography>
                                
                                <Typography variant="body1" onClick={handleLogin} className="cursor-pointer pr-2 underline text-darkBlue hover:text-primary">
                                    {isLogin? <FormattedMessage id="login.create"/> : <FormattedMessage id="signup.login"/>} 
                                </Typography>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
 
export default Sign;