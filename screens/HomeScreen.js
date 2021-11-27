import React from 'react';
import {Container} from '../styles/FeedStyles';
import PostCard from './PostCard';
import {FlatList, Text, View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {fetchPosts, fetchMorePosts} from '../functions/Functions';

const HomeScreen = ({navigation}) => {
  const [posts, setPosts] = React.useState(new Array());
  const [postsPerLoad] = React.useState(4);
  const [startAfter, setStartAfter] = React.useState(Object);
  const [spinner, setSpinner] = React.useState(false);
  const [lastPost, setLastPost] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    setLastPost(false);
    getPosts();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, loading]);

  const getPosts = async () => {
    setSpinner(true);
    const postsData = await fetchPosts(postsPerLoad);
    setPosts(postsData.posts);
    setStartAfter(postsData.lastVisible);
    setSpinner(false);
  };

  const getMorePosts = async () => {
    if (!lastPost) {
      setSpinner(true);
      const postsData = await fetchMorePosts(startAfter, postsPerLoad);
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

  const handleRefresh = () => {
    setLastPost(false);
    getPosts();
    setRefreshing(false);
  };
  // --------------------------------------------------------

  return (
    <Container>
      <FlatList
        data={posts}
        renderItem={({item}) => (
          <PostCard
            item={item}
            onPress={() =>
              navigation.navigate('HomeProfile', {userId: item.userId})
            }
          />
        )}
        keyExtractor={item => item.postId}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={getMorePosts}
        onEndReachedThreshold={0.01}
        scrollEventThrottle={150}
        ListFooterComponent={renderFooter}
      />
    </Container>
  );
};

export default HomeScreen;
