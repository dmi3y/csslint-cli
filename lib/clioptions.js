module.exports = {
    'help'        : { 'format' : '',                       'description' : 'Displays this information.'},
    'version'     : { 'format' : '',                       'description' : 'Outputs the current version number.'},
    'list-rules'  : { 'format' : '',                       'description' : 'Outputs all of the rules available.'},

    'format'      : { 'format' : '<format>',               'description' : 'Indicate which format to use for output.'},
    'quiet'       : { 'format' : '',                       'description' : 'Only output when errors are present.'},
    'errors'      : { 'format' : '<rule[,rule]+>',         'description' : 'Indicate which rules to include as errors.'},
    'warnings'    : { 'format' : '<rule[,rule]+>',         'description' : 'Indicate which rules to include as warnings.'},
    'ignore'      : { 'format' : '<rule[,rule]+>',         'description' : 'Indicate which rules to ignore completely.'},
    'exclude-list': { 'format' : '<file|dir[,file|dir]+>', 'description' : 'Indicate which files/directories to exclude from being linted.'}
};