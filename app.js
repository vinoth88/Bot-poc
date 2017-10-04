// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
const KrakenClient = require('./kraken');

const secret = 'pu/SU+ZgW6ceZuNoovnhDlbF7NPaYn2QbovLGWOfmK20lncgOoUKwGofldLIvfOpk5iQs2XHnH6bl2k0lnKwOQ=='; // API Key
const key = 'GeIiSp+TLvTaCgQ76q93wVn1JpubCbClbK2YkZ9xmH+5HAy2vbb+HRDg'; // API Private Key

const kraken = new KrakenClient(key, secret);

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978,function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create connector and listen for messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var instructions = 'Welcome to the Bot to showcase the DirectLine API. Send \'Show me a hero card\' or \'Send me a BotFramework image\' to see how the DirectLine client supports custom channel data. Any other message will be echoed.';

var bot = new builder.UniversalBot(connector, function (session) {

    var reply = new builder.Message()
        .address(session.message.address);

    var text = session.message.text.toLocaleLowerCase();

    console.log('[' + session.message.address.conversation.id + '] Message received: ' + text);
var temp= session.message.text;

if( temp=="status")
     kraken.api('TradeBalance', function(err, data) {
       if (err) {
        throw err;
        }

         kraken.api('TradeBalance',{asset:'XXBT'} ,function(err, doc){
           if (err) {
            throw err;
            }

               kraken.api('Balance',function(err, available){
                 if (err) {
                  throw err;
                  }
                 for(var k in available.result){

                  var temp = temp +'asset'+[k]+'    ' +available.result[k]+"              ";
                }
                  reply.text('Balance in Dollar'+data.result.eb +'   '+'Balance in bitcoin'+doc.result.eb  +'Available balances'+temp);
                  session.send(reply);
               });




         });

   });

  else{
    reply.text('Code not recognised');
    session.send(reply);
  }

});


bot.on('conversationUpdate', function (activity) {
    // when user joins conversation, send instructions
    if (activity.membersAdded) {
        activity.membersAdded.forEach(function (identity) {
            if (identity.id === activity.address.bot.id) {
                var reply = new builder.Message()
                    .address(activity.address)
                    .text(instructions);
                bot.send(reply);
            }
        });
    }
});
