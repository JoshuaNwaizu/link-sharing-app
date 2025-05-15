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
}

const initialState: ProfileState = {
  firstName: '',
  lastName: '',
  email: '',
  imageUrl: null,
  loading: false,
  error: null,
  success: false,
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
      const { firstName, lastName, email, imageUrl } = action.payload;
      state.firstName = firstName;
      state.lastName = lastName;
      state.email = email;
      state.imageUrl = imageUrl;
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`${API}/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
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
        }),
      );
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchProfile = (): AppThunk => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 404) {
      dispatch(clearProfile());
      return;
    }

    if (!response.ok) throw new Error('Failed to fetch profile');

    const data = await response.json();

    dispatch(
      setProfileData({
        id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        imageUrl: data.image?.url || null,
      }),
    );
    console.log('Fetched profile data:', data);
    console.log('Fetching from URL:', `${API}/me`);
    console.log('Using token:', token);

    // Add this to the response handling:
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    dispatch(
      setProfileData({
        id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        imageUrl: data.image?.url || null,
      }),
    );
  } catch (error) {
    handleError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};
// thunk for updating profile

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API}/profiles/update`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      const data = await response.json();
      return data.data; // Note the .data here to match the backend response
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update profile',
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
      const token = localStorage.getItem('token');
      console.log(token);
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`${API}/profiles`, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
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

// export const logout = (): AppThunk => (dispatch) => {
//   localStorage.removeItem('token');
//   dispatch(clearProfile()); // Add this line
//   // ...other logout logic...
// };
