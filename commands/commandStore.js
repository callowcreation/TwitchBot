const fs = require('fs');
const CommandSchema = require('../validation/CommandSchema');

/**
 * This class loads and stores every command from the specified directory
 */
class CommandStore {

    /**
     * @constructor
     * @param {String} directory
     * @example
     * const commands = new CommandStore(process.cwd() + '/commands/'); 
     */
    constructor(directory) {
        this._directory = directory;
        this._loadAllCommands();
    }

    /**
     * Tries to load and register all commands from the given directory after construction.
     * @private
     * @returns {Void}
     */
    _loadAllCommands() { // todo: add support for nested folders
        this._commands = [];
        const files = fs.readdirSync(this._directory).filter(file => file.endsWith('.js'));
        files.forEach(file => {
            try {
                const command = require(`${this._directory}${file}`);
                const validated = CommandSchema.validate(command); // validate the command using the predefined schema
                if(validated.error == null) { // if validation was successful
                    console.info(`Command ${file} has been loaded.`);
                    this._commands.push(command);
                } else {
                    console.warn(`Command ${file} could not be loaded. Validation: ${validated.error}`);
                }
            } catch (error) {
                console.warn(`Command ${file} could not be loaded. ${error}`);
            }
        });
    }

    /**
     * Gets a registered command by name or alias.
     * @public
     * @param {String} commandName 
     * @returns {Object} The command object with its properties and run function.
     */
    getCommand(commandName) {
        let found = this._commands.find(cmd => cmd.name === commandName) || this._commands.find(cmd => cmd.aliases.includes(commandName));
        if(!found) return null;
        return found;
    }

}

module.exports = {
    CommandStore
}