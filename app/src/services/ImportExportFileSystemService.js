import { passwordService } from './PasswordService';

class ImportExportFileSystemService {
    constructor(passwordService) {
        this.passwordService = passwordService;
    }

    import() {

    }

    async export() {
        try {
            const accounts = await passwordService.getAccountAndSecretsList();
            await this.createExportDirectory();
            await window.Neutralino.filesystem.writeFile("./exports/output.json", JSON.stringify(accounts));
        } catch(error) {
            console.log(error);
            return {success: false, message: 'There was an error while exporting files'};
        }
        return {success: true};
    }

    async createExportDirectory() {
        // Create directory only if does not exist
        try {
            await window.Neutralino.filesystem.readDirectory("./exports");
        } catch (error) {
            await window.Neutralino.filesystem.createDirectory("./exports")
        }
    }
}

export const importExportService = new ImportExportFileSystemService(passwordService);