import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import { auth } from "../FirebaseApp";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { useFocusEffect } from '@react-navigation/native';
import { onAuthStateChanged } from "firebase/auth";

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shouldShowError, setShouldShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); 

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = onAuthStateChanged(auth, (userFromFirebaseAuth) => {
        if (userFromFirebaseAuth) {
            navigation.goBack();
        }
      })
      return () => { unsubscribe(); };
    }, [])
  );

  const onLoginPressed = async () => {
    if (email === '' || password === '') {
        setShouldShowError(true);
        setErrorMsg('Error: All fields must be filled in.');
        return;
    }

    try {     
        await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
        setErrorMsg(err.message);
        setShouldShowError(true);
    }
  };

  const onCreateAccPressed = async () => {
    if (email === '' || password === '') {
      setShouldShowError(true);
      setErrorMsg('Error: All fields must be filled in.');
      return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert("Account Created");
    } catch (err) {
        setErrorMsg(err.message);
        setShouldShowError(true);
    }      
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Your Account</Text>

      <Text style={styles.text}>Email:</Text>
      <TextInput 
        style={styles.textInput}
        placeholder="Enter your email"
        autoCapitalize='none'
        onChangeText={setEmail}
        value={email}
      />

      <Text style={styles.text}>Password:</Text>
      <TextInput 
        style={styles.textInput}
        placeholder="Enter your password"
        autoCapitalize='none'
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
      />

      <View>
        {(shouldShowError)? (<Text style={styles.errorText}>{errorMsg}</Text>):(null)}
      </View>

      <Pressable style={styles.loginBtn} onPress={onLoginPressed}>
          <Text style={{fontSize: 20, color: "white"}}>Login</Text>
      </Pressable>

      <Pressable style={styles.createAccBtn} onPress={onCreateAccPressed}>
          <Text style={{fontSize: 20, color: "#EE4466"}}>Create New Account</Text>
      </Pressable>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    marginTop: 25
  },
  text: {
    fontSize: 20,
    width: 355,
    paddingBottom: 2,
    marginTop: 20
  },
  textInput: {
    fontSize: 20,
    height: 40,
    width: 355,
    borderWidth: 1,
    paddingLeft: 10,
  },
  errorText: {
    backgroundColor: '#FFEBEE',
    color: '#FF0000',
    fontSize: 20,
    width: 355,
    padding: 5,
    marginTop: 5,
    marginBottom: 5
  },
  loginBtn: {
    padding: 12,
    alignItems: 'center',
    width: 355,
    color: 'white',
    backgroundColor: "#EE4466",
    marginTop: 20,
  },
  createAccBtn: {
    padding: 12,
    alignItems: 'center',
    width: 355,
    color: 'white',
    backgroundColor: "white",
    marginTop: 20,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#EE4466"
  }
});

export default LoginScreen;
