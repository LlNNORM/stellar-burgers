import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../services/store';
import {
  fetchFeeds,
  selectFeedsOrders,
  selectFeedsLoading,
  selectFeedsError
} from '../../services/feedsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders: TOrder[] = useSelector(selectFeedsOrders);
  const loading = useSelector(selectFeedsLoading);
  const error = useSelector(selectFeedsError);

  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchFeeds());
    }
  }, [dispatch, orders.length]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (loading) return <Preloader />;
  if (error) return <p style={{ color: 'red' }}>Ошибка: {error}</p>;
  if (!orders.length) return <p>Нет заказов</p>;
  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
