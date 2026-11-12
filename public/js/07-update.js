function update(dt,rdt=dt){T+=rdt;spotUpdate(dt);comedyUpdate(dt);Music.setMode(frenzy>0||(SP.p&&SP.p.st==='epic')?'frenzy':'calm');shk=Math.max(0,shk-dt*40);
 if(frenzy>0){frenzy-=rdt;if(frenzy<=0){frenzy=0;buildFish();frenzyCool=T+GC.frenzyCooldown;LOG('Bão Cá Vàng KẾT THÚC')}}
 banner.t-=dt;fish.forEach(f=>{f.x+=f.v*dt;if(f.x>W+80)f.x=-80;if(f.x<-80)f.x=W+80});
 for(const p of players.values()){const s=p.vip?vipPos(p.vi):slotPos(p.slot);if(p.cx===undefined){p.cx=s.x;p.cy=s.y}const mk=Math.min(1,dt*2.5);p.cx+=(s.x-p.cx)*mk;p.cy+=(s.y-p.cy)*mk;p.x0=p.cx+55;p.y=p.cy;p.x=p.cx;p.t+=dt;if(p.stun>T||p.zap>T)p.t-=dt;if(p.st==='epic'){if(!SP.p)spotReq(p,'catch');if(SP.p!==p){p.t=0;continue}if(p.tn>=100||p.win){p.win=0;p.t=0;p.st='show';p.sp=1;onCatch(p);reveal(p);continue}}
  const lim={cast:.8,wait:p.wait,bite:.9,reel:.8,show:p.sp?4.2:2.6,epic:GC.qteSeconds,fall:2.6}[p.st];
  if(p.t>=lim){p.t=0;
   if(p.st==='cast'){p.st='wait';p.wait=p.boost>0?R(1.2,2.5):R(2,5);SFX.splash();burst(p.x0,WL,10,'#fff',150,120)}
   else if(p.st==='wait'){p.st='bite';SFX.splash()}
   else if(p.st==='bite'){const f=p.force;p.force=0;const q=p.pre=f==='fake'?{tier:'junk',e:'🚽',n:'Bồn cầu vàng',kg:0,fake:true}:f?{tier:'legend',e:'🦈',n:'Cá mập trắng',kg:+R(100,500).toFixed(1),fake:false}:roll(p.boost>0,frenzy>0);
    q.focus=f==='fake'||q.tier==='legend'||(q.fake&&Math.random()<GC.fakeFocusChance);p.st=(GC.spotlight&&q.focus&&(q.tier==='legend'||(!SP.p&&T>=spotCool)))?'epic':'reel'}
   else if(p.st==='reel'){p.st='show';onCatch(p)}else if(p.st==='epic'){tugFail(p)}
   else{p.loot=null;if(p.sp){p.sp=0;spotEnd(p)}if(p.boost>0||T<p.keep){p.st='cast';p.wait=R(2,4);SFX.cast()}else{leave(p);break}}}}
 for(const q of parts){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=400*dt;q.l-=dt}for(let i=parts.length;i--;)if(parts[i].l<=0)parts.splice(i,1);
 for(let i=pops.length;i--;){const p=pops[i];if(p.d>0){p.d-=dt;continue}p.y-=(p.y-WL)*dt*1.2;p.l-=dt;if(p.l<=0)pops.splice(i,1)}}

