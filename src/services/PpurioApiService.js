//src/services/PpurioApiService.js
import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/ppurio";

// Function to send multiple SMS messages
export const sendMessages = (messages) => {
  console.log("Sending2323 data to backend:", messages); // 확인용 로그
  return axios.post(`${REST_API_BASE_URL}/send`, messages);
};
