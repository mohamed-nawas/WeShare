import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styles from '../styles/Styles';

const FormButton = ({buttonTitle, ...restOfButtonProperty}) => {
  return (
    <TouchableOpacity style={styles.formBtnContainer} {...restOfButtonProperty}>
      <Text style={styles.formBtnTitleText}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
};

export default FormButton;
