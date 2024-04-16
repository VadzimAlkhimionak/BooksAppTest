import {instance} from '../instance.ts';
import {IBook} from '../../types/interfaces/IBook.ts';

export default async (id: number, data: Partial<IBook>) => {
  await instance.patch(`api/v1/books/${id}`, {json: data}).json();
};
