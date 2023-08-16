import { React } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import useSettingsPageHook from './settingspagehook';
import style from './settingspage-css';

export default function SettingsPage() {

  const {server, PublicKey, PrivateKey, setServer, setPublicKey, setPrivateKey, saveSettings} = useSettingsPageHook();

  return (
    <View>
      <Text style={style.text}>Server</Text>
      <TextInput style={style.text_input} placeholder="Server" value={server} onChangeText={text => setServer(text)}/>
      <Text style={style.text}>Public key</Text>
      <TextInput style={{...style.text_input, ...style.rsa_key}} placeholder="Public Key" value={PublicKey} multiline={true} onChangeText={text => setPublicKey(text)}/>
      <Text style={style.text}>Private key</Text>
      <TextInput style={{...style.text_input, ...style.rsa_key}} placeholder="Private Key" value={PrivateKey} multiline={true} onChangeText={text => setPrivateKey(text)}/>
      <View style={style.button_wrapper}>
        <Button style={style.save_button} onPress={saveSettings} title="Save" />
      </View>
    </View>
  );
};
