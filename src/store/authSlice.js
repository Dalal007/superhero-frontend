import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

const initialState = {
  user: null,
  ready: false,
  error: "",
};

export const loadMe = createAsyncThunk("auth/loadMe", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const { data } = await api.get("/auth/me");
    return data;
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e?.message);
  }
});

export const loginThunk = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    return data.user;
  } catch (e) {
    return rejectWithValue(e?.response?.data || { message: e?.message });
  }
});

export const registerThunk = createAsyncThunk("auth/register", async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("token", data.token);
    return data.user;
  } catch (e) {
    return rejectWithValue(e?.response?.data || { message: e?.message });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("token");
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.ready = true;
        state.error = "";
      })
      .addCase(loadMe.rejected, (state) => {
        state.ready = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = "";
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.error = action.payload?.message || "Login failed";
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = "";
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.error = action.payload?.message || "Registration failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
