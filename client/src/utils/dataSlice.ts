import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API } from '../App';

interface DataState {
  data: {
    email?: string;
    userId?: string;
    token?: string;
    _id?: string;
  } | null;
  loading: boolean;
  error: string | null;
}

// const initialState: DataState = {
//   data: null,
//   loading: false,
//   error: null,
// };
const getInitialState = (): DataState => {
  const savedData = localStorage.getItem('userData');
  return {
    data: savedData ? JSON.parse(savedData) : null,
    loading: false,
    error: null,
  };
};
export const fetchData = createAsyncThunk(
  'data/fetchData',
  async (options: {
    url: string;
    method?: string;
    body?: string;
    headers?: Record<string, string>;
  }) => {
    const { url, method, body, headers } = options;
    try {
      const response: any = await fetch(url, {
        method,
        body,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });
      console.log('Response status:', response.status); // Log the status
      console.log('Response headers:', response.headers); // Log the headers
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },
);
export const fetchUser = createAsyncThunk(
  'data/fetchUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API}/user/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      console.log('Fetched user data:', data);
      return data.user;
    } catch (error: any) {
      console.error('Error fetching user:', error);
      return rejectWithValue(error.message);
    }
  },
);

export const dataSlice = createSlice({
  name: 'data',
  initialState: getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = {
          email: action.payload.email,
          userId: action.payload.userId,
          token: action.payload.token,
        };
        localStorage.setItem('userData', JSON.stringify(state.data));
        console.log('Email stored in Redux:', action.payload.email); // Debug log
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});
export const selectUserEmail = (state: { data: DataState }) =>
  state.data.data?.email;

export default dataSlice.reducer;
