import { Navigate } from "react-router-dom";

import Container from 'react-bootstrap/Container';

import SettingsFormSubmission from "./SettingsFormSubmission";

import { AUTH_SUCCESS, USER_DATA, LOGOUT } from '../../api/user/api';
import "./style.css";

export default function Settings() {
  
  // Response data from the AUTH_SUCCESS & USER_DATA
   const { data: IsAuth, isError: IsAuthIssue, isLoading: IsAuthLoading } = AUTH_SUCCESS()
   const { data: UserData, isError: UserDataIssue, isLoading: LoadUserData} = USER_DATA()

   // Check loading or error states and return null or navigate away as needed
   if(IsAuthLoading && LoadUserData) return null;
   if(IsAuthIssue && UserDataIssue) return <Navigate to='/signin'/>;

   return (
     <>
      {
        IsAuth.isauth && (
          <div id="detail">
           <div>
              <Container>
                <h1 className="banner mt-4">StealthMessage</h1>

                <SettingsFormSubmission
                    csrf={IsAuth?.csrf_token}
                    UserData={UserData}
                />
             </Container>
           </div>
          </div>
        )
      }
     </>
   )
}
