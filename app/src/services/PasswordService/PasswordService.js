import {RemotePasswordService} from './RemotePasswordService.js'
import {FileSystemPasswordService} from './FileSystemPasswordService.js'
import { KeyProviderService } from './KeyProviderService.js';
import { StorageService } from '../StorageService/StorageService.js';

// export const passwordService = new FileSystemPasswordService("./secrets/", "./keys/private_key.pem", "./keys/public_key.pem");
const keyProviderService = new KeyProviderService("./keys/private_key.pem", "./keys/public_key.pem");
const storageService = new StorageService();
export const passwordService = new RemotePasswordService(storageService, keyProviderService);