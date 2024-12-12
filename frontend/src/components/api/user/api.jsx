import { useQuery, useMutation } from "@tanstack/react-query"; 
import axios from "axios";

const apiClient = axios.create({
    headers: {
      "Content-Type": "application/json",
    },
});

// API REQUEST TO RETRIEVE USER CSRF TOKEN AND TO CHECK IF USER WAS AUTHENTICATED SUCCESSFULLY
export function AUTH_SUCCESS() {
    const success = useQuery({
        queryKey: ['auth_success'],
        queryFn: async () => {
            const response = await apiClient.get('/auth_success', { withCredentials: true });
            return response.data;
        },
        retry: false,
        refetchOnWindowFocus: false
    });

    return success;
}

// API REQUEST TO RETRIEVE ALL USER DATA (ACCOUNT DETAILS, MESSAGES)
export function USER_DATA() {
    const userdata = useQuery({
        queryKey: ['userdataprofile'],
        queryFn: async () => {
            const response = await apiClient.get('/userdataprofile', { withCredentials: true });
            return response.data;
        },
        retry: false,
        refetchOnWindowFocus: true
    });

    return userdata;
}

// API REQUEST TO LOGOUT USER IN ACCOUNT
export function LOGOUT(csrfToken) {
    const logout = useMutation({
        mutationFn: async () => {
            const response = await apiClient.post('/logout', null, {
                headers: {
                  'X-CSRF-TOKEN': csrfToken,
                },
                withCredentials: true,
            });

            return response.data;
        }
    });

    return logout;
}
