import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const isAuth = !!localStorage.getItem('token'); // Проверяем, есть ли токен
  return isAuth ? element : <Navigate to='/login' />;
};
