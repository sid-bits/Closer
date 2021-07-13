import React, {useState, useContext, useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
} from 'react-native-gifted-chat';

import {AuthContext} from '../navigation/AuthProvider';
import {IconButton} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
// Don't need {useNavigation}, this is the last screen in the application flow

// The rest is same as RoomScreen, except a big difference:
// This screen is a modal, so the chatting works without disconnecting the meeting
// A Modal screen pushes on top of the current screen (conference screen in our case) and when the back button is pressed, it simply pops the Modal screen away.

export default function ModalChatScreen(props) {
  const {thread} = props.route.params;
  const {user} = useContext(AuthContext);
  const currentUser = user.toJSON();

  const [messages, setMessages] = useState([]);

  async function handleSend(messages) {
    const text = messages[0].text;

    firestore()
      .collection('THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: currentUser.uid,
          email: currentUser.email,
        },
      });

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

  useEffect(() => {
    const messagesListener = firestore()
      .collection('THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();

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
            };
          }

          return data;
        });

        setMessages(messages);
      });

    return () => messagesListener();
  }, []);

  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#6646ee',
          },
          left: {
            backgroundColor: '#ddddeb',
          },
        }}
        textStyle={{
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

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon="send-circle" size={32} color="#2b2737" />
        </View>
      </Send>
    );
  }

  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton icon="chevron-double-down" size={32} color="#2b2737" />
      </View>
    );
  }

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
});
