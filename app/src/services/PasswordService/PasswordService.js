import {RemotePasswordService} from './RemotePasswordService.js'
import {FileSystemPasswordService} from './FileSystemPasswordService.js'

// const passwordService = new FileSystemPasswordService("./secrets/", "./keys/private_key.pem", "./keys/public_key.pem");
// export default passwordService;
export const passwordService = new RemotePasswordService("./secrets/", "./keys/private_key.pem", "./keys/public_key.pem", "mamo", "2aa93f4723b977457");