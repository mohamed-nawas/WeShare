import React from 'react';
import {TextInput, View} from 'react-native';
import styles from '../styles/Styles';
import AntDesign from 'react-native-vector-icons/AntDesign';

const FormInput = ({
  labelValue,
  placeholderText,
  iconType,
  ...restOfformInputProperty
}) => {
  return (
    <View style={styles.formInputContainer}>
      <View style={styles.formInputIconStyle}>
        <AntDesign name={iconType} size={25} color="#666" />
      </View>
      <TextInput
        style={styles.formInput}
        numberOfLines={1}
        placeholderTextColor="#666"
        placeholder={placeholderText}
        value={labelValue}
        {...restOfformInputProperty}
      />
    </View>
  );
};

export default FormInput;
