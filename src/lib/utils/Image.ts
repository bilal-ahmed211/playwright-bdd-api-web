// import { ICustomWorld } from "../interface/cucumber";
// import { ensureFile, pathExists } from 'fs-extra';
// import pixelmatch from 'pixelmatch';
// import { PNG } from 'pngjs';
// import * as fs from 'fs';
// import { writeFileSync } from "fs";
// import { join } from "path";
// import { env } from "../../../env";

// /**
//  * Compares a screenshot to a base image,
//  * if the image doesn't exist it fails the test but creates a new base image based on
//  * the screenshot passed so it can be used on the next run
//  * @param screenshot a playwright screenshot
//  * @param customWorld needed to create the base image path
//  * @param threshold Difference Threshold
//  */

// interface ImagePathOptions {
//     skipOs: boolean;
// }

// export function getImagePath(
//     customWorld: ICustomWorld,
//     name: string,
//     options?: ImagePathOptions
// ): string {
//     return join(
//         'screenshots',
//         customWorld.link?.name || '',
//         options?.skipOs ? '' : process.platform,
//         env.playwright.browser,
//         `${name}.png`
//     );
// }

// export async function compareToBaseImage(
//     customWorld: ICustomWorld,
//     name: string,
//     screenshot: Buffer,
//     threshold?: { threshold: number }
// ): Promise<any> {
//     let baseImage;
//     const baseImagePath = getImagePath(customWorld, name);
//     const baseImageExist = await pathExists(baseImagePath);
//     if (baseImageExist) {
//         baseImage = PNG.sync.read(fs.readFileSync(baseImagePath));
//     } else {
//         await ensureFile(baseImagePath);
//         writeFileSync(baseImagePath, screenshot);
//         customWorld.log(
//             `The base image doesn't exist, a screenshot was taken to ${baseImagePath} so it can be used for next run`
//         );
//         return;
//     }
//     const img1 = PNG.sync.read(screenshot);
//     const difference = getDifference(img1, baseImage, threshold);
//     if (difference) {
//         customWorld.attach(difference, 'image/png;base64')
//         throw new Error(`Screenshot does not match : ${baseImagePath}`)
//     }
// }

// /**
//  * @param img1
//  * @param img2
//  * @param threshold
//  */

// export function getDifference(
//     img1: PNG,
//     img2: PNG,
//     threshold: any = env.imgThreshold
// ): Buffer | undefined {
//     const { width, height } = img2;
//     const diff = new PNG(width, height);
//     const difference = pixelmatch(img1.data, img2.data, diff.data, width, height, threshold);
//     if (difference > 0) {
//         return PNG.sync.write(diff);
//     }
//     return undefined;
// }


