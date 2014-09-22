'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var fs = require('fs');
var cgUtils = require('../utils.js');
var _ = require('underscore');
var chalk = require('chalk');
var fs = require('fs');

var mysql = require('mysql');

var mysql_conn = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  database: 'dgs-server_development'
});


_.str = require('underscore.string');
_.mixin(_.str.exports());

var PartialGenerator = module.exports = function PartialGenerator(args, options, config) {

    yeoman.generators.NamedBase.apply(this, arguments);

};

util.inherits(PartialGenerator, yeoman.generators.NamedBase);

PartialGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    var prompts = [
        {
            name: 'route',
            message: 'Enter your route url (i.e. /mypartial/:id).  If you don\'t want a route added for you, leave this empty.'
        }
    ];

    this.prompt(prompts, function (props) {
        this.route = props.route;
        cgUtils.askForModuleAndDir('partial',this,true,cb);
    }.bind(this));
};


PartialGenerator.prototype.files = function files() {

    this.ctrlname = _.camelize(_.classify(this.name)) + 'Ctrl';
    this.resource = this.name; // user
    this.resource_cap = this.name.charAt(0).toUpperCase() + this.name.slice(1); // User
    this.resource_pluralize = this.name+'s'; // users
    this.text_fields = [];
    this.select_fields = [];
    var that = this;
    mysql_conn.query('describe users;', function (err, results, fields) { 
        var result;          
        for(result in results)
        {
            if(results[result].Type === 'varchar(255)')
            {
                that.text_fields.push(results[result].Field);  
            }
            else if(results[result].Type === 'int(11)')
            {
                var field = results[result].Field.slice(-3);
                if(field === '_id')
                {
                    that.select_fields.push(results[result].Field);     
                }
                else
                {
                    that.text_fields.push(results[result].Field);
                }
            }
            else
            {
                // do nothing
            }
        }
        that.text_fields = that.text_fields;
        that.select_fields = that.select_fields;
    });

    cgUtils.processTemplates(this.name,this.dir,'partial',this,null,null,that.module);

    if (this.route && this.route.length > 0){
        var partialUrl = this.dir + this.name + '.html';
        cgUtils.injectRoute(this.module.file,this.config.get('uirouter'),this.name,this.route,partialUrl,this);
    }
    mysql_conn.end();
};