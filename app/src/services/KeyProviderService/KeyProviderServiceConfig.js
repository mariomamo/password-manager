import { KeyProviderService } from "./KeyProviderService";

export const keyProviderService = new KeyProviderService("./keys/private_key.pem", "./keys/public_key.pem");