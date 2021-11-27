import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ScrollView,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Styles from '../styles/EditProfileScreenStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import {AuthContext} from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {StatusWrapper} from '../styles/AddPost';

const EditProfileScreen = () => {
  const bs = React.createRef();
  const fall = new Animated.Value(1);

  const {user, logout} = React.useContext(AuthContext);
  const [image, setImage] = React.useState(null);
  const [userData, setUserData] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [transferred, setTransferred] = React.useState(0);

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

      // create a profile updated profile picture post
      await firestore()
        .collection('posts')
        .add({
          comments: null,
          likes: null,
          post: '',
          postImg: url,
          postTime: new Date(Date.now()),
          userId: user.uid,
          isProfilePicture: true,
        })
        .then(() => {
          console.log(`profile picture post created`);
        })
        .catch(e => console.log(e));
      // ------------------------------------------------

      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const handleUpdate = async () => {
    let imgUrl = await uploadImage();

    if (imgUrl === null && userData.userImg) {
      imgUrl = userData.userImg;
    }

    firestore()
      .collection('users')
      .doc(user.uid)
      .update({
        fname: userData.fname,
        lname: userData.lname,
        about: userData.about,
        phone: userData.phone,
        country: userData.country,
        city: userData.city,
        userImg: imgUrl,
      })
      .then(() => {
        console.log('user updated');
        Alert.alert(
          'User Updated',
          'User details have been succesfully updated',
        );
      })
      .catch(e => {
        console.log(
          'there is an error occurred while updating user details',
          e,
        );
      });
  };

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
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
  }, []);

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
            width: 780,
            height: 780,
            cropping: true,
            // cropperCircleOverlay: true,
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
      width: 780,
      height: 780,
      cropping: true,
      cropperCircleOverlay: true,
    })
      .then(image => {
        console.log(image);
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        setImage(imageUri);
      })
      .catch(e => console.log(`choose photo error : ${e}`));
    bs.current.snapTo(0);
  };

  const renderInner = () => (
    <View style={Styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={Styles.panelTitle}>Upload Photo</Text>
        <Text style={Styles.panelSubTitle}>Choose Profile Picture</Text>
      </View>
      <TouchableOpacity
        style={Styles.panelButton}
        onPress={takePhotoFromCamera}>
        <Text style={Styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={Styles.panelButton}
        onPress={choosePhotoFromLibrary}>
        <Text style={Styles.panelButtonTitle}>Choose Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={Styles.panelButton}
        onPress={() => bs.current.snapTo(1)}>
        <Text style={Styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
  const renderHeader = () => (
    <View style={Styles.header}>
      <View style={Styles.panelHeader}>
        <View style={Styles.panelHandle} />
      </View>
    </View>
  );

  return (
    <ScrollView>
      <View style={Styles.container}>
        <BottomSheet
          ref={bs}
          snapPoints={[330, 0]}
          renderContent={renderInner}
          renderHeader={renderHeader}
          initialSnap={1}
          callbackNode={fall}
          enabledGestureInteraction={true}
        />
        <Animated.View
          style={{
            margin: 20,
            opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
          }}>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
              <View
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ImageBackground
                  source={{
                    uri: image
                      ? image
                      : userData
                      ? userData.userImg ||
                        'https://www.vhv.rs/dpng/d/188-1888496_tie-user-default-suit-display-contact-business-woman.png'
                      : 'https://www.vhv.rs/dpng/d/188-1888496_tie-user-default-suit-display-contact-business-woman.png',
                  }}
                  style={{
                    height: 100,
                    width: 100,
                    borderWidth: 1,
                    borderColor: '#000',
                  }}
                  imageStyle={{borderRadius: 15}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <MaterialCommunityIcons
                      name="camera"
                      size={50}
                      color="#f2f2f2"
                      style={{
                        opacity: 0.7,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: '#fff',
                        borderRadius: 10,
                      }}
                    />
                  </View>
                </ImageBackground>
              </View>
            </TouchableOpacity>
            <Text style={{marginTop: 10, fontWeight: 'bold', fontSize: 18}}>
              {userData ? userData.fname : ''} {userData ? userData.lname : ''}
            </Text>
            {/* <Text>{user.uid}</Text> */}
          </View>

          <View style={Styles.action}>
            <FontAwesome name="user-o" size={20} />
            <TextInput
              style={Styles.textInput}
              placeholder="First Name"
              placeholderTextColor="#666666"
              autoCorrect={false}
              value={userData ? userData.fname : ''}
              onChangeText={val => setUserData({...userData, fname: val})}
            />
          </View>
          <View style={Styles.action}>
            <FontAwesome name="user-o" size={20} />
            <TextInput
              style={Styles.textInput}
              placeholder="Last Name"
              placeholderTextColor="#666666"
              autoCorrect={false}
              value={userData ? userData.lname : ''}
              onChangeText={val => setUserData({...userData, lname: val})}
            />
          </View>
          <View style={Styles.action}>
            <AntDesign name="info" size={20} />
            <TextInput
              style={Styles.textInput}
              placeholder="About"
              placeholderTextColor="#666666"
              autoCorrect={false}
              value={userData ? userData.about : ''}
              onChangeText={val => setUserData({...userData, about: val})}
            />
          </View>
          <View style={Styles.action}>
            <FontAwesome name="phone" size={20} />
            <TextInput
              style={Styles.textInput}
              placeholder="phone"
              keyboardType="number-pad"
              placeholderTextColor="#666666"
              autoCorrect={false}
              value={userData ? userData.phone : ''}
              onChangeText={val => setUserData({...userData, phone: val})}
            />
          </View>
          <View style={Styles.action}>
            <FontAwesome name="globe" size={20} />
            <TextInput
              style={Styles.textInput}
              placeholder="Country"
              placeholderTextColor="#666666"
              autoCorrect={false}
              value={userData ? userData.country : ''}
              onChangeText={val => setUserData({...userData, country: val})}
            />
          </View>
          <View style={Styles.action}>
            <MaterialCommunityIcons name="map-marker-outline" size={20} />
            <TextInput
              style={Styles.textInput}
              placeholder="City"
              placeholderTextColor="#666666"
              autoCorrect={false}
              value={userData ? userData.city : ''}
              onChangeText={val => setUserData({...userData, city: val})}
            />
          </View>

          {uploading ? (
            <StatusWrapper>
              <Text>{transferred} % completed</Text>
            </StatusWrapper>
          ) : (
            <TouchableOpacity
              style={Styles.commandButton}
              onPress={handleUpdate}>
              <Text style={Styles.panelButtonTitle}>Update</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;
