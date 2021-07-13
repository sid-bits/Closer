import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddRoomScreen from '../screens/AddRoomScreen';
import RoomScreen from '../screens/RoomScreen';
import ConferenceScreen from '../screens/ConferenceScreen';
import ModalChatScreen from '../screens/ModalChatScreen';
import JoinRoomScreen from '../screens/JoinRoomScreen';

const ChatAppStack = createStackNavigator();
const ModalStack = createStackNavigator();

// ChatApp() contains the 'Home, Room, and Conference Screens'
// Whereas the modal screens - 'AddRoom, JoinRoom and ModalChat' are outside the ChatApp()
// Modal screens behave like pop-ups, that's why in-meeting chatting works seamlessly
// and the meeting isn't stopped
function ChatApp() {
  return (
    <ChatAppStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2b2737',
          height: 64,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontSize: 22,
        },
      }}>
      <ChatAppStack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <ChatAppStack.Screen
        name="Room"
        component={RoomScreen}
        options={({route}) => ({
          title: route.params.thread.name,
          // thread.name is passed so that the room's title can be changed dynamically whenever the user navigates to the RoomScreen
          // Header style is sent as well in the screenOptions, Line 20
        })}
      />

      <ChatAppStack.Screen
        name="Conference"
        component={ConferenceScreen}
        options={{headerShown: false}}
      />
    </ChatAppStack.Navigator>
  );
}

export default function HomeStack() {
  return (
    <ModalStack.Navigator mode="modal" headerMode="none">
      <ModalStack.Screen name="ChatApp" component={ChatApp} />
      <ModalStack.Screen name="AddRoom" component={AddRoomScreen} />
      <ModalStack.Screen name="JoinRoom" component={JoinRoomScreen} />
      <ModalStack.Screen name="ModalChat" component={ModalChatScreen} />
      {/* Modal for In-Meeting-Chat /\ */}
    </ModalStack.Navigator>
  );
}
