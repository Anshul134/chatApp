const handlebars = require('express-handlebars');

const helpers = require('handlebars-helpers')({
  handlebars: handlebars
});

handlebars.registerHelper('eq', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});