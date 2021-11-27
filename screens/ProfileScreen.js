import React from 'react';
import {AuthContext} from '../navigation/AuthProvider';
import ProfileScreenStyles from '../styles/ProfileScreenStyles';
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
} from 'react-native';
import PostCard from './PostCard';
import {Container} from '../styles/FeedStyles';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {fetchUserPosts, fetchMoreUserPosts} from '../functions/Functions';
import Spinner from 'react-native-loading-spinner-overlay';

const ProfileScreen = ({navigation, route}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [startAfter, setStartAfter] = React.useState(Object);
  const [spinner, setSpinner] = React.useState(false);
  const [posts, setPosts] = React.useState(new Array());
  const [lastPost, setLastPost] = React.useState(false);

  const {user, logout} = React.useContext(AuthContext);

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(route.params ? route.params.userId : user.uid)
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
    getUserPosts();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, loading]);

  const deletePost = postId => {
    console.log(`Post Id : ${postId}`);

    firestore()
      .collection('posts')
      .doc(postId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const {postImg} = documentSnapshot.data();
          if (postImg !== null) {
            const storageRef = storage().refFromURL(postImg);
            const imageRef = storage().ref(storageRef.fullPath);
            imageRef
              .delete()
              .then(() => {
                console.log(`${postImg} has been deleted`);
                deleteFirestoreData(postId);
              })
              .catch(() => {
                console.log('error while deleting image');
              });
          } else {
            deleteFirestoreData(postId);
          }
        }
      })
      .catch(() => {
        console.log('error retreiving post image');
      });
  };

  const deleteFirestoreData = postId => {
    firestore()
      .collection('posts')
      .doc(postId)
      .delete()
      .then(() => {
        firestore()
          .collection('likesComments')
          .doc(postId)
          .delete()
          .then(() => {
            Alert.alert(
              'Post Deleted',
              'Your post and related likesComment document has been deleted successfully',
            );
          })
          .catch((e = console.log(e)));
      })
      .catch(e => console.log('error deleting post', e));
  };

  const handleDelete = postId => {
    Alert.alert(
      'Delete post',
      'Are you sure want to delete the post',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel pressed'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => deletePost(postId),
        },
      ],
      {cancelable: false},
    );
  };

  const handleRefresh = () => {
    getUserPosts();
    setRefreshing(false);
  };

  const handleMessage = async () => {
    // check if current user profile is updated
    const usersRef = await firestore().collection('users');
    usersRef
      .doc(user.uid)
      .get()
      .then(async documentSnapshot => {
        const {fname, lname} = documentSnapshot.data();
        if (fname === '' && lname === '') {
          // if not updated

          console.log('current users profile is not updated, update now!!');
          Alert.alert(
            'Your profile is not updated !!',
            'You should update your profile to chat with anyone',
          );
        } else {
          // if updated

          const chatsRef = firestore().collection('chats');
          const chats1 = chatsRef
            .where('ownerUserId', '==', user.uid)
            .where('chatUserId', '==', route.params.userId)
            .get();
          const chats2 = chatsRef
            .where('ownerUserId', '==', route.params.userId)
            .where('chatUserId', '==', user.uid)
            .get();

          const [chats1Snapshot, chats2Snapshot] = await Promise.all([
            chats1,
            chats2,
          ]);

          const chats1List = chats1Snapshot.docs;
          const chats2List = chats2Snapshot.docs;
          const chatsList = chats1List.concat(chats2List);

          console.log(chatsList.length);

          if (chatsList.length !== 0) {
            if (chats1List.length === 1) {
              console.log(`chat is in chats1 list`);
              chats1List.find(doc => {
                const userName = userData.fname + ' ' + userData.lname;
                navigation.navigate('ChatProfile', {
                  chatId: doc.id,
                  userName: userName,
                });
              });
            }
            if (chats2List.length === 1) {
              console.log(`chat is in chats2 list`);
              chats2List.find(doc => {
                const userName = userData.fname + ' ' + userData.lname;
                navigation.navigate('ChatProfile', {
                  chatId: doc.id,
                  userName: userName,
                });
              });
            }
          } else {
            console.log(`chat not found, should be created`);

            chatsRef
              .add({
                ownerUserId: user.uid,
                chatUserId: route.params.userId,
                createdAt: new Date(Date.now()),
                isMessageExists: false,
              })
              .then(() => {
                console.log('Chat created');

                chatsRef
                  .where('ownerUserId', '==', user.uid)
                  .where('chatUserId', '==', route.params.userId)
                  .get()
                  .then(querySnapshot => {
                    querySnapshot.docs.find(doc => {
                      const chatId = doc.id;
                      const userName = userData.fname + ' ' + userData.lname;
                      navigation.navigate('ChatProfile', {
                        chatId: chatId,
                        userName: userName,
                      });
                    });
                  })
                  .catch(e => console.log(e));
              })
              .catch(e => console.log(e));
          }
        }
      })
      .catch(e => console.log(e));
  };

  const getUserPosts = async () => {
    setSpinner(true);
    const postsData = await fetchUserPosts(
      route.params ? route.params.userId : user.uid,
      4,
    );
    setPosts(postsData.posts);
    setStartAfter(postsData.lastVisible);
    setSpinner(false);
  };

  const getMoreUserPosts = async () => {
    if (!lastPost) {
      setSpinner(true);
      const postsData = await fetchMoreUserPosts(
        route.params ? route.params.userId : user.uid,
        startAfter,
        4,
      );
      setPosts([...posts, ...postsData.posts]);
      setStartAfter(postsData.lastVisible);
      postsData.posts.length == 0 ? setLastPost(true) : setLastPost(false);
      setSpinner(false);
    }
  };

  const renderFooter = () => {
    return !lastPost ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F5FCFF',
        }}>
        <Spinner
          visible={spinner}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
        />
      </View>
    ) : (
      <View
        style={{
          width: '100%',
          height: 50,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
          borderTopWidth: 1,
          borderTopColor: '#000',
        }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: 'bold',
          }}>
          No More posts to show
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
        <Image
          style={[ProfileScreenStyles.userImg, {marginLeft: '5%'}]}
          source={{
            uri: userData
              ? userData.userImg ||
                'https://www.vhv.rs/dpng/d/188-1888496_tie-user-default-suit-display-contact-business-woman.png'
              : 'https://www.vhv.rs/dpng/d/188-1888496_tie-user-default-suit-display-contact-business-woman.png',
          }}
        />
        <View style={{marginRight: '5%', width: '55%', marginLeft: '5%'}}>
          <Text style={ProfileScreenStyles.userName}>
            {userData ? userData.fname : 'Update'}{' '}
            {userData ? userData.lname : 'Details'}
          </Text>
          {/* <Text>{route.params ? route.params.userId : user.uid}</Text> */}
          <Text style={ProfileScreenStyles.aboutUser}>
            {userData ? userData.about : 'Update Details'}
          </Text>
          <View style={ProfileScreenStyles.userBtnWrapper}>
            {route.params ? (
              <>
                <TouchableOpacity
                  style={ProfileScreenStyles.userBtn}
                  onPress={handleMessage}>
                  <Text style={ProfileScreenStyles.userBtnText}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ProfileScreenStyles.userBtn}>
                  <Text style={ProfileScreenStyles.userBtnText}>Folow</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={ProfileScreenStyles.userBtn}
                  onPress={() => navigation.navigate('EditProfile')}>
                  <Text style={ProfileScreenStyles.userBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={ProfileScreenStyles.userBtn}
                  onPress={logout}>
                  <Text style={ProfileScreenStyles.userBtnText}>Logout</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>

      <View style={ProfileScreenStyles.userInfoWrapper}>
        <View style={ProfileScreenStyles.userInfoItem}>
          <Text style={ProfileScreenStyles.userInfoTitle}>
            {posts ? posts.length : '0'}
          </Text>
          <Text style={ProfileScreenStyles.userInfoSubTitle}>Posts</Text>
        </View>
        <View style={ProfileScreenStyles.userInfoItem}>
          <Text style={ProfileScreenStyles.userInfoTitle}>1.8M</Text>
          <Text style={ProfileScreenStyles.userInfoSubTitle}>Followers</Text>
        </View>
        <View style={ProfileScreenStyles.userInfoItem}>
          <Text style={ProfileScreenStyles.userInfoTitle}>367</Text>
          <Text style={ProfileScreenStyles.userInfoSubTitle}>Following</Text>
        </View>
      </View>

      <Container>
        {posts.length == 0 ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>No posts to show</Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            renderItem={({item}) => (
              <PostCard
                item={item}
                onDelete={handleDelete}
                screen={'profile'}
              />
            )}
            keyExtractor={item => item.postId}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onEndReached={getMoreUserPosts}
            onEndReachedThreshold={0.01}
            scrollEventThrottle={150}
            ListFooterComponent={renderFooter}
          />
        )}
      </Container>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default ProfileScreen;
