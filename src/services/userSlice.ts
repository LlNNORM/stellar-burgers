import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  updateUserApi,
  getUserApi,
  logoutApi
} from '../utils/burger-api';
import type { TUser, TLoginData, TRegisterData } from '../utils/types';
import type { RootState } from './store';
import {
  loadUserFromStorage,
  saveUserToStorage,
  clearUserFromStorage
} from '../utils/storage';

interface UserState {
  user: TUser | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  user: loadUserFromStorage(),
  loading: false,
  error: null,
  isLoggedIn: !!loadUserFromStorage() // если есть user в localStorage — считаем залогиненным
};

// Логин
export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await loginUserApi(credentials);
    // Сохранение токенов
    localStorage.setItem('refreshToken', data.refreshToken);
    document.cookie = `accessToken=${data.accessToken}`;
    // Получаем профиль
    const profile = await getUserApi();
    return profile.user;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка логина');
  }
});

// Регистрация
export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (credentials, { rejectWithValue }) => {
  try {
    const data = await registerUserApi(credentials);
    localStorage.setItem('refreshToken', data.refreshToken);
    document.cookie = `accessToken=${data.accessToken}`;
    const profile = await getUserApi();
    return profile.user;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка регистрации');
  }
});

// Получить текущего пользователя
export const fetchCurrentUser = createAsyncThunk<
  TUser,
  void,
  { rejectValue: string }
>('user/fetchCurrent', async (_, { rejectWithValue }) => {
  try {
    const profile = await getUserApi();
    return profile.user;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Не удалось получить пользователя');
  }
});
// Обновить данные текущего пользователя
export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/updateUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(userData);
    return response.user;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка обновления данных');
  }
});

// Логаут
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      document.cookie = `accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка логаута');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser(state) {
      state.user = null;
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(loginUser.fulfilled, (s, a: PayloadAction<TUser>) => {
        s.loading = false;
        s.user = a.payload;
        s.isLoggedIn = true;
        saveUserToStorage(a.payload);
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? 'Ошибка логина';
      })
      // register
      .addCase(registerUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(registerUser.fulfilled, (s, a: PayloadAction<TUser>) => {
        s.loading = false;
        s.user = a.payload;
        s.isLoggedIn = true;
        saveUserToStorage(a.payload);
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? 'Ошибка регистрации';
      })
      // fetchCurrent
      .addCase(fetchCurrentUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (s, a: PayloadAction<TUser>) => {
        s.loading = false;
        s.user = a.payload;
        s.isLoggedIn = true;
      })
      .addCase(fetchCurrentUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? 'Не удалось получить пользователя';
        s.isLoggedIn = false;
      })
      //update
      .addCase(updateUser.fulfilled, (s, a) => {
        s.user = a.payload;
        saveUserToStorage(a.payload);
      })
      .addCase(updateUser.rejected, (s, a) => {
        s.error = a.payload || 'Не удалось обновить данные';
      })
      // logout
      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null;
        s.loading = false;
        s.error = null;
        s.isLoggedIn = false;
        clearUserFromStorage();
      });
  }
});

export const { resetUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;
