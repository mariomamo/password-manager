import { React } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginPage from './components/LoginPage/loginpage';
import AccountsPage from './AccountsPage';
import Toast from 'react-native-toast-message';
import HomePage from './components/HomePage/homepage';
import AddPasswordPage from './components/AddPasswordPage/addpasswordpage';
import 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginPage} />
        <Stack.Screen name="Home" options={{ headerShown: false }} component={HomePage} />
        <Stack.Screen name="AddPasswordPage" options={{ headerTitle: "Add new account" }} component={AddPasswordPage} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};
