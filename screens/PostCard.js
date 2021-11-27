import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Card,
  UserInfo,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  PostText,
  PostImg,
  InteractionWrapper,
  Interaction,
  InteractionText,
  Divider,
} from '../styles/FeedStyles';
import {AuthContext} from '../navigation/AuthProvider';
import moment from 'moment';
import {Modal, TouchableOpacity, View, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import CommentModal from '../components/CommentModal';

const PostCard = ({item, onDelete, screen, onPress}) => {
  const {user, logout} = React.useContext(AuthContext);
  const [userData, setUserData] = React.useState(null);
  const [liked, setLiked] = React.useState(null);
  const [likesCount, setLikesCount] = React.useState(null);
  const [commentsCount, setCommentsCount] = React.useState(null);
  const [shouldCommentShow, setShouldCommentShow] = React.useState(false);

  let likeText = '';
  let commentText = '';

  if (likesCount === 1) {
    likeText = '1 Like';
  } else if (likesCount > 1) {
    likeText = likesCount + ' Likes';
  } else {
    likeText = 'Like';
  }

  if (commentsCount == 1) {
    commentText = '1 Comment';
  } else if (commentsCount > 1) {
    commentText = commentsCount + ' Comments';
  } else {
    commentText = 'Comment';
  }

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(item.userId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('user data' + documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      })
      .catch(e => {
        console.log('there is an error occurred while getting user', e);
      });
  };

  React.useEffect(() => {
    getUser();
    checkIfPostLiked(item);
  }, []);

  React.useEffect(() => {
    getNoOfLikes(item);
    getNoOfComments(item);
  }, [liked]);

  const getNoOfLikes = async item => {
    await firestore()
      .collection('likesComments')
      .doc(item.postId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const {likedUserIdsArray} = documentSnapshot.data();
          const noOfLikes = likedUserIdsArray.length;
          setLikesCount(noOfLikes);
        }
      })
      .catch(e => console.log(e));
  };

  const getNoOfComments = async item => {
    await firestore()
      .collection('likesComments')
      .doc(item.postId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const {commentsArray} = documentSnapshot.data();
          const noOfComments = commentsArray.length;
          setCommentsCount(noOfComments);
        }
      })
      .catch(e => console.log(e));
  };

  const checkIfPostLiked = async item => {
    await firestore()
      .collection('likesComments')
      .doc(item.postId)
      .get()
      .then(doc => {
        const {likedUserIdsArray} = doc.data();
        for (let i = 0; i < likedUserIdsArray.length; i++) {
          const element = likedUserIdsArray[i];
          if (element === user.uid) {
            setLiked(true);
          }
        }
      })
      .catch(e => console.log(e));
  };

  const handlePostLike = async item => {
    console.log(`postId : ${item.postId}`);
    // check if the current user has liked the post
    await firestore()
      .collection('likesComments')
      .doc(item.postId)
      .get()
      .then(async doc => {
        if (!doc.exists) {
          // meaning no collection likesComments, so create the collection and add a document
          await firestore()
            .collection('likesComments')
            .doc(item.postId)
            .set({
              likedUserIdsArray: [user.uid],
            })
            .then(() => {
              setLiked(true);
              console.log(`userId added`);
            })
            .catch(e => console.log(e));
        } else {
          let shouldContinue = true;
          const {likedUserIdsArray} = doc.data();
          if (likedUserIdsArray) {
            for (let i = 0; i < likedUserIdsArray.length; i++) {
              if (likedUserIdsArray[i] === user.uid) {
                // remove the userId from the likedUserIdsArray
                const e = likedUserIdsArray[i]; // get the element of index i
                console.log(`e : ${e}`);
                await firestore()
                  .collection('likesComments')
                  .doc(item.postId)
                  .update({
                    likedUserIdsArray: firestore.FieldValue.arrayRemove(e),
                  })
                  .then(() => {
                    setLiked(false);
                    console.log(`userId removed`);
                    shouldContinue = false;
                  })
                  .catch(e => console.log(e));
              }
            }
            // if no elements with current userId is found, add a userId and set Liked state to true
            if (shouldContinue) {
              await firestore()
                .collection('likesComments')
                .doc(item.postId)
                .update({
                  likedUserIdsArray: firestore.FieldValue.arrayUnion(user.uid),
                })
                .then(() => {
                  setLiked(true);
                  console.log(`userId added`);
                })
                .catch(e => console.log(e));
            }
          } else {
            console.log('likedUserIdsArray does not exists');
            await firestore()
              .collection('likesComments')
              .doc(item.postId)
              .update({
                likedUserIdsArray: firestore.FieldValue.arrayUnion(user.uid),
              })
              .then(() => {
                setLiked(true);
                console.log(`userId added`);
              })
              .catch(e => console.log(e));
          }
        }
      })
      .catch(e => console.log(e));
  };

  return (
    <Card>
      <UserInfo>
        <UserImg
          source={{
            uri: userData
              ? userData.userImg ||
                'https://www.vhv.rs/dpng/d/188-1888496_tie-user-default-suit-display-contact-business-woman.png'
              : 'https://www.vhv.rs/dpng/d/188-1888496_tie-user-default-suit-display-contact-business-woman.png',
          }}
        />
        <UserInfoText>
          {item.isProfilePicture === true ? (
            item.userId === user.uid ? (
              <View style={{flexDirection: 'row'}}>
                <UserName>
                  {userData ? userData.fname : 'Update'}{' '}
                  {userData ? userData.lname : 'Details'}
                </UserName>
                <Text style={{fontSize: 13, textAlignVertical: 'bottom'}}>
                  {' '}
                  updated profile picture
                </Text>
              </View>
            ) : (
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={onPress}>
                  <UserName>
                    {userData ? userData.fname : 'Update'}{' '}
                    {userData ? userData.lname : 'Details'}
                  </UserName>
                </TouchableOpacity>
                <Text style={{fontSize: 13, textAlignVertical: 'bottom'}}>
                  {' '}
                  updated profile picture
                </Text>
              </View>
            )
          ) : item.userId === user.uid ? (
            <UserName>
              {userData ? userData.fname : 'Update'}{' '}
              {userData ? userData.lname : 'Details'}
            </UserName>
          ) : (
            <TouchableOpacity onPress={onPress}>
              <UserName>
                {userData ? userData.fname : 'Update'}{' '}
                {userData ? userData.lname : 'Details'}
              </UserName>
            </TouchableOpacity>
          )}

          {/* <PostTime>{item.postTime.toString()}</PostTime> */}
          <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
        </UserInfoText>
      </UserInfo>
      <PostText>{item.post}</PostText>

      {item.postImg !== null ? (
        item.isProfilePicture === true ? (
          <PostImg
            style={{
              width: 260,
              height: 260,
              borderRadius: 130,
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 0,
              marginBottom: 15,
              borderWidth: 2,
              borderColor: '#808080',
            }}
            source={{uri: item.postImg}}
          />
        ) : (
          <PostImg source={{uri: item.postImg}} />
        )
      ) : (
        <Divider />
      )}
      <InteractionWrapper>
        <Interaction onPress={() => handlePostLike(item)}>
          {liked ? (
            <Ionicons name="heart" size={25} color="#2e64e5" />
          ) : (
            <Ionicons name="heart-outline" size={25} color="#333" />
          )}
          <InteractionText active={liked}>{likeText}</InteractionText>
        </Interaction>
        <Interaction onPress={() => setShouldCommentShow(true)}>
          <Ionicons name="md-chatbubble-outline" size={25} />
          <InteractionText>{commentText}</InteractionText>
        </Interaction>
        <Modal
          transparent={true}
          visible={shouldCommentShow}
          animationType={'slide'}
          onRequestClose={() => setShouldCommentShow(false)}>
          <CommentModal postId={item.postId} />
        </Modal>
        {user.uid === item.userId && screen === 'profile' ? (
          <Interaction onPress={() => onDelete(item.postId)}>
            <Ionicons name="md-trash-bin" size={25} />
          </Interaction>
        ) : null}
      </InteractionWrapper>
    </Card>
  );
};

export default PostCard;
