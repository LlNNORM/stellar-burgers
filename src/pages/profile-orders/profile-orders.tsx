import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  fetchUserOrders,
  selectUserOrders,
  selectUserOrdersLoading,
  selectUserOrdersError
} from '../../services/userOrdersSlice';
import { Preloader } from '../../components/ui/preloader';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const loading = useSelector(selectUserOrdersLoading);
  const error = useSelector(selectUserOrdersError);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (loading) return <Preloader />;
  if (error) return <p>Ошибка: {error}</p>;

  return <ProfileOrdersUI orders={orders} />;
};
