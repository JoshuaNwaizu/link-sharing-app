import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API } from '../App';
import { RootState } from '../store';

interface Link {
  id: string;
  url: string;
  platform: string;
  isDropDown: boolean;
  selectedPlatform: null;
}
interface LinkState {
  toggleOption: string | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  links: Link[];
  selectedPlatform: string | null;
}
const initialState: LinkState = {
  toggleOption: null,
  links: [],
  error: null,
  status: 'idle',
  selectedPlatform: null,
};
export const fetchLinks = createAsyncThunk(
  'link/fetchLinks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API}/get-links`, {
        credentials: 'include', // <-- Add this!
        headers: {
          'Content-Type': 'application/json',
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

    const linksToSave = links.filter((link) => link.url.trim() !== '');

    if (linksToSave.length === 0) {
      throw new Error('Please add at least one URL before saving');
    }

    const response = await fetch(`${API}/save-links`, {
      method: 'POST',

      credentials: 'include', // <-- Add this!
      headers: {
        'Content-Type': 'application/json',
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
      const nextId =
        state.links.length > 0
          ? Math.max(...state.links.map((link) => Number(link.id))) + 1
          : 1;

      state.links.push({
        id: nextId.toString(),
        url: '',
        platform: 'github',
        isDropDown: false,
        selectedPlatform: null,
      });
    },
    reorderLinks: (state, action) => {
      state.links = action.payload;
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
    setPlatform: (state, action: PayloadAction<string>) => {
      state.selectedPlatform = action.payload;
    },
    // updateLinkPlatform: (
    //   state,
    //   action: PayloadAction<{ index: number; platform: string }>,
    // ) => {
    //   const { index, platform } = action.payload;
    //   if (state.links[index]) {
    //     state.links[index].platform = platform;
    //   }
    // },
    updateLinkPlatform: (
      state,
      action: PayloadAction<{ id: string; platform: string }>,
    ) => {
      const { id, platform } = action.payload;
      const link = state.links.find((link) => link.id === id);
      if (link) {
        link.platform = platform;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchLinks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLinks.fulfilled, (state, action) => {
        state.status = 'idle';
        state.links = action.payload.map((link: Link, index: number) => ({
          ...link,
          id: index + 1, // Sequential IDs starting from 1
        }));
        state.error = null;
      })
      .addCase(fetchLinks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
      .addCase(saveLinks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveLinks.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(saveLinks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      });
  },
});
export { linkSlice };
export const {
  toggleOptionTitle,
  addLink,
  updateLink,
  removeLink,
  setPlatform,
  updateLinkPlatform,
  reorderLinks,
} = linkSlice.actions;
export default linkSlice.reducer;
