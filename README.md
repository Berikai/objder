# Objder - Folder Structured JSON Management

Objder is a simple library that extracts an object as a folder and its properties as JSON files and can import it backwards.

It handles the properties with `$` at the beginning as a folder.

## Install

```bash 
npm i objder
```

## Usage

### Extract

```js
import { extractJSON } from 'objder'

// Create a new object.
var obj = {
    $folder: {
        data: {
            msg: "Hello! I'm here >>>> ./folder/data.json"
        }
    },
    data: {
        msg: "Hello! I'm here >>>> ./data.json"
    }
};

extractJSON(obj, './hello-world'); // Extract object to hello-world folder.
```

### Import

```js
import { importJSON } from 'objder'

var obj = importJSON({}, './hello-world'); // Import hello-world folder as object.
```

or

```js
import { importJSON } from 'objder'

var obj = {} ;

importJSON(obj, './hello-world'); // Import hello-world folder as object.
```
