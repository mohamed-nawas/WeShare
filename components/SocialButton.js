import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../styles/Styles';
import SocialIcon from 'react-native-vector-icons/AntDesign';

const SocialButton = ({
  buttonTitle,
  buttonType,
  color,
  backgroundColor,
  ...restOfButtonProperty
}) => {
  return (
    <TouchableOpacity
      style={[styles.socialBtnContainer, {backgroundColor: backgroundColor}]}
      {...restOfButtonProperty}>
      <View style={styles.socialBtnIconWrapper}>
        <SocialIcon
          style={styles.socialBtnIcon}
          name={buttonType}
          size={22}
          color={color}
        />
      </View>
      <View style={styles.socialBtnTitleTextWrapper}>
        <Text style={[styles.socialBtnTitleText, {color: color}]}>
          {buttonTitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default SocialButton;
