import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import puppeteer from 'puppeteer-core';

const root=path.dirname(fileURLToPath(import.meta.url));
const output=path.join(root,'output');fs.mkdirSync(output,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.ttf':'font/ttf','.wav':'audio/wav'};
const server=http.createServer((req,res)=>{
  const u=new URL(req.url,'http://localhost');const rel=decodeURIComponent(u.pathname)==='/'?'index.html':decodeURIComponent(u.pathname).slice(1);
  const filename=path.resolve(root,rel);if(!filename.startsWith(root+path.sep)){res.writeHead(403).end();return}
  fs.readFile(filename,(err,b)=>{if(err){res.writeHead(404).end();return}res.setHeader('Content-Type',mime[path.extname(filename)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');res.end(b)});
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port;
const browser=await puppeteer.launch({executablePath:process.env.GEO_CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding','--hide-scrollbars']});
try{
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewport({width:1920,height:1080,deviceScaleFactor:1});
  await page.goto(`http://127.0.0.1:${port}/?render`,{waitUntil:'networkidle0'});await page.evaluate(()=>window.__ready);
  const stills=path.join(output,'stills');fs.mkdirSync(stills,{recursive:true});
  const sampleTimes=[0,1.2,3.3,4.45,6.1,8.8,10.7,13.2,16.5,18.8,20.3,22.8,26.8,29.6];
  for(const t of sampleTimes){await page.evaluate(t=>window.__seek(t),t);await page.screenshot({path:path.join(stills,`${String(t).replace('.','_')}.png`)})}
  // Exact same frame after seeking away must be identical: no hidden ambient clocks.
  await page.evaluate(()=>window.__seek(13.2));const first=await page.screenshot();
  await page.evaluate(()=>window.__seek(22.8));await page.evaluate(()=>window.__seek(13.2));const second=await page.screenshot();
  if(!Buffer.from(first).equals(Buffer.from(second)))throw new Error('Non-deterministic render');
  if(errors.length)throw new Error(errors.join('\n'));
  console.log(JSON.stringify({stills:sampleTimes.length,deterministic:true,pageErrors:errors}));
  if(!process.argv.includes('--stills')){
    const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',path.join(output,'silent.mp4')],{stdio:['pipe','inherit','inherit']});
    const done=once(ff,'close');
    for(let n=0;n<900;n++){
      const frame=await page.evaluate(t=>{window.__seek(t);return document.querySelector('canvas').toDataURL('image/png').split(',')[1]},n/30);
      if(!ff.stdin.write(Buffer.from(frame,'base64')))await once(ff.stdin,'drain');
      if(n%150===0)console.log(`Rendered ${n}/900 frames`);
    }
    ff.stdin.end();const [code]=await done;if(code!==0)throw new Error(`FFmpeg ${code}`);
    console.log('Rendered 900 frames at 1920x1080, 30fps.');
  }
}finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
