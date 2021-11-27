import React from 'react';
import {Text, View} from 'react-native';

const ErrorText = ({errorText}) => {
  return (
    <View>
      <Text
        style={{
          color: 'red',
          fontSize: 16,
          fontWeight: 'bold',
        }}>
        {errorText}
      </Text>
    </View>
  );
};

export default ErrorText;
