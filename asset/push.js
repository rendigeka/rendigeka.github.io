var webPush = require('web-push');
const vapidKeys = {
   "publicKey": "BDOQW5ma2xkJAJ-cADQM7dGutGrdF6p8rphX0dgsFG5X82Kf04VR6mLn45NRIqBwQz4fFeyQn87XDHjsRDOip2U",
   "privateKey": "zagZKsgkp60Up7VsYBOF2mdHnLEszsonfisDzkkuuwM"
};

webPush.setVapidDetails('mailto:example@yourdomain.org', vapidKeys.publicKey, vapidKeys.privateKey);
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/dxbz_VTj4nk:APA91bFDsv6XgBW5nba2rG3c8qz7X19zowTI_7hE0gU0bWKw_eZn-MU8pPyEh67m5iheK3rgMoMj03IqI2LViDdWU9ZAUXSXgKXyE0rUwwqHqV_YYfX2niuCtmeT0MnHIktcF_Nqr5Af",
   "keys": {
       "p256dh": "BA4f+D3LkL2E7Ot1xOlEcVOcppk9p7LyCNhmmBSSdTgrsBVgW0uNIjTabsXFqV/uhwTZdbSVtdRMn5nLonz18aA=",
       "auth": "mPRGzr0NqqhLhEVBKARh5Q=="
   }
};

var payload = 'Selamat! Anda mendapat push notifikasi!';
var options = { gcmAPIKey: '1000625962734', TTL: 60 };
webPush.sendNotification(pushSubscription, payload, options);