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
  NotFound404,
  DetailsPage
} from '@pages';
import { Modal, OrderInfo, IngredientDetails, AppHeader } from '@components';
import { ProtectedRoute } from '../protected-route';
import { OnlyPublicRoute } from '../public-route';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../../services/userSlice';
import type { AppDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const background = location.state && location.state.background;
  const OrderDetailsWrapper = () => {
    const { number } = useParams<{ number: string }>();

    return (
      <DetailsPage orderNumber={`#${number}`}>
        <OrderInfo />
      </DetailsPage>
    );
  };

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);
  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        {/* Основные страницы */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderDetailsWrapper />} />
        {/* Аутентификационные страницы. Публичные маршруты, защищенные от авторизированных пользователей*/}
        <Route element={<OnlyPublicRoute />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>
        {/* Защищенные маршруты */}
        <Route element={<ProtectedRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />
          {/* Страница деталей заказа по прямой ссылке */}
          <Route
            path='/profile/orders/:number'
            element={<OrderDetailsWrapper />}
          />
        </Route>
        {/* Страница деталей ингредиента по прямой ссылке */}
        <Route
          path='/ingredients/:id'
          element={
            <DetailsPage title='Детали ингредиента'>
              <IngredientDetails />
            </DetailsPage>
          }
        />

        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
