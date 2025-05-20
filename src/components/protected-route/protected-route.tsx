import { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIsLoggedIn } from '../../services/userSlice';

interface ProtectedRouteProps {
  anonymous?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  anonymous = false
}) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Если разрешен неавторизованный доступ, а пользователь авторизован...
  if (anonymous && isLoggedIn) {
    // ...то отправляем его на предыдущую страницу
    return <Navigate to={from} replace />;
  }

  // Если требуется авторизация, а пользователь не авторизован...
  if (!anonymous && !isLoggedIn) {
    // ...то отправляем его на страницу логин
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Всё в порядке — показываем вложенные маршруты
  return <Outlet />;
};
