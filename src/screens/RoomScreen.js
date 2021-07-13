import React, {useState, useContext, useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet, Share} from 'react-native';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
} from 'react-native-gifted-chat';

import {AuthContext} from '../navigation/AuthProvider';
import {IconButton} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

export default function RoomScreen({route}) {
  const {thread} = route.params;
  // got from the HomeScreen ^, we will use it for getting thread._id and thread.name
  const {user} = useContext(AuthContext);
  const currentUser = user.toJSON();

  const navigation = useNavigation();

  const createConference = () => navigation.navigate('Conference', {thread});
  // Passing thread as well, we'll use this to get the channel name

  // Being able to share from the room screen
  const onShare = async () => {
    try {
      // Using share() method which will share a 'message' property
      // We will share the thread._id and also mention the thread.name for better communication
      await Share.share({
        // message: thread._id
        message: `You've been invited to join the room '${
          thread.name
        }' on Closer.${'\n'}${'\n'}Enter the following room code while joining the room :${'\n'}${
          thread._id
        }`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const [messages, setMessages] = useState([]);

  // helper method that sends a message
  async function handleSend(messages) {
    const text = messages[0].text;

    firestore()
      .collection('THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      // Adding the message sent by the user to THREADS > MESSAGES
      // (this contains user information as well,
      // it'll help us differentiate between messages from different users)
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: currentUser.uid,
          email: currentUser.email,
        },
      });

    // We're also adding this message sent by the user as the latestMessage field in that doc(current room)
    // as this will be used to display the latestMessage on the home screen for the room (also for the order of rooms)
    await firestore()
      .collection('THREADS')
      .doc(thread._id)
      .set(
        {
          latestMessage: {
            text,
            createdAt: new Date().getTime(),
          },
        },
        {merge: true},
      );
  }

  // onSnapshot to display the messages
  useEffect(() => {
    const messagesListener = firestore()
      .collection('THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      // for ordering by most recent
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();
          // data() method grabs all the fields in that doc as an object

          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData,
          };

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.email,
              // Adding the user's email as the name,
              // we already have the email from the authentication
            };
          }

          return data;
        });

        // The returned (data) goes in messages array, which is being returned at Line 192
        setMessages(messages);
      });

    return () => messagesListener();
  }, []);

  // Adding a helper method for bubble
  function renderBubble(props) {
    return (
      // Returning the component
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            // Here is the color for user (because displayed on the right side)
            backgroundColor: '#6646ee',
          },
          left: {
            // Here is the color for others (because displayed on the left side)
            backgroundColor: '#ddddeb',
          },
        }}
        textStyle={{
          // right and left same as above
          right: {
            color: '#fff',
          },
          left: {
            color: '#000',
          },
        }}
      />
    );
  }

  // Adding a helper method for Send
  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon="send-circle" size={32} color="#2b2737" />
        </View>
      </Send>
    );
  }

  // Adding a helper method for scrollToBottomComponent
  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton icon="chevron-double-down" size={32} color="#2b2737" />
      </View>
    );
  }

  // Add a helper method for renderLoading
  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6646ee" />
      </View>
    );
  }

  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
  }

  return (
    <>
      <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={{_id: currentUser.uid}}
        renderBubble={renderBubble}
        placeholder="Write away..."
        showUserAvatar
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        renderLoading={renderLoading}
        renderSystemMessage={renderSystemMessage}
      />

      {/* Takes to the conference */}
      <IconButton
        style={styles.toConference}
        onPress={createConference}
        icon="video-plus"
        size={36}
        color="#2b2737"
      />

      {/* For sharing, see Line 26*/}
      <IconButton
        style={styles.shareButton}
        onPress={onShare}
        icon="share-variant"
        size={28}
        color="#2b2737"
      />
    </>
  );
}

const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  systemMessageWrapper: {
    backgroundColor: '#3d384e',
    borderRadius: 4,
    padding: 6,
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },

  toConference: {
    position: 'absolute',
    bottom: -10,
    right: 40,
  },
  shareButton: {
    position: 'absolute',
    right: 0,
    bottom: 110,
  },
});
