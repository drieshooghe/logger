// Requirements
import * as sheetClient from 'google-spreadsheet'
import * as googleApis from 'googleapis'
import * as slackClient from '@slack/client'

const moment = require('moment-timezone');
const creds = require('../credentials.json');
const env = require('../env.json')

// Variables
const doc = new sheetClient(env.google.sheets.id);
const slack = new slackClient.IncomingWebhook(env.slack.url);

// Entrypoint
exports.log = (req: any, res: any) => {

    const now = moment().tz('Europe/Brussels');
    const time = '=TIME(' + now.format('HH, mm, ss') + ')';
    const date = '=DATE(' + now.format('YYYY, MM, DD') + ')';
    const message = 'Dries badged at ' + now.format('HH:mm:ss on MMMM Do YYYY');

    /**
     * Add timestamp to specified google sheet and log outcome
     */
    doc.useServiceAccountAuth(creds, function (err: Error) {
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

    /**
     * Send message to slack and log outcome
     */
    slack.send(message, function (err: Error, res: any): void {
        if (err) {
            console.error(err);
        } else {
            console.log('Message sent: ', res);
        }
    });

    res.sendStatus(200);
};

