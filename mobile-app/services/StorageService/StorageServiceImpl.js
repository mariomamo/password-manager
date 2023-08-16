import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageServiceImpl {

    async set(key, value) {
        return await AsyncStorage.setItem(key, value);
    }

    async get(key) {
        return await AsyncStorage.getItem(key);
    }

    async remove(key) {
        return await AsyncStorage.removeItem(key);
    }

}