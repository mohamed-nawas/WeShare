import React from 'react';
import {View, Text, ScrollView, FlatList} from 'react-native';
import {
  Comment,
  CommentContainer,
  Container,
  Send,
} from '../styles/CommentModalStyles';
import {
  fetchPosts,
  fetchMorePosts,
  fetchComments,
  fetchMoreComments,
} from '../functions/Functions';
import {AuthContext} from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import CommentCard from './CommentCard';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const CommentModal = ({postId}) => {
  const {user} = React.useContext(AuthContext);
  const [textInputValue, setTextInputValue] = React.useState(null);
  const [comments, setComments] = React.useState(new Array());
  const [commentsPerLoad] = React.useState(4);
  const [startAfter, setStartAfter] = React.useState(Object);
  const [lastPost, setLastPost] = React.useState(false);

  React.useEffect(async () => {
    setLastPost(false);
    await getComments(postId);
    // navigation.addListener('focus', () => setLoading(!loading));
  }, []);

  const getComments = async postId => {
    const commentsData = await fetchComments(postId);
    console.log(`commentsData : ${JSON.stringify(commentsData.comments)}`);
    setComments(commentsData.comments);
    setStartAfter(commentsData.lastVisible);
  };

  const handleCommentSend = async () => {
    console.log(`postId : ${postId}`);
    console.log(`user.uid : ${user.uid}`);
    console.log(`comment : ${textInputValue}`);

    await firestore()
      .collection('likesComments')
      .doc(postId)
      .get()
      .then(async doc => {
        if (doc.exists) {
          await firestore()
            .collection('likesComments')
            .doc(postId)
            .update({
              commentsArray: firestore.FieldValue.arrayUnion({
                comment: textInputValue,
                commentUserId: user.uid,
              }),
            })
            .then(async () => {
              console.log('comment added');
              await getComments(postId);
            })
            .catch(e => console.log(e));
        } else {
          await firestore()
            .collection('likesComments')
            .doc(postId)
            .set({
              commentsArray: [
                {
                  comment: textInputValue,
                  commentUserId: user.uid,
                },
              ],
            })
            .then(async () => {
              console.log('comment added');
              await getComments(postId);
            })
            .catch(e => console.log(e));
        }
      })
      .catch(e => console.log(e));
  };

  return (
    <View>
      <Container>
        <FlatList
          data={comments}
          renderItem={({item}) => <CommentCard item={item} />}
          keyExtractor={item => Math.random()}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.01}
          scrollEventThrottle={150}
        />
      </Container>
      <CommentContainer>
        <Comment
          value={textInputValue}
          onEndEditing={e => setTextInputValue(e.nativeEvent.text)}
          placeholder="  add a comment"
        />
        <Send onPress={handleCommentSend}>
          <MaterialCommunityIcon
            name="send-circle-outline"
            size={35}
            color="#1275a6"
          />
        </Send>
      </CommentContainer>
    </View>
  );
};

export default CommentModal;
