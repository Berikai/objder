import * as fs from 'fs';
import * as path from 'path';

/** 
 * Handles name conversions and component type determinations.
 */ 
const nameManager = ({
    isPropFolder: (name: string) => name.substring(0, 1) == '$',
    Folder_propToPath: (name: string) => name.substring(1, name.length),
    Folder_pathToProp: (name: string) => `$${name}`,
    isPathJSON: (name: string) => name.substring(name.length - 5, name.length) == '.json',
    JSON_propToPath: (name: string) => `${name}.json`,
    JSON_pathToProp: (name: string) => name.substring(0, name.length - 5),
})

/** 
 * Converts directory to object structure. 
 * It also handles doing the specified tasks like creating the properties itself.
 * This function basically the core of importing directory structure.
 */ 
export const dirToObject = (obj: object, targetDir: string) => {
    // withFileType mode is needed to get a Dirent object.
    // Do for each file in the directory.
    fs.readdirSync(targetDir, { withFileTypes: true }).forEach(dirent => {
        const key = dirent.name; // Get the file/folder name

        if (dirent.isFile() && nameManager.isPathJSON(key)) {
            const fileName = nameManager.JSON_pathToProp(key);
            obj[fileName] = JSON.parse(fs.readFileSync(path.join(targetDir, key)).toString());
            return;
        }

        if(dirent.isDirectory()) {
            obj[nameManager.Folder_pathToProp(key)] = {};
            dirToObject(obj[nameManager.Folder_pathToProp(key)], path.join(targetDir, key));
            return;
        }

        console.warn('Unexpected file detected in the directory: ', path.join(targetDir, key))
    });
}

/** 
 * Converts object to directory structure. 
 * It also handles doing the specified tasks like creating the folders itself.
 * This function basically the core of exporting object structure.
 */ 
export const objectToDir = (obj: object, targetDir: string) => {
    // Create the target directory first to avoid some problems.
    // Recursive mode is important to tolerate path/file creation retries.
    fs.mkdirSync(path.join(targetDir), { recursive: true });

    // Do for each object property:
    Object.keys(obj).forEach(key => {
        if (nameManager.isPropFolder(key)) {
            const folderName = nameManager.Folder_propToPath(key);
            fs.mkdirSync(path.join(targetDir, folderName), { recursive: true });
            objectToDir(obj[key], path.join(targetDir, folderName));
            return;
        }

        fs.writeFileSync(path.join(targetDir, nameManager.JSON_propToPath(key)), JSON.stringify(obj[key], null, 1));
    });
}