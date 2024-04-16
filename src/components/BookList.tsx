import React, {FC, useCallback} from 'react';
import {Swipeable} from 'react-native-gesture-handler';
import {
  Animated,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {IBook} from '../types/interfaces/IBook.ts';
import AnimatedInterpolation = Animated.AnimatedInterpolation;
import {formatDate} from './ManageBookModal.tsx';

interface Props {
  data: IBook[] | undefined;
  onRefresh: () => void;
  onAddBook: () => void;
  onDelete: (id: number) => void;
  onEdit: (book: IBook) => void;
}

export const BookList: FC<Props> = ({
  data,
  onDelete,
  onRefresh,
  onEdit,
  onAddBook,
}) => {
  const renderLeftActions = useCallback(
    (progress: AnimatedInterpolation<number>, item: IBook) => {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={15}
          onPress={() => onEdit(item)}
          style={styles.leftActions}>
          <Text style={{color: 'white'}}>Edit</Text>
        </TouchableOpacity>
      );
    },
    [onEdit],
  );

  const renderRightActions = useCallback(
    (progress: AnimatedInterpolation<number>, id: number | undefined) => {
      return (
        <TouchableOpacity
          style={styles.rightActions}
          activeOpacity={0.7}
          onPress={() => onDelete(id!)}>
          <Text style={{color: 'white'}}>Delete</Text>
        </TouchableOpacity>
      );
    },
    [onDelete],
  );

  const renderItem = useCallback(
    ({item}: {item: IBook}) => {
      return (
        <Swipeable
          renderLeftActions={progress => renderLeftActions(progress, item)}
          renderRightActions={progress =>
            renderRightActions(progress, item.id)
          }>
          <View style={styles.itemContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>Author: {item.author}</Text>
            <Text style={styles.year}>
              Year of Publication: {formatDate(item.year_of_publication)}
            </Text>
          </View>
        </Swipeable>
      );
    },
    [renderLeftActions, renderRightActions],
  );

  const renderHeader = useCallback(() => {
    return (
      <TouchableOpacity
        onPress={onAddBook}
        activeOpacity={0.7}
        style={styles.headerContent}>
        <Text style={styles.title}>Add a book</Text>
      </TouchableOpacity>
    );
  }, [onAddBook]);

  const renderEmpty = useCallback(() => {
    return (
      <View style={styles.empty}>
        <Text style={styles.title}>No books</Text>
      </View>
    );
  }, []);

  return (
    <FlatList
      data={data}
      contentContainerStyle={styles.root}
      keyExtractor={item => String(item.id)}
      stickyHeaderIndices={[0]}
      renderItem={renderItem}
      ListHeaderComponentStyle={styles.header}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
  },

  header: {
    backgroundColor: 'white',
    paddingBottom: 15,
  },
  headerContent: {
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 32,
    borderRadius: 15,
  },

  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'green',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'red',
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

  empty: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
