const Common = require('./common.js').Common;
const WebServer = require('./webserver.js');
const fs = require('fs');

class App {
 run() {
  this.settingsFile = 'settings.json';
  this.videosFile = 'videos.json';
  try {
   this.createSettings();
   this.loadSettings();
   this.loadVideos();
   Common.addLog('');
   Common.addLog('Online TV server');
   Common.addLog('');
   this.webServer = new WebServer();
  } catch (ex) {
   Common.addLog(ex);
  }
 }

 createSettings() {
  try {
   if (!fs.existsSync(this.settingsFile)) {
    var settings = {
     rtmp_port: 1935,
     http_port: 80,
     https_port: 443,
     https_cert_path: '/etc/letsencrypt/live/{DOMAIN}/',
     web_path: 'www/tv',
     video_path: 'video'
    }
    fs.writeFileSync(this.settingsFile, JSON.stringify(settings, null, ' '));
    Common.addLog('The new settings file was created sucessfully.');
   }
  } catch (ex) {
   Common.addLog(ex);
  }
 }

 loadSettings() {
  if (fs.existsSync(this.settingsFile)) {
   var json = fs.readFileSync(this.settingsFile, { encoding:'utf8', flag:'r' });
   Common.settings = JSON.parse(json);
   if (Common.settings.https_cert_path.includes('{DOMAIN}')) {
    const readline = require('readline-sync');
    const domain = readline.question('Enter your server address domain name (eg.: tv.domain.tld): ');
    Common.settings.https_cert_path = Common.setting.https_cert_path.replace('{DOMAIN}', domain);
    fs.writeFileSync(this.settingsFile, JSON.stringify(Common.settings, null, ' '));
   }
  } else {
   Common.addLog('Error: Settings file "' + this.settingsFile + '" not found.');
   Common.addLog('');
   process.exit(1);
  }
 }

 loadVideos() {
  if (fs.existsSync(this.videosFile)) Common.videos = this.getObjFromJSON(this.videosFile);
  else {
   Common.addLog('Error: Videos list file "' + this.videosFile + '" not found.');
   Common.addLog('');
   process.exit(1);
  }
 }
}

module.exports = App;
