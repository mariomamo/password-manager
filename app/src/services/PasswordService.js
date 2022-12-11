import forge from "node-forge"

class PasswordService {

    constructor(encriptedKeyPath, privateKeyPath, publicKeyPath) {
        this.secretsPath = encriptedKeyPath;
        this.privateKeyPath = privateKeyPath;
        this.publicKeyPath = publicKeyPath;
        this.padding = "RSAES-OAEP";
    }

    async add(accountName, plainText) {
        const files = (await window.Neutralino.filesystem.readDirectory(this.secretsPath)).map(element => element.entry);
        if (files.includes(accountName)) {
            return {success: false, message: "This account already exist"};
        }
        // File does not exsist, I can write it
        const publicKey = forge.pki.publicKeyFromPem(await window.Neutralino.filesystem.readFile(this.publicKeyPath));

        const encryptedPassword = forge.util.encode64(
            publicKey.encrypt(forge.util.encodeUtf8(plainText), this.padding, {
            md: forge.md.sha256.create(),
        }))
        try {
            window.Neutralino.filesystem.writeFile(this.secretsPath + "/" + accountName, encryptedPassword)
            return {success: true};
        } catch (error) {
            return {success: false, message: 'There was an error while creating ' + accountName + ' account'};
        }
    }
    
    delete(accountName) {
        return window.Neutralino.filesystem.removeFile(this.secretsPath + "/" + accountName);
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

    async getPassword(accountName) {
        const privateKey = forge.pki.privateKeyFromPem(await window.Neutralino.filesystem.readFile(this.privateKeyPath));
        const encryptedPassword = await window.Neutralino.filesystem.readFile(this.secretsPath + '/' + accountName);
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
}

// TODO: Read from file
export const passwordService = new PasswordService("./secrets/", "./keys/private_key.pem", "./keys/public_key.pem");