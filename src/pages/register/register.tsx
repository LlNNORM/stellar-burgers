import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  registerUser,
  selectUser,
  selectUserError,
  selectUserLoading
} from '../../services/userSlice';
import { Preloader } from '@ui';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const errorText = useSelector(selectUserError);
  const loading = useSelector(selectUserLoading);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await dispatch(registerUser({ name: userName, email, password }));
  };

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  if (loading) return <Preloader />;

  return (
    <RegisterUI
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      userName={userName}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
      errorText={errorText || ''}
    />
  );
};
