import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../services/userSlice';

export const OnlyPublicRoute: FC = () => {
  const user = useSelector(selectUser);

  // Если пользователь уже авторизован — редирект на главную
  if (user) {
    return <Navigate to='/' replace />;
  }

  // Иначе — показываем вложенные маршруты
  return <Outlet />;
};
