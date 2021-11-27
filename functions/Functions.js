import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

export const getLatestMsgFromChat = async chatId => {
  const response = await firestore()
    .collection('messages')
    .where('user.chatId', '==', chatId)
    .orderBy('createdAt', 'asc')
    .get()
    .then(querySnapshot => {
      return querySnapshot;
    })
    .catch(e => console.log(e));

  return response;
};

export const getChatParticipant = async username => {
  const array = username.split(' ');
  const fname = array[0];
  const lname = array[1];
  const response = await firestore()
    .collection('users')
    .where('fname', '==', fname)
    .where('lname', '==', lname)
    .get()
    .then(querySnapshot => {
      return querySnapshot;
    })
    .catch(e => {
      console.log(`ERROR, CODE : ${e}`);
    });

  return response;
};

export const getUser = async userId => {
  const response = await firestore()
    .collection('users')
    .doc(userId)
    .get()
    .then(documentSnapshot => {
      return documentSnapshot;
    })
    .catch(e => console.log(e));

  return response;
};

export const setMsgState = async receiverId => {
  const response = await firestore()
    .collection('messages')
    .where('user.receiverId', '==', receiverId)
    .where('received', '==', false)
    .get()
    .then(querySnapshot => {
      return querySnapshot;
    })
    .catch(e => console.log(e));

  return response;
};

export const updateMsgDoc = async docId => {
  await firestore()
    .collection('messages')
    .doc(docId)
    .update({
      sent: true,
      received: true,
    })
    .then(() => {
      console.log('message updated');
    })
    .catch(e => console.log(e));
};

export const fetchPosts = async postsPerLoad => {
  const posts = new Array();
  const querySnapshot = await firestore()
    .collection('posts')
    .orderBy('postTime', 'desc')
    .limit(postsPerLoad)
    .get();
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
  querySnapshot.forEach(doc => {
    let postData = doc.data();
    postData.postId = doc.id;
    posts.push(postData);
  });
  return {posts, lastVisible};
};

export const fetchUserPosts = async (userId, postsPerLoad) => {
  const posts = new Array();
  const querySnapshot = await firestore()
    .collection('posts')
    .where('userId', '==', userId)
    .orderBy('postTime', 'desc')
    .limit(postsPerLoad)
    .get();
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
  querySnapshot.forEach(doc => {
    let postData = doc.data();
    postData.postId = doc.id;
    posts.push(postData);
  });
  return {posts, lastVisible};
};

export const fetchMorePosts = async (startAfter, postsPerLoad) => {
  const posts = new Array();
  const querySnapshot = await firestore()
    .collection('posts')
    .orderBy('postTime', 'desc')
    .startAfter(startAfter)
    .limit(postsPerLoad)
    .get();
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
  querySnapshot.forEach(doc => {
    let postData = doc.data();
    postData.postId = doc.id;
    posts.push(postData);
  });
  return {posts, lastVisible};
};

export const fetchMoreUserPosts = async (userId, startAfter, postsPerLoad) => {
  const posts = new Array();
  const querySnapshot = await firestore()
    .collection('posts')
    .where('userId', '==', userId)
    .orderBy('postTime', 'desc')
    .startAfter(startAfter)
    .limit(postsPerLoad)
    .get();
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
  querySnapshot.forEach(doc => {
    let postData = doc.data();
    postData.postId = doc.id;
    posts.push(postData);
  });
  return {posts, lastVisible};
};

export const getChatUserIsOwner = async userId => {
  const chatsIds = new Array();
  const querySnapshot = await firestore()
    .collection('chats')
    .where('ownerUserId', '==', userId)
    .where('isMessageExists', '==', true)
    .orderBy('createdAt', 'desc')
    .get();
  querySnapshot.forEach(doc => {
    const {chatUserId} = doc.data();

    const id = doc.id;
    chatsIds.push({
      id: id,
      chatId: chatUserId,
    });

    // firestore()
    //   .collection('messages')
    //   .where('user.chatId', '==', id)
    //   .get()
    //   .then(querySnapshot => {
    //     if (querySnapshot.size !== 0) {
    //       chatsIds.push({
    //         id: id,
    //         chatId: chatUserId,
    //       });
    //     }
    //   })
    //   .catch(e => console.log(e));

    // const querySnapshot1 = firestore()
    //   .collection('messages')
    //   .where('user.chatId', '==', id)
    //   .get();

    // if (querySnapshot1.size !== 0) {
    //   chatsIds.push({
    //     id: id,
    //     chatId: chatUserId,
    //   });
    // }
  });
  // console.log(`chatsIds from getChatUserIsOwner is : ${chatsIds}`);
  return {chatsIds};
};

export const getChatUserIsChat = async userId => {
  const chatsIds = new Array();
  const querySnapshot = await firestore()
    .collection('chats')
    .where('chatUserId', '==', userId)
    .where('isMessageExists', '==', true)
    .orderBy('createdAt', 'desc')
    .get();
  querySnapshot.forEach(doc => {
    const {ownerUserId} = doc.data();

    const id = doc.id;
    chatsIds.push({
      id: id,
      chatId: ownerUserId,
    });

    // firestore()
    //   .collection('messages')
    //   .where('user.chatId', '==', id)
    //   .get()
    //   .then(querySnapshot => {
    //     if (querySnapshot.size !== 0) {
    //       chatsIds.push({
    //         id: id,
    //         chatId: ownerUserId,
    //       });
    //     }
    //   })
    //   .catch(e => console.log(e));

    // const querySnapshot1 = firestore()
    //   .collection('messages')
    //   .where('user.chatId', '==', id)
    //   .get();

    // if (querySnapshot1.size !== 0) {
    //   chatsIds.push({
    //     id: id,
    //     chatId: ownerUserId,
    //   });
    // }
  });
  // console.log(`chatsIds from getChatUserIsChat is : ${chatsIds}`);
  return {chatsIds};
};

export const getChatInfo = async chatIdsArray => {
  const userData = new Array();
  const promises = chatIdsArray.map(async chatId => {
    await firestore()
      .collection('users')
      .doc(chatId)
      .get()
      .then(documentSnapshot => {
        const {fname, lname, userImg} = documentSnapshot.data();
        userData.push({
          fname,
          lname,
          userImg,
        });
      })
      .catch(e => {
        console.log(e);
        return 'ERROR';
      });
  });
  await Promise.all(promises);
  const response = await Promise.all(userData);
  return {response};
};

export const getLatestMsgInfo = async msgsIdsArray => {
  const latestMsgData = new Array();
  const promises = msgsIdsArray.map(async msgId => {
    await firestore()
      .collection('messages')
      .where('user.chatId', '==', msgId)
      .orderBy('createdAt', 'desc')
      .get()
      .then(querySnapshot => {
        const doc = querySnapshot.docs[0];
        const {text, createdAt, user} = doc.data();
        const {senderId} = user;
        const time = moment(createdAt.toDate()).fromNow();
        latestMsgData.push({
          text,
          time,
          senderId,
        });
      })
      .catch(e => {
        console.log(e);
        return 'ERROR';
      });
  });
  await Promise.all(promises);
  const response = await Promise.all(latestMsgData);
  return {response};
};

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export const getPost = async postId => {
  const postData = [];
  await firestore()
    .collection('posts')
    .doc(postId)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        const {
          userId,
          post,
          postImg,
          postTime,
          likes,
          comments,
        } = documentSnapshot.data();
        postData.push({
          postUserId: userId,
          post: post,
          postImg: postImg,
          postTime: postTime,
          likes: likes,
          comments: comments,
        });
      }
    })
    .catch(e => console.log(e));
  return {postData};
};

export const updatePost = async (postId, updateField, updateValue) => {
  if (updateField === 'likes') {
    await firestore()
      .collection('posts')
      .doc(postId)
      .update({
        likes: updateValue,
      })
      .then(() => {
        console.log('post updated');
      })
      .catch(e => console.log(e));
  }
};

export const addLikes = async (postId, userId) => {
  console.log(`postId : ${postId}`);
  console.log(`userId : ${userId}`);
  await firestore()
    .collection('likesComments')
    .doc(postId)
    .get()
    .then(documentSnapshot => {
      console.log(
        `documentSnapshot : ${JSON.stringify(
          documentSnapshot,
          getCircularReplacer(),
        )}`,
      );
      console.log(
        `documentSnapshot.data() : ${JSON.stringify(
          documentSnapshot.data(),
          getCircularReplacer(),
        )}`,
      );

      // const {likedUserIdsArray} = documentSnapshot.data();
      // console.log(
      //   `likedUserIdsArray : ${JSON.stringify(
      //     likedUserIdsArray,
      //     getCircularReplacer(),
      //   )}`,
      // );

      // likedUserIdsArray.find(likedUserId => {
      //   if (likedUserId === userId) {
      //     // delete this likedUserId from array
      //     console.log(`user have already liked the post`);
      //     // const likedUserIdIndex = likedUserIdsArray.indexOf(likedUserId);
      //     // if (likedUserIdIndex > -1) {
      //     //   likedUserIdsArray.splice(likedUserIdIndex, 1);
      //     // }
      //   } else {
      //     // add this likedUserId
      //     console.log(`user has not already liked the post`);
      //     // likedUserIdsArray.push(userId);
      //   }
      // });
    })
    .catch(e => console.log(e));
};

export const fetchComments1 = async commentsPerLoad => {
  const comments = new Array();
  const querySnapshot = await firestore()
    .collection('likesComments')
    .limit(commentsPerLoad)
    .get();
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
  querySnapshot.forEach(doc => {
    let commentData = doc.data();
    comments.push(commentData);
  });
  return {comments, lastVisible};
};

export const fetchComments = async postId => {
  const comments = new Array();
  const documentSnapshot = await firestore()
    .collection('likesComments')
    .doc(postId)
    // .limit(commentsPerLoad)
    .get();
  let lastVisible = '';
  if (documentSnapshot.exists) {
    // console.log(
    //   `documentSnapshot : ${JSON.stringify(
    //     documentSnapshot,
    //     getCircularReplacer(),
    //   )}`,
    // );
    const {commentsArray} = documentSnapshot.data();
    if (commentsArray) {
      lastVisible = commentsArray[commentsArray.length - 1];
      commentsArray.forEach(commentObj => {
        const {comment, commentUserId} = commentObj;
        let commentData = {comment: comment, commentUserId: commentUserId};
        comments.push(commentData);
      });
    } else {
      console.log(`no comments exists for this post`);
    }
  }

  return {comments, lastVisible};
};

export const fetchMoreComments = async (startAfter, commentsPerLoad) => {
  const comments = new Array();
  const querySnapshot = await firestore()
    .collection('likesComments')
    .startAfter(startAfter)
    .limit(commentsPerLoad)
    .get();
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
  querySnapshot.forEach(doc => {
    let commentData = doc.data();
    comments.push(commentData);
  });
  return {comments, lastVisible};
};
