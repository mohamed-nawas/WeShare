import React from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import styles from '../styles/Styles';
import Onboarding from 'react-native-onboarding-swiper';
import LinearGradient from 'react-native-linear-gradient';

const SkipButtonComponent = ({...props}) => (
  <TouchableOpacity {...props}>
    <LinearGradient
      style={styles.skipBtn}
      colors={['#4c669f', '#3b5998', '#192f6a']}>
      <Text style={styles.btnText}>Skip</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const DoneButtonComponent = ({...props}) => (
  <TouchableOpacity {...props}>
    <LinearGradient
      style={styles.doneBtn}
      colors={['#4c669f', '#3b5998', '#192f6a']}>
      <Text style={styles.btnText}>Done</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const NextButtonComponent = ({...props}) => (
  <TouchableOpacity {...props}>
    <LinearGradient
      style={styles.doneBtn}
      colors={['#4c669f', '#3b5998', '#192f6a']}>
      <Text style={styles.btnText}>Next</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const Dots = ({selected}) => {
  let backgroundColor;
  backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';
  return <View style={[styles.dotsView, {backgroundColor: backgroundColor}]} />;
};

const OnBoardingScreen = ({navigation}) => {
  return (
    <Onboarding
      // SkipButtonComponent={SkipButtonComponent}
      // DoneButtonComponent={DoneButtonComponent}
      // NextButtonComponent={NextButtonComponent}
      DotComponent={Dots}
      onSkip={() => navigation.replace('Login')}
      onDone={() => navigation.replace('Login')}
      pages={[
        {
          backgroundColor: '#a6e4d0',
          image: <Image source={require('../assets/onboarding-img1.png')} />,
          title: 'Connect to the world',
          subtitle: 'A new way to connect with the world',
        },
        {
          backgroundColor: '#fdeb93',
          image: <Image source={require('../assets/onboarding-img2.png')} />,
          title: 'Share your favourites',
          subtitle: 'Share your thoughts with similar kind of people',
        },
        {
          backgroundColor: '#e9bcbe',
          image: <Image source={require('../assets/onboarding-img3.png')} />,
          title: 'Become the star',
          subtitle: 'Let the spot light capture you',
        },
      ]}
    />
  );
};

export default OnBoardingScreen;
