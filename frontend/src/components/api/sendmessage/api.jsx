import { useQuery, useMutation } from "@tanstack/react-query"; 
import axios from "axios";

const apiClient = axios.create({
    headers: {
      "Content-Type": "application/json",
    },
});

// API REQUEST TO RETRIEVE A USERS NAME
export function SEND_TO_USER(secret) {
    const sendtouser = useQuery({
        queryKey: ['secretkey', secret],
        queryFn: async () => {
            const response = await apiClient.get(`/secretkey/${secret}`);
            return response.data;
        },
        retry: false,
        refetchOnWindowFocus: false
    });

    return sendtouser;
}

// API REQUEST TO SEND A UNKNOWN MESSAGE BY USER
export function SEND_MESSAGE(secret) {
    const sendmessage = useMutation({
        mutationFn: async (form) => {
            const response = await apiClient.post(`/secretkey/${secret}`, form);
            return response.data;
        }
    });

    return sendmessage;
}
