/* ===== SPOTLIGHT SYSTEM: Camera Focus · Epic Reel-in · MVP Card · VIP Yacht ===== */
const cam={z:1,x:W/2,y:H/2},SP={p:null,k:'',t:0,out:false,after:null,bp:0,lb:-1};
let card=null,flash=0,roomBest=0,spotCool=0;
const TIER={junk:0,common:0,rare:1,legend:2},tierOK=t=>TIER[t]>=(TIER[GC.spotMinTier]||1);
const vipPos=i=>({x:[510,410,610][i]||510,y:676});
SFX.drum=()=>{tone(70,.28,'sine',.55);noise(.1,150,.5)};
function sayNow(t){if(!GC.tts)return;sayQ.length=0;try{speechSynthesis.cancel()}catch(e){}talking=false;say(t,true)}   // ngắt hàng đợi, ưu tiên đọc ngay

function spotReq(p,kind,force){if(!GC.spotlight||SP.p||(T<spotCool&&!force))return false;Object.assign(SP,{p,k:kind,t:0,out:false,after:null,bp:0,lb:-1});if(kind==='catch'){p.tn=GC.qteStart;p.win=0}
 LOG(`🎬 Spotlight [${kind}] → ${p.name}`);if(kind==='catch')sayNow(`Cá lớn cắn câu! Mọi người spam KEO và thả tim giúp ${p.name} kéo lên!`);return true}
function spotEnd(p){SP.out=true;SP.after=(p.failed||p.fake)?null:p;if(SP.after)p.keep=Math.max(p.keep,T+8);p.failed=0;p.fake=0}   // ở lại cho tới khi zoom out xong và lên du thuyền                       // zoom out rồi mới lên du thuyền
function spotGift(p,coins){if(!spotReq(p,'gift',true))return;flash=.8;shk=Math.max(shk,20);
 card={t:4.5,title:'💎 ĐẠI GIA THẢ LƯỚI LỚN 💎',name:p.name,img:p.img,e:'💣',big:coins+' xu',sub:'Cá khổng lồ nổi lên khắp biển!',rec:false};
 sayNow(`Đại gia ${p.name} vừa thả lưới lớn!`)}
function reveal(p){const L=p.loot;if(L.fake)return revealFake(p,L);flash=1;shk=Math.max(shk,24);burst(p.x0+25,WL,80,'#cfefff',540,460);burst(p.x0+25,WL-80,40,'#ffd700',420,300);fireworks();SFX.bell();SFX.splash();
 card={t:4,title:'🏆 VINH DANH CẦN THỦ 🏆',name:p.name,img:p.img,e:L.e,big:L.kg.toFixed(1)+' kg',sub:L.n,rec:p.rec,tier:L.tier};
 sayNow(`Chúc mừng ${p.name} câu được ${L.n} nặng ${Math.round(L.kg)} ký${p.rec?'. Kỷ lục mới của phòng!':'!'}`);LOG(`${p.name} VINH DANH: ${L.n} ${L.kg}kg${p.rec?' (KỶ LỤC)':''}`)}
function makeVip(p){const o=[...players.values()].filter(q=>q!==p&&q.vip&&T<q.vip);let vi=[0,1,2].find(i=>!o.some(q=>q.vi===i));
 if(vi===undefined){o.sort((a,b)=>a.vip-b.vip);vi=o[0].vi;leave(o[0])}
 p.vip=T+GC.vipSeconds;p.vi=vi;p.slot=-1;p.keep=Math.max(p.keep,p.vip);LOG(`👑 ${p.name} lên du thuyền VIP ${GC.vipSeconds}s`)}

function spotUpdate(dt){
 if(SP.p&&!players.has(SP.p.id))SP.p=null;
 const p=SP.p;flash=Math.max(0,flash-dt*2.2);if(card){card.t-=dt;if(card.t<=0)card=null}
 if(p){SP.t+=dt;
  if(!SP.out&&(SP.t>30||(SP.k==='gift'&&SP.t>4.5))){SP.out=true;SP.after=p}
  if(SP.k==='catch'&&p.st==='epic'){p.tn=Math.max(0,Math.min(100,(p.tn||0)-GC.qteDecay*dt));SP.bp+=dt*(1.8+(1-p.tn/100)*2.4);const b=Math.floor(SP.bp);           // nhịp tim dồn dập dần
   if(b!==SP.lb){SP.lb=b;shk=Math.max(shk,9);SFX.drum();setTimeout(()=>{SFX.drum();shk=Math.max(shk,5)},230)}
   burst(p.x0+25+R(-45,45),WL,3,'#fff',230,270)}}                                                // mặt nước sủi bọt
 const tz=p&&!SP.out?GC.spotZoom:1;let tx=W/2,ty=H/2;
 if(p&&isFinite(p.x0+p.y)){tx=Math.min(W-W/2/tz,Math.max(W/2/tz,p.x0-25));ty=Math.min(H-H/2/tz,Math.max(H/2/tz,p.y-60))}
 if(!isFinite(cam.x+cam.y+cam.z)){cam.z=1;cam.x=W/2;cam.y=H/2}
 const k=Math.min(1,dt*3.2);cam.z+=(tz-cam.z)*k;cam.x+=(tx-cam.x)*k;cam.y+=(ty-cam.y)*k;
 if(p&&SP.out&&cam.z<1.05){SP.p=null;spotCool=T+GC.spotCooldown;if(SP.after&&players.has(SP.after.id))makeVip(SP.after);SP.after=null}}

function spotFx(){const p=SP.p,dim=Math.min(1,Math.max(0,(cam.z-1)/(GC.spotZoom-1)));if(!p||dim<.01)return;
 const sx=W/2+(p.x0-25-cam.x)*cam.z,sy=H/2+(p.y-60-cam.y)*cam.z,fy=H/2+(p.y-cam.y)*cam.z;
 let r=g.createRadialGradient(sx,sy,90*cam.z,sx,sy,1250);r.addColorStop(0,'rgba(0,0,0,0)');r.addColorStop(.3,`rgba(0,0,10,${.4*dim})`);r.addColorStop(1,`rgba(0,0,10,${.88*dim})`);
 g.fillStyle=r;g.fillRect(-60,-60,W+120,H+120);                                                    // vignette
 g.save();g.globalCompositeOperation='lighter';const b=g.createLinearGradient(0,0,0,fy);b.addColorStop(0,'rgba(255,240,170,0)');b.addColorStop(1,`rgba(255,240,170,${.42*dim})`);
 g.fillStyle=b;g.beginPath();g.moveTo(sx-45,0);g.lineTo(sx+45,0);g.lineTo(sx+150*cam.z/1.8,fy);g.lineTo(sx-150*cam.z/1.8,fy);g.closePath();g.fill();   // chùm sáng sân khấu
 g.fillStyle=`rgba(255,235,150,${.3*dim})`;g.beginPath();g.ellipse(sx,fy,140*cam.z/1.8,32,0,0,7);g.fill();g.restore()}

function drawCard(){const c=card;if(!c)return;const age=(c.t0||(c.t0=c.t))-c.t,s0=Math.min(1,age/.3),s=1-Math.pow(1-s0,3),a=Math.min(1,c.t/.4),cx=W/2,cy=H/2+60;
 g.save();g.globalAlpha=a;g.translate(cx,cy);g.scale(s,s);
 let gr=g.createLinearGradient(0,-280,0,280);gr.addColorStop(0,'#3b1a78');gr.addColorStop(1,'#12082e');g.fillStyle=gr;g.strokeStyle='#ffd700';g.lineWidth=10;g.shadowColor='#ffd700';g.shadowBlur=40;
 g.beginPath();g.roundRect(-390,-280,780,560,40);g.fill();g.stroke();g.shadowBlur=0;
 txt(c.title,0,-215,36,'#ffd700');
 avatar({name:c.name,img:c.img},-210,-60,100);txt((c.name||'').slice(0,14),-210,95,34);
 g.fillStyle='#ffffff18';g.beginPath();g.arc(190,-60,115,0,7);g.fill();emo(c.e,190,-60,170);
 txt(c.big,0,200,88,'#7dffb0');txt(c.sub||'',0,250,32,'#fff');
 if(c.rec){g.save();g.translate(250,-250);g.rotate(-.12);const k=1+.06*Math.sin(T*12);g.scale(k,k);g.fillStyle='#e53935';g.beginPath();g.roundRect(-190,-34,380,68,18);g.fill();txt('★ KỶ LỤC MỚI! ★',0,14,40,'#fff');g.restore()}
 g.restore()}

function yacht(){if(![...players.values()].some(p=>p.vip&&T<p.vip))return;g.save();g.translate(0,Math.sin(T*2)*3);
 g.fillStyle='#fff';g.beginPath();g.moveTo(370,676);g.lineTo(710,676);g.lineTo(668,772);g.lineTo(412,772);g.closePath();g.fill();
 g.fillStyle='#1e63c9';g.fillRect(392,724,296,12);g.fillStyle='#ffd700';g.fillRect(366,672,348,9);
 g.fillStyle='#ffd700';g.fillRect(380,560,6,116);g.fillStyle='#e53935';g.beginPath();g.moveTo(386,560);g.lineTo(436,578);g.lineTo(386,596);g.fill();
 txt('👑 VIP',540,764,22,'#d4a000');g.restore()}
