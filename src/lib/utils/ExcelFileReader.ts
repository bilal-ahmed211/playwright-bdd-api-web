import xlsx from 'xlsx';
import {fakerjsMapper} from './TestDataGenerator'
const path = require('node:path');

interface TestCaseData {
    [key: string]: string;
};

export class ExcelFileReader { 
    filePath: any;
    workbook: any;
    sheetNames: any;
    data: any;
    record: any;
    constructor() { }

    // public async getExceltData(fileName: string, sheetName: string, testCaseName: string) {
    //     this.filePath = path.resolve(__dirname, '../../../src/data', fileName);
    //     this.workbook = xlsx.readFile(this.filePath);
    //     this.sheetNames = this.workbook.SheetNames;
       
    //     if (!this.sheetNames.includes(sheetName)) {
    //         throw new Error(`Sheet "${sheetName}" not found in file "${fileName}".`);
    //     }

    //     for (const key in this.sheetNames) {
    //         if (this.sheetNames[key] == sheetName) {
    //             this.data = xlsx.utils.sheet_to_json(this.workbook.Sheets[sheetName]);
    //             this.data.find((row) => row.TestCaseName == testCaseName);
    //         }
    //     }
    //     if (!this.record) {
    //         throw new Error(`Test case "${testCaseName}" not found in sheet "${sheetName}" of file "${fileName}".`);
    //     }
    //     this.record = this.data.find((row) => row.TestCaseName == testCaseName);
    //     // this.record = JSON.parse(JSON.stringify(this.record).replace(/"\s+|\s+"/g, '"'));
    //     return this.record;
    // };

    public async getExceltData(fileName: string, sheetName: string, testCaseName: string) {
        this.filePath = path.resolve(__dirname, '../../../src/data', fileName);
        this.workbook = xlsx.readFile(this.filePath);
        this.sheetNames = await this.workbook.SheetNames;

        for (const key in this.sheetNames) {
            if (this.sheetNames[key] == sheetName) {
                this.data = await xlsx.utils.sheet_to_json(this.workbook.Sheets[sheetName]);
                this.data.find((item) => item.TestCaseName == testCaseName);
            }
        }
        this.record = this.data.find((item) => item.TestCaseName == testCaseName);
        this.record = JSON.parse(JSON.stringify(this.record).replace(/"\s+|\s+"/g, '"'));
        return this.record;
    }

}

