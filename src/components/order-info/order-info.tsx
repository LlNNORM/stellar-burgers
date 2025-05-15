import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} from '../../services/ingredientsSlice';

import {
  fetchOrderDetails,
  selectOrderData,
  selectOrderLoading,
  selectOrderError
} from '../../services/orderDetailsSlice';

import type { AppDispatch } from '../../services/store';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>(); // <-- извлекаем номер заказа из URL
  const dispatch = useDispatch<AppDispatch>();

  const ingredients = useSelector(selectIngredients);
  const ingredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);

  const orderData = useSelector(selectOrderData);
  const orderLoading = useSelector(selectOrderLoading);
  const orderError = useSelector(selectOrderError);

  // загружаем ингредиенты
  useEffect(() => {
    if (!ingredients.length && !ingredientsLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  // загружаем заказ по номеру
  useEffect(() => {
    if (number) {
      dispatch(fetchOrderDetails(Number(number)));
    }
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (orderLoading || ingredientsLoading) {
    return <Preloader />;
  }

  if (orderError || ingredientsError) {
    return <div>Произошла ошибка при загрузке данных</div>;
  }

  if (!orderInfo) {
    return null;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
