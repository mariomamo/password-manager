export class StorageServiceImpl {

    async set(key, value) {
        return await localStorage.setItem(key, value);
    }

    async get(key) {
        return await localStorage.getItem(key);
    }

    async remove(key) {
        return await localStorage.removeItem(key);
    }

}