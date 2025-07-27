import { MenuItem, Select, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Form, Formik } from "formik";
import { FormattedMessage } from "react-intl";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import axios from "axios";

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

const PersonalView = ({member, isEdit}: PersonData) => {
    
    const handleSubmit = () => {
        
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`${process.env.BACKEND}${member.ID}`)
        } catch (error) {
            
        }
    }

    return (  
        <div className="w-full h-max mt-8">
            <Formik initialValues={member} onSubmit={handleSubmit}>
                <Form className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <TextField
                        inputProps={{readOnly: isEdit? false : true}}
                        id="Name"
                        label={<FormattedMessage id="form.name"/>}
                        defaultValue={member.Name}
                    />
                    
                    <TextField
                        inputProps={{readOnly: isEdit? false : true}}
                        id="ArabicName"
                        label={<FormattedMessage id="form.arabicName"/>}
                        defaultValue={member.ArabicName}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker 
                            label={<FormattedMessage id="form.dob"/>}
                            disableFuture
                            readOnly={isEdit? false : true}                            
                            format="DD-MM-YYYY"
                        />
                    </LocalizationProvider>

                    <TextField
                        inputProps={{readOnly: isEdit? false : true}}
                        id="Email"
                        label={<FormattedMessage id="form.email"/>}
                        defaultValue={member.Email}
                    />

                    <TextField
                        inputProps={{readOnly: isEdit? false : true}}
                        id="PhoneNumber"
                        label={<FormattedMessage id="form.phone"/>}
                        defaultValue={member.PhoneNumber}
                    />

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">{<FormattedMessage id="form.gender"/>}</InputLabel>
                        <Select
                            readOnly={isEdit? false : true}
                            id="Gender"
                            label={<FormattedMessage id="form.gender"/>}
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
 
export default PersonalView;