import forge from "node-forge"

class PasswordService {

    constructor(encriptedKeyPath, privateKeyPath, publicKeyPath) {
        this.encriptedKeyPath = encriptedKeyPath;
        this.privateKeyPath = privateKeyPath;
        this.publicKeyPath = publicKeyPath;
        this.padding = "RSAES-OAEP";
    }

    async add(accountName, plainText) {
        const publicKey = forge.pki.publicKeyFromPem(await window.Neutralino.filesystem.readFile(this.publicKeyPath));

        const encryptedPassword = forge.util.encode64(
            publicKey.encrypt(forge.util.encodeUtf8(plainText), this.padding, {
            md: forge.md.sha256.create(),
            })
        )
        return window.Neutralino.filesystem.writeFile(this.encriptedKeyPath + "/" + accountName, encryptedPassword);
    }
    
    delete(accountName) {
        return window.Neutralino.filesystem.removeFile(this.encriptedKeyPath + "/" + accountName);
    }
    
    edit(oldName, newName) {
        return window.Neutralino.filesystem.moveFile(this.encriptedKeyPath + "/" + oldName, this.encriptedKeyPath + newName);
    }
    
    async getAccountList() {
        const accountNames = [];
        const files = await window.Neutralino.filesystem.readDirectory(this.encriptedKeyPath);
        files.forEach(file => {
            if (file.entry !== '.' && file.entry !== '..') {
                accountNames.push(file.entry);
            }
        });
        return accountNames;
    }

    async getPassword(accountName) {
        const privateKey = forge.pki.privateKeyFromPem(await window.Neutralino.filesystem.readFile(this.privateKeyPath));
        const encryptedPassword = await window.Neutralino.filesystem.readFile(this.encriptedKeyPath + '/' + accountName);
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