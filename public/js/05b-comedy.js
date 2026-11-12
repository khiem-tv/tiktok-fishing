/* ===== GIẰNG CO (QTE) · SỰ KIỆN HÀI HƯỚC · NÉM DÉP · FAKE FOCUS ===== */
const floats=[],slips=[];let ink=null,boat=null,storm=null,slipCool=0,nextEv=0;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').toLowerCase().replace(/[^a-z0-9]/g,'');
SFX.fart=()=>{noise(.25,300,.4);if(!AC)return;const o=AC.createOscillator(),v=AC.createGain(),t=AC.currentTime;o.type='sawtooth';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(40,t+.7);
 v.gain.setValueAtTime(.35,t);v.gain.exponentialRampToValueAtTime(.001,t+.75);o.connect(v);v.connect(master);o.start(t);o.stop(t+.8)};
SFX.zap=()=>{noise(.5,4000,.7);tone(900,.3,'sawtooth',.2)};SFX.splat=()=>noise(.25,800,.5);
const inQte=()=>SP.k==='catch'&&SP.p&&SP.p.st==='epic'?SP.p:null;
const els=()=>[...players.values()].filter(p=>!p.vip&&!p.sp&&p.st!=='epic'&&p.st!=='fall'&&!(p.zap>T)&&p.x0);

/* --- Tug-of-War: bình luận / tim đẩy thanh lực lên, quà = Giật Điện --- */
function tugPush(v){const p=inQte();if(!p)return;p.tn=Math.min(100,(p.tn||0)+v);if(p.tn>=100)p.win=1}   // chạm 100% = thắng ngay
function tugComment(u){const p=inQte();if(!p)return;tugPush((u.id===p.id?GC.qtePushOwner:GC.qtePush)*(norm(u.comment).includes('keo')?1.5:1));burst(p.x0+25+R(-30,30),WL,2,'#7dff6b',200,200)}
function tugLike(u){const p=inQte();if(p)tugPush(GC.qteLike*(u.count||1)*(u.id===p.id?1.5:1))}
function zapWin(p){p.win=1;flash=1;shk=32;SFX.zap();banner={t:3,s:'⚡ GIẬT ĐIỆN · CẦN THẦN! ⚡'};burst(p.x0+25,WL-100,70,'#7ad7ff',520,380);LOG(`${p.name} tặng quà → Giật Điện`);sayNow(`Cần thần giật điện! ${p.name} kéo thẳng cá lên luôn!`)}
function tugFail(p){const L=p.pre||{e:'🐟',n:'cá lớn'};p.st='fall';p.t=0;p.failed=1;p.loot=null;p.pre=null;shk=Math.max(shk,18);SFX.splash();SFX.junk();burst(p.x0+25,WL,70,'#fff',500,420);
 floats.push({s:'✂️ ĐỨT DÂY!',x:p.x0-25,y:p.y-150,vx:0,vy:-30,t:2.4,sz:34,col:'#ff5252'},{e:L.e,x:p.x0+25,y:WL,vx:260,vy:170,t:2.4,sz:90});
 LOG(`${p.name} để sổng ${L.n}`);sayNow(pick([`Ôi không! Đứt dây rồi! ${p.name} để sổng ${L.n} mất rồi, tiếc quá trời!`,`${p.name} ngã ngửa luôn! ${L.n} chạy mất, khóc thét!`]))}
function revealFake(p,L){p.fake=1;flash=.7;shk=Math.max(shk,14);SFX.fart();burst(p.x0+25,WL,40,'#c9a227',380,300);
 card={t:4,title:'🤡 CÚ LỪA TIÊU ĐIỂM! 🤡',name:p.name,img:p.img,e:L.e,big:'PHÙÙÙ~ 💨',sub:L.n,rec:false};LOG(`${p.name} dính cú lừa: ${L.n}`);
 sayNow(pick([`Ha ha ha! ${p.name} giằng co hùng hục mà chỉ được ${L.n}!`,`Tưởng thủy quái, ai dè ${L.n}! ${p.name} ơi, xì hơi luôn rồi`]))}
function drawQTE(){const p=inQte();if(!p)return;const left=Math.max(0,GC.qteSeconds-p.t),tn=p.tn||0,y=1560,w=860,x=(W-w)/2;
 txt(`⏱ ${Math.ceil(left)}s`,W/2,y-60,72,left<4?'#ff5252':'#fff');g.fillStyle='#000a';g.beginPath();g.roundRect(x,y,w,64,32);g.fill();
 g.fillStyle=tn>66?'#7dff6b':tn>33?'#ffd54a':'#ff5252';g.beginPath();g.roundRect(x+6,y+6,Math.max(20,(w-12)*tn/100),52,26);g.fill();
 txt(`LỰC KÉO ${Math.floor(tn)}%`,W/2,y+46,34);txt(`SPAM "KEO" + THẢ TIM giúp ${(p.name||'').slice(0,12)}!  🎁 Quà = GIẬT ĐIỆN`,W/2,y+120,28,'#ffd700')}

/* --- Ném dép / bóng nước vào Top 1 (comment "nemdep" hoặc quà 1 xu) --- */
function throwSlip(by){if(T<slipCool)return;const lp=players.get(leader);if(!lp||lp.st==='epic'||lp.stun>T||!lp.x0)return;slipCool=T+1.5;
 slips.push({e:pick(['🩴','🎈']),x:R(60,1020),y:H+40,sx:0,sy:0,t:0,p:lp});LOG(`${by.name} ném dép vào ${lp.name}`);say(`${by.name} ném dép vào đầu ${lp.name}!`)}

/* --- Sự kiện ngoại cảnh --- */
function evBoat(){const l=els().filter(p=>p.st==='wait'||p.st==='bite'||p.st==='cast'),t=pick(l.length?l:els());if(!t)return;boat={x:-160,t,cut:false};banner={t:3,s:'🚤 CA-NÔ PHÓNG QUA!'};SFX.splash();say('Cẩn thận! Ca nô phóng qua rồi!',true)}
function evStorm(){const t=pick(els());if(!t)return;storm={x:-200,t,tt:0,hit:0};banner={t:3,s:'⛈️ MÂY ĐEN ĐÁNH SÉT!'};say('Mây đen kéo tới! Ai đó sắp bị sét đánh rồi!',true)}
function evInk(){ink={t:25,lvl:1,blobs:Array.from({length:12},()=>({x:R(60,1020),y:R(200,1700),r:R(110,260)}))};banner={t:3,s:'🐙 BẠCH TUỘC PHUN MỰC! THẢ TIM ĐỂ LAU!'};SFX.splat();say('Bạch tuộc phun mực đen kín màn hình! Mọi người thả tim để lau sạch nhanh lên!',true)}
function inkWipe(n){if(!ink)return;ink.lvl-=n/GC.inkLikes;if(ink.lvl<=0){ink=null;say('Sạch bóng rồi! Cảm ơn mọi người đã thả tim!')}}

function comedyUpdate(dt){
 if(!nextEv)nextEv=T+R(GC.eventMin,GC.eventMax);
 if(T>=nextEv&&players.size>2&&!SP.p&&!boat&&!storm&&!ink){nextEv=T+R(GC.eventMin,GC.eventMax);pick([evBoat,evStorm,evInk])()}
 for(let i=floats.length;i--;){const f=floats[i];f.x+=(f.vx||0)*dt;f.y+=(f.vy||0)*dt;if((f.t-=dt)<=0)floats.splice(i,1)}
 if(boat){boat.x+=1100*dt;burst(boat.x,WL+45,2,'#fff',160,160);const p=boat.t;
  if(!boat.cut&&boat.x>=p.x0+25&&players.has(p.id)){boat.cut=true;if(p.st!=='epic'&&!p.sp){p.st='cast';p.t=0;p.pre=null;p.wait=R(2,4);floats.push({s:'✂️ Đứt dây!',x:p.x0-25,y:p.y-130,vx:0,vy:-40,t:1.8,sz:30,col:'#ff5252'});say(`Ca nô cắt đứt dây câu của ${p.name}!`)}}
  if(boat.x>W+200)boat=null}
 if(storm){storm.tt+=dt;storm.x+=((storm.t.x0-25)-storm.x)*Math.min(1,dt*2.5);
  if(!storm.hit&&storm.tt>1.6){storm.hit=T;flash=.9;shk=Math.max(shk,20);SFX.zap();const p=storm.t;
   if(players.has(p.id)&&p.st!=='epic'&&!p.sp){p.zap=T+3;floats.push({s:'⚡ CHÁY XÉM!',x:p.x0-25,y:p.y-130,vx:0,vy:-30,t:2.5,sz:30,col:'#ffd54a'});say(`${p.name} bị sét đánh cháy xém!`)}}
  if(storm.hit&&T-storm.hit>1.6)storm=null}
 if(ink&&(ink.t-=dt)<=0)ink=null;
 for(let i=slips.length;i--;){const s=slips[i];if(!s.sx){s.sx=s.x;s.sy=s.y}s.t+=dt/.7;const tx=s.p.x0-25,ty=s.p.y-70,k=Math.min(1,s.t);s.x=s.sx+(tx-s.sx)*k;s.y=s.sy+(ty-s.sy)*k-Math.sin(k*3.14)*220;
  if(s.t>=1){if(players.has(s.p.id)&&s.p.st!=='epic'){s.p.stun=T+2;floats.push({s:'💫 Ối!',x:tx,y:ty-60,vx:0,vy:-30,t:1.6,sz:30,col:'#fff'})}burst(tx,ty,25,'#fff',260,200);SFX.splat();slips.splice(i,1)}}}

function drawP(p){const x=p.x0-25,y=p.y;g.save();
 if(p.st==='fall'){g.translate(x,y);g.rotate((x<300?1.5:-1.5)*Math.min(1,p.t*5));g.translate(-x,-y)}else if(p.stun>T){g.translate(x,y);g.rotate(Math.sin(T*25)*.12);g.translate(-x,-y)}
 drawPlayer(p);
 if(p.zap>T){g.fillStyle='#111c';g.fillRect(x-17,y-46,34,46);g.fillStyle='#222';g.beginPath();g.arc(x,y-70,27,0,7);g.fill();emo(Math.floor(T*8)%2?'💀':'🔥',x,y-70,44)}
 if(p.stun>T)emo('💫',x,y-100,40);if(p.st==='fall')emo('😵',x,y-70,40);g.restore()}
function drawWorldFx(){if(boat)emo('🚤',boat.x,WL+55,130,true);
 if(storm){emo('⛈️',storm.x,330,190);if(storm.hit&&T-storm.hit<.35){const tx=storm.t.x0-25,ty=storm.t.y-80;g.strokeStyle='#fff';g.lineWidth=10;g.shadowColor='#7ad7ff';g.shadowBlur=30;g.beginPath();g.moveTo(storm.x,400);
  for(let i=1;i<6;i++)g.lineTo(storm.x+(tx-storm.x)*i/6+R(-30,30),400+(ty-400)*i/6);g.lineTo(tx,ty);g.stroke();g.shadowBlur=0}}
 slips.forEach(s=>emo(s.e,s.x,s.y,70));floats.forEach(f=>f.e?emo(f.e,f.x,f.y,f.sz):txt(f.s,f.x,f.y,f.sz,f.col||'#fff'))}
function drawScreenFx(){if(!ink)return;g.save();g.globalAlpha=Math.min(1,ink.lvl)*.93;g.fillStyle='#120a24';ink.blobs.forEach(b=>{g.beginPath();g.arc(b.x,b.y,b.r,0,7);g.fill()});g.restore();
 txt(`🫧 Thả tim để lau mực: còn ${Math.ceil(ink.lvl*100)}%`,W/2,H-110,36)}
