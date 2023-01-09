const fs = require('fs');
const os = require('os');

class Common {
 static settings;
 static videos;

 static addLog(message) {
  const msg = this.getDateTime() + ' ' + (message == undefined ? '' : message);
  console.log(msg);
  if (this.settings && this.settings.log_to_file) fs.appendFileSync(this.settings.log_file, msg + os.EOL);
 }

 static getDateTime() {
  function toString(number, padLength) { return number.toString().padStart(padLength, '0'); }
  const date = new Date();
  return toString(date.getFullYear(), 4)
   + '-' + toString(date.getMonth() + 1, 2)
   + '-'  + toString(date.getDate(), 2)
   + ' ' + toString(date.getHours(), 2)
   + ':'  + toString(date.getMinutes(), 2)
   + ':'  + toString(date.getSeconds(), 2);
 }
}

exports.Common = Common;
