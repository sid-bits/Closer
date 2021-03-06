import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {Button} from 'react-native-paper';

const {width, height} = Dimensions.get('screen');

// Exporting a reuasable FormButton so that I don't repeat the code.
// It will work for container buttons as well as text buttons.
// That's what the mode is doing at Line 13
export default function FormButton({title, modeValue, ...rest}) {
  return (
    <Button
      mode={modeValue}
      {...rest}
      style={styles.button}
      contentStyle={styles.buttonContainer}>
      {title}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    borderTopLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  buttonContainer: {
    width: width / 1.5,
    height: height / 15,
  },
});
