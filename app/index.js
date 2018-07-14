const fs = require('fs');

const Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.argument('appname', {
            type: String,
            required: false,
            desc: 'Name of app you want to create',
            default: 'diwapodoo'
        });
    }

    createapp() {
        var dir = this.options.appname;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        } else {
            this.log('Directory already exist');
        }
    }

    prompting() {
        this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Project name:',
                default: this.options.appname,
            },
            {
                type: 'input',
                name: 'version',
                message: 'Version?',
                default: 1.0,
                store: true
            },
            {
                type: 'input',
                name: 'author',
                message: 'Author\'s Name:',
                default: 'diwap',
                store: true
            },
            {
                type: 'confirm',
                name: 'isapplication',
                message: 'Is Application?',
                default: false
            },
            {
                type: 'input',
                name: 'depends',
                message: 'Dependent module name:'
            },
            {
                type: 'input',
                name: 'summary',
                message: 'Module Summary:'
            },
        ]).then((ans) => {
            config(this.options, ans)
            createmodel(this.options, ans)
            createview(this.options, ans)
        })


    }
};

var isapp = (value) => {
    if (value == true) {
        return 'True'
    } else {
        return 'False'
    }
}

var depends = (value) => {
    var clean = value.replace(/,|"|'/g, '')
    var dp = `\['${clean.replace(/\s/g, '\', \'')}'\]`
    return dp
}

var config = (options, data) => {
    var dir = options.appname;

    var manifest = `# -*- coding: utf-8 -*-\n{
    'name': "${data.name}",
    'summary': """${data.summary}""",
    'author': '${data.author}',
    'version': '${data.version}',
    'depends': ${depends(data.depends)},
    'data': \['views/${dir}_views.xml'\],
    'application': ${isapp(data.isapplication)},\n}`

    fs.appendFileSync(`${dir}/__manifest__.py`, manifest, (err) => {
        if (err) throw err;
    })
    fs.chmodSync(`${dir}/__manifest__.py`, 0755)

    fs.appendFileSync(`${dir}/__init__.py`, 'from . import models')
    fs.chmodSync(`${dir}/__init__.py`, 0755)
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var createmodel = (options, data) => {
    app = options.appname
    fs.mkdirSync(`${app}/models`);

    var models = `# -*- coding: utf-8 -*-\n
from odoo import fields, models\n\n
class ${app.capitalize()}(models.Model):
    _name = '${app}.${app}'
    _rec_name = 'name'\n
    name = fields.Char("Name")\n`

    fs.appendFileSync(`${app}/models/__init__.py`, `from . import ${app}`)
    fs.chmodSync(`${app}/models/__init__.py`, 0755)

    fs.appendFileSync(`${app}/models/${app}.py`, models)
    fs.chmodSync(`${app}/models/${app}.py`, 0755)

}

var createview = (options, data) => {
    app = options.appname
    fs.mkdirSync(`${app}/views`);

    var views = `<?xml version="1.0" encoding="utf-8"?>
    <odoo>\n
        <record id="view_form_${app}" model="ir.ui.view">
            <field name="name">${app.capitalize()}</field>
                <field name="model">${app}.${app}</field>
                <field name="type">form</field>
                <field name="arch" type="xml">
                <form>
                    <sheet>
                        <group>
                            <group>
                                <field name="name"/>
                            </group>    
                            <group>
                            </group>    
                        </group>
                    </sheet>
                </form>
            </field>
        </record>\n
        <record id="tree_view_${app}" model="ir.ui.view">
            <field name="name">${app.capitalize()}</field>
            <field name="model">${app}.${app}</field>
            <field name="arch" type="xml">
                <tree>
                    <field name="name"/>
                </tree>
            </field>
        </record>\n
        <record id="${app}_action" model="ir.actions.act_window">
            <field name="name">${app.capitalize()}</field>
            <field name="res_model">${app}.${app}</field>
            <field name="view_mode">tree,form</field>
            <field name="search_view_id" ref="view_form_${app}"/>
        </record>\n
        <menuitem name="${app.capitalize()}"
            id="${app}_menu_root"/>\n
        <menuitem name="${app.capitalize()}"
            id="${app}_menu_action"
            action="${app}_action"
            parent="${app}_menu_root"/>
    </odoo>`

    fs.appendFileSync(`${app}/views/${app}_views.xml`, views)
    fs.chmodSync(`${app}/views/${app}_views.xml`, 0755)
}