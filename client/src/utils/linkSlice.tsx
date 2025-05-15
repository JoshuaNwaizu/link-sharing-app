import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API } from '../App';
import { RootState } from '../store';

interface Link {
  id: string;

  url: string;
  platform: string;
  isDropDown: boolean;
}
interface LinkState {
  toggleOption: string | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  links: Link[];
}
const initialState: LinkState = {
  toggleOption: null,
  links: [],
  error: null,
  status: 'idle',
};
export const fetchLinks = createAsyncThunk(
  'link/fetchLinks',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API}/get-links`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch links');
      }

      const data = await response.json();
      const transformedLinks = data.data.links.map((link: any) => ({
        id: link._id || String(Math.random()), // Ensure each link has an id
        url: link.url,
        platform: link.platform,
        isDropDown: false,
      }));
      return transformedLinks;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch links',
      );
    }
  },
);
export const saveLinks = createAsyncThunk(
  'link/saveLinks',
  async (_, { getState }) => {
    const { links } = (getState() as RootState).link;
    const token = localStorage.getItem('token');
    const linksToSave = links.filter((link) => link.url.trim() !== '');

    if (linksToSave.length === 0) {
      throw new Error('Please add at least one URL before saving');
    }
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`${API}/save-links`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ links: linksToSave }),
    });
    if (!response.ok) {
      throw new Error('Failed to save links');
    }
    const data = await response.json();
    console.log(data);
  },
);

const linkSlice = createSlice({
  name: 'link',
  initialState,
  reducers: {
    toggleOptionTitle: (state, action: { payload: string }) => {
      state.toggleOption =
        state.toggleOption === action.payload ? null : action.payload;
    },
    addLink: (state) => {
      const newId = (state.links.length + 1).toString();
      state.links.push({
        id: newId,
        url: '',
        platform: 'github',
        isDropDown: false,
      });
    },

    updateLink: (
      state,
      action: { payload: { id: string; url: string; platform: string } },
    ) => {
      const link = state.links.find((link) => link.id === action.payload.id);
      if (link) {
        link.url = action.payload.url;
        link.platform = action.payload.platform;
      }
    },
    removeLink: (state, action: { payload: string }) => {
      state.links = state.links.filter((link) => link.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveLinks.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(saveLinks.fulfilled, (state) => {
      state.status = 'idle';
    });
    builder.addCase(saveLinks.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message ?? null;
    });
  },
});
export { linkSlice };
export const { toggleOptionTitle, addLink, updateLink, removeLink } =
  linkSlice.actions;
export default linkSlice.reducer;
