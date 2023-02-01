# Objder

Yet another JSON management, written in Typescript.

Objder is intended to be used as regular objects with some superset functions on top of it to make data storage easy in **a directory based structure**, rather than singleton `.json` files.

It handles the properties with `$` at the beginning as folder and the standart ones as `.json` files.

## Install

```bash 
npm i objder
```

## Usage

```ts
// Import Objder module.
import * as Objder from 'objder'

// Create a new Objder object.
const objder = new Objder({$red:{green:{blue:"Hello World!"}}})

// You can export the directory structure.
objder.export('./hello-world')
```

Above code creates `red` folder and creates `green.json` file in it with ``{ blue: "Hello World!" }`` as its content in the end. (`./hello-world/red/green.json`)

```ts 
// You can edit properties like as always!
objder.$red.green.blue = "Hello Objder!"
```

Objder is just a simple javascript object at its core with just a simple superset syntax. `$` represents folders as mentioned earlier.

## Examples

### Create a new Objder object

```ts
const objder = new Objder({$red:{green:{blue:"Hello World!"}}})
```

or

```ts
const objder = new Objder()

objder.set({$red:{green:{blue:"Hello World!"}}})
```

You can also create the objder object first and set the value later as seen above.

### Set & Clear

```ts
// You can set or clear value of objder. Use these functions carefully!
objder.set({cupcake:{sugar:10,egg:100}}) // calls clear() on initialization.

objder.clear()
```

Objder gives you  the ability to set value of an objder object and the ability to remove objder object value.


### Import & Export Data

```ts
// You can import directory structure from path.
objder.import('./hello-world')
```

Load, rescue or import data in a globally appreciated way: JSON.

```ts
// You can export the directory structure.
objder.export('./hello-world')
```

Save, backup or export data in a globally appreciated way: JSON.