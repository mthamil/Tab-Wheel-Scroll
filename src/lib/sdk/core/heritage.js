"use strict";

/**
 * Helper function based on Babel.js plugin 'babel-plugin-transform-builtin-extend'
 * which fixes inheritance interop between classes created with the add-on sdk's Class() 
 * and Babel.js's transpiled classes.
 */
function Extendable(base){
    function MakeExtendable(){
        base.apply(this, arguments);
    }
    
    MakeExtendable.prototype = Object.create(base.prototype);
    Object.setPrototypeOf(MakeExtendable, base);

    return MakeExtendable;
}

export { Extendable };