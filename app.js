// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
const KrakenClient = require('./kraken');

const secret = 'pu/SU+ZgW6ceZuNoovnhDlbF7NPaYn2QbovLGWOfmK20lncgOoUKwGofldLIvfOpk5iQs2XHnH6bl2k0lnKwOQ=='; // API Key
const key = 'GeIiSp+TLvTaCgQ76q93wVn1JpubCbClbK2YkZ9xmH+5HAy2vbb+HRDg'; // API Private Key

const kraken = new KrakenClient(key, secret);


var assetPairs = ['XXBTZUSD']

var leverage_sell = [2, 3, 4, 5];
var leverage_buy = [2, 3, 4, 5];

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978,function() {
  console.log('%s listening to %s', server.name, server.url);
});

// Create connector and listen for messages
var connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var instructions = 'Welcome to the Bot to showcase the DirectLine API. Send \'Show me a hero card\' or \'Send me a BotFramework image\' to see how the DirectLine client supports custom channel data. Any other message will be echoed.';

var bot = new builder.UniversalBot(connector, function(session) {

    var reply = new builder.Message()
      .address(session.message.address);

    var text = session.message.text.toLocaleLowerCase();

    console.log('[' + session.message.address.conversation.id + '] Message received: ' + text);

    var temp = session.message.text;


    var arr = temp.split(/[ ,]+/);
console.log(arr);

    if (arr.indexOf("status") == 0 && arr.length == 1) {
      kraken.api('TradeBalance', function(err, data) {

        if (err) {
          reply.text(err);
          session.send(reply);
        }

        kraken.api('TradeBalance', {
          asset: 'XXBT'
        }, function(err, doc) {
          if (err) {
            reply.text(err);
            session.send(reply);
          }

          kraken.api('Balance', function(err, available) {
            if (err) {
              reply.text(err);
              session.send(reply);
            }
            var temp = " ";
            for (var k in available.result) {

              temp = temp + [k] + '    ' + available.result[k] + '\n\n';
            }



            reply.text('Balance in Dollar' + data.result.eb + '\n\n' + 'Balance in bitcoin' + doc.result.eb + '\n\n'+'Available balance' + '\n\n'+ temp);
            session.send(reply);

          });
        });
      });
    } else if (arr.indexOf("buy") == 0 && assetPairs.indexOf(arr[1]) > -1 && !isNaN(arr[2])) {


      if (leverage_buy.indexOf(arr[3]) > -1) {

        if (!isNaN(arr[4])) {

          kraken.api('AddOrder', {
            'pair': arr[1],
            'type': arr[0],
            'ordertype': 'limit',
            'volume': arr[2],
            'leverage': arr[3],
            'price': arr[4]
          }, function(err, data) {
            if (err) {
              reply.text('Order failed');
              session.send(reply);
            } else {
              reply.text('Order successfully processed');
              session.send(reply);
            }
          });

        } else {

          kraken.api('AddOrder', {
            'pair': arr[1],
            'type': arr[0],
            'ordertype': 'market',
            'volume': arr[2],
            'leverage': arr[3]

          }, function(err, data) {
            if (err) {
              reply.text('Order failed');
              session.send(reply);
            } else {
              reply.text('Order successfully processed');
              session.send(reply);
            }
          });

}

}
        if (!isNaN(arr[4])) {

          kraken.api('AddOrder', {
            'pair': arr[1],
            'type': arr[0],
            'ordertype': 'limit',
            'volume': arr[2],
            'price': arr[4]
          }, function(err, data) {
            if (err) {
              reply.text('Order failed');
              session.send(reply);
            } else {
              reply.text('Order successfully processed');
              session.send(reply);
            }
          });

        } else {

          kraken.api('AddOrder', {
            'pair': arr[1],
            'type': arr[0],
            'ordertype': 'market',
            'volume': arr[2]

          }, function(err, data) {
            if (err) {
              reply.text('Order failed');
              session.send(reply);
            } else {
              reply.text('Order successfully processed');
              session.send(reply);
            }
          });

        }


  } else if (arr.indexOf("sell") == 0 && assetPairs.indexOf(arr[1]) > -1 && !isNaN(arr[2])) {


    if (leverage_buy.indexOf(arr[3]) > -1) {

      if (!isNaN(arr[4])) {

        kraken.api('AddOrder', {
          'pair': arr[1],
          'type': arr[0],
          'ordertype': 'limit',
          'volume': arr[2],
          'leverage': arr[3],
          'price': arr[4]
        }, function(err, data) {
          if (err) {
            reply.text('Order failed');
            session.send(reply);
          } else {
            reply.text('Order successfully processed');
            session.send(reply);
          }
        });

      } else {

        kraken.api('AddOrder', {
          'pair': arr[1],
          'type': arr[0],
          'ordertype': 'market',
          'volume': arr[2],
          'leverage': arr[3]

        }, function(err, data) {
          if (err) {
            reply.text('Order failed');
            session.send(reply);
          } else {
            reply.text('Order successfully processed');
            session.send(reply);
          }
        });
}

}
      if (!isNaN(arr[4])) {

        kraken.api('AddOrder', {
          'pair': arr[1],
          'type': arr[0],
          'ordertype': 'limit',
          'volume': arr[2],
          'price': arr[4]
        }, function(err, data) {
          if (err) {
            reply.text('Order failed');
            session.send(reply);
          } else {
            reply.text('Order successfully processed');
            session.send(reply);
          }
        });

      } else {

        kraken.api('AddOrder', {
          'pair': arr[1],
          'type': arr[0],
          'ordertype': 'market',
          'volume': arr[2]

        }, function(err, data) {
          if (err) {
            reply.text('Order failed');
            session.send(reply);
          } else {
            reply.text('Order successfully processed');
            session.send(reply);
          }
        });
      }
}
else {
  reply.text('Code not recognised');
  session.send(reply);
}

});


bot.on('conversationUpdate', function(activity) {
  // when user joins conversation, send instructions
  if (activity.membersAdded) {
    activity.membersAdded.forEach(function(identity) {
      if (identity.id === activity.address.bot.id) {
        var reply = new builder.Message()
          .address(activity.address)
          .text(instructions);
        bot.send(reply);
      }
    });
  }
});


function createCard(selectedCardName, session) {
    switch (selectedCardName) {
        case HeroCardName:
            return createHeroCard(session);
        case ThumbnailCardName:
            return createThumbnailCard(session);
        case ReceiptCardName:
            return createReceiptCard(session);
        case SigninCardName:
            return createSigninCard(session);
        case AnimationCardName:
            return createAnimationCard(session);
        case VideoCardName:
            return createVideoCard(session);
        case AudioCardName:
            return createAudioCard(session);
        default:
            return createHeroCard(session);
    }
}
