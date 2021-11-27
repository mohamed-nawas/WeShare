import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  TextSection,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
} from '../styles/MessageStyles';
import {AuthContext} from '../navigation/AuthProvider';
import {
  getChatInfo,
  getChatUserIsChat,
  getChatUserIsOwner,
  getLatestMsgInfo,
} from '../functions/Functions';

const MessagesScreen = ({navigation, route}) => {
  const [Messages, setMessages] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const list = [];

  const {user} = React.useContext(AuthContext);

  React.useEffect(async () => {
    await getChats();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, loading]);

  const getChats = async () => {
    // all codes related to chatUserIsOwner Instance
    // all codes related to chatUserIsChat Instance

    // ----------------------------------------------------
    const response1 = await getChatUserIsOwner(user.uid);
    const response2 = await getChatUserIsChat(user.uid);

    // console.log(
    //   `response1 : ${JSON.stringify(response1, getCircularReplacer())}`,
    // );
    // console.log(
    //   `response2 : ${JSON.stringify(response2, getCircularReplacer())}`,
    // );

    const resp1 = response1.chatsIds;
    const resp2 = response2.chatsIds;

    // console.log(`resp1 : ${JSON.stringify(resp1)}`);
    // console.log(`resp2 : ${JSON.stringify(resp2)}`);

    let idsArray1 = [];
    let idsArray2 = [];

    resp1.forEach(e => {
      idsArray1.push(e.id);
    });
    resp2.forEach(e => {
      idsArray2.push(e.id);
    });
    const idsArray = idsArray1.concat(idsArray2);

    // console.log(`ids Array : ${idsArray}`);

    let chatsArray1 = [];
    let chatsArray2 = [];

    resp1.forEach(e => {
      chatsArray1.push(e.chatId);
    });
    resp2.forEach(e => {
      chatsArray2.push(e.chatId);
    });
    const chatsIdsArray = chatsArray1.concat(chatsArray2);

    // console.log(`chatsIds Array : ${chatsIdsArray}`);
    const userData1 = await getChatInfo(chatsIdsArray);
    const userData = userData1.response;
    // console.log(`user data : ${JSON.stringify(userData)}`);

    // console.log(`ids Array : ${idsArray}`);
    const latestMsgData1 = await getLatestMsgInfo(idsArray);
    const latestMsgData = latestMsgData1.response;
    // console.log(`latest message data : ${JSON.stringify(latestMsgData)}`);

    const fnameArr = [];
    userData.forEach(e => {
      fnameArr.push(e.fname);
    });
    const lnameArr = [];
    userData.forEach(e => {
      lnameArr.push(e.lname);
    });
    const userNameArr = [];
    for (let i = 0; i < fnameArr.length; i++) {
      userNameArr.push(fnameArr[i] + ' ' + lnameArr[i]);
    }
    const userImgArr = [];
    userData.forEach(e => {
      userImgArr.push({
        uri: e.userImg
          ? e.userImg ||
            'https://www.vhv.rs/dpng/d/188-1888496_tie-user-default-suit-display-contact-business-woman.png'
          : 'https://www.vhv.rs/dpng/d/188-1888496_tie-user-default-suit-display-contact-business-woman.png',
      });
    });
    const textArr = [];
    latestMsgData.forEach(e => {
      textArr.push(e.text);
    });
    const senderIdArr = [];
    latestMsgData.forEach(e => {
      senderIdArr.push(e.senderId);
    });
    const timeArr = [];
    latestMsgData.forEach(e => {
      timeArr.push(e.time);
    });

    let chatArr = [];
    for (let i = 0; i < idsArray.length; i++) {
      chatArr.push({
        id: idsArray[i],
        userName: userNameArr[i],
        userImg: userImgArr[i],
        messageTime: timeArr[i],
        messageText:
          senderIdArr[i] === user.uid ? 'You : ' + textArr[i] : textArr[i],
      });
    }

    // console.log(`chatArr : ${JSON.stringify(chatArr)}`);
    setMessages(chatArr);
  };

  return (
    <Container
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <FlatList
        data={Messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Card
            onPress={() =>
              navigation.navigate('Chat', {
                chatId: item.id,
                userName: item.userName,
              })
            }>
            <UserInfo>
              <UserImgWrapper>
                <UserImg source={item.userImg} />
              </UserImgWrapper>
              <TextSection>
                <UserInfoText>
                  <UserName>{item.userName}</UserName>
                  <PostTime>{item.messageTime}</PostTime>
                </UserInfoText>
                <MessageText>{item.messageText}</MessageText>
              </TextSection>
            </UserInfo>
          </Card>
        )}
      />
    </Container>
  );
};

export default MessagesScreen;
