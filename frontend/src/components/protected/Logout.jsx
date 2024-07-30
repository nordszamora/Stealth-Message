import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';

import "./style.css";

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function Logout() {
   const [response, setResponse] = useState('');
   const [csrfToken, setCsrfToken] = useState('');

    // Get a csrf token
    useEffect(() => {
      async function GetCsrfToken() {
        try {
          const response = await axios.get(`${API_URL}/api/v1/csrf`, { withCredentials: true });
       
          setCsrfToken(response.data.csrf_token);
        } catch(error) {
          console.log(error);
        }
      }

      GetCsrfToken();
   }, []);

   // Function to handle the logout process
   async function logout() {
     try {
       const response = await axios.post(`${API_URL}/api/v1/logout`, null, {
         headers: {
           'X-CSRF-TOKEN': csrfToken
         },

         withCredentials: true
       });

       setResponse(response.statusText);
     } catch(error) {
       console.log(error);
     }
   }

   // Component to handle redirect after logout
   function Response() {
     return (response) ? <Navigate to={`/signin`} /> : null;
   }

   return (
     <>
      {/* Render a response */}
      <Response />
      {/* Link to trigger logout function and navigate to sign-in */}
      <Link to={`/signin`} className='custom-header' onClick={logout}>Log out</Link>
     </>
   );
}
