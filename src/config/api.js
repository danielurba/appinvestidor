import AsyncStorage from '@react-native-community/async-storage';

const Parse = require('parse/react-native')

Parse.setAsyncStorage(AsyncStorage);
Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
Parse.initialize(
  '4wnNLOuVc2xLqO8aqc3MuIxvdt9D1gOUnDziaprL', // This is your Application ID
  '5Z1BufFDgzowxmbwE6HfvmguHeycWYZswnIE5IcA' // This is your Javascript key
);

export default Parse