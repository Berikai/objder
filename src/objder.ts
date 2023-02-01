import { dirToObject, objectToDir } from './lib/converter';

/**
 * Objder is a simple json file organizer that splits json data into folders.
 */
module.exports = class Objder {

    /** 
     * Create a new Objder object. 
     * Optionally, you can pass an object to the constructor.
     */
    constructor(obj?: object) {
        obj ? Object.assign(this, obj) : Object.assign(this, {});
    }

    /** 
     * Clear the object. 
     * Be careful, changes the object value entirely!
     */
    clear() {
        Object.keys(this).forEach(key => delete this[key]); // Source: https://stackoverflow.com/questions/19316857/removing-all-properties-from-a-object
    }

    /** 
     * Set object value. 
     * Be careful, changes the object value entirely!
     */
    set(obj: object) {
        this.clear();
        Object.assign(this, obj);
    }

    /** 
     * Imports folder structure from target object.
     */ 
    async import(targetDir: string) {
        return new Promise<Objder>((resolve, reject) => {
            try {
                dirToObject(this, targetDir);
                resolve(this);
            } catch (err) {
                reject(err);
            }
        });
    }

    /** 
     * Exports object structure to target directory.
     */ 
    async export(targetDir: string) {
        return new Promise<Objder>((resolve, reject) => {
            try {
                objectToDir(this, targetDir);
                resolve(this);
            } catch (err) {
                reject(err);
            }
        });
    }
}