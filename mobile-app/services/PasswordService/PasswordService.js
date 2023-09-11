import {RemotePasswordService} from './RemotePasswordService.js'
import {FileSystemPasswordService} from './FileSystemPasswordService.js'
import { storageService } from '../StorageService/StorageServiceConfig.js';
import { keyProviderService } from '../KeyProviderService/KeyProviderServiceConfig.js';

// export const passwordService = new FileSystemPasswordService("./secrets/", "./keys/private_key.pem", "./keys/public_key.pem");
export const passwordService = new RemotePasswordService(storageService, keyProviderService);