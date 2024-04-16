import 'react-native-gesture-handler';
import React, {useCallback, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';

import {IBook} from './types/interfaces/IBook.ts';
import {useMutation, useQuery} from '@tanstack/react-query';
import {createBook, deleteBook, fetchAll, updateBook} from './services/books';
import {Loader} from './components/Loader.tsx';
import {ManageBookModal} from './components/ManageBookModal.tsx';
import {BookList} from './components/BookList.tsx';

export const Root = () => {
  const [isShowModal, setIsShowModal] = useState<boolean>(false);

  const [selectedBook, setSelectedBook] = useState<IBook>();

  const {data, isPending, refetch} = useQuery<IBook[], void>({
    queryKey: ['books'],
    queryFn: () => {
      return fetchAll();
    },
  });

  const {mutate: deleteMutation, isError: isDeleteBookError} = useMutation({
    mutationFn: async (id: number) => {
      return await deleteBook(id);
    },
    onSuccess: async () => {
      await refetch();
    },
  });

  const {mutate: createMutation, isError: isCreateBookError} = useMutation({
    mutationFn: (book: IBook) => {
      return createBook(book);
    },
    onSuccess: async () => {
      await refetch();
    },
  });

  const {mutate: updateMutation, isError: isUpdateBookError} = useMutation({
    mutationFn: ({id, book}: {id: number; book: IBook}) => {
      return updateBook(id, book);
    },
    onSuccess: async () => {
      await refetch();
    },
  });

  const handleToggleModal = useCallback(
    () => setIsShowModal(prevState => !prevState),
    [],
  );

  const handleAddBook = useCallback(() => {
    setSelectedBook(undefined);
    handleToggleModal();
  }, [handleToggleModal]);

  const handleEditBook = useCallback(
    (book: IBook) => {
      setSelectedBook(book);
      handleToggleModal();
    },
    [handleToggleModal],
  );

  const handleCreateBook = useCallback(
    (book: IBook) => {
      if (isCreateBookError) {
        return;
      }

      handleToggleModal();
      createMutation(book);
    },
    [createMutation, handleToggleModal, isCreateBookError],
  );

  const handleUpdateBook = useCallback(
    (book: IBook) => {
      if (isUpdateBookError || book.id === undefined) {
        return;
      }

      handleToggleModal();
      updateMutation({id: book.id, book});
    },
    [handleToggleModal, isUpdateBookError, updateMutation],
  );

  const handleDeleteBook = useCallback(
    (id: number) => {
      if (isDeleteBookError) {
        return;
      }

      deleteMutation(id);
    },
    [deleteMutation, isDeleteBookError],
  );

  return (
    <>
      <Loader loading={isPending} />

      <SafeAreaView style={styles.root}>
        <StatusBar barStyle={'dark-content'} />

        <ManageBookModal
          isShow={isShowModal}
          book={selectedBook}
          onConfirm={selectedBook?.id ? handleUpdateBook : handleCreateBook}
          onCancel={handleToggleModal}
        />

        <BookList
          data={data}
          onRefresh={refetch}
          onDelete={handleDeleteBook}
          onEdit={handleEditBook}
          onAddBook={handleAddBook}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  author: {
    fontSize: 16,
    marginBottom: 3,
  },
  year: {
    fontSize: 16,
  },
});
