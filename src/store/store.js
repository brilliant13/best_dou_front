import { configureStore } from "@reduxjs/toolkit";
import contactsReducer from "./contactsSlice.js";

const store = configureStore({
  reducer: {
    contacts: contactsReducer,
  },
});

export default store;
