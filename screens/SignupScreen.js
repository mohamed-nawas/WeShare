import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import styles from '../styles/Styles';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import {AuthContext} from '../navigation/AuthProvider';
import ErrorText from '../components/ErrorText';

const SignupScreen = ({navigation}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPwd, setConfirmPwd] = React.useState('');

  const {register, error, googleRegister, fbRegister} =
    React.useContext(AuthContext);
  const [errorForwarded, setErrorForwarded] = React.useState(null);

  React.useEffect(() => {
    if (error) {
      setErrorForwarded(error);
    }
  }, [error]);

  React.useEffect(() => {
    if (password !== confirmPwd) {
      setErrorForwarded('password-not-match');
    }
  }, [error]);

  React.useEffect(() => {
    if (!email || !password || !confirmPwd) {
      setErrorForwarded('fields-empty');
    }
  }, [email, password, confirmPwd]);

  const renderErrorText = e => {
    if (e.code === 'auth/invalid-email') {
      return <ErrorText errorText="Email invalid!" />;
    }
    if (e.code === 'auth/weak-password') {
      return (
        <ErrorText errorText="Password should be at least 6 characters!" />
      );
    }
    if (e.code === 'auth/email-already-in-use') {
      return <ErrorText errorText="Email already in use!" />;
    }
    if (e === 'password-not-match') {
      return <ErrorText errorText="Passwords does not match!" />;
    }
    if (e === 'fields-empty') {
      return <ErrorText errorText="Fields cannot be empty!" />;
    }
  };

  return (
    <ScrollView>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Create an account</Text>
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
        <FormInput
          labelValue={confirmPwd}
          onChangeText={pwd => setConfirmPwd(pwd)}
          placeholderText="Confirm Password"
          iconType="lock"
          secureTextEntry={true}
        />
        {errorForwarded ? renderErrorText(errorForwarded) : null}
        <FormButton
          buttonTitle="Sign Up"
          onPress={() => {
            {
              email && password && confirmPwd ? register(email, password) : {};
            }
          }}
        />
        <View style={styles.signupTextPrivate}>
          <Text style={styles.signupColor_TextPrivate}>
            By registering, you confirm that you accept our{' '}
          </Text>
          <TouchableOpacity>
            <Text style={[styles.signupColor_TextPrivate, {color: '#e88832'}]}>
              Terms of service
            </Text>
          </TouchableOpacity>
          <Text style={styles.signupColor_TextPrivate}> and </Text>
          <TouchableOpacity>
            <Text style={[styles.signupColor_TextPrivate, {color: '#e88832'}]}>
              Privacy policy
            </Text>
          </TouchableOpacity>
        </View>
        <SocialButton
          buttonTitle="Sign Up with Facebook"
          buttonType="facebook-square"
          color="#4867aa"
          backgroundColor="#e6eaf4"
          onPress={() => fbRegister()}
        />
        <SocialButton
          buttonTitle="Sign Up with Google"
          buttonType="google"
          color="#de4d41"
          backgroundColor="#f5e7ea"
          onPress={() => googleRegister()}
        />
        <TouchableOpacity
          style={styles.loginForgetBtn}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginNavBtnText}>
            Have an account? Sign In here
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;
