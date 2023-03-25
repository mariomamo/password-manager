import { passwordService } from './PasswordService';
import { UnauthorizedException } from '../../exceptions/UnauthorizedException.js';

class ImportExportFileSystemService {
    constructor(passwordService) {
        this.passwordService = passwordService;
        this.dialogFilters = {
            filters: [
                {
                    name: ".json",
                    extensions: ['json']
                }
            ],
            multiSelections: false
        }
    }

    async import() {
        try {
            const fileToImport = (await window.Neutralino.os.showOpenDialog("Select file to import", this.dialogFilters))[0]
            if (fileToImport == undefined) {
                return {status: "ABORT", message: "Dialog closed"};
            }
            const accountsList = await window.Neutralino.filesystem.readFile(fileToImport);
            return await passwordService.addAccounts(JSON.parse(accountsList));
        } catch (error) {
            console.log("Error while picking file: ", error);
            return {status: "ERROR", message: "Unknown error occurred"}
        }
    }

    async export() {
        try {
            var fileToSave = (await window.Neutralino.os.showSaveDialog("Export file", this.dialogFilters));
            if (fileToSave === "") {
                return {status: "ABORT", message: "dialog closed"};
            }
            fileToSave += ".json";
            const accounts = await passwordService.getAllAccountAndSecretsList();
            await window.Neutralino.filesystem.writeFile(fileToSave, JSON.stringify(accounts));
        } catch(error) {
            console.log(error);
            if (error instanceof UnauthorizedException) {
                return {status: "UNAUTHORIZED", message: "Unauthorized"};
            } else {
                return {status: "ERROR", message: 'There was an error while exporting files'};
            }
        }
        return {status: "SUCCESS"};
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

export const importExportFileSystemService = new ImportExportFileSystemService(passwordService);