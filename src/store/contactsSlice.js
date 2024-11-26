import { createSlice } from "@reduxjs/toolkit";
import contactsData from "../data/contacts.json"; // JSON 파일 불러오기

const contactsSlice = createSlice({
  name: "contacts",
  initialState: contactsData,
  reducers: {
    addContact: (state, action) => {
      const newContact = action.payload;
      // ID 중복 방지: 최대 ID 찾아서 +1
      const maxId = state.reduce(
        (max, contact) => (contact.id > max ? contact.id : max),
        0
      );
      newContact.id = maxId + 1;
      state.push(newContact);
    },
    updateContact: (state, action) => {
      const updatedContact = action.payload;
      const index = state.findIndex(
        (contact) => contact.id === updatedContact.id
      );
      if (index !== -1) {
        state[index] = { ...state[index], ...updatedContact };
      }
    },
    deleteContact: (state, action) => {
      const contactId = action.payload;
      return state.filter((contact) => contact.id !== contactId);
    },
  },
});

export const { addContact, updateContact, deleteContact } =
  contactsSlice.actions;
export default contactsSlice.reducer;
