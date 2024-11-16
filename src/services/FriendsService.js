import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/friends";

export const addFriend = (memberId, friend) =>
  axios.post(`${REST_API_BASE_URL}/member/${memberId}`, friend);

export const getFriendById = (friendId) =>
  axios.get(`${REST_API_BASE_URL}/${friendId}`);

export const getFriendsByMemberId = (memberId) =>
  axios.get(`${REST_API_BASE_URL}/member/${memberId}`);

export const updateFriend = (friendId, friend) =>
  axios.patch(`${REST_API_BASE_URL}/${friendId}`, friend);

export const deleteFriend = (friendId) =>
  axios.delete(`${REST_API_BASE_URL}/${friendId}`);
