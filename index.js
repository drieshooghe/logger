const {google} = require('googleapis');

exports.logger = (req, res) => {
  var jwt = getJwt();
  var apiKey = getApiKey();
  var spreadsheetId = '1wS7evEV5Jvb1nYaRFUleidSZnK6OR-4Z1ZTqQ9MFTkU';
  var range = 'A1';
  var row = [new Date(), 'A Cloud Function was here'];
  appendSheetRow(jwt, apiKey, spreadsheetId, range, row);
  res.status(200).type('text/plain').end('OK');
};

function getJwt() {
  var credentials = require("./credentials.json");
  return new google.auth.JWT(
    credentials.client_email, null, credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
}

function getApiKey() {
  var apiKeyFile = require("./api_key.json");
  return apiKeyFile.key;
}

function appendSheetRow(jwt, apiKey, spreadsheetId, range, row) {
  const sheets = google.sheets({version: 'v4'});
  sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId,
    range: range,
    auth: jwt,
    key: apiKey,
    valueInputOption: 'RAW',
    resource: {values: [row]}
  }, function(err, result) {
    if (err) {
      throw err;
    }
    else {
      console.log('Updated sheet: ' + result.data.updates.updatedRange);
    }
  });
}