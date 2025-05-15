import { FC, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCookie } from '../../utils/cookie';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../services/store';
import { fetchCurrentUser, selectUser } from '../../services/userSlice';

export const ProtectedRoute: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const accessToken = getCookie('accessToken');

  useEffect(() => {
    if (accessToken && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [accessToken, user, dispatch]);

  // Если токена нет — редирект на логин
  if (!accessToken) {
    return <Navigate to='/login' replace />;
  }

  // Показ вложенных роутов
  return <Outlet />;
};
