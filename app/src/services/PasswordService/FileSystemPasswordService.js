import forge from "node-forge"

export class FileSystemPasswordService {

    constructor(encriptedKeyPath, privateKeyPath, publicKeyPath) {
        this.secretsPath = encriptedKeyPath;
        this.privateKeyPath = privateKeyPath;
        this.publicKeyPath = publicKeyPath;
        this.padding = "RSAES-OAEP";
    }

    async addAccount(accountName, plainText) {
        if (await this.checkIfAccountExists(accountName)) {
            return {status: "ERROR", message: "This account already exist"};
        }

        // File does not exsist, I can write it
        const publicKey = forge.pki.publicKeyFromPem(await window.Neutralino.filesystem.readFile(this.publicKeyPath));

        const encryptedPassword = forge.util.encode64(
            publicKey.encrypt(forge.util.encodeUtf8(plainText), this.padding, {
            md: forge.md.sha256.create(),
        }));
        try {
            window.Neutralino.filesystem.writeFile(this.secretsPath + "/" + accountName, encryptedPassword);
            return {status: "SUCCESS"};
        } catch (error) {
            return {status: "ERROR", message: "There was an error while creating " + accountName + " account"};
        }
    }

    async addAccounts(accountList) {
        var result = {status: "SUCCESS"};
        for (const account of accountList) {
            try {
                if (await this.checkIfAccountExists(account.account)) {
                    result = {status: "WARNING", message: "Some accounts already exists and will be ignored"};
                } else {
                    await window.Neutralino.filesystem.writeFile(this.secretsPath + "/" + account.account, account.secret);
                }
            } catch (error) {
                result = {status: "ERROR", message: "There was an error while creating some accounts"};
            }
        }
        return result;
    }
    
    async delete(accountName) {
        try {
            window.Neutralino.filesystem.removeFile(this.secretsPath + "/" + accountName);
            return {status: "SUCCESS"};
        } catch (error) {
            console.log(error);
            return {status: "ERROR", message: "There was an error while deleting account " + accountName};
        }
    }
    
    edit(oldName, newName) {
        return window.Neutralino.filesystem.moveFile(this.secretsPath + "/" + oldName, this.secretsPath + newName);
    }
    
    async getAccountList() {
        const accountNames = [];
        const files = await window.Neutralino.filesystem.readDirectory(this.secretsPath);
        files.forEach(file => {
            if (file.entry !== '.' && file.entry !== '..') {
                accountNames.push(file.entry);
            }
        });
        return accountNames;
    }

    async getAllAccountAndSecretsList() {
        const accounts = [];
        const files = await window.Neutralino.filesystem.readDirectory(this.secretsPath);
        await Promise.all(files.map(async file => {
            if (file.entry !== '.' && file.entry !== '..') {
                const account = {
                    account: file.entry,
                    secret: await this.getEncryptedPassword(file.entry)
                }
                accounts.push(account);
            }
        }));
        return accounts;
    }

    async getEncryptedPassword(accountName) {
        const encryptedPassword = await window.Neutralino.filesystem.readFile(this.secretsPath + '/' + accountName);
        return encryptedPassword;
    }

    async getDecryptedPassword(accountName) {
        const privateKey = forge.pki.privateKeyFromPem(await window.Neutralino.filesystem.readFile(this.privateKeyPath));
        const encryptedPassword = await this.getEncryptedPassword(accountName);
        const decryptedPassword = forge.util.decodeUtf8(
            privateKey.decrypt(forge.util.decode64(encryptedPassword), this.padding, {
              md: forge.md.sha256.create(),
            })
        );
        return decryptedPassword;
    }

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    async checkIfAccountExists(accountName) {
        const files = (await window.Neutralino.filesystem.readDirectory(this.secretsPath)).map(element => element.entry);
        if (files.includes(accountName)) {
            return true;
        }
    }
}