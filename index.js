// Requirements
var GoogleSpreadsheet = require('google-spreadsheet');
const {google} = require('googleapis');
const { IncomingWebhook } = require('@slack/client');
var moment = require('moment-timezone');
var creds = require('./credentials.json');
var sheetInfo = require('./sheet_info.json');
var slackInfo = require('./slack_info.json');

// Variables
var doc = new GoogleSpreadsheet(sheetInfo.id);
const webhook = new IncomingWebhook(slackInfo.url);

// Entrypoint
exports.log = (req, res) => {

  var now = moment().tz('Europe/Brussels');
  var time = '=TIME(' + now.format('HH, mm, ss') + ')';
  var date = '=DATE(' + now.format('YYYY, MM, DD') + ')';
  var message = 'Dries badged at ' + now.format('HH:mm on MMMM Do YYYY');

  var result = doc.useServiceAccountAuth(creds, function (err) {

    doc.addRow(sheetInfo.tabId, {
      "DATE": date,
      "TIME": time
    }, function (err) {
      if (err) {
        message = 'Whoops, looks like something went wrong when you badged:' + err;
      }
    }
    );
  });

  webhook.send(message, function (err, res) {
    if (err) {
      console.log('Error:', err);
    } else {
      console.log('Message sent: ', res);
    }
  });

  res.sendStatus(200);
};
