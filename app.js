var dtrace = require('dtrace-provider');
var provider = dtrace.createDTraceProvider('test');
var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '7c5571c3-b5d8-46e9-9a02-0b393c4274c8',
    appPassword: 'EG50dhcEG3YgcYZWBggojmn'
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
});
