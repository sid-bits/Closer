import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {TextInput} from 'react-native-paper';

const {width, height} = Dimensions.get('screen');

// Exporting a reuasable FormInput so that I don't repeat the code.
// It will work for flat input as well as outlined input.
// That's what the mode is doing at Line 13, it defaults to flat input.
export default function FormInput({modeValue, labelName, ...rest}) {
  return (
    <TextInput
      mode={modeValue}
      label={labelName}
      style={styles.input}
      numberOfLines={1}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 10,
    marginBottom: 10,
    width: width / 1.5,
    height: height / 15,
    backgroundColor: '#f2f0fa',
    borderWidth: 3,
    borderColor: '#6646ee',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 14,
  },
});
