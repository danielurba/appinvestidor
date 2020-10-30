import AsyncStorage from '@react-native-community/async-storage';

const Parse = require('parse/react-native')

Parse.setAsyncStorage(AsyncStorage);
Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
Parse.initialize(
  'kzRYvBGL6p6Ec7QJ2S4tqvrm52Mogkffwf56Rd4t', // This is your Application ID
  'bxPUHKenz6NFCGBmHxbhtDb4Z07vPWrA1RaDt2ec' // This is your Javascript key
);

export default Parse