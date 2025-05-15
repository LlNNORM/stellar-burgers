import { FC, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { BurgerConstructorUI } from '@ui';
import {
  createOrder,
  clearOrderModal,
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData
} from '../../services/burgerConstructorSlice';
import { selectUser } from '../../services/userSlice';
import type { AppDispatch } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const user = useSelector(selectUser);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ),
    [constructorItems]
  );

  const onOrderClick = () => {
    // Если пользователь не авторизован — редирект на login
    if (!user) {
      navigate('/login');
      return;
    }

    // Если пустой заказ или идёт запрос — не отправляем
    if (
      (!constructorItems.bun && constructorItems.ingredients.length === 0) ||
      orderRequest
    )
      return;

    dispatch(createOrder());
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
