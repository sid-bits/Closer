import React from 'react';
import {StyleSheet, Dimensions, Share} from 'react-native';
import AgoraUIKit, {VideoRenderMode, layout} from 'agora-rn-uikit';
import {useNavigation} from '@react-navigation/native';
import {IconButton} from 'react-native-paper';

export default function ConferenceScreen(props) {
  const {thread} = props.route.params;
  // We can get to this screen from RoomScreen or from HomeScreen (covered in those screens)
  const channel = thread._id;
  const channelName = thread.name;

  const navigation = useNavigation();
  // We'll use navigation to go back,
  // that would depend on from where we came:
  // the HomeScreen or the RoomScreen
  // We'll also use it to go to ModalChatScreen (in-meeting chat)

  const windowHeight = Dimensions.get('window').height;

  // Being able to share from the conference screen, so we don't have to disconnect from the meet in order to share.
  const onShare = async () => {
    try {
      // Using share() method which will share a 'message' property
      // We will share the channel (thread._id) and also mention the channelName (thread.name) for better communication
      await Share.share({
        message: `You've been invited to join the room '${channelName}' on Closer.${'\n'}${'\n'}Enter the following room code while joining the room :${'\n'}${channel}`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const modalChat = () => navigation.navigate('ModalChat', {thread});
  // To navigate to the ModalChatScreen, see Line 16 of ModalChatScreen

  // We will use 3 categories of props interface here:
  // The first category is rtcProps
  const rtcProps = {
    appId: '<-Removed the appId->',
    channel: channel,
    // The layout remains as grid,
    // Could have just as easily made it as pinned/spotlight,
    // but that creates a problem of rest of the members diminished in just a few pixels or are just entirely off the screen
    // which takes away the 'get closer' experience, which is the goal of this application.
    layout: layout.grid,
    // Also, the grid dynamically adapts to the change in the number of participants in the meet.

    // enableVideo: false,
    // enableAudio: false,
    // Could have enableVideo: false, enableAudio: false, to initiate the call with both Audio and Video as closed, but I felt it took away from the 'get closer' experience,
    // User shouldn't have to click a lot of buttons to get to the meeting.
  };

  // second category is callbacks
  const callbacks = {
    EndCall: () => navigation.goBack(),
    // See Line 13
  };

  // and the final category is styleProps
  const styleProps = {
    iconSize: 24,
    theme: '#fff',
    // ^ color of the icons
    videoMode: {
      max: VideoRenderMode.Hidden,
      min: VideoRenderMode.Hidden,
      // This solves the problem of a video occupying just a fraction of the available space,
      // which becomes a bigger problem on smaller devices.
      // The video of the participants will now occupy the entirety of the space provided to it.
    },

    gridVideoView: {
      margin: 8,
      borderRadius: 15,
      overflow: 'hidden',
      // ^ needed for border radius to be visible
    },

    localBtnStyles: {
      // All the local user buttons have the same style except the endCall button
      muteLocalVideo: styles.btnStyle,
      muteLocalAudio: styles.btnStyle,
      switchCamera: styles.btnStyle,
      endCall: {
        borderRadius: 10,
        width: 40,
        height: 40,
        backgroundColor: '#e64040',
        borderWidth: 0,
      },
    },

    localBtnContainer: {
      bottom: 5,
      left: 8,
    },

    UIKitContainer: {
      height: windowHeight,
      backgroundColor: '#191919',
      paddingLeft: 8,
      paddingRight: 8,
      paddingBottom: 75,
      paddingTop: 50,
    },
  };

  return (
    <>
      <AgoraUIKit
        rtcProps={rtcProps}
        callbacks={callbacks}
        styleProps={styleProps}
      />

      <IconButton
        style={styles.shareButton}
        onPress={onShare}
        icon="share-variant"
        size={27}
        color="#ffffff"
      />

      <IconButton
        style={styles.toChat}
        onPress={modalChat}
        icon="message-text"
        size={27}
        color="#ffffff"
      />
    </>
  );
}

const styles = StyleSheet.create({
  shareButton: {
    borderRadius: 10,
    backgroundColor: '#525252',
    position: 'absolute',
    right: 20,
    top: 3,
  },

  toChat: {
    borderRadius: 10,
    backgroundColor: '#525252',
    position: 'absolute',
    right: 90,
    top: 3,
  },

  btnStyle: {
    borderRadius: 10,
    width: 40,
    height: 40,
    backgroundColor: '#525252',
    borderWidth: 0,
  },
});
