"use strict";
require('core-js');
require('reflect-metadata');
require('zone.js/dist/zone');
var core_1 = require("@angular/core");
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var forms_1 = require('@angular/forms');
var app_component_1 = require('./app.component');
console.info('app.environment:', app.environment);
if (app.environment === 'prod' || app.environment === 'pre') {
    core_1.enableProdMode();
}
platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [forms_1.disableDeprecatedForms(), forms_1.provideForms()]);
//# sourceMappingURL=main.js.map