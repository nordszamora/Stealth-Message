import { useMutation } from "@tanstack/react-query"; 
import axios from "axios";

const apiClient = axios.create({
    headers: {
      "Content-type": "application/json",
    },
});

// API REQUEST TO CHANGE USER NAME
export function CHANGE_NAME(csrfToken) {
    const change_name = useMutation({
        mutationFn: async (new_name) => {
            const response = await apiClient.put('/name_', new_name, {
                headers: {
                  'X-CSRF-TOKEN': csrfToken,
                },
                withCredentials: true
            });

            return response.data;
        },
    });
    return change_name;
}

// API REQUEST TO CHANGE USER USERNAME
export function CHANGE_USERNAME(csrfToken) {
    const change_username = useMutation({
        mutationFn: async (new_username) => {
            const response = await apiClient.put('/username_', new_username, {
                headers: {
                  'X-CSRF-TOKEN': csrfToken,
                },
                withCredentials: true
            });

            return response.data;
        }
    });
    return change_username;
}

// API REQUEST TO ADD NEW EMAIL (FOR OLD USER WHO DONT HAVE AN EMAIL - VER 1.0) OR CHANGE EMAIL FOR USER
export function ADD_OR_CHANGE_EMAIL(csrfToken) {
    const add_or_change_email = useMutation({
        mutationFn: async (new_email) => {
            const response = await apiClient.put('/email_', new_email, {
                headers: {
                  'X-CSRF-TOKEN': csrfToken,
                },
                withCredentials: true
            });

            return response.data;
        }
    });
    return add_or_change_email;
}

// API REQUEST TO CHANGE USER PASSWORD
export function CHANGE_PASSWORD(csrfToken) {
    const change_password = useMutation({
        mutationFn: async (form) => {
            const response = await apiClient.put('/password_', form, {
                headers: {
                  'X-CSRF-TOKEN': csrfToken,
                },
                withCredentials: true
            });

            return response.data;
        }
    });
    return change_password;
}

// API REQUEST TO DELETE USER ACCOUNT
export function ACCOUNT_DELETION(csrfToken) {
    const account_deletion = useMutation({
        mutationFn: async (password) => {
            const response = await apiClient.post('/deletion', password, {
                headers: {
                  'X-CSRF-TOKEN': csrfToken,
                },
                withCredentials: true,
            });

            return response.data;
        }
    });

    return account_deletion;
}
