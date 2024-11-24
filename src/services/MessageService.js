import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/messages";

export const sendMessage = (message) => axios.post(REST_API_BASE_URL, message);

export const getMessageById = (messageId) =>
  axios.get(`${REST_API_BASE_URL}/${messageId}`);

export const getMessagesByMemberId = (memberId) =>
  axios.get(`${REST_API_BASE_URL}/member/${memberId}`);

export const getMessagesByFriendId = (friendId) =>
  axios.get(`${REST_API_BASE_URL}/friend/${friendId}`);

export const getMessagesByMemberIdAndFriendId = (memberId, friendId) =>
  axios.get(`${REST_API_BASE_URL}/member/${memberId}/friend/${friendId}`);

export const deleteMessage = (messageId) =>
  axios.delete(`${REST_API_BASE_URL}/${messageId}`);
