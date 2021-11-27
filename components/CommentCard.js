import React from 'react';
import {View, Text, TextInput} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import {
  Card,
  UserInfo,
  UserImg,
  UserInfoText,
  UserName,
  CommentTime,
  CommentText,
  Divider,
  InteractionWrapper,
  Interaction,
  InteractionText,
} from '../styles/CommentCardStyles';

const CommentCard = ({item}) => {
  const [commentData, setCommentData] = React.useState({});

  React.useEffect(async () => {
    const response = await getCommentUser(item.commentUserId);
    const {userName, userImg} = response[0];
    setCommentData({
      userImg: userImg,
      userName: userName,
      comment: item.comment,
      time: 'moments ago',
    });
    console.log(`commentData In useEffect : ${JSON.stringify(commentData)}`);
  }, []);

  const getCommentUser = async userId => {
    const comment = new Array();
    const response = await firestore()
      .collection('users')
      .doc(userId)
      .get()
      .then(doc => {
        const {fname, lname, userImg} = doc.data();
        comment.push({
          userName: fname + ' ' + lname,
          userImg: userImg,
        });
        return comment;
      })
      .catch(e => console.log(e));
    return response;
  };

  return (
    <Card>
      <UserInfo>
        <UserImg
          source={{
            uri: commentData.userImg
              ? commentData.userImg ||
                'https://www.vhv.rs/dpng/d/188-1888496_tie-user-default-suit-display-contact-business-woman.png'
              : 'https://www.vhv.rs/dpng/d/188-1888496_tie-user-default-suit-display-contact-business-woman.png',
          }}
        />
        <UserInfoText>
          <UserName>{commentData.userName}</UserName>
          <CommentTime>{commentData.time}</CommentTime>
        </UserInfoText>
      </UserInfo>
      <CommentText>{commentData.comment}</CommentText>
      <Divider />
      <InteractionWrapper>
        <Interaction>
          <Ionicons name="md-chatbubble-outline" size={25} />
          <InteractionText>Like</InteractionText>
        </Interaction>
        <Interaction>
          <Ionicons name="md-chatbubble-outline" size={25} />
          <InteractionText>Reply</InteractionText>
        </Interaction>
      </InteractionWrapper>
    </Card>
  );
};

export default CommentCard;
