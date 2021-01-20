var vscode = require( 'vscode' );
var utils = require( './utils.js' );

function validateColours( workspace )
{
    function check( setting )
    {
        var definedColour = workspace.getConfiguration( 'todo-tree.highlights' ).get( setting );
        if( definedColour !== undefined && !utils.isValidColour( definedColour ) )
        {
            invalidColours.push( setting + ' (' + definedColour + ')' );
        }
    }

    var invalidColours = [];
    var result = "";

    var attributeList = [ 'foreground', 'background', 'iconColour', 'rulerColour' ];
    attributeList.forEach( function( attribute ) { check( 'defaultHighlight.' + attribute ); } );

    var config = vscode.workspace.getConfiguration( 'todo-tree.highlights' );
    Object.keys( config.customHighlight ).forEach( function( tag )
    {
        attributeList.forEach( function( attribute ) { check( 'customHighlight.' + tag + '.' + attribute ); } );
    } );

    if( invalidColours.length > 0 )
    {
        result = "Invalid colour settings: " + invalidColours.join( ', ' );
    }

    return result;
}

function validateIconColours( workspace )
{
    function checkIconColour( setting )
    {
        var icon = workspace.getConfiguration( 'todo-tree.highlights' ).get( setting + ".icon" );
        var iconColour = workspace.getConfiguration( 'todo-tree.highlights' ).get( setting + ".iconColour" );
        if( icon !== undefined && icon.indexOf( "$(" ) != 0 && utils.isThemeColour( iconColour ) )
        {
            invalidIconColours.push( setting + '.iconColour (' + iconColour + ')' );
        }
    }

    var invalidIconColours = [];
    var result = "";

    checkIconColour( 'defaultHighlight' );

    var config = vscode.workspace.getConfiguration( 'todo-tree.highlights' );
    Object.keys( config.customHighlight ).forEach( function( tag )
    {
        checkIconColour( 'customHighlight.' + tag );
    } );

    if( invalidIconColours.length > 0 )
    {
        result = "Invalid icon colour settings (theme colours can only be used with codicons): " + invalidIconColours.join( ', ' );
    }

    return result;
}

module.exports.validateColours = validateColours;
module.exports.validateIconColours = validateIconColours;