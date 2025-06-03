import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API } from '../App';
import { AppThunk } from '../store';

interface ProfileState {
  id?: string; // Add this line
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  isEmailDisabled: boolean;
}

const initialState: ProfileState = {
  firstName: '',
  lastName: '',
  email: '',
  imageUrl: null,
  loading: false,
  error: null,
  success: false,
  isEmailDisabled: true,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.firstName = '';
      state.lastName = '';
      state.email = '';
      state.imageUrl = null;
      state.error = null;
      state.loading = false;
    },
    setProfileData: (
      state,
      action: PayloadAction<
        Omit<ProfileState, 'loading' | 'error' | 'success'>
      >,
    ) => {
      const { id, firstName, lastName, email, imageUrl, isEmailDisabled } =
        action.payload;
      state.id = id ?? state.id; // ✅ assign id
      state.firstName = firstName;
      state.lastName = lastName;
      state.email = email;
      state.imageUrl = imageUrl;
      state.isEmailDisabled = isEmailDisabled;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },

    resetProfile: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.firstName = action.payload.firstName;
          state.lastName = action.payload.lastName;
          state.email = action.payload.email;
          state.imageUrl = action.payload.image?.url || null;
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch profile';
      })
      .addCase(saveOrUpdateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveOrUpdateProfile.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(saveOrUpdateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
    // ...existing updateProfile cases...
  },
});

export const {
  setProfileData,
  setLoading,
  setError,
  setSuccess,
  resetProfile,
  clearProfile,
} = profileSlice.actions;

export const fetchProfileById =
  (id: string): AppThunk =>
  async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await fetch(`${API}/profile/${id}`, {
        credentials: 'include', // <-- Add this!
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      dispatch(
        setProfileData({
          id: data._id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          imageUrl: data.image?.url || null,
          isEmailDisabled: true,
        }),
      );
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setLoading(false));
    }
  };
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${API}/me`, {
        credentials: 'include', // <-- Use cookies!
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        dispatch(clearProfile());
        return null;
      }

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      if (data) {
        return {
          ...data,
          isEmailDisabled: true,
        };
      }
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch profile',
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (formData: FormData, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API}/me`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      const data = await response.json();

      dispatch(
        setProfileData({
          id: data._id, // ✅ include this
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          imageUrl: data.image?.url || null,
          isEmailDisabled: true,
        }),
      );

      dispatch(setSuccess(true));
      return data;
    } catch (error) {
      dispatch(
        setError(
          error instanceof Error ? error.message : 'Failed to update profile',
        ),
      );
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update profile',
      );
    }
  },
);
export const saveOrUpdateProfile = createAsyncThunk(
  'profile/saveOrUpdateProfile',
  async (formData: FormData, { dispatch, rejectWithValue }) => {
    try {
      // First check if profile exists
      const checkResponse = await fetch(`${API}/me`, {
        credentials: 'include', // <-- This is required!
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let response;
      if (checkResponse.status === 404) {
        // No profile exists, create new one
        response = await fetch(`${API}/profiles`, {
          method: 'POST',
          credentials: 'include', // <-- This is required!

          body: formData,
        });
      } else {
        // Profile exists, update it
        response = await fetch(`${API}/me`, {
          method: 'PUT',
          credentials: 'include', // <-- This is required!

          body: formData,
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save/update profile');
      }

      const data = await response.json();

      dispatch(
        setProfileData({
          id: data._id, // ✅ include this
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          imageUrl: data.image?.url || null,
          isEmailDisabled: true,
        }),
      );

      dispatch(setSuccess(true));
      return data;
    } catch (error) {
      dispatch(
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to save/update profile',
        ),
      );
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to save/update profile',
      );
    }
  },
);
// Thunk for saving profile
export const saveProfile =
  (formData: FormData): AppThunk =>
  async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(setSuccess(false));

    try {
      const response = await fetch(`${API}/profiles`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // <-- Send cookies!
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to save profile');

      const data = await response.json();
      dispatch(
        setProfileData({
          id: data._id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          imageUrl: data.image?.url || null,
          isEmailDisabled: true,
        }),
      );
      dispatch(setSuccess(true));
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setLoading(false));
    }
  };
const handleError = (error: unknown, dispatch: (action: any) => void) => {
  const errorMessage =
    error instanceof Error ? error.message : 'An unknown error occurred';
  dispatch(setError(errorMessage));
  console.error(error);
};
export default profileSlice.reducer;
