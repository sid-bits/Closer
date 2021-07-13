import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import {List, Divider, IconButton, DarkTheme} from 'react-native-paper';
import {AuthContext} from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';

export default function HomeScreen({navigation}) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  const {user} = useContext(AuthContext);
  // See Line 4 of AuthProvider.js
  const currentUser = user.toJSON();

  const {logout} = useContext(AuthContext);
  // Uses logout from AuthContext and then after button press,
  // firebase.auth sets the user as unauthenticated
  // and as we saw in routes.js the unauthenticated user is taken to the AuthStack

  useEffect(() => {
    // Database structure that is being queried here (from firebase):
    // There are 2 top-level collections:  1. USERS  2. THREADS
    // 1. USERS > THREADS (The THREADS collection here just stores the thread id from the second THREADS collection)
    //    This is done so that we only display the THREADS (Rooms) of which the current user is a part of.
    // 2. THREADS > MESSAGES
    //    (Here the messages collection is not being fetched,
    //    We'll do that when reading the messages)
    firestore()
      .collection('USERS')
      .doc(currentUser.uid)
      // We'll filter the rooms based on the currentUser.uid
      .collection('THREADS')
      .onSnapshot(allDocs => {
        const resp = new Set(allDocs.docs.map(itm => itm.id));
        // Used to filter at Line 61

        const unsubscribe = firestore()
          .collection('THREADS')
          .orderBy('latestMessage.createdAt', 'desc')
          // So that room with the most recent 'latestMessage' appears first
          .onSnapshot(querySnapshot => {
            let threads = querySnapshot.docs.map(documentSnapshot => {
              return {
                _id: documentSnapshot.id,
                name: '',
                latestMessage: {
                  text: '',
                },
                ...documentSnapshot.data(),
              };
            });

            threads = threads.filter(itm => resp.has(itm._id));
            console.log(threads);

            setThreads(threads);

            if (loading) {
              setLoading(false);
            }
          });

        // unsubscribe listener
        return () => unsubscribe();
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  // ...................................................

  // Navigates to following screens, defined in HomeStack
  const AddRoomScreen = () => navigation.navigate('AddRoom', {threads});
  const JoinRoomScreen = () => navigation.navigate('JoinRoom', {threads});

  // ...................................................

  // Renders when the list containing the rooms is empty
  const ListEmptyComponent = () => {
    return (
      <View>
        <Text style={styles.emptyListStyleHeading}>Let's get you started.</Text>
        <Text style={styles.emptyListStyleSecondary}>Create a room</Text>
        <View style={styles.iconStarterContainer}>
          <IconButton
            style={styles.iconStarter}
            icon="account-multiple-plus"
            size={50}
            color="#ffffff"
            onPress={AddRoomScreen}
          />
        </View>

        <Text style={styles.emptyListStyleSecondary}>Or Join a room</Text>
        <View style={styles.iconStarterContainer}>
          <IconButton
            style={styles.iconStarter}
            icon="account-group"
            size={50}
            color="#ffffff"
            onPress={JoinRoomScreen}
          />
        </View>

        <Text style={styles.emptyListStyleNote}>
          All your rooms will appear here.
        </Text>
      </View>
    );
  };

  return (
    <>
      <View style={styles.headerContainer}></View>
      <View style={styles.container}>
        <FlatList
          data={threads}
          keyExtractor={item => item._id}
          ItemSeparatorComponent={() => <Divider theme={DarkTheme} />}
          // DarkTheme adds desired color to the divider without writing any extra code
          ListEmptyComponent={ListEmptyComponent}
          // When the list is empty ^
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Room', {thread: item})}>
              {/* item is used to specify the id for the room (RoomScreen) which will be displayed */}
              <List.Item
                title={item.name}
                description={item.latestMessage.text}
                titleNumberOfLines={1}
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
                descriptionNumberOfLines={1}
                // -----
                right={() => (
                  <IconButton
                    style={styles.conferenceIcon}
                    icon="video-plus"
                    size={30}
                    color="#ffffff"
                    onPress={
                      () => navigation.navigate('Conference', {thread: item})
                      // item is used to specify the id for the channel name (ConferenceScreen) which will be displayed
                    }
                  />
                )}
                // ...
              />
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Button for Adding a room */}
      <IconButton
        style={styles.addRoomButton}
        icon="account-multiple-plus"
        size={36}
        color="#ffffff"
        onPress={AddRoomScreen}
      />

      {/* Button for Joining a room */}
      <IconButton
        style={styles.joinRoomButton}
        icon="account-group"
        size={36}
        color="#ffffff"
        onPress={JoinRoomScreen}
      />

      {/* Button for Logging out (Line 23) */}
      <IconButton
        style={styles.logoutButton}
        icon="logout-variant"
        size={36}
        color="#ffffff"
        onPress={() => logout()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    backgroundColor: '#575070',
    width: Dimensions.get('window').width,
    height: 64,
  },
  container: {
    marginTop: 64,
    backgroundColor: '#191720',
    flex: 1,
  },
  listTitle: {
    fontSize: 22,
    fontFamily: 'sans-serif-medium',
    color: '#ffffff',
  },
  listDescription: {
    fontSize: 16,
    fontFamily: 'sans-serif-light',
    color: '#ffffff',
  },

  addRoomButton: {
    position: 'absolute',
    right: 55,
  },

  joinRoomButton: {
    position: 'absolute',
    top: -2,
    right: 0,
  },

  logoutButton: {
    position: 'absolute',
    left: 0,
  },

  conferenceIcon: {
    backgroundColor: '#575070',
    marginTop: 9,
  },

  emptyListStyleHeading: {
    fontFamily: 'sans-serif-medium',
    fontWeight: 'bold',
    paddingTop: 30,
    paddingLeft: 20,
    fontSize: 48,
    textAlign: 'left',
    color: '#fff',
  },

  emptyListStyleSecondary: {
    fontFamily: 'sans-serif-thin',
    paddingTop: 14,
    paddingBottom: 10,
    paddingLeft: 20,
    fontSize: 28,
    textAlign: 'left',
    color: '#fff',
  },

  emptyListStyleNote: {
    fontFamily: 'sans-serif-thin',
    paddingTop: 40,
    paddingLeft: 20,
    fontSize: 24,
    textAlign: 'left',
    color: '#fff',
  },

  iconStarterContainer: {
    paddingLeft: 20,
    paddingTop: 4,
  },

  iconStarter: {
    backgroundColor: '#575070',
  },
});
