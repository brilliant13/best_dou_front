import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/ppurio";

// Function to send multiple SMS messages
export const sendMessages = (messages) => {
  return axios.post(`${REST_API_BASE_URL}/send`, messages);
};
