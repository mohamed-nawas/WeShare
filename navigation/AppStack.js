import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PostProvider} from '../navigation/PostProvider';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';

import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddPostScreen from '../screens/AddPostScreen';
import MessagesScreen from '../screens/MessagesScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createStackNavigator();
const Tab1 = createBottomTabNavigator();
const Tab = createMaterialBottomTabNavigator();

const FeedStack = ({navigation}) => (
  <PostProvider>
    <Stack.Navigator>
      <Stack.Screen
        name="Facebook"
        component={HomeScreen}
        options={{
          title: 'WeShare',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: '#fff',
            fontFamily: 'Kufam-SemiBoldItalic',
            fontSize: 20,
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#0000CD',
            shadowColor: '#000',
            elevation: 5,
          },
          headerRight: () => (
            <View style={{marginRight: 25}}>
              <TouchableOpacity onPress={() => navigation.navigate('AddPost')}>
                <Text style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>
                  Add Post
                </Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="AddPost"
        component={AddPostScreen}
        options={{
          title: 'Add a Post',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: '#fff',
            fontFamily: 'Kufam-SemiBoldItalic',
            fontSize: 20,
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#0000CD',
            shadowColor: '#000',
            elevation: 5,
          },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <View style={{marginLeft: 15}}>
              <Ionicons name="arrow-back" size={25} color="#fff" />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="HomeProfile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: '#fff',
            fontFamily: 'Kufam-SemiBoldItalic',
            fontSize: 20,
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#0000CD',
            shadowColor: '#000',
            elevation: 5,
          },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <View style={{marginLeft: 15}}>
              <Ionicons name="arrow-back" size={25} color="#fff" />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="MessageProfile"
        component={MessagesScreen}
        options={{
          headerTitle: 'Chats',
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: '#fff',
            fontFamily: 'Kufam-SemiBoldItalic',
            fontSize: 20,
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#0000CD',
            shadowColor: '#000',
            elevation: 5,
          },
        }}
      />
      <Stack.Screen
        name="ChatProfile"
        component={ChatScreen}
        options={({route}) => ({
          title: route.params.userName,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: '#fff',
            fontFamily: 'Kufam-SemiBoldItalic',
            fontSize: 20,
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#0000CD',
            shadowColor: '#000',
            elevation: 5,
          },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <View style={{marginLeft: 15}}>
              <Ionicons name="arrow-back" size={25} color="#fff" />
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  </PostProvider>
);

const MessageStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Messages"
      component={MessagesScreen}
      options={{
        title: 'Chats',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#fff',
          fontFamily: 'Kufam-SemiBoldItalic',
          fontSize: 20,
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: '#2e64e5',
          shadowColor: '#000',
          elevation: 5,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#fff" />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={({route}) => ({
        title: route.params.userName,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#fff',
          fontFamily: 'Kufam-SemiBoldItalic',
          fontSize: 20,
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: '#2e64e5',
          shadowColor: '#000',
          elevation: 5,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#fff" />
          </View>
        ),
      })}
    />
  </Stack.Navigator>
);

const ProfileStack = ({navigation}) => (
  <PostProvider>
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: '#fff',
            fontFamily: 'Kufam-SemiBoldItalic',
            fontSize: 20,
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#6a1bd1',
            shadowColor: '#000',
            elevation: 5,
          },
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerTitle: 'Edit Profile',
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: '#fff',
            fontFamily: 'Kufam-SemiBoldItalic',
            fontSize: 20,
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#6a1bd1',
            shadowColor: '#000',
            elevation: 5,
          },
          headerBackImage: () => (
            <View style={{marginLeft: 15}}>
              <Ionicons name="arrow-back" size={25} color="#fff" />
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  </PostProvider>
);

const AppStack = () => {
  const setTabBarVisibility = route => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const screenAddPost = ['AddPost'];
    const screenHomeProfile = ['HomeProfile'];
    const screenChat = ['Chat'];
    const screenChatProfile = ['ChatProfile'];
    const screenEditProfile = ['EditProfile'];
    if (screenAddPost.indexOf(routeName) > -1) return false;
    if (screenHomeProfile.indexOf(routeName) > -1) return false;
    if (screenChat.indexOf(routeName) > -1) return false;
    if (screenChatProfile.indexOf(routeName) > -1) return false;
    if (screenEditProfile.indexOf(routeName) > -1) return false;
    return true;
  };

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#2e64e5',
      }}
      activeColor="#fff"
      barStyle={{backgroundColor: '#009387'}}
      shifting={true}>
      <Tab.Screen
        name="Home"
        component={FeedStack}
        options={({route}) => ({
          tabBarLabel: 'Home',
          tabBarVisible: setTabBarVisibility(route),
          tabBarColor: '#0000CD',
          tabBarIcon: ({color}) => (
            <AntDesign name="home" color={color} size={26} />
          ),
        })}
      />
      <Tab.Screen
        name="Messages"
        component={MessageStack}
        options={({route}) => ({
          tabBarLabel: 'Chats',
          tabBarVisible: setTabBarVisibility(route),
          tabBarColor: '#2e64e5',
          tabBarIcon: ({color}) => (
            <Ionicons name="chatbox-ellipses-outline" color={color} size={26} />
          ),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={({route}) => ({
          tabBarLabel: 'Profile',
          tabBarVisible: setTabBarVisibility(route),
          tabBarColor: '#6a1bd1',
          tabBarIcon: ({color}) => (
            <AntDesign name="profile" color={color} size={26} />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

export default AppStack;
