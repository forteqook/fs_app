export const APIKEY = `AIzaSyCLVZTRAenfkg_umXHEIlKkxYvocrP808k`;
export const SIGNUP = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${APIKEY}`;
export const SIGNIN = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${APIKEY}`
export const REFRESH = `https://securetoken.googleapis.com/v1/token?key=${APIKEY}`

import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";
import {getDatabase} from "firebase/database";
import {getAuth} from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCLVZTRAenfkg_umXHEIlKkxYvocrP808k",
  authDomain: "fsapp-c281f.firebaseapp.com",
  databaseURL: "https://fsapp-c281f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fsapp-c281f",
  storageBucket: "fsapp-c281f.appspot.com",
  messagingSenderId: "1039130363999",
  appId: "1:1039130363999:web:da181bf7d14765dca333ea"
};

const app =  initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const database = getDatabase(app);
export const auth = getAuth();

export const setTokens = async (values, callBack) => {
    const firstPair = ["@fsApp@userId", values.userId]
    const secondPair = ["@fsApp@token", values.token]
    const thirdPair = ["@fsApp@refToken", values.refToken]
    try {
      await AsyncStorage.multiSet([firstPair, secondPair, thirdPair]).then(response=>{callBack()})
    } catch(e) {
      //save error
    }
  }
  
  export const getTokens = async (callBack) => {
  
    let values
    try {
      values = await AsyncStorage.multiGet([
          '@fsApp@userId',
          '@fsApp@token',
          '@fsApp@refToken'
        ]).then(values=>{
            callBack(values)
        })
    } catch(e) {
      // read error
    }
  
    // example console.log output:
    // [ ['@MyApp_user', 'myUserValue'], ['@MyApp_key', 'myKeyValue'] ]
  }
  
  export const removeTokens = async (callBack) => {
    try {
      await AsyncStorage.multiRemove([
        '@fsApp@userId',
        '@fsApp@token',
        '@fsApp@refToken'
      ]).then(()=>{
        callBack()
      })
    } catch (e) {
 
    }
  }