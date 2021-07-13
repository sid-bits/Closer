import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

// Simply Shows a Rotating-Loader when the content is loading
export default function Loading() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#191720" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
