import {instance} from '../instance.ts';
import {IBook} from '../../types/interfaces/IBook.ts';

export default async (data: Omit<IBook, 'id'>) => {
  await instance.post('api/v1/books', {json: data}).json();
};
