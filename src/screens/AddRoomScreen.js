import React, {useState, useContext} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../navigation/AuthProvider';
import {useNavigation} from '@react-navigation/native';

export default function AddRoomScreen() {
  const {user} = useContext(AuthContext);
  // See Line 4 of AuthProvider.js
  const currentUser = user.toJSON();
  const navigation = useNavigation();

  const [roomName, setRoomName] = useState('');
  // To add the room name in the THREADS collection, Line 28

  async function handleButtonPress() {
    if (roomName.length > 0) {
      var gettingDocumentId;
      await firestore()
        // Create a new Firestore collection to save THREADS (From next time, it'll just get updated):
        .collection('THREADS')
        .add({
          name: roomName,
          // Adding the latestMessage field here as well,
          // we sort the rooms based on the latestMessage in the HomeScreen
          latestMessage: {
            text: `You have joined the room ${roomName}.`,
            createdAt: new Date().getTime(),
          },
        })

        .then(docRef => {
          // console.log('Document written with ID: ', docRef.id);
          gettingDocumentId = docRef.id;
          docRef.collection('MESSAGES').add({
            // Adding System Message in THREADS > MESSAGES collection
            text: `You have joined the room ${roomName}.`,
            createdAt: new Date().getTime(),
            system: true,
          });
        });

      // Adding a createdAt in USERS > doc(currentUser.uid), this creates the doc for current user if it doesn't already exists, this createdAt can be used in the future or analytic purposes.
      firestore().collection('USERS').doc(currentUser.uid).set({
        createdAt: new Date().getTime(),
      });

      // Adding room's id in USERS > THREADS
      // gettingDocumentId (defined earlier) is the id of the room which is being created (See Line 39)
      firestore()
        .collection('USERS')
        .doc(currentUser.uid)
        .collection('THREADS')
        .doc(gettingDocumentId)
        .set({
          createdAt: new Date().getTime(),
          numberOfMembers: 1,
          // numberOfMembers will be there only for rooms currentUser created, just added cause can be proved useful in the future
        });
      // console.log(gettingDocumentId);
      navigation.navigate('Home');
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
        <Text style={styles.title}>Create a new room</Text>
        <FormInput
          labelName="Room Name"
          value={roomName}
          onChangeText={text => setRoomName(text)}
          clearButtonMode="while-editing"
        />
        <FormButton
          title="Create"
          modeValue="contained"
          labelStyle={styles.buttonLabel}
          onPress={() => handleButtonPress()}
          disabled={roomName.length === 0}
          // Rooms with no names can't be created ^
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
