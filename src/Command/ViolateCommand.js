const AbstractCommand = require('discord-bot-base').AbstractCommand;
const _ = require('lodash');
const Server = require('../Model/Server');

class ViolateCommand extends AbstractCommand {
    static get name() { return 'violate'; }

    static get description() { return 'Marks a server as disabled, and sends the given message to the owner.'; }

    handle() {
        if (!this.isAdmin()) {
            return false;
        }

        return this.responds(/^violate (\d+) ?([\S\s]+)?$/gmi, (matches) => {
                let id     = matches[1],
                    server = this.client.servers.get('id', id),
                    message = matches[2] !== undefined ? matches[2] : `Your server has been removed for violating the Terms of Service of DiscordServers.com.
If you would like to appeal this, please tweet \`@discservs\` or find \`Aaron\` in the \`Discord Bots\` server. View the TOS here: http://www.discordservers.com/terms`;

                if (server === null) {
                    this.reply("Bad server id");

                    return;
                }

                Server.findOne({identifier: server.id}, (error, dbServer) => {
                    if (error) {
                        this.logger.error(error);

                        return this.reply("There was an error updating that server. Try again later.");
                    }

                    if (!dbServer) {
                        this.reply("Bad server id");

                        return;
                    }

                    this.client.leaveServer(server).catch(this.logger.error);
                    dbServer.remove(error => {
                        if (error) {
                            this.logger.error(error);

                            return this.reply("There was an error updating your server. Try again later.");
                        }

                        let owner = this.client.users.get('id', dbServer.owner.id);

                        try {
                            this.sendMessage(owner, message)
                                .catch(e => {throw new Error(e);})
                                .then(() => {
                                    let reply = `Sent owner of ${dbServer.name} (${owner}) the following message: \n\n\`\`\`\n${message}\n\`\`\``;
                                    this.logger.info(reply);
                                    this.sendMessage(this.client.admin, reply);
                                });
                        } catch (e) {
                            this.sendMessage(this.client.admin, 'Failed sending a message to the owner of that server.');
                            this.logger.error(e);
                        }

                    });
                });
            });
    }
}

module.exports = ViolateCommand;