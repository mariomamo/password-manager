import forge from "node-forge"

export class KeyProviderService {

    constructor(privateKeyPath, publicKeyPath) {
        this.privateKeyPath = privateKeyPath;
        this.publicKeyPath = publicKeyPath;
    }

    async getPublicKey() {
        return forge.pki.publicKeyFromPem(await window.Neutralino.filesystem.readFile(this.publicKeyPath));
    }

    async getPrivateKey() {
        return forge.pki.privateKeyFromPem(await window.Neutralino.filesystem.readFile(this.privateKeyPath));
    }

}