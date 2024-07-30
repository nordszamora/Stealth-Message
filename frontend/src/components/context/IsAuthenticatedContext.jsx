import { useState, useEffect } from 'react';
import Context from './Context';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function IsAuthenticated({ children }) {
   const [Isauthenticated, setIsAuthenticated] = useState(false);
   const [loading, setLoading] = useState(true);

   // Check if the user is authenticated
   useEffect(() => {
      async function CheckAuthentication() {
        try {
          // Make an API request to check if authenticated
          const response = await axios.get(`${API_URL}/api/v1/isauthenticated`, {
             withCredentials: true 
          });

          setIsAuthenticated(response.data.IsAuthenticated);
          setLoading(false);
        } catch (error) {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }

      CheckAuthentication();
   }, []);

   return (
     // Provide the authentication status and loading state to the context
     <Context.Provider value={{ Isauthenticated, loading }}>
       { children } {/* Render the children components */}
     </Context.Provider>
   );
}
