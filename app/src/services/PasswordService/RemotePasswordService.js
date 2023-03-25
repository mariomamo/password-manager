import forge from "node-forge"
import { Buffer } from "buffer";
import { UnauthorizedException } from '../../exceptions/UnauthorizedException.js';

const baseUrl = "https://mariooffertucci.altervista.org";
const putCredentialUrl = baseUrl + "/passwordmanager/put.php";
const getCredentialUrl = baseUrl + "/passwordmanager/get.php";
const getCredentialsList = baseUrl + "/passwordmanager/getCredentialsList.php";
const deleteCredentialUrl = baseUrl + "/passwordmanager/delete.php";
const getAllCredentialsUrl = baseUrl + "/passwordmanager/getAllCredentials.php";
const geTokenUrl = baseUrl + "/getJWT.php";

export class RemotePasswordService {

    constructor(encriptedKeyPath, privateKeyPath, publicKeyPath) {
        this.secretsPath = encriptedKeyPath;
        this.privateKeyPath = privateKeyPath;
        this.publicKeyPath = publicKeyPath;
        this.padding = "RSAES-OAEP";
    }

    async generateToken(username, password) {
        const requestOptions = {
            method: 'GET',
            headers: {'Authorization': "Basic " + Buffer.from(username + ":" + password).toString('base64')},
        };
        var data = await fetch(geTokenUrl, requestOptions);
        this.token = await data.text();
        return data.status;
    }

    async addAccount(accountName, plainText) {
        const publicKey = forge.pki.publicKeyFromPem(await window.Neutralino.filesystem.readFile(this.publicKeyPath));

        const encryptedPassword = forge.util.encode64(
            publicKey.encrypt(forge.util.encodeUtf8(plainText), this.padding, {
            md: forge.md.sha256.create(),
        }));

        const requestOptions = {
            method: 'POST',
            headers: {"Authorization": "Bearer " + await this.token},
            body: JSON.stringify({"name": accountName, "secret": encryptedPassword})
        };
        var data = await fetch(putCredentialUrl, requestOptions);
        if (data.status === 200) {
            return {status: "SUCCESS"};
        } else if (data.status === 500) {
            return {status: "ERROR", message: "This account already exist"};
        } else if (data.status === 401) {
            return {status: "UNAUTHORIZED", message: "Unauthorized"};
        } else {
            return {status: "ERROR", message: "There was an error while creating " + accountName + " account"};
        }
    }

    async addAccounts(accountList) {
        var result = {status: "SUCCESS"};
        for (const account of accountList) {
            try {
                const requestOptions = {
                    method: 'POST',
                    headers: {"Authorization": "Bearer " + await this.token},
                    body: JSON.stringify({"name": account.account, "secret": account.secret})
                };
                var data = await fetch(putCredentialUrl, requestOptions);
                if (data.status === 500) {
                    result = {status: "WARNING", message: "Some accounts already exists and will be ignored"};
                } else if (data.status === 401) {
                    result = {status: "UNAUTHORIZED", message: "Unauthorized"};
                    break;
                } else {
                    result = {status: "ERROR", message: "There was an error while creating some accounts"};
                }
            } catch (error) {
                result = {status: "ERROR", message: "There was an error while creating some accounts"};
            }
        }
        return result;
    }
    
    async delete(accountName) {
        const requestOptions = {
            method: 'DELETE',
            headers: {"Authorization": "Bearer " + await this.token},
            body: JSON.stringify({"name": accountName})
        };

        var data = await fetch(deleteCredentialUrl, requestOptions);
        if (data.status === 200) {
            return {status: "SUCCESS"};
        } else if (data.status === 401) {
            return {status: "UNAUTHORIZED", message: "Unauthorized"};
        } else {
            return {status: "ERROR", message: "There was an error while deleting account " + accountName};
        }
    }
    
    edit(oldName, newName) {
        // TODO
    }

    checkUnauthorizedException(data) {
        if (data.status === 401) {
            this.token = null;
            throw new UnauthorizedException("Unauthorized");
        }
    }
    
    async getAccountList() {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {"Authorization": "Bearer " + await this.token}
            };
            var data = await fetch(getCredentialsList, requestOptions);
            data = await data.json();
            return data;
        } catch (error) {
            console.log(error);
            this.checkUnauthorizedException(data);
        }
    }

    async getAllAccountAndSecretsList() {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {"Authorization": "Bearer " + await this.token}
            };
            var data = await fetch(getAllCredentialsUrl, requestOptions);
            return await data.json();
        } catch (error) {
            console.log(error);
            this.checkUnauthorizedException(data);
        }        
    }

    async getEncryptedPassword(accountName) {
        try {
            const requestOptions = {
                method: 'POST',
                headers: {"Authorization": "Bearer " + await this.token},
                body: JSON.stringify({"name": accountName})
            };
    
            var data = await fetch(getCredentialUrl, requestOptions);
            if (data.status === 401) {
                throw new UnauthorizedException();
            }
            return data.text();
        } catch (error) {
            console.log(error);
            this.checkUnauthorizedException(data);
        }  
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
}