import { MenuItem, Select, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Form, Formik } from "formik";
import { FormattedMessage } from "react-intl";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

interface PersonData {
    member: {
        ID?: number
        Name?: string
        ArabicName?: string
        DOB?: Date
        Gender?: string
        Email?:  string
        PhoneNumber?: string
    }
    isEdit: boolean
}

const MedicalView = ({member, isEdit}: PersonData) => {
    
    const handleSubmit = () => {
        
    }

    return (  
        <div className="w-full grid md:grid-cols-3 h-max mt-8">
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <ListItem className="hover:bg-Baige cursor-pointer">
                    <ListItemText primary="Photos" secondary="Jan 9, 2014" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Work" secondary="Jan 7, 2014" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Vacation" secondary="July 20, 2014" />
                </ListItem>
            </List>

            <Formik initialValues={member} onSubmit={handleSubmit}>
                <Form className="w-full col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                    <TextField
                        inputProps={{readOnly: isEdit? false : true}}
                        id="Name"
                        label={<FormattedMessage id="form.doctor"/>}
                        defaultValue={member.Name}
                    />
                    
                    <TextField
                        inputProps={{readOnly: isEdit? false : true}}
                        id="ArabicName"
                        label={<FormattedMessage id="form.service"/>}
                        defaultValue={member.ArabicName}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker 
                            label={<FormattedMessage id="form.date"/>}
                            disableFuture
                            readOnly={isEdit? false : true}                            
                            format="DD-MM-YYYY"
                        />
                    </LocalizationProvider>

                    <TextField
                        inputProps={{readOnly: isEdit? false : true}}
                        id="Email"
                        label={<FormattedMessage id="form.time"/>}
                        defaultValue={member.Email}
                    />


                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">{<FormattedMessage id="form.status"/>}</InputLabel>
                        <Select
                            readOnly={isEdit? false : true}
                            id="Gender"
                            label={<FormattedMessage id="form.status"/>}
                            defaultValue={member.Gender}
                        >
                            <MenuItem value={"Male"}><FormattedMessage id="form.male"/></MenuItem>
                            <MenuItem value={"Female"}><FormattedMessage id="form.female"/></MenuItem>
                        </Select>
                    </FormControl>

                </Form>
                
            </Formik>
        </div>
    );
}
 
export default MedicalView;