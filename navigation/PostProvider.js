import React from 'react';
import firestore from '@react-native-firebase/firestore';

export const PostContext = React.createContext();

export const PostProvider = ({children, route}) => {
  const [posts, setPosts] = React.useState(null);
  const [userPosts, setUserPosts] = React.useState(null);

  const fetchPosts = async () => {
    const list = [];
    const postsCollection = firestore().collection('posts');
    try {
      await postsCollection
        .orderBy('postTime', 'desc')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const {
              comments,
              likes,
              post,
              postImg,
              postTime,
              userId,
            } = doc.data();
            list.push({
              id: doc.id,
              userId,
              userName: 'Amelia Jackson',
              userImg: require('../assets/users/user-3.jpg'),
              postTime: postTime,
              postImg,
              post,
              liked: false,
              likes,
              comments,
            });
          });
        });
      console.log('posts: ', list);
      setPosts(list);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchUserPosts = async userId => {
    const list = [];
    const postsCollection = firestore().collection('posts');
    try {
      await postsCollection
        .where('userId', '==', userId)
        .orderBy('postTime', 'desc')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const {
              comments,
              likes,
              post,
              postImg,
              postTime,
              userId,
            } = doc.data();
            list.push({
              id: doc.id,
              userId,
              userName: 'Amelia Jackson',
              userImg: require('../assets/users/user-3.jpg'),
              postTime: postTime,
              postImg,
              post,
              liked: false,
              likes,
              comments,
            });
          });
        });
      console.log('posts: ', list);
      setUserPosts(list);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PostContext.Provider
      value={{
        fetchPosts,
        fetchUserPosts,
        posts,
        userPosts,
      }}>
      {children}
    </PostContext.Provider>
  );
};
