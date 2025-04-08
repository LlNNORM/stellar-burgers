import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector, useDispatch } from 'react-redux';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { Preloader } from '../ui/preloader';

import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} from '../../services/ingredientsSlice';

import {
  selectConstructorItems,
  selectConstructorBun
} from '../../services/burgerConstructorSlice';

import type { AppDispatch } from '../../services/store';

export const BurgerIngredients: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const ingredients = useSelector(selectIngredients);
  const loading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  const constructorItems = useSelector(selectConstructorItems);
  const constructorBun = useSelector(selectConstructorBun);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const ingredientsWithCount = ingredients.map((item) => {
    let count = 0;
    if (item.type === 'bun' && constructorBun?._id === item._id) {
      count = 2;
    } else {
      count = constructorItems.filter((i) => i._id === item._id).length;
    }
    return { ...item, count };
  });

  const buns = ingredientsWithCount.filter((item) => item.type === 'bun');
  const mains = ingredientsWithCount.filter((item) => item.type === 'main');
  const sauces = ingredientsWithCount.filter((item) => item.type === 'sauce');

  return (
    <>
      {loading && <Preloader />}
      {error && <p>Ошибка загрузки: {error}</p>}
      {!loading && !error && (
        <BurgerIngredientsUI
          currentTab={currentTab}
          buns={buns}
          mains={mains}
          sauces={sauces}
          titleBunRef={titleBunRef}
          titleMainRef={titleMainRef}
          titleSaucesRef={titleSaucesRef}
          bunsRef={bunsRef}
          mainsRef={mainsRef}
          saucesRef={saucesRef}
          onTabClick={onTabClick}
        />
      )}
    </>
  );
};
