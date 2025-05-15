import { FC, ReactNode } from 'react';
import styles from './details-page.module.css';

type TDetailsPageProps = {
  title?: string;
  orderNumber?: string;
  children: ReactNode;
};

export const DetailsPage: FC<TDetailsPageProps> = ({
  title,
  orderNumber,
  children
}) => (
  <div className={styles.wrapper}>
    {title && <h1 className={'text text_type_main-large'}>{title}</h1>}
    {orderNumber && (
      <h1 className={'text text_type_digits-default'}>{orderNumber}</h1>
    )}
    {children}
  </div>
);
