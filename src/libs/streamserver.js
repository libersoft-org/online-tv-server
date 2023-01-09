const Common = require('./common.js');
const NodeMediaServer = require('node-media-server');
const NodeRTMPClient = require('node-media-client').NodeRTMPClient;
const fs = require('fs');

class StreamServer {
 constructor() {
  this.nms = new NodeMediaServer({
   rtmp: {
    port: Common.settings.rtmp_port,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
    allow: ['127.0.0.1']
   }, http: null
  });
  this.nms.run();
  const client = new NodeRTMPClient({ url: 'rtmp://localhost/tv', streamKey: 'stream' });
  client.connect();
  const streamFile = (id) => {
   if (id >= Common.videos.length) {
    streamFile(0);
    return;
   }
   if (!Common.settings.video_path.endsWith('/')) Common.settings.video_path += '/';
   client.publish(fs.createReadStream(Common.settings.video_path + Common.videos[id]), () => { streamFile(id + 1); });
  };
  Common.addLog('RTMP server running on port: ' + Common.settings.rtmp_port);
 }

 loadVideos() {
  if (fs.existsSync(this.videosFile)) Common.videos = this.getObjFromJSON(this.videosFile);
  else {
   Common.addLog('Error: Settings file "' + this.videosFile + '" not found. Please run this application again using: node index.js --create-settings');
   Common.addLog('');
   process.exit(1);
  }
 }
}

module.exports = StreamServer;
