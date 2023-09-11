import forge from "node-forge"

export class KeyProviderService {

    constructor(storageService) {
        this.storageService = storageService;
    }

    async getPublicKey() {
        return forge.pki.publicKeyFromPem(await this.storageService.get("PublicKey"));
    }

    async getPrivateKey() {
        return forge.pki.privateKeyFromPem(await this.storageService.get("PrivateKey"));
    }

}