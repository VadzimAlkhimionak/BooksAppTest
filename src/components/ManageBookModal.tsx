import {Modal as RNModal, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {IBook} from '../types/interfaces/IBook.ts';
import {Input} from './Input.tsx';
import DatePicker from 'react-native-date-picker';

interface Props {
  isShow: boolean;
  book: IBook | undefined;
  onConfirm: (book: IBook) => void;
  onCancel: () => void;
}

export function formatDate(inputDate: Date) {
  const date = new Date(inputDate);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // January is 0
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export const ManageBookModal: FC<Props> = ({
  isShow,
  book,
  onCancel,
  onConfirm,
}) => {
  const [author, setAuthor] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState(new Date());

  const [open, setOpen] = useState(false);

  const disabled = !author || !title;

  const handleConfirmDate = (date: Date) => {
    setOpen(false);
    setDate(date);
  };
  const handleToggleDatePicker = () => setOpen(prevState => !prevState);

  const handleConfirm = useCallback(() => {
    onConfirm({
      ...(book ? {id: book.id} : {}),
      author,
      title,
      year_of_publication: date,
    });

    setAuthor('');
    setTitle('');
    setDate(new Date());
  }, [author, book, date, onConfirm, title]);

  useEffect(() => {
    setAuthor(book?.author ?? '');
    setTitle(book?.title ?? '');
    setDate(
      book?.year_of_publication
        ? new Date(book?.year_of_publication)
        : new Date(),
    );
  }, [book]);

  return (
    <RNModal visible={isShow} animationType="fade" transparent={true}>
      <View style={styles.root}>
        <Text style={styles.title}>Create a new book</Text>

        <View style={styles.inputs}>
          <Input
            label="Title:"
            value={title}
            onChangeText={setTitle}
            placeholder="Write a title..."
          />
          <Input
            label="Author:"
            value={author}
            onChangeText={setAuthor}
            placeholder="Write an author..."
          />
          <Input
            label="Date of publication:" // Changed label
            value={formatDate(date)}
            onTouchStart={handleToggleDatePicker}
            placeholder="MM/DD/YYYY"
            keyboardType="number-pad"
            editable={false}
          />
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={onCancel}
            activeOpacity={0.7}
            style={styles.buttonDelete}>
            <Text style={styles.title}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={disabled}
            onPress={handleConfirm}
            activeOpacity={0.7}
            style={[styles.buttonEdit, {opacity: disabled ? 0.4 : 1}]}>
            <Text style={styles.title}>
              {book ? 'Update a book' : 'Add a book'}{' '}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <>
        <DatePicker
          modal
          open={open}
          date={date}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={handleToggleDatePicker}
        />
      </>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    flex: 1,
    paddingVertical: 100,
    paddingHorizontal: 16,
  },
  inputs: {
    flex: 1,
    gap: 30,
    paddingTop: 40,
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
  },
  buttonEdit: {
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 15,
    flex: 1,
  },
  buttonDelete: {
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 15,
    flex: 1,
  },

  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
  },
});
