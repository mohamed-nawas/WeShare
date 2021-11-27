import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import styles from '../styles/Styles';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import {AuthContext} from '../navigation/AuthProvider';
import ErrorText from '../components/ErrorText';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const {login, error, googleLogin, fbLogin} = React.useContext(AuthContext);
  const [errorForwarded, setErrorForwarded] = React.useState(null);

  React.useEffect(() => {
    if (error) {
      setErrorForwarded(error);
    }
  }, [error]);

  React.useEffect(() => {
    if (!email || !password) {
      setErrorForwarded('fields-empty');
    }
  }, [email, password]);

  const renderErrorText = e => {
    if (e.code === 'auth/invalid-email') {
      return <ErrorText errorText="Email invalid!" />;
    }
    if (e.code === 'auth/user-not-found') {
      return <ErrorText errorText="User not found!" />;
    }
    if (e.code === 'auth/wrong-password') {
      return <ErrorText errorText="Wrong password!" />;
    }
    if (e === 'fields-empty') {
      return <ErrorText errorText="Fields cannot be empty!" />;
    }
  };

  return (
    <ScrollView>
      <View style={styles.loginContainer}>
        <Image
          source={require('../assets/rn-social-logo1.png')}
          style={styles.loginLogo}
        />
        <Text style={styles.loginText}>Sign In</Text>
        <FormInput
          labelValue={email}
          onChangeText={email => setEmail(email)}
          placeholderText="Email"
          iconType="user"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <FormInput
          labelValue={password}
          onChangeText={pwd => setPassword(pwd)}
          placeholderText="Password"
          iconType="lock"
          secureTextEntry={true}
        />
        {errorForwarded ? renderErrorText(errorForwarded) : null}
        <FormButton
          buttonTitle="Sign In"
          onPress={() => {
            {
              email && password ? login(email, password) : {};
            }
          }}
        />
        <TouchableOpacity style={styles.loginForgetBtn}>
          <Text style={styles.loginNavBtnText}>Forgot Password?</Text>
        </TouchableOpacity>
        <SocialButton
          buttonTitle="Sign In with Facebook"
          buttonType="facebook-square"
          color="#4867aa"
          backgroundColor="#e6eaf4"
          onPress={() => fbLogin()}
        />
        <SocialButton
          buttonTitle="Sign In with Google"
          buttonType="google"
          color="#de4d41"
          backgroundColor="#f5e7ea"
          onPress={() => googleLogin()}
        />
        <TouchableOpacity
          style={styles.loginForgetBtn}
          onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.loginNavBtnText}>
            Don't have an account? Create here...
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
