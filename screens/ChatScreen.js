// @refresh reset

import React from 'react';
import {Bubble, GiftedChat, Time} from 'react-native-gifted-chat';
import {AuthContext} from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import {
  getChatParticipant,
  setMsgState,
  updateMsgDoc,
  getUser,
} from '../functions/Functions';
import {Image, Text, View} from 'react-native';

const ChatScreen = ({route}) => {
  const {user} = React.useContext(AuthContext);
  const [messages, setMessages] = React.useState([]);
  const [chatImage, setChatImage] = React.useState(null);
  const [receiverId, setReceiverId] = React.useState('');

  React.useEffect(async () => {
    // get chat participant details
    const querySnapshot = await getChatParticipant(route.params.userName);
    querySnapshot.docs.find(doc => {
      const {userImg} = doc.data();
      const id = doc.id;
      setChatImage(userImg);
      setReceiverId(id);
    });

    const unsubscribe = firestore()
      .collection('messages')
      .where('user.chatId', '==', route.params.chatId)
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot
          .docChanges()
          .filter(({type}) => type === 'added')
          .map(({doc}) => {
            const message = doc.data();
            return {
              ...message,
              createdAt: message.createdAt.toDate(),
            };
          })
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        appendMessages(messages);
      });

    console.log(`route params chatId : ${route.params.chatId}`);
    return () => unsubscribe();
  }, []);

  React.useEffect(async () => {
    // set message state
    if (receiverId) {
      if (user.uid !== receiverId) {
        console.log('userId : ' + user.uid);
        console.log('receiverId : ' + receiverId);
        const querySnapshot = await setMsgState(user.uid);
        querySnapshot.docs.forEach(async doc => {
          await updateMsgDoc(doc.id);
        });
      }
    }
  }, [receiverId]);

  const appendMessages = React.useCallback(
    messages => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );
    },
    [messages],
  );

  const handleSend = async messages => {
    await firestore()
      .collection('chats')
      .doc(route.params.chatId)
      .update({
        isMessageExists: true,
      })
      .then(() => {
        console.log(`chat state set as isMessageExists true`);
        handleSend1(messages);
      })
      .catch(e => console.log(e));
  };

  const handleSend1 = async messages => {
    const writes = messages.map(m =>
      firestore()
        .collection('messages')
        .add({
          ...m,
          sent: true,
          received: false,
        }),
    );
    await Promise.all(writes);
  };

  const renderAvatar = () => (
    <View>
      <Image
        style={{width: 50, height: 50, borderRadius: 25}}
        source={{
          uri: chatImage
            ? chatImage ||
              'https://www.vhv.rs/dpng/d/188-1888496_tie-user-default-suit-display-contact-business-woman.png'
            : 'https://www.vhv.rs/dpng/d/188-1888496_tie-user-default-suit-display-contact-business-woman.png',
        }}
      />
    </View>
  );

  const renderBubble = props => (
    <Bubble
      {...props}
      textStyle={{
        left: {
          color: '#000',
          fontSize: 16,
        },
        right: {
          color: '#fff',
          fontSize: 16,
        },
      }}
      wrapperStyle={{
        right: {
          backgroundColor: '#2e64e5',
          width: 200,
          borderColor: '#000',
          borderWidth: 1,
        },
        left: {
          backgroundColor: '#fff',
          width: 200,
          borderColor: '#000',
          borderWidth: 1,
        },
      }}
    />
  );

  return (
    <GiftedChat
      messages={messages}
      user={{
        _id: user.uid,
        chatId: route.params.chatId,
        // chatId: chatId,
        senderId: user.uid,
        receiverId: receiverId,
      }}
      onSend={handleSend}
      renderAvatar={renderAvatar}
      renderBubble={renderBubble}
      showAvatarForEveryMessage={true}
      timeTextStyle={{
        left: {
          color: '#000',
          fontSize: 12,
        },
        right: {
          color: '#fff',
          fontSize: 12,
        },
      }}
    />
  );
};

export default ChatScreen;
