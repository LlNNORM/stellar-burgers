// components/burger-constructor/BurgerConstructor.tsx
import { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { BurgerConstructorUI } from '@ui';
import {
  createOrder,
  clearOrderModal
} from '../../services/burgerConstructorSlice';
import {
  selectConstructorBun,
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData,
  selectTotalPrice
} from '../../services/burgerConstructorSlice';
import type { AppDispatch } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const bun = useSelector(selectConstructorBun);
  const items = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);

  // вот тут получаем цену сразу из стора
  const price = useSelector(selectTotalPrice);

  const onOrderClick = () => {
    if (!bun || orderRequest) return;
    dispatch(createOrder());
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients: items }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
