import { api } from '../lib/axios';
import type { INewUser, IUser } from '../types/IUser';

export const fetchUsers = async (): Promise<IUser[]> => {
  const response = await api.get('/api/users');
  return response.data.map((user: any) => ({
    ...user,
    register_date: new Date(user.register_date),
  }));
};

export const addUser = async (newUser: INewUser): Promise<void> => {
  const userToAdd = { ...newUser, register_date: new Date(newUser.register_date) };
  await api.post('/api/users', userToAdd);
};

export const deleteUser = async (userId: number): Promise<void> => {
  await api.delete(`/api/users/${userId}`);
};

export const updateUser = async (user: IUser): Promise<void> => {
  const userToUpdate = {
    ...user,
    register_date:
      user.register_date instanceof Date ? user.register_date : new Date(user.register_date),
  };
  await api.put(`/api/users/${user.id}`, userToUpdate);
};
