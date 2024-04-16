import React, {FC} from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';

interface Props extends TextInputProps {
  label: string;
}

export const Input: FC<Props> = ({label, ...props}) => {
  return (
    <View style={styles.root}>
      <Text>{label}</Text>

      <TextInput placeholderTextColor="grey" style={styles.input} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    gap: 5,
  },
  input: {
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
});
