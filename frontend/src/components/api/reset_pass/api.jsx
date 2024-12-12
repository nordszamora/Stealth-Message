import { useQuery, useMutation } from "@tanstack/react-query"; 
import axios from "axios";

const apiClient = axios.create({
    headers: {
      "Content-Type": "application/json",
    },
});

// API REQUEST TO FORGOT USERS ACCOUNT
export function RESET_REQUEST() {
    const reset_request = useMutation({
        mutationFn: async (account) => {
            const response = await apiClient.post('/reset_request', account);
            return response.data;
        },
    });

    return reset_request;
}

// API REQUEST TO RETRIEVE A TOKEN OF RESET CONFIRMATION
export function CHECK_TOKEN(token) {
    const check_token = useQuery({
        queryKey: ['reset_confirmation', token],
        queryFn: async () => {
            const response = await apiClient.get(`/reset_confirmation/${token}`);
            return response.data;
        },
        retry: false,
        refetchOnWindowFocus: false
    });

    return check_token;
}

// API REQUEST TO CONFIRM USERS NEW PASSWORD
export function RESET_CONFIRMATION() {
    const reset_confirmation = useMutation({
        mutationFn: async ({token, new_password}) => {
            const response = await apiClient.put(`/reset_confirmation/${token}`, { new_password });
            return response.data;
        },
    });

    return reset_confirmation;
}
