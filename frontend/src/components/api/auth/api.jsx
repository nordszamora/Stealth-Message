import { useMutation } from "@tanstack/react-query"; 
import axios from "axios";

const apiClient = axios.create({
    headers: {
      "Content-Type": "application/json",
    },
});

// API REQUEST FOR CREATING AN ACCOUNT
export function SIGNUP() {
    const register = useMutation({
        mutationFn: async (form) => {
            const response = await apiClient.post('/register', form);
            return response.data;
        }
    });

    return register;
}

// API REQUEST LOGIN USERS ACCOUNT
export function SIGNIN() {
    const login = useMutation({
        mutationFn: async (form) => {
            const response = await apiClient.post('/login', form, { withCredentials: true });
            return response.data;
        },
    });

    return login;
}
