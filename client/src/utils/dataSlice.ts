import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface DataState {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  data: null,
  loading: false,
  error: null,
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

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default dataSlice.reducer;
