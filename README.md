#generator-cg-angular

>Yeoman Generator for Enterprise Angular Projects

What is it?
-------------

It is an extension of [generator-cg-angular](https://github.com/cgross/generator-cg-angular).
generator-cg-angular only generates the directory structure. But this extension also creates the files required along with some basic code (just like scaffolding in rails).

How to use?
-------------

Prerequisites: Node, Grunt, Yeoman, and Bower.  Once Node is installed, do:

    npm install -g grunt-cli yo bower

Next, install this generator:

    npm install -g generator-cg-angular

To create a project:

    mkdir MyNewAwesomeApp
    cd MyNewAwesomeApp
    yo cg-angular

By running the generator command i.e. :
    yo cg-angular:partial my-partial [attribute:datatype]
the following files are created in the app/controllers/my-partial folder.
* my-partial.html
* my-partial.js
* my-partial.less
* my-partial-spec.js