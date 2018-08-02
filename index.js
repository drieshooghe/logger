// Requirements
var GoogleSpreadsheet = require('google-spreadsheet');
const {google} = require('googleapis');
const { IncomingWebhook } = require('@slack/client');
var moment = require('moment-timezone');
var creds = require('./credentials.json');
var env = require('./env.json')

// Variables
var doc = new GoogleSpreadsheet(env.google.sheets.id);
const webhook = new IncomingWebhook(env.slack.url);

// Entrypoint
exports.log = (req, res) => {

  var now = moment().tz('Europe/Brussels');
  var time = '=TIME(' + now.format('HH, mm, ss') + ')';
  var date = '=DATE(' + now.format('YYYY, MM, DD') + ')';
  var message = 'Dries badged at ' + now.format('HH:mm:ss on MMMM Do YYYY');

  var result = doc.useServiceAccountAuth(creds, function (err) {
    if (err) {
      console.error(err);
    }
    doc.addRow(env.google.sheets.tab, {
      "DATE": date,
      "TIME": time
    }, function (err) {
      if (err) {
        console.error(err);
      }
    }
    );
  });

  webhook.send(message, function (err, res) {
    if (err) {
      console.error(err);
    } else {
      console.log('Message sent: ', res);
    }
  });

  res.sendStatus(200);
};

