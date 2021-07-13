import React, {useState, useContext} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../navigation/AuthProvider';
import {useNavigation} from '@react-navigation/native';

export default function JoinRoomScreen() {
  const {user} = useContext(AuthContext);
  // See Line 4 of AuthProvider.js
  const currentUser = user.toJSON();
  const navigation = useNavigation();

  const [roomName, setRoomName] = useState('');
  // Here roomName is the room-code entered by the user,
  // This room-code is shared by a different user who is already in the room,
  // Room-code can be shared from the room screen or the conference screen

  async function handleButtonPress() {
    if (roomName.length > 0) {
      // Here it's different than AddRoomScreen
      // We are not doing anything in THREADS top-level collection
      // We are adding the room name in USERS > THREADS collection,
      // which displays the room on HomeScreen for our user (Because only those rooms are displayed which are present in USERS > THREADS)
      await firestore()
        .collection('USERS')
        .doc(currentUser.uid)
        .collection('THREADS')
        .doc(roomName)
        .set({createdAt: new Date().getTime()});

      console.log(roomName);

      navigation.navigate('Home');
      // Screen closes and we can see that the room is now displayed on the home screen among other rooms
    }
  }

  return (
    <View style={styles.rootContainer}>
      <View style={styles.closeButtonContainer}>
        <IconButton
          icon="close-circle"
          size={36}
          color="#6646ee"
          onPress={() => navigation.goBack()}
        />
      </View>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Join an existing room</Text>
        <FormInput
          labelName="Enter Room Code"
          value={roomName}
          onChangeText={text => setRoomName(text)}
          clearButtonMode="while-editing"
        />
        <FormButton
          title="Join"
          modeValue="contained"
          labelStyle={styles.buttonLabel}
          onPress={() => handleButtonPress()}
          disabled={roomName.length === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 30,
    right: 0,
    zIndex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    marginBottom: 10,
    fontFamily: 'sans-serif-light',
  },
  buttonLabel: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
