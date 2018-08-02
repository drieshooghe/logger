# Logger
Practical hour logger for Google Cloud Functions that logs to Google Sheets and Slack.

## Installing
- Generate a service account and API key: See [this](https://stackoverflow.com/questions/44448029/how-to-use-google-sheets-api-while-inside-a-google-cloud-function) thread on stackoverflow
- Enable the google sheets API
- Complete ```credentials.json``` with the info from the service account and ```env.json``` with your slack and sheets info
- Create a new Cloud Function on GCP and upload your app
