import { useQuery, useMutation } from "@tanstack/react-query"; 
import axios from "axios";

const apiClient = axios.create({
    headers: {
      "Content-type": "application/json",
    },
});

// API REQUEST TO RETRIEVE A MESSAGE
export function READ_MESSAGE(key) {
    const readmessage = useQuery({
        queryKey: ['message', key],
        queryFn: async () => {
            const response = await apiClient.get(`/message/${key}`, {
                withCredentials: true
            });
            return response.data;
        },
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1 * 60 * 1000,
        gcTime: 1 * 60 * 1000
    });

    return readmessage;
}

// API REQUEST TO UNREAD THE MESSAGE
export function HAS_READ_MESSAGE(csrfToken) {
    const has_read_notification = useMutation({
        mutationFn: async ({key, has_read}) => {
            const response = await apiClient.put(`/message/${key}`, { has_read }, {
                headers: {
                  'X-CSRF-TOKEN': csrfToken,
                },
                withCredentials: true,
            });

            return response.data;
        }
    });

    return has_read_notification;
}

// API REQUEST TO REMOVE THE MESSAGE
export function REMOVE_MESSAGE(csrfToken) {
    const remove_message = useMutation({
        mutationFn: async (key) => {
            const response = await apiClient.delete(`/message/${key}`, {
                headers: {
                  'X-CSRF-TOKEN': csrfToken,
                },
                withCredentials: true,
            });

            return response.data;
        }
    });

    return remove_message;
}
