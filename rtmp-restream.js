// server/rtmp-restream.js
const NodeMediaServer = require('node-media-server');
const ffmpeg = require('fluent-ffmpeg');

// 1. خادم لاستقبال البث من تطبيقك (عبر HTTP)
const http = require('http');
const server = http.createServer();

server.on('request', (req, res) => {
  if (req.method === 'POST' && req.url === '/live') {
    let body = [];
    req.on('data', chunk => body.push(chunk));
    req.on('end', () => {
      // هنا ستستقبل بيانات الفيديو من تطبيقك
      console.log('Received live stream data');
      // في تطبيق حقيقي، هنا ستتعامل مع البيانات
    });
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Stream received\n');
  }
});

server.listen(8000, () => {
  console.log('Relay server listening on http://localhost:8000');
});

// 2. خادم RTMP مبسط (استقبال وإعادة بث)
const config = {
  rtmp: {
    port: 1935, // المنفذ القياسي لـ RTMP
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8001, // منفذ لمشاهدة البث
    allow_origin: '*',
    mediaroot: './media'
  },
  relay: {
    ffmpeg: '/usr/local/bin/ffmpeg', // تأكد من المسار الصحيح لـ ffmpeg
    tasks: [
      {
        app: 'live',
        mode: 'push', // يعيد إرسال البث
        edge: 'rtmp://a.rtmp.youtube.com/live2', // مثال: إرسال إلى يوتيوب
        name: 'YOUR_YOUTUBE_STREAM_KEY' // استبدله بمفتاح بثك الحقيقي
      }
    ]
  }
};

let nms = new NodeMediaServer(config);
nms.run();
console.log('RTMP Server is running on rtmp://localhost:1935/live');