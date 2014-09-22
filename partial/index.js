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

// var PartialGenerator = yeoman.generators.NamedBase.extend({
  // askFor: function() {
  //   var cb = this.async();

  //   var prompts = [
  //       {
  //           name: 'route',
  //           message: 'Enter your route url (i.e. /mypartial/:id).  If you don\'t want a route added for you, leave this empty.'
  //       }
  //   ];

  //   this.prompt(prompts, function (props) {
  //       this.route = props.route;
  //       cgUtils.askForModuleAndDir('partial',this,true,cb);
  //   }.bind(this));
  // },

  // files: function() {
  //   this.ctrlname = _.camelize(_.classify(this.name)) + 'Ctrl';
  //   this.resource = this.name; // user
  //   this.resource_cap = this.name.charAt(0).toUpperCase() + this.name.slice(1); // User
  //   this.resource_pluralize = this.name+'s'; // users
  //   this.text_fields = [];
  //   this.select_fields = [];
  //   var that = this;
  //   mysql_conn.query('describe users;', function (err, results, fields) { 
  //       var result;          
  //       for(result in results)
  //       {
  //           if(results[result].Type === 'varchar(255)')
  //           {
  //               that.text_fields.push(results[result].Field);  
  //           }
  //           else if(results[result].Type === 'int(11)')
  //           {
  //               var field = results[result].Field.slice(-3);
  //               if(field === '_id')
  //               {
  //                   that.select_fields.push(results[result].Field);     
  //               }
  //               else
  //               {
  //                   that.text_fields.push(results[result].Field);
  //               }
  //           }
  //           else
  //           {
  //               // do nothing
  //           }
  //       }
  //       that.text_fields = that.text_fields;
  //       that.select_fields = that.select_fields;
  //   });

  //   cgUtils.processTemplates(this.name,this.dir,'partial',this,null,null,that.module);

  //   if (this.route && this.route.length > 0){
  //       var partialUrl = this.dir + this.name + '.html';
  //       cgUtils.injectRoute(this.module.file,this.config.get('uirouter'),this.name,this.route,partialUrl,this);
  //   }
  //   mysql_conn.end();
  // }

  // files: function() {
  //   this.ctrlname = _.camelize(_.classify(this.name)) + 'Ctrl';
  //   this.resource = this.name; // user
  //   this.resource_cap = this.name.charAt(0).toUpperCase() + this.name.slice(1); // User
  //   this.resource_pluralize = this.name+'s'; // users

  //   // this.copy("partial.html", "app/controllers/"+this.name+"/"+this.name+".html");
  //   // this.copy("partial.js", "app/controllers/"+this.name+"/"+this.name+".js");
  //   // this.copy("partial-spec.js", "app/controllers/"+this.name+"/"+this.name+"-spec.js");
  //   // this.copy("partial.less", "app/controllers/"+this.name+"/"+this.name+".less");
    
  //   this.text_fields = [];
  //   this.select_fields = [];
  //   var that = this;
  //   mysql_conn.query('describe users;', function (err, results, fields) { 
  //       var result;          
  //       for(result in results)
  //       {
  //           if(results[result].Type === 'varchar(255)')
  //           {
  //               that.text_fields.push(results[result].Field);  
  //           }
  //           else if(results[result].Type === 'int(11)')
  //           {
  //               var field = results[result].Field.slice(-3);
  //               if(field === '_id')
  //               {
  //                   that.select_fields.push(results[result].Field);     
  //               }
  //               else
  //               {
  //                   that.text_fields.push(results[result].Field);
  //               }
  //           }
  //           else
  //           {
  //               // do nothing
  //           }
  //       }
  //       that.text_fields = that.text_fields;
  //       that.select_fields = that.select_fields;
  //   });
  //   mysql_conn.end();
  //   var context = { 
  //       appname: this.appname,
  //       ctrlname: _.camelize(_.classify(this.name)) + 'Ctrl',
  //       resource: this.name, // user
  //       resource_cap: this.name.charAt(0).toUpperCase() + this.name.slice(1), // User
  //       resource_pluralize: this.name+'s', // users
  //   };
 
  //   this.template("partial.html", "app/controllers/"+this.name+"/"+this.name+".html", context);
  //   this.template("partial.js", "app/controllers/"+this.name+"/"+this.name+".js", context);
  //   this.template("partial-spec.js", "app/controllers/"+this.name+"/"+this.name+"-spec.js", context);
  //   this.template("partial.less", "app/controllers/"+this.name+"/"+this.name+".less", context);
  // }
// });

var PartialGenerator = module.exports = function PartialGenerator(args, options, config) {

    yeoman.generators.NamedBase.apply(this, arguments);
};

util.inherits(PartialGenerator, yeoman.generators.NamedBase);

PartialGenerator.prototype.askFor = function askFor() {
  this.ctrlname = _.camelize(_.classify(this.name)) + 'Ctrl';
  this.resource = this.name; // user
  this.resource_cap = this.name.charAt(0).toUpperCase() + this.name.slice(1); // User
  this.resource_pluralize = this.name+'s'; // users
  var args = this.args;
  var name = []
  var input = []
  var th = []
  var td = []
  var fields = []
  for(var i=1; i<args.length; i++)
  { 
    var string = args[i].split(":");
    if(string[0].slice(-3) === '_id' && string[1] === 'integer')
    {
      var name = (string[0]);
      input.push('<div class="form-group" ng-class="{\'has-error\' : '+this.resource+'.'+name+'.$invalid && !'+this.resource+'Form.'+name+'.$pristine}">\
        <label>'+name+'</label>\
        <select name="'+name+'" ng-model="current'+this.resource_cap+'.'+name+'" class="form-control" required>\
        <option> </option>\
        </select>\
        <p ng-show="'+this.resource+'Form.'+name+'.$invalid && !'+this.resource+'.'+name+'.$pristine" class="help-block" > Your error message here.</p>\
        </div>');
      th.push('<th>'+name+'</th>');
      fields.push(string[0]+': " "');
      td.push('<td>{{'+this.resource+'.'+name+'}}</td>');
    }
    else if(string[1] === 'integer')
    {
      var name = (string[0]);
      input.push('<div class="form-group" ng-class="{\'has-error\' : '+this.resource+'.'+name+'.$invalid && !'+this.resource+'Form.'+name+'.$pristine}">\
        <label>'+name+'</label>\
        <input type="text" name="'+name+'" ng-model="current'+this.resource_cap+'.'+name+'" class="form-control" required>\
        </input>\
        <p ng-show="'+this.resource+'Form.'+name+'.$invalid && !'+this.resource+'.'+name+'.$pristine" class="help-block" > Your error message here.</p>\
        </div>');
      th.push('<th>'+name+'</th>');
      fields.push(string[0]+': " "');
      td.push('<td>{{'+this.resource+'.'+name+'}}</td>');
    }
    else if(string[1] === 'text')
    {
      var name = (string[0]);
      input.push('<div class="form-group" ng-class="{\'has-error\' : '+this.resource+'.'+name+'.$invalid && !'+this.resource+'Form.'+name+'.$pristine}">\
        <label>'+name+'</label>\
        <input type="textarea" name="'+name+'" ng-model="current'+this.resource_cap+'.'+name+'" class="form-control" required>\
        </input>\
        <p ng-show="'+this.resource+'Form.'+name+'.$invalid && !'+this.resource+'.'+name+'.$pristine" class="help-block" > Your error message here.</p>\
        </div>');
      th.push('<th>'+name+'</th>');
      fields.push(string[0]+': " "');
      td.push('<td>{{'+this.resource+'.'+name+'}}</td>');
    }
    else if(string[1] === 'string')
    {
      var name = (string[0]);
      input.push('<div class="form-group" ng-class="{\'has-error\' : '+this.resource+'.'+name+'.$invalid && !'+this.resource+'Form.'+name+'.$pristine}">\
        <label>'+name+'</label>\
        <input type="text" name="'+name+'" ng-model="current'+this.resource_cap+'.'+name+'" class="form-control" required>\
        </input>\
        <p ng-show="'+this.resource+'Form.'+name+'.$invalid && !'+this.resource+'.'+name+'.$pristine" class="help-block" > Your error message here.</p>\
        </div>');
      th.push('<th>'+name+'</th>');
      fields.push(string[0]+': " "');
      td.push('<td>{{'+this.resource+'.'+name+'}}</td>');
    }
    else
    {
      // do nothing
    }
  }

  th = th.join(" ");
  input = input.join(" ");
  td = td.join(" ");

  var context = { 
    appname: this.appname,
    ctrlname: _.camelize(_.classify(this.name)) + 'Ctrl',
    resource: this.name, // user
    resource_cap: this.name.charAt(0).toUpperCase() + this.name.slice(1), // User
    resource_pluralize: this.name+'s', // users
    name: name,
    input: input,
    th: th,
    td: td,
    fields: fields
  };

  this.template('partial.html', 'app/controllers/'+this.name+'/'+this.name+'.html',context);
  this.template('partial.js', 'app/controllers/'+this.name+'/'+this.name+'.js',context);
  this.template('partial.less', 'app/controllers/'+this.name+'/'+this.name+'.less',context);
  this.template('partial-spec.js', 'app/controllers/'+this.name+'/'+this.name+'-spec.js',context);
};