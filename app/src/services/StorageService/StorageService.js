export class StorageService {

    async set(key, value) {
        return await window.Neutralino.storage.setData(key, value);
    }

    async get(key) {
        return await window.Neutralino.storage.getData(key).catch(() => null);
    }

    async remove(key) {
        return await window.Neutralino.storage.setData(key, null);
    }

}