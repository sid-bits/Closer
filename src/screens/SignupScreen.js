import React, {useState, useContext} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';

export default function SignupScreen({navigation}) {
  const {register} = useContext(AuthContext);
  // Uses register from AuthContext and then after button press (Line 45),
  // firebase.auth authenticates the user
  // and as we saw in routes.js the authenticated user is taken to the HomeStack

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Create an account.</Text>
      <View>
        <FormInput
          labelName="Email"
          value={email}
          autoCapitalize="none"
          onChangeText={userEmail => setEmail(userEmail)}
        />
        <Text style={styles.secondaryText}>Enter a valid email.</Text>
      </View>
      <View>
        <FormInput
          labelName="Password"
          value={password}
          secureTextEntry={true}
          onChangeText={userPassword => setPassword(userPassword)}
        />
        <Text style={styles.secondaryText}>
          Password should contain atleast{'\n'}6 digits.
        </Text>
      </View>
      <View style={styles.buttonsView}>
        <FormButton
          title="Signup"
          modeValue="contained"
          labelStyle={styles.signupButtonLabel}
          onPress={() => register(email, password)}
        />
      </View>
      <IconButton
        icon="keyboard-backspace"
        size={30}
        style={styles.backButton}
        color="#ffffff"
        onPress={() => navigation.goBack()}
        // onPress={() => navigation.navigate('Login')}
      />
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
    fontFamily: 'sans-serif-thin',
    fontSize: 22,
    marginBottom: 10,
    color: '#ffffff',
  },
  secondaryText: {
    fontFamily: 'sans-serif-thin',
    fontSize: 14,
    color: '#ffffff',
    marginTop: -6,
    marginBottom: 4,
  },
  signupButtonLabel: {
    fontWeight: 'bold',
    fontSize: 22,
    fontFamily: 'sans-serif-medium',
  },
  backButton: {
    marginTop: 10,
  },
  buttonsView: {
    marginTop: 30,
  },
});
