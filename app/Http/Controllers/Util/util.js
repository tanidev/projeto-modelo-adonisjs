'use strict'

module.exports = {

    formatValidationMessages : function(messages) {

        var object = {}

        messages.forEach(e => {
            object[e.field] = e.message
        })
        
        return object
    }

}