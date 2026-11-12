function txt(s,x,y,sz,c='#fff',al='center'){g.font=`bold ${sz}px sans-serif`;g.textAlign=al;g.lineWidth=sz/5;g.strokeStyle='#0008';g.strokeText(s,x,y);g.fillStyle=c;g.fillText(s,x,y)}
function emo(e,x,y,sz,flip){const im=Gfx.sprite(e);if(im){g.save();g.translate(x,y);if(flip)g.scale(-1,1);g.drawImage(im,-sz/2,-sz/2,sz,sz);g.restore();return}g.save();g.translate(x,y);if(flip)g.scale(-1,1);g.font=sz+'px serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff';g.fillText(e,0,0);g.restore()}
function avatar(p,x,y,r){g.save();g.beginPath();g.arc(x,y,r,0,7);g.clip();const i=img(p.img);
 if(i)g.drawImage(i,x-r,y-r,r*2,r*2);else{g.fillStyle=`hsl(${hue(p.name||'?')},70%,55%)`;g.fillRect(x-r,y-r,r*2,r*2);txt((p.name||'?')[0].toUpperCase(),x,y+r/3,r*1.1)}
 g.restore();g.beginPath();g.arc(x,y,r,0,7);g.lineWidth=3;g.strokeStyle='#fff';g.stroke()}
function bg(){let s=g.createLinearGradient(0,0,0,WL);s.addColorStop(0,'#5cc8ff');s.addColorStop(1,'#d9f5ff');g.fillStyle=s;g.fillRect(0,0,W,WL);
 g.fillStyle='#fff6a8';g.beginPath();g.arc(900,160,70,0,7);g.fill();
 for(let i=0;i<4;i++){const x=(T*12+i*330)%1400-160,y=120+i*70;g.fillStyle='#ffffffcc';[0,45,90].forEach(o=>{g.beginPath();g.arc(x+o,y,38,0,7);g.fill()})}
 g.fillStyle='#f1d28a';g.beginPath();g.ellipse(120,445,220,60,0,0,7);g.fill();emo('🌴',70,400,110);emo('🏝️',200,430,60);
 s=g.createLinearGradient(0,WL,0,H);s.addColorStop(0,'#27a9e8');s.addColorStop(.5,'#0a6fb5');s.addColorStop(1,'#04294f');g.fillStyle=s;g.fillRect(0,WL,W,H-WL);
 if(frenzy>0){g.fillStyle=`rgba(255,200,0,${.12+.06*Math.sin(T*6)})`;g.fillRect(0,WL,W,H-WL)}
 g.fillStyle='#0a6fb540';for(let k=0;k<5;k++){g.save();g.translate(180+k*180,WL);g.rotate(.15);g.fillRect(0,0,40,1300);g.restore()}}
function dock(){g.fillStyle='#8a5a2b';g.fillRect(0,440,W,262);g.fillStyle='#a8743c';for(let y=440;y<700;y+=26)g.fillRect(0,y,W,3);
 g.fillStyle='#5b3a1a';g.fillRect(0,698,W,12);for(let x=30;x<W;x+=180)g.fillRect(x,700,16,90)}
function wave(){g.fillStyle='#4fc3f7aa';g.beginPath();g.moveTo(0,WL+30);for(let x=0;x<=W;x+=20)g.lineTo(x,WL+Math.sin(x/55+T*2)*9);g.lineTo(W,WL+30);g.fill()}
function drawPlayer(p){const x=p.x0-25,y=p.y,bob=(p.st==='bite'||p.st==='epic')?Math.sin(T*40)*8:Math.sin(T*3+p.slot)*3;
 Gfx.body(g,p,x,y);avatar(p,x,y-70,24);Gfx.hat(g,p,x,y);
 txt((p.name||'').slice(0,12),x,y-104,15);
 const tipX=x+30,tipY=y-48,bend=p.st==='epic'?32+Math.sin(T*35)*5:0,tx=tipX+25+bend*.5,ty=tipY-30+bend;let bx=p.x0+25,by=WL+22+bob;
 if(p.st==='cast'){const k=p.t/.8;bx=tipX+(bx-tipX)*k;by=tipY+(by-tipY)*k-Math.sin(k*3.14)*120}
 if(p.st==='reel'||p.st==='show'){const k=p.st==='show'?1:p.t/.8;bx=bx+(tipX-bx)*k;by=by+(tipY-80-by)*k}
 g.strokeStyle='#5b3a1a';g.lineWidth=5;g.beginPath();g.moveTo(x+10,y-30);g.quadraticCurveTo(x+32+bend*.3,y-54+bend*.9,tx,ty);g.stroke();
 if(p.st==='fall'){bx=tx;by=ty+30}   // dây đứt: chỉ còn đoạn lủng lẳng
 g.strokeStyle='#fffc';g.lineWidth=1.5;g.beginPath();g.moveTo(tx,ty);g.quadraticCurveTo((tx+bx)/2,Math.min(by,ty)+30,bx,by);g.stroke();
 if(p.st!=='show'){g.fillStyle=p.boost>0?'#ff7a18':'#f33';g.beginPath();g.arc(bx,by,7,0,7);g.fill()}
 if(p.st==='bite'){txt('❗',x,y-135,34);burst(bx,WL,1,'#fff',90,150)}
 if(p.boost>0)emo('🔥',x+30,y-100,26);
 if(p.st==='epic'&&SP.p===p)txt('‼️ CÁ KHỔNG LỒ ‼️',Math.max(150,Math.min(W-150,x)),y-140,24,'#ff5252');
 if(p.vip&&T<p.vip){const gl=g.createRadialGradient(x,y-50,10,x,y-50,100);gl.addColorStop(0,`rgba(255,215,0,${.55+.15*Math.sin(T*4)})`);gl.addColorStop(1,'rgba(255,215,0,0)');g.fillStyle=gl;g.fillRect(x-100,y-150,200,200);emo('👑',x,y-128+Math.sin(T*3)*3,36)}
 if(p.st==='show'&&p.loot){const L=p.loot,k=Math.min(1,p.t*4);if(p.sp&&p.t<1.2){const u=p.t/1.2;emo(L.e,p.x0+25+(x-p.x0-25)*u,WL+(y-165-WL)*u-Math.sin(u*3.14)*300,110+50*Math.sin(u*3.14))}else emo(L.e,x,y-165-k*20,62+(L.tier==='legend'?30:0));
  if(L.tier==='junk')emo(pick(['😭','🤣']),x+28,y-100,28);
  txt(L.tier==='junk'?L.n:`${L.n} ${Math.round(L.kg)}kg`,x,y-205,18,L.tier==='legend'?'#ffd700':'#fff')}}
function hud(){const top=Object.values(scores).sort((a,b)=>b.kg-a.kg).slice(0,3);
 g.fillStyle='#000a';g.beginPath();g.roundRect(30,30,520,185,24);g.fill();txt('🏆 CẦN THỦ VĨ ĐẠI NHẤT',60,68,26,'#ffd700','left');
 top.forEach((s,i)=>{txt(['🥇','🥈','🥉'][i]+' '+s.name.slice(0,14),60,112+i*40,26,'#fff','left');txt(Math.round(s.kg)+' kg',530,112+i*40,26,'#7dffb0','right')});
 g.fillStyle='#0008';g.beginPath();g.roundRect(30,235,1020,40,20);g.fill();
 g.fillStyle=frenzy>0?'#ffd700':'#ff4d8d';g.beginPath();g.roundRect(34,239,Math.max(10,992*(frenzy>0?frenzy/GC.frenzySeconds:energy/100)),32,16);g.fill();
 txt(frenzy>0?`🌟 BÃO CÁ VÀNG ${Math.ceil(frenzy)}s`:`⚡ Năng lượng ${Math.floor(energy)}% (tim + bình luận)`,540,264,22);
 if(banner.t>0)txt(banner.s,540,360,54,'#ffd700');
 if(queue.length)txt(`⏳ ${queue.length} người đang chờ`,1040,310,20,'#fff','right')}
function draw(){g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,W,H);if(shk>0)g.translate(R(-shk,shk),R(-shk,shk));
 g.save();g.translate(W/2,H/2);g.scale(cam.z,cam.z);g.translate(-cam.x,-cam.y);if(!TR)bg();
 fish.forEach(f=>{const y=f.y+Math.sin(T*2+f.ph)*10;if(f.gold){g.fillStyle='rgba(255,215,0,.28)';g.beginPath();g.arc(f.x,y,f.sz*.62,0,7);g.fill()}emo(f.e,f.x,y,f.sz,f.v>0);if(f.acc){const d=f.v>0?1:-1,k=f.acc==='🔪';emo(f.acc,f.x+d*f.sz*(k?.45:.28),y+f.sz*(k?.05:-.08),f.sz*.5,f.v>0)}});
 pops.forEach(p=>{if(p.d<=0){emo(p.e,p.x,p.y,90);txt(p.kg+'kg',p.x,p.y-60,24,'#ffd700')}});
 if(!TR){wave();dock();yacht()}
 [...players.values()].sort((a,b)=>a.slot-b.slot).forEach(drawP);
 parts.forEach(q=>{g.globalAlpha=Math.max(0,q.l);g.fillStyle=q.c;g.beginPath();g.arc(q.x,q.y,q.r,0,7);g.fill()});g.globalAlpha=1;drawWorldFx();g.restore();spotFx();hud();drawQTE();drawCard();drawScreenFx();if(flash>0){g.fillStyle=`rgba(255,255,255,${flash*.85})`;g.fillRect(-60,-60,W+120,H+120)}}


