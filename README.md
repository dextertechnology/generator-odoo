# Odoo Generator

## Requirement Installation

First thing is to install yo using npm
```sh
npm install -g yo
```

Then install the needed generator(s). Generators are npm packages named generator-XYZ.

```sh
npm install -g generator-odoo
```

## Basic Scaffolding
We’ll use generator-odoo to scaffold odoo module.

To scaffold a new project, run:

```sh
yo odoo
```
OR
```sh
yo odoo my-app
```
It takes appname as argument

## Things to remember

- Provide atleast one depends
- Multiple module name can be provided using either comma or space

_Don't forget to contribute with issues and update. Happy coding!_