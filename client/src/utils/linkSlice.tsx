import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API } from '../App';
import { RootState } from '../store';

export interface Link {
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

export const fetchOflineLinks = createAsyncThunk(
  'link/fetchOflineLinks',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API}/shared-links/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch links');
      }

      const data = await response.json();
      console.log('Received links data:', data);

      return data.data.links.map((link: any) => ({
        id: link._id || String(Math.random()),
        url: link.url,
        platform: link.platform,
        isDropDown: false,
      }));
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch links',
      );
    }
  },
);
// export const fetchOflineLinks = createAsyncThunk(
//   'link/fetchOflineLinks',
//   async (profileId: string, { rejectWithValue }) => {
//     try {
//       console.log('Fetching links for profileId:', profileId);

//       const response = await fetch(`${API}/shared-links/${profileId}`);

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || 'Failed to fetch links');
//       }

//       const data = await response.json();
//       console.log('Received links data:', data);

//       if (!data.data?.links) {
//         throw new Error('Invalid response format');
//       }

//       return data.data.links.map((link: any) => ({
//         id: link._id || String(Math.random()),
//         url: link.url,
//         platform: link.platform,
//         isDropDown: false,
//       }));
//     } catch (error) {
//       console.error('Error in fetchOflineLinks:', error);
//       return rejectWithValue(
//         error instanceof Error ? error.message : 'Failed to fetch links',
//       );
//     }
//   },
// );
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
    await response.json();
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
      // Existing cases
      .addCase(fetchLinks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLinks.fulfilled, (state, action) => {
        state.status = 'idle';
        state.links = action.payload.map((link: Link) => ({
          ...link,
        }));
        state.error = null;
      })
      .addCase(fetchLinks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
      // Add these cases for fetchOflineLinks
      .addCase(fetchOflineLinks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOflineLinks.fulfilled, (state, action) => {
        state.status = 'idle';
        state.links = action.payload;
        state.error = null;
        console.log('Updated state with links:', state.links); // Debug log
      })
      .addCase(fetchOflineLinks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
      // Existing save links cases...
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
