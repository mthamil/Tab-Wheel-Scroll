'use strict';

var EXPORTED_SYMBOLS = ['setDefaultPrefs'];
Components.utils.import('resource://gre/modules/Services.jsm');

// Initializes default preferences
function setDefaultPrefs(bootstrapData) {
    var branch = Services.prefs.getDefaultBranch('');
    var prefLoaderScope = {
        pref: function(key, val) {
            switch (typeof val) {
                case 'boolean':
                    branch.setBoolPref(key, val);
                    break;
                case 'number':
                    branch.setIntPref(key, val);
                    break;
                case 'string':
                    branch.setCharPref(key, val);
                    break;
            }
        }
    };

    var uri = Services.io.newURI(
        "defaults/preferences/defaults.js",
        null,
        bootstrapData.resourceURI);

    // Execute the defaults.js file.
    Services.scriptloader.loadSubScript(uri.spec, prefLoaderScope);
}