/**
 * Objder
 * Yet Another JSON Management
 * 
 * MIT License
 * Copyright (c) 2023 Berikai (https://berikai.dev)
 */

import fs from 'fs';
import path from 'path';

/** 
 * Handles name conversions and component type determinations.
 */ 
const nameManager = {
    folderPrefix: '$', 

    isPropFolder: name => name.substring(0, nameManager.folderPrefix.length) == nameManager.folderPrefix,
    isPathJSON: name => name.substring(name.length - 5, name.length) == '.json',

    Folder_propToPath: name => name.substring(nameManager.folderPrefix.length, name.length),
    Folder_pathToProp: name => nameManager.folderPrefix + name,

    JSON_propToPath: name => name + '.json',
    JSON_pathToProp: name => name.substring(0, name.length - 5),
};

/** 
 * Imports the json files in the specified path as javascript object.
 * 
 * @param {object} object
 * @param {string} directory
 * @returns {object} object
 */ 
export const importJSON = (object, directory) => {
    // withFileType mode is needed to get a Dirent object.
    // Do for each file in the directory.
    fs.readdirSync(directory, { withFileTypes: true }).forEach(dirent => {
        const key = dirent.name; // Get the file/folder name

        if (dirent.isFile() && nameManager.isPathJSON(key)) {
            const fileName = nameManager.JSON_pathToProp(key);
            object[fileName] = JSON.parse(fs.readFileSync(path.join(directory, key)).toString());
            return;
        }

        if(dirent.isDirectory()) {
            object[nameManager.Folder_pathToProp(key)] = {};
            importJSON(object[nameManager.Folder_pathToProp(key)], path.join(directory, key));
            return;
        }

        console.warn('WARN: Unexpected file detected in specified directory: ', path.join(directory, key));
    });

    return object;
}

/** 
 * Extracts the given javascript object to specified path as json files.
 * 
 * @param {object} object
 * @param {string} directory
 */ 
export const extractJSON = (object, directory) => {
    // Check object type
    if (typeof object != 'object') {
        console.warn(`WARN: Couldn't extract a property because parent component is a folder.\nProperty value: ${object}`);
        fs.appendFileSync(path.join(directory, `warn${new Date().getTime()}.log`), `WARN: Couldn't extract a property because parent component is a folder.\nProperty value: ${object}\n`);
        return;
    }
    // Create the target directory first to avoid some problems.
    // Recursive mode is important to tolerate path/file creation retries.
    fs.mkdirSync(path.join(directory), { recursive: true });

    // Do for each object property:
    Object.keys(object).forEach(key => {
        if (nameManager.isPropFolder(key)) {
            const folderName = nameManager.Folder_propToPath(key);
            fs.mkdirSync(path.join(directory, folderName), { recursive: true });
            extractJSON(object[key], path.join(directory, folderName));
            return;
        }
        
        fs.writeFileSync(path.join(directory, nameManager.JSON_propToPath(key)), JSON.stringify(object[key], null, 1));
    });
}