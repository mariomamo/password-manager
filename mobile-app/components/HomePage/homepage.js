import { React } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AccountsPage from '../../AccountsPage';
import SettingsPage from '../SettingsPage/settingspage';
import LoginPage from '../LoginPage/loginpage';

const Drawer = createDrawerNavigator();

export default function Home() {
  return (
    <Drawer.Navigator initialRouteName="Accounts">
        <Drawer.Screen name="Accounts" options={{ headerTitle:'Accounts' }} component={AccountsPage} />
        <Drawer.Screen name="Settings" options={{ headerTitle:'Settings' }} component={SettingsPage} />
        {/*TODO: Should be a button*/}
        <Drawer.Screen name="Logout" options={{ headerTitle:'Logout' }} component={LoginPage} initialParams={{isLogout: true}}/>
    </Drawer.Navigator>
  );
};
