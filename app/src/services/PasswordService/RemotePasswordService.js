import forge from "node-forge"
import {Buffer} from "buffer";
import {UnauthorizedException} from '../../exceptions/UnauthorizedException.js';

const baseUrl = "http://localhost:41062/www";
const putCredentialUrl = baseUrl + "/passwordmanager/put.php";
const getCredentialUrl = baseUrl + "/passwordmanager/get.php";
const getCredentialsList = baseUrl + "/passwordmanager/getCredentialsList.php";
const deleteCredentialUrl = baseUrl + "/passwordmanager/delete.php";
const getAllCredentialsUrl = baseUrl + "/passwordmanager/getAllCredentials.php";
const logOutUrl = baseUrl + "/passwordmanager/logout.php";
const geTokenUrl = baseUrl + "/getJWT.php";

export class RemotePasswordService {

    constructor(storageService, keyProviderService) {
        this.storageService = storageService;
        this.keyProviderService = keyProviderService;
        this.padding = "RSAES-OAEP";
    }

    _setJwtToken = async (jwt_token) => {
        this.token = jwt_token;
        if (jwt_token) await this.storageService.set("jwt_token", jwt_token);
        else await this.storageService.remove("jwt_token");
    }

    _setRefreshToken = async (refresh_token) => {
        this.refresh_token = refresh_token;
        if (refresh_token) await this.storageService.set("refresh_token", refresh_token);
        else await this.storageService.remove("refresh_token");
    }

    async refreshTokens() {
        const requestOptions = {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"refresh_token": this.refresh_token})
        };
        var data = await fetch(geTokenUrl, requestOptions);
        if (data.status !== 401 && data.status !== 403) {
            await data.json().then(json => {
                this._setJwtToken(json.token);
                this._setRefreshToken(json.refresh_token);
            });
        } else {
            await this._setJwtToken(null);
            await this._setRefreshToken(null);
            throw new UnauthorizedException("Unauthorized");
        }
    }

    async generateToken(username, password) {
        const requestOptions = {
            method: 'GET',
            headers: {'Authorization': "Basic " + Buffer.from(username + ":" + password).toString('base64')},
        };
        var data = await fetch(geTokenUrl, requestOptions);
        if (data.status !== 401 && data.status !== 403) {
            await data.json().then(json => {
                this._setJwtToken(json.token);
                this._setRefreshToken(json.refresh_token);
            });
        } else {
            return {status: "UNAUTHORIZED", message: "Unauthorized"};
        }
        return {status: "SUCCESS", data: {"token": this.token, "refresh_token": this.refresh_token}};
    }

    async functionWithRefreshToken(callback) {
        return callback().catch(async ex => {
            if (ex instanceof UnauthorizedException) {
                console.log("First unauth");
                await this.refreshTokens();
                return callback().catch(ex => {
                    if (ex instanceof UnauthorizedException) {
                        console.log("Second unauth");
                        this._setJwtToken(null);
                        this._setRefreshToken(null);
                    }
                    throw ex;
                });
            }
        });
    }

    async addAccount(accountName, plainText) {
        const publicKey = await this.keyProviderService.getPublicKey();

        const encryptedPassword = forge.util.encode64(
            publicKey.encrypt(forge.util.encodeUtf8(plainText), this.padding, {
                md: forge.md.sha256.create(),
            }));
        return this.functionWithRefreshToken(() => this.addAccountInternal(accountName, encryptedPassword));
    }

    async addAccountInternal(accountName, encryptedPassword) {
        const requestOptions = {
            method: 'POST',
            headers: {"Authorization": "Bearer " + this.token, "Content-Type": "application/json"},
            body: JSON.stringify({"name": accountName, "secret": encryptedPassword})
        };
        var data = await fetch(putCredentialUrl, requestOptions);
        if (data.status === 200) {
            return {status: "SUCCESS"};
        } else if (data.status === 500) {
            return {status: "ERROR", message: "This account already exist"};
        } else if (data.status === 401 || data.status === 403) {
            throw new UnauthorizedException("Unauthorized");
        } else {
            return {status: "ERROR", message: "There was an error while creating " + accountName + " account"};
        }
    }

    async addAccounts(accountList) {
        return this.functionWithRefreshToken(() => this.addAccountsInternal(accountList));
    }

    async addAccountsInternal(accountList) {
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
                } else if (data.status === 401 || data.status === 403) {
                    throw new UnauthorizedException("Unauthorized");
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
        return this.functionWithRefreshToken(() => this.deleteInternal(accountName));
    }

    async deleteInternal(accountName) {
        const requestOptions = {
            method: 'DELETE',
            headers: {"Authorization": "Bearer " + this.token},
            body: JSON.stringify({"name": accountName})
        };
        var data = await fetch(deleteCredentialUrl, requestOptions);
        if (data.status === 200) {
            return {status: "SUCCESS"};
        } else if (data.status === 401 || data.status === 403) {
            throw new UnauthorizedException("Unauthorized");
        } else {
            return {status: "ERROR", message: "There was an error while deleting account " + accountName};
        }
    }

    edit(oldName, newName) {
        // TODO
    }

    async getAccountList() {
        return this.functionWithRefreshToken(() => this.getAccountListInternal());
    }

    async getAccountListInternal() {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {"Authorization": "Bearer " + this.token}
            };
            var data = await fetch(getCredentialsList, requestOptions);
            return await data.json();
        } catch (error) {
            console.log("Error: " + error);
            if (data.status === 401 || data.status === 403) {
                throw new UnauthorizedException("Unauthorized");
            }
        }
    }

    async getAllAccountAndSecretsList() {
        return this.functionWithRefreshToken(() => this.getAllAccountAndSecretsListInternal());
    }

    async getAllAccountAndSecretsListInternal() {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {"Authorization": "Bearer " + await this.token}
            };
            var data = await fetch(getAllCredentialsUrl, requestOptions);
            return await data.json();
        } catch (error) {
            console.log("Error: " + error);
            if (data.status === 401 || data.status === 403) {
                throw new UnauthorizedException("Unauthorized");
            }
        }
    }

    async getEncryptedPassword(accountName) {
        return this.functionWithRefreshToken(() => this.getEncryptedPasswordInternal(accountName));
    }

    async getEncryptedPasswordInternal(accountName) {
        try {
            const requestOptions = {
                method: 'POST',
                headers: {"Authorization": "Bearer " + this.token, "Content-Type": "application/json"},
                body: JSON.stringify({"name": accountName})
            };
            var data = await fetch(getCredentialUrl, requestOptions);
            if (data.status === 401) {
                throw new UnauthorizedException("Unauthorized");
            }
            return data.text();
        } catch (error) {
            console.log("Error: " + error);
            if (data.status === 401 || data.status === 403) {
                throw new UnauthorizedException("Unauthorized");
            }
        }
    }

    async isLogged() {
        const jwt_token = await this.storageService.get("jwt_token");
        const refresh_token = await this.storageService.get("refresh_token");
        if (jwt_token && refresh_token) {
            await this._setJwtToken(jwt_token);
            await this._setRefreshToken(refresh_token);
            return true;
        }
        return false;
    }

    async logOut() {
        const requestOptions = {
            method: 'POST',
            headers: {"Authorization": "Bearer " + this.token, "Content-Type": "application/json"},
        };
        await fetch(logOutUrl, requestOptions).then(() => {
            this._setJwtToken(null);
            this._setRefreshToken(null);
        }).catch(error => console.log(error));
    }

    async getDecryptedPassword(accountName) {
        const privateKey = await this.keyProviderService.getPrivateKey();
        const encryptedPassword = await this.getEncryptedPassword(accountName);
        return forge.util.decodeUtf8(
            privateKey.decrypt(forge.util.decode64(encryptedPassword), this.padding, {
                md: forge.md.sha256.create(),
            })
        );
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