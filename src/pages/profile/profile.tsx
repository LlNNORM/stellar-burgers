import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectUser,
  fetchCurrentUser,
  updateUser
} from '../../services/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Загружаем пользователя при необходимости и инициализируем форму
  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    } else {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user, dispatch]);

  // Проверка, изменена ли форма (только после загрузки пользователя)
  const isFormChanged = user
    ? formValue.name !== (user.name || '') ||
      formValue.email !== (user.email || '') ||
      !!formValue.password
    : false;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const dataToUpdate = {
      name: formValue.name,
      email: formValue.email,
      password: ''
    };
    dispatch(updateUser(dataToUpdate));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
