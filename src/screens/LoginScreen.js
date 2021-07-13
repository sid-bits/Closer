import React, {useState, useContext} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';

export default function LoginScreen({navigation}) {
  const {login} = useContext(AuthContext);
  // Uses login from AuthContext and then after button press (Line 41),
  // firebase.auth authenticates the user
  // and as we saw in routes.js the authenticated user is taken to the HomeStack

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Closer.</Text>
      <Text style={styles.subText}>Let's get you logged in.</Text>
      <View>
        <FormInput
          modeValue="flat"
          labelName="Email"
          value={email}
          autoCapitalize="none"
          onChangeText={userEmail => setEmail(userEmail)}
        />
        <FormInput
          modeValue="flat"
          labelName="Password"
          value={password}
          secureTextEntry={true}
          onChangeText={userPassword => setPassword(userPassword)}
        />
      </View>

      <View style={styles.buttonsView}>
        <FormButton
          title="Login"
          modeValue="contained"
          labelStyle={styles.loginButtonLabel}
          onPress={() => login(email, password)}
        />
        <FormButton
          title="New user? Join here"
          modeValue="text"
          uppercase={false}
          labelStyle={styles.navButtonLabel}
          onPress={() => navigation.navigate('Signup')}
        />
      </View>
    </View>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#191720',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'sans-serif-medium',
    fontWeight: 'bold',
    fontSize: 48,
    marginBottom: 10,
    color: '#ffffff',
  },
  subText: {
    fontFamily: 'sans-serif-thin',
    fontSize: 22,
    marginBottom: 20,
    color: '#ffffff',
  },
  loginButtonLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'sans-serif-medium',
  },
  navButtonLabel: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'sans-serif-medium',
  },
  buttonsView: {
    marginTop: 30,
  },
});
