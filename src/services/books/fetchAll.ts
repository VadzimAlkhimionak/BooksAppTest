import {bookSchema} from '../../types/schemas/book.ts';
import {instance} from '../instance.ts';

export default async () => {
  const response = await instance.get('api/v1/books').json();
  return bookSchema.array().parse(response);
};
