import { ICustomWorld } from '../../lib/interface/cucumber';
import { Kafka } from '../../lib/utils/Kafka';
import { Given, When } from '@cucumber/cucumber';
import {generateDynamicFakerjsDataForTestCase} from '../../lib/utils//TestDataGenerator';
import {
    setStaticTestCaseDataFromExcel,
} from '../../lib/utils/GetTestCaseData';

Given('Read Static Test Data from Excel sheet', async function (this: ICustomWorld, dataTable) {
    const rawTable = dataTable.rawTable;
    const data = {};
    rawTable.forEach((element) => {
        data[element[0]] = element[1];
    });
    const fileName = rawTable[0][0];
    const sheetName = rawTable[0][1];
    const testcaseName = rawTable[0][2];
    console.log(`File Name: ${fileName}, Sheet Name: ${sheetName}, Test Case: ${testcaseName}`);
    await setStaticTestCaseDataFromExcel(fileName + '.xlsx', sheetName, testcaseName);
});

Given('Generate Dynamic fakerjs test data for testcase', async function (this: ICustomWorld, dataTable) {
    const rawTable = dataTable.rawTable;
    const data = {};
    rawTable.forEach((element) => {
        data[element[0]] = element[1];
    });
    const fileName = rawTable[0][0];
    const sheetName = rawTable[0][1];
    const testcaseName = rawTable[0][2];
    console.log(`File Name: ${fileName}, Sheet Name: ${sheetName}, Test Case: ${testcaseName}`);
    await generateDynamicFakerjsDataForTestCase(fileName + '.xlsx', sheetName, testcaseName, 'src/data/FakerjsTestData.xlsx');
});

//To be fixed - as above step has generated file but no fakersjs data is generated
Given('Read Fakerjs Dynamic Test Data from Excel sheet', async function (this: ICustomWorld, dataTable) {
    const rawTable = dataTable.rawTable;
    const data = {};
    rawTable.forEach((element) => {
        data[element[0]] = element[1];
    });
    const fileName = rawTable[0][0];
    const sheetName = rawTable[0][1];
    const testcaseName = rawTable[0][2];
    console.log(`File Name: ${fileName}, Sheet Name: ${sheetName}, Test Case: ${testcaseName}`);
    // await generateDynamicDataForTestCase('src/data/ExcelTestData.xlsx', 'src/data/DynamicFakerjsData.xlsx');
    // await setDynamicTestCaseDataFromUpdatedSheet(fileName + '.xlsx', sheetName, testcaseName);
});

When('I trigger the Kafka even with {string} data',
    async function (this: ICustomWorld, payload: string): Promise<void> {
        const kafka = new Kafka(this);
        await kafka.triggerkafkaEvent(payload);
    }
);
