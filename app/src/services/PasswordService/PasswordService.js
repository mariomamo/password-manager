import {RemotePasswordService} from './RemotePasswordService.js'
import {FileSystemPasswordService} from './FileSystemPasswordService.js'

// export const passwordService = new FileSystemPasswordService("./secrets/", "./keys/private_key.pem", "./keys/public_key.pem");
export const passwordService = new RemotePasswordService("./secrets/", "./keys/private_key.pem", "./keys/public_key.pem");