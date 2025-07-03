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
interface FetchDataParams {
  url: string;
  method: string;
  body?: string;
  headers?: Record<string, string>;
  credentials?: 'include' | 'omit' | 'same-origin';
}

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
  async (
    { url, method, body, headers }: FetchDataParams,
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue({
          status: response.status,
          message: data.message || 'Something went wrong',
        });
      }

      return data;
    } catch (error: any) {
      return rejectWithValue({
        status: 500,
        message: 'Network error - please check your connection',
      });
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
