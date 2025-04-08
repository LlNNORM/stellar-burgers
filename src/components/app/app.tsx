import '../../index.css';
import styles from './app.module.css';
import { Routes, Route } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Modal, OrderInfo, IngredientDetails, AppHeader } from '@components';
import { ProtectedRoute } from '../protected-route';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        {/* Основные страницы */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* Защищенные маршруты */}
        <Route path='/login' element={<ProtectedRoute element={<Login />} />} />
        <Route
          path='/register'
          element={<ProtectedRoute element={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute element={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute element={<ResetPassword />} />}
        />
        <Route
          path='/profile'
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute element={<ProfileOrders />} />}
        />

        {/* Модальные окна */}
        <Route
          path='/feed/:number'
          element={
            <Modal title='Детали заказа' onClose={() => navigate(-1)}>
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute
              element={
                <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                  <OrderInfo />
                </Modal>
              }
            />
          }
        />

        {/* Страница 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  );
};

export default App;
