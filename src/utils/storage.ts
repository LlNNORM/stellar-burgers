import { TUser } from '@utils-types';

export const loadUserFromStorage = (): TUser | null => {
  try {
    const serializedUser = localStorage.getItem('user');
    return serializedUser ? JSON.parse(serializedUser) : null;
  } catch {
    return null;
  }
};

export const saveUserToStorage = (user: TUser) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch {}
};

export const clearUserFromStorage = () => {
  localStorage.removeItem('user');
};
