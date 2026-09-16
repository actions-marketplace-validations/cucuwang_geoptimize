/* Original geoptimize film. Motion study informed by feitangyuan/motion-web.
 * See ATTRIBUTION.md. Fixed-time evaluation makes every frame reproducible. */
const canvas = document.querySelector('#film');
const ctx = canvas.getContext('2d', {alpha:false});
const C = {bg:'#101318',ink:'#f7f5ee',mint:'#79edb3',muted:'#a9b1bd',rail:'#303842',pink:'#ff9eac',paper:'#f3f0e7',dark:'#1a2029',line:'#3e4854'};
const starts=[0,4.7,9.4,15,21,25.3];
const transitions=[
  {name:'circle-reveal',duration:.55,preroll:.55},
  {name:'terminal-open',duration:.6,preroll:.6},
  {name:'horizontal-push',duration:.65,preroll:.65},
  {name:'diagonal-sweep',duration:.5,preroll:.5},
  {name:'beat-cut',duration:.6,preroll:.3},
];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>1-Math.pow(1-clamp(t),4);
const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
// Analytic response of an underdamped spring, stiffness=200, damping=14, mass=1.
function spring(t,k=200,c=14){if(t<=0)return 0;const w=Math.sqrt(k-c*c/4);return 1-Math.exp(-c*t/2)*(Math.cos(w*t)+c/(2*w)*Math.sin(w*t));}
let data, playing=false, held=0, origin=0, soundOn=false, bounds=[],clips=[],activeScene=0;
function rect(x,y,w,h,fill,r=0,stroke=null){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function circle(x,y,r,fill,stroke=null,lw=3){ctx.beginPath();ctx.arc(x,y,Math.max(0,r),0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}}
function line(x1,y1,x2,y2,color,width=3){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()}
function boxInWorld(x,y,w,h){const m=ctx.getTransform();const ps=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(([a,b])=>m.transformPoint({x:a,y:b}));return{x:Math.min(...ps.map(p=>p.x)),y:Math.min(...ps.map(p=>p.y)),right:Math.max(...ps.map(p=>p.x)),bottom:Math.max(...ps.map(p=>p.y))}}
function intersection(a,b){return{x:Math.max(a.x,b.x),y:Math.max(a.y,b.y),right:Math.min(a.right,b.right),bottom:Math.min(a.bottom,b.bottom)}}
function text(s,x,y,size=48,color=C.ink,weight=600,align='left',font='Space',track=true){
  ctx.font=`${weight} ${size}px ${font}`;ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.fillText(s,x,y);
  if(track&&s){const m=ctx.measureText(s);const raw=boxInWorld(x-m.actualBoundingBoxLeft,y-m.actualBoundingBoxAscent,m.actualBoundingBoxLeft+m.actualBoundingBoxRight,m.actualBoundingBoxAscent+m.actualBoundingBoxDescent);let region={x:0,y:0,right:1920,bottom:1080};for(const clip of clips)region=intersection(region,clip);const visible=intersection(raw,region);if(visible.right-visible.x>1&&visible.bottom-visible.y>1)bounds.push({s,scene:activeScene,raw,...visible,region,authoredClip:clips.length>0})}
}
function transform(x,y,angle,scale,fn){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(scale,scale);fn();ctx.restore()}
function clipRegion(x,y,w,h,fn){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();clips.push(boxInWorld(x,y,w,h));fn();clips.pop();ctx.restore()}
function revealText(s,x,y,size,color,p){clipRegion(x-12,y-size-16,1100,size+60,()=>text(s,x,y+(1-p)*(size+32),size,color,700))}
function logo(x,y,size=38,color=C.ink){text('>_',x,y,size,C.mint,600,'left','Code');text('geoptimize',x+size*1.8,y,size,color,700)}
function check(x,y,s,color=C.bg,p=1){ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.moveTo(-s*.35,0);if(p<.4){ctx.lineTo(lerp(-s*.35,-s*.08,p/.4),s*.26*p/.4)}else{ctx.lineTo(-s*.08,s*.26);ctx.lineTo(lerp(-s*.08,s*.48,(p-.4)/.6),lerp(s*.26,-s*.4,(p-.4)/.6))}ctx.strokeStyle=color;ctx.lineWidth=s*.11;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();ctx.restore()}
function label(s,x,y,w,fill,color=C.bg,angle=0){transform(x,y,angle,1,()=>{rect(-w/2,-30,w,60,fill,30);text(s,0,11,28,color,600,'center')})}
function pageShape(x,y,t,rotation,variant){transform(x,y,rotation,1,()=>{rect(-170,-215,340,430,C.paper,18);text(variant===0?'<title>':'<html>',-130,-147,30,C.bg,400,'left','Code',false);for(let i=0;i<5;i++)line(-130,-88+i*47,i%2?92:128,-88+i*47,i===2?C.pink:'#c6c9c4',i===2?14:9);rect(-130,165,150,12,C.mint,6);})}
function bg(color){rect(0,0,1920,1080,color)}
function scene0(t){
  bg(C.bg);logo(116,115);
  const a=spring(t-.18),b=spring(t-1.18);
  revealText('Looks ready.',120,400,142,C.ink,a);revealText("Let's check.",120,575,142,C.mint,b);
  text('A closer look at your website content.',128,695,34,C.muted,400);
  const p=ease((t-.32)/.8);const yy=lerp(1450,564,p);
  pageShape(1460,yy,t,.12+Math.sin(t*1.6)*.025,0);
  pageShape(1340,yy+10,t,-.09+Math.sin(t*1.4)*.025,1);
  if(t>.92){const s=spring(t-.92);transform(1548,386,-.12,s,()=>{circle(0,0,63,C.pink);text('?',0,28,80,C.bg,700,'center')})}
  if(t>1.7){const s=spring(t-1.7);transform(1300,824,.075,s,()=>{rect(-181,-40,362,80,C.mint,40);text('One quick scan.',0,13,33,C.bg,600,'center')})}
  // The scanning focus belongs to the document, rather than a decorative pointer trail.
  if(t>2.5){const p=smooth((t-2.5)/1.2);const y=lerp(384,732,p);line(1108,y,1577,y,C.mint,5);circle(1108,y,9,C.mint)}
}
function scene1(t){
  bg(C.mint);
  const p=spring(t-.1,200,18);clipRegion(104,180,1690,398,()=>{text('Meet',119,330-(1-p)*36,106,C.bg,500);text('geoptimize.',110,510-(1-p)*36,186,C.bg,700)});
  const q=spring(t-.5,200,18);
  if(t>=.5)clipRegion(100,592,1718,235,()=>transform(960,704,0,.9+.1*q,()=>{rect(-844,-102,1688,204,C.bg,18);text('$',-785,25,54,C.mint,400,'left','Code');const cmd='npx geoptimize scan ./dist --dir';const n=Math.floor(clamp((t-.7)/1.45)*cmd.length);text(cmd.slice(0,n),-704,25,51,C.ink,400,'left','Code');if(t<2.4){const w=ctx.measureText(cmd.slice(0,n)).width;rect(-697+w,-24,24,55,C.mint,2)}}));
  text('Your website. A little more legible.',124,934,43,C.bg,500);
  if(t>2.4){const s=spring(t-2.4);transform(1744,323,.08,s,()=>{circle(0,0,75,C.bg);check(0,0,70,C.mint,clamp((t-2.4)/.3))})}
}
function scene2(t){
  bg(C.bg);logo(116,105);text('See where things stand.',116,249,88,C.ink,700);
  const q=ease(t/.8);clipRegion(96,306,1700,616,()=>{ctx.save();ctx.translate(0,(1-q)*40);
  text('Content readiness',122,360,37,C.muted,500);
  text(String(data.before.total),106,654,270,C.ink,700);text('/ 100',456,642,67,C.muted,500);
  text('3 pages checked',126,734,37,C.ink,500);
  text('Synthetic demo site',126,790,31,C.muted,400);
  const ds=data.before.dimensions;
  ds.forEach((d,i)=>{const y=390+i*108;const v=ease((t-.3-i*.13)/1);text(d.name,735,y,34,C.ink,500);text(`${d.value} / ${d.max}`,1772,y,31,C.muted,400,'right','Code');rect(735,y+23,1038,16,C.rail,8);rect(735,y+23,1038*d.value/d.max*v,16,i===2?C.mint:(i===0?C.pink:C.mint),8)});
  ctx.restore();});
  text('Findings you can inspect. Evidence you can open.',120,987,36,C.mint,500);
}
function metricRow(y,title,before,after,t,delay){
  line(880,y-49,1765,y-49,'#c7cbc4',2);text(title,897,y+5,32,C.bg,500);
  text(String(before),1428,y+10,56,'#737b75',500,'center');
  const p=spring(t-delay);line(1486,y-9,1550,y-9,C.bg,3);line(1540,y-18,1550,y-9,C.bg,3);line(1540,y,1550,y-9,C.bg,3);
  transform(1670,y-13,0,Math.max(.001,p),()=>{circle(0,0,45,C.mint);text(String(after),0,18,53,C.bg,700,'center')});
}
function scene3(t){
  bg(C.paper);text('>_',116,105,38,'#188453',600,'left','Code');text('geoptimize',184,105,38,C.bg,700);
  const p=spring(t-.1);clipRegion(104,206,700,420,()=>{text('Find it.',119,395-(1-p)*28,161,C.bg,700);text('Fix it.',118,568-(1-p)*28,161,C.bg,700)});
  text('Then check again.',126,680,49,C.bg,500);
  clipRegion(865,195,935,730,()=>{ctx.save();
  rect(880,213,899,349,C.bg,16);text('Demo page · before / after',916,270,28,C.muted,500);
  text('<title>',919,346,35,C.muted,400,'left','Code');
  text(t<1.55?'Demo':'Demo /',919,398,34,t<1.55?C.pink:C.mint,400,'left','Code');
  text('</title>',919,450,35,C.muted,400,'left','Code');
  if(t>1.6){rect(906,479,820,55,'#1f3b2e',6);text('canonical = https://demo.example/',922,517,28,C.mint,400,'left','Code')}
  text('BEFORE',1390,635,24,'#667168',600);text('AFTER',1620,635,24,'#667168',600);
  metricRow(716,'Missing canonical',data.before.missingCanonical,data.after.missingCanonical,t,2.1);
  metricRow(854,'Duplicate title groups',data.before.duplicateTitleGroups,data.after.duplicateTitleGroups,t,2.38);
  ctx.restore();});
  text('Same synthetic site, with revised content.',126,989,31,'#556057',400);
}
function scene4(t){
  bg(C.bg);logo(116,105);
  const p=spring(t-.1,200,18);clipRegion(104,218,1700,350,()=>{text('Fits the way',118,358-(1-p)*28,123,C.ink,700);text('you already work.',118,503-(1-p)*28,123,C.mint,700)});
  const x0=145,x1=978;line(x0,709,1773,709,C.line,5);
  const progress=ease((t-.5)/1.6);line(x0,709,lerp(x0,1773,progress),709,C.mint,5);
  circle(x0,709,13,C.mint);circle(x1,709,13,t>1.3?C.mint:C.line);circle(1773,709,13,t>2?C.mint:C.line);
  text('SCAN LOCALLY',123,644,28,C.muted,500);
  text('SAVE A REPORT',978,644,28,C.muted,500);
  text('geo scan ./dist --dir',124,818,43,C.ink,400,'left','Code');
  text('report.html',979,818,52,C.ink,500);
  const q=spring(t-1.6);transform(1695,826,0,Math.max(.001,q),()=>{circle(0,0,46,C.mint);check(0,0,50,C.bg)});
  text('Free and open source. Ready for CI.',123,972,38,C.muted,500);
}
function scene5(t){
  bg(C.mint);
  const p=spring(t-.1,200,18);transform(960,249,0,Math.max(.001,p),()=>{text('>_',-115,0,121,C.bg,600,'left','Code')});
  clipRegion(105,302,1710,240,()=>text('geoptimize',960,494-(1-p)*42,181,C.bg,700,'center'));
  text('Lint your docs like code.',960,601,66,C.bg,500,'center');
  const q=spring(t-.6,200,18);if(t>=.6)clipRegion(245,680,1430,175,()=>transform(960,761,0,.9+.1*q,()=>{rect(-686,-67,1372,134,C.bg,16);text('npm install --save-dev geoptimize',0,18,46,C.ink,400,'center','Code')}));
  text('github.com/cucuwang/geoptimize',960,965,42,C.bg,500,'center');
  // Two punctuation marks arrive like the tool has found its place.
  if(t>1.6){const s=spring(t-1.6);transform(1745,235,.12,s,()=>{circle(0,0,61,C.bg);check(0,0,63,C.mint)})}
}
const scenes=[scene0,scene1,scene2,scene3,scene4,scene5];
function renderScene(i,t){activeScene=i;scenes[i](t)}
function sceneTime(i,t){return t-starts[i]+(i?transitions[i-1].preroll:0)}
function renderTransition(i,t,p){
  const next=i+1,spec=transitions[i],incoming=t-(starts[next]-spec.duration),outgoing=sceneTime(i,t);
  if(spec.name==='horizontal-push'){
    bg(C.paper);ctx.save();ctx.translate(-1920*p,0);renderScene(i,outgoing);ctx.restore();ctx.save();ctx.translate(1920*(1-p),0);renderScene(next,incoming);ctx.restore();return;
  }
  if(spec.name==='beat-cut'){
    const local=incoming/spec.duration;
    if(local<.5){bg(C.bg);transform(960,540,0,1+.025*smooth(local*2),()=>{ctx.translate(-960,-540);renderScene(i,outgoing)})}
    else{bg(C.mint);transform(960,540,0,lerp(.96,1,ease((local-.5)*2)),()=>{ctx.translate(-960,-540);renderScene(next,incoming-spec.duration/2)})}
    return;
  }
  renderScene(i,outgoing);ctx.save();ctx.beginPath();
  if(spec.name==='circle-reveal')ctx.arc(1548,386,Math.max(0,p*2040),0,Math.PI*2);
  if(spec.name==='terminal-open')ctx.rect(0,704-704*p,1920,1408*p);
  if(spec.name==='diagonal-sweep'){const x=2400*p;ctx.moveTo(0,0);ctx.lineTo(x,0);ctx.lineTo(x-350,1080);ctx.lineTo(0,1080);ctx.closePath()}
  ctx.clip();renderScene(next,incoming);ctx.restore();
}
function draw(t){
  t=clamp(t,0,30);bounds=[];clips=[];const i=starts.findLastIndex(s=>t>=s);let transition=null;
  if(i<5&&t>starts[i+1]-transitions[i].duration){transition=transitions[i].name;const p=smooth((t-(starts[i+1]-transitions[i].duration))/transitions[i].duration);renderTransition(i,t,p)}
  else renderScene(i,sceneTime(i,t));
  window.__state={t,scene:i,transition,bounds};
}
window.__seek=t=>{playing=false;held=t;draw(t);return {t,scene:window.__state.scene}};
window.__hold=window.__seek;
window.__probe=()=>window.__state;
const play=document.querySelector('#play'),seek=document.querySelector('#seek'),clock=document.querySelector('#time'),music=document.querySelector('#music');
function syncUI(t){seek.value=t;clock.value=`0:${String(Math.floor(t)).padStart(2,'0')}`;play.textContent=playing?'Pause':'Play'}
function pause(){playing=false;music.pause();syncUI(held)}
function tick(now){if(playing){held=clamp((now-origin)/1000,0,30);draw(held);syncUI(held);if(held>=30)pause()}requestAnimationFrame(tick)}
play.addEventListener('click',()=>{if(playing){pause();return}if(held>=30)held=0;origin=performance.now()-held*1000;playing=true;if(soundOn){music.currentTime=held;music.play().catch(()=>{})}syncUI(held)});
seek.addEventListener('input',()=>{pause();held=Number(seek.value);draw(held);music.currentTime=held;syncUI(held)});
document.querySelector('#sound').addEventListener('click',e=>{soundOn=!soundOn;e.target.textContent=soundOn?'Sound on':'Sound off';e.target.setAttribute('aria-pressed',String(soundOn));if(soundOn&&playing){music.currentTime=held;music.play().catch(()=>{})}else music.pause()});
window.__ready=(async()=>{
  data=await (await fetch('./source-data.json')).json();
  await Promise.all([document.fonts.load('700 160px Space'),document.fonts.load('400 46px Code')]);
  if(new URLSearchParams(location.search).has('render'))document.body.classList.add('render');
  draw(0);requestAnimationFrame(tick);return true;
})();
