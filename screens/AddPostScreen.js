import React from 'react';
import {Platform, Text, View, PermissionsAndroid, Alert} from 'react-native';
import {
  InputWrapper,
  InputField,
  AddImage,
  StatusWrapper,
  SubmitBtn,
  SubmitBtnText,
} from '../styles/AddPost';
import ActionButton from 'react-native-action-button';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../navigation/AuthProvider';
import {PostContext} from '../navigation/PostProvider';

const AddPostScreen = () => {
  const {user} = React.useContext(AuthContext);
  const {fetchUserPosts} = React.useContext(PostContext);

  const [image, setImage] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [transferred, setTransferred] = React.useState(0);
  const [postText, setPostText] = React.useState(null);

  const takePhotoFromCamera = () => {
    const requestCameraPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Access Required',
            message: 'App needs access to your camera ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
          ImagePicker.openCamera({
            width: 1200,
            height: 780,
            cropping: true,
          })
            .then(image => {
              console.log(image);
              const imageUri =
                Platform.OS === 'ios' ? image.sourceURL : image.path;
              setImage(imageUri);
            })
            .catch(e => console.log(e));
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };
    requestCameraPermission();
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      cropping: true,
    })
      .then(image => {
        console.log(image);
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        setImage(imageUri);
      })
      .catch(e => console.log(`choose photo error : ${e}`));
  };

  const submitPost = async () => {
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
            'You should update your profile to post',
          );
        } else {
          // if updated
          // check if there is anything in the postText or image
          if (postText !== null || image !== null) {
            const imageUrl = await uploadImage();
            console.log('Image url : ' + imageUrl);

            firestore()
              .collection('posts')
              .add({
                userId: user.uid,
                post: postText,
                postImg: imageUrl,
                postTime: firestore.Timestamp.fromDate(new Date()),
                likes: null,
                comments: null,
              })
              .then(() => {
                console.log('Post Added!');
                Alert.alert(
                  'Post published!',
                  'Your post has been published successfully!',
                );
                setImage(null);
                setPostText(null);
                fetchUserPosts(user.uid);
              })
              .catch(e => {
                console.log(`firestore error, error code : ${e}`);
              });
          } else {
            Alert.alert(
              'Post is empty',
              'You have to have something in the post',
            );
          }
        }
      })
      .catch(e => console.log(e));
  };

  const uploadImage = async () => {
    if (image === null) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // add timestamp to filename to differentiate files with same name uniquly
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);
    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);
    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );
      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });
    try {
      await task;
      const url = await storageRef.getDownloadURL();
      setUploading(false);
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <InputWrapper>
        {image !== null ? <AddImage source={{uri: image}} /> : null}
        <InputField
          placeholder="What is on your mind?"
          multiline
          numberOfLines={4}
          value={postText}
          onChangeText={content => setPostText(content)}
        />
        {uploading ? (
          <StatusWrapper>
            <Text>{transferred} % completed</Text>
          </StatusWrapper>
        ) : (
          <SubmitBtn onPress={submitPost}>
            <SubmitBtnText>Post</SubmitBtnText>
          </SubmitBtn>
        )}
      </InputWrapper>
      <ActionButton buttonColor="rgba(231,76,60,1)">
        <ActionButton.Item
          buttonColor="#9b59b6"
          title="Take a photo"
          onPress={takePhotoFromCamera}>
          <AntDesign name="camera" />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#3498db"
          title="Choose a photo"
          onPress={choosePhotoFromLibrary}>
          <AntDesign name="jpgfile1" />
        </ActionButton.Item>
      </ActionButton>
    </View>
  );
};

export default AddPostScreen;
