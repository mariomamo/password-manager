import { storageService } from "../StorageService/StorageServiceConfig";
import { KeyProviderService } from "./KeyProviderService";

export const keyProviderService = new KeyProviderService(storageService);