import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React, {FC} from 'react';

interface Props {
  loading: boolean;
}

export const Loader: FC<Props> = ({loading}) => {
  if (!loading) {
    return null;
  }

  return (
    <View style={styles.root}>
      <ActivityIndicator size="large" color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    zIndex: 1,
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
});
