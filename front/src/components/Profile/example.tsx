
import TextField from '@mui/material/TextField';
import { SubmitHandler, useForm } from "react-hook-form";
import Button from '@mui/material/Button';
import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';


interface ICreateUserProps
{
 
    user_name?: string;
    display_name?:string;
    email?:string;
    password?:string;
}

const Profilepage = () => {
    const{
        register,
        handleSubmit,
        formState: { errors },
        watch,
        clearErrors,
        setValue,
      } = useForm<ICreateUserProps>();
      const [error, setError] = useState<string>("");
      

      const onSubmit= async (formData: ICreateUserProps) => {
        const user_name = formData.user_name;
        const display_name = formData.display_name;
        const email = formData.email;
        
        const data = {
          user_name:user_name!,
          display_name:display_name!,
          email:email!,
          
        };
       
    }
return(

    <form style={{ maxWidth: '500px', width:'100%' ,margin: 'auto', paddingTop: 150 }}>
         <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ mt: 1 }}
            >
         <label> 
                    Username
                    <TextField
                      sx={{ marginTop: 1 }}
                      fullWidth
                      required
                      size="small"
                      id="username"
                      autoComplete="username"
                      autoFocus
                      {...register("user_name", {
                        required: "Username is required.",
                      })}
                      
                      variant="outlined"
                      error={Boolean(errors.user_name)}
                      helperText={
                        errors.user_name
                          ? errors.user_name.message?.toString()
                          : null
                      }
                    />
                  </label>

                  
                  <label>Displayname</label>
                  <TextField
                    sx={{ marginTop: 1 }}
                    size="small"
                    fullWidth
                    required
                    id="displayname"
                    variant="outlined"
                    {...register("display_name", {
                      required: "Displayname is required",
                    })}
                    
                    error={Boolean(errors.display_name)}
                    helperText={
                      errors.display_name
                        ? errors.display_name.message?.toString()
                        : null
                    }
                  />
                  <label>Email</label>
                  <TextField
                    sx={{ marginTop: 1 }}
                    size="small"
                    fullWidth
                    required
                    {...register("email", {
                      required: "Email is required",
                    })}
                    
                    error={Boolean(errors.email)}
                    helperText={
                     
                    errors.email ? errors.email.message?.toString() : ''
                    }
                  />
                  {/* <center>
                   <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, mb: 1 }}
                    size="small"
                    onClick={() => {
                        setError("");
                      }}
                  >
                Change password
                  </Button>
                  </center> */}
                  </Box>
</form>
);
}
export default Profilepage;

  // const validateCurrentPassword = async (id: any, currentPassword: string): Promise<boolean> => {
  //   try {
  //     // Call your API endpoint to validate the current password
  //     const response = await UserApi.updatePassword(id, currentPassword);
      
  //     // Assuming the response contains a boolean indicating whether the password is valid
  //     return response.isValid;
  //   } catch (error) {
  //     console.error("Error validating current password:", error);
  //     return false; // Return false in case of an error
  //   }
  // };
  

  // const editPassword = async (id: any, currentPassword: string, newPassword: any) => {
  //   if (validate()) {
  //     try {
  //       // Validate the current password
  //       const isValidCurrentPassword = await validateCurrentPassword(id, currentPassword);
        
  //       if (!isValidCurrentPassword) {
  //         // Display an error message indicating that the current password is incorrect
  //         setErrors({ ...errors, currentPassword: "Current password is incorrect" });
  //         return;
  //       }
  
  //       // If the current password is valid, proceed to update the password
  //       const updatedData = {
  //         ...editedData,
  //         id: id,
  //         password: newPassword,
  //         currentPassword: currentPassword,
  //       };
  
  //       const response = await UserApi.updatePassword(id, updatedData);
        
  //       if (response) {
  //         if (response.statusCode === 409) {
  //           setUniqueAlert(response.message);
  //         } else if (response.statusCode === 200) {
  //           setRows(response.data);
  //           const updatedUserDetails = { ...userDetails, ...updatedData };
  //           setUserDetails(updatedUserDetails);
  //           setAlertShow(response.message);
  //         }
  //       }
  //     } catch (error: any) {
  //       if (
  //         error.response &&
  //         error.response.data &&
  //         error.response.data.statusCode === 422
  //       ) {
  //         setUniqueAlert(error.response.data.message.user_name);
  //       }
  //       console.error(error);
  //     }
  //   }
  // };