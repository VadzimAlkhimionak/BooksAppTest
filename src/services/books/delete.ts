import {instance} from '../instance.ts';

export default async (id: number) => {
  await instance.delete(`api/v1/books/${id}`).json();
};
