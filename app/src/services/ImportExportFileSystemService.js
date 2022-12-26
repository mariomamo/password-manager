import { passwordService } from './PasswordService';

class ImportExportFileSystemService {
    constructor(passwordService) {
        this.passwordService = passwordService;
    }

    async import() {
        const filters = {
            filters: [
                {
                    name: ".json",
                    extensions: ['json']
                }
            ],
            multiSelections: false
        }
        try {
            const fileToImport = (await window.Neutralino.os.showOpenDialog("Select file to import", filters))[0]
            const accountsList = await window.Neutralino.filesystem.readFile(fileToImport);
            return await passwordService.addAccounts(JSON.parse(accountsList));
        } catch (error) {
            console.log("Error while picking file: ", error);
            if (error.code == "NE_RT_NATRTER") {
                return {success: false, status: "ABORT", message: "Unknown error occurred"}
            }
            return {success: false, message: "Unknown error occurred"}
        }
    }

    async export() {
        try {
            const accounts = await passwordService.getAllAccountAndSecretsList();
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

export const importExportFileSystemService = new ImportExportFileSystemService(passwordService);