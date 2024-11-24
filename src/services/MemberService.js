import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/goods";

export const createMember = (member) => axios.post(REST_API_BASE_URL, member);
