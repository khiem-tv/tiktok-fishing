function burst(x,y,n,c,sp=300,up=0){for(let i=0;i<n;i++){const a=R(0,6.28),s=R(30,sp);parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-up,l:R(.6,1.4),c,r:R(2,6)})}}
function join(u){u.id=u.id||u.name;if(!u.id){LOG('Bỏ qua sự kiện không có id/tên','warn');return null}if(players.has(u.id))return null;
 if(players.size>=MAX){if(queue.length<50&&!queue.find(q=>q.id===u.id))queue.push(u);return null}
 const f=[...Array(MAX).keys()].find(i=>!used().has(i)),p={...u,slot:f,st:'cast',t:0,wait:R(2,5),boost:0,keep:0,loot:null};
 const sp0=slotPos(f);Object.assign(p,{cx:sp0.x,cy:sp0.y,x:sp0.x,x0:sp0.x+55,y:sp0.y});   // có toạ độ ngay từ đầu (camera cần)
 players.set(u.id,p);SFX.cast();return p}
function leave(p){players.delete(p.id);const q=queue.shift();if(q)join(q)}
function addScore(p,kg){const s=scores[p.id]||(scores[p.id]={name:p.name,img:p.img,kg:0,best:0});
 const v=kg*(frenzy>0?2:1);s.kg=+(s.kg+v).toFixed(1);s.best=Math.max(s.best,kg);
 const top=Object.entries(scores).sort((a,b)=>b[1].kg-a[1].kg)[0][0];
 const ch=!!(leader&&top!==leader&&top===p.id);if(ch){LOG(`${p.name} phá kỷ lục, lên top 1`);fireworks();shk=25;say(`${p.name} đã phá kỷ lục, vươn lên top một!`,true)}leader=top;return ch}
function fireworks(){SFX.fire();for(let k=0;k<6;k++)setTimeout(()=>burst(R(150,930),R(150,500),60,`hsl(${R(0,360)},100%,60%)`,380),k*250)}
function onCatch(p){const L=p.loot=p.pre||roll(p.boost>0,frenzy>0);p.pre=null;if(p.boost>0)p.boost--;const rec=addScore(p,L.kg)||(L.tier!=='junk'&&roomBest>0&&L.kg>roomBest);roomBest=Math.max(roomBest,L.kg);p.rec=rec;if(L.tier==='rare'||L.tier==='legend')LOG(`${p.name} câu ${L.n} ${L.kg}kg [${L.tier}]`);burst(p.x0,WL,25,'#fff',260,200);SFX.splash();
 if(L.tier==='junk'){SFX.junk();say(pick([`Haha, ${p.name} câu trúng ${L.n} rồi`,`${p.name} ơi, ${L.n} này đem đi tái chế nhé`]))}
 else if(L.tier==='legend'){SFX.bell();shk=18;burst(p.x0,WL-40,50,'#ffd700',400);say(`Chúc mừng ${p.name} câu được ${L.n} nặng ${Math.round(L.kg)} ký!`,true)}
 else if(L.tier==='rare'){SFX.bell();flash=Math.max(flash,.3);burst(p.x0+25,WL-60,45,'#ffd700',380,320)}}
function gift(u,coins,comment){LOG(`quà ${u.name}: ${coins} xu`);
 const q=inQte(),own=q&&u.id===q.id;if(q){if(own)zapWin(q);else tugPush(35)}                       // đang giằng co: quà chủ cần = Giật Điện, người khác = +35 lực
 if(coins===1&&!own){throwSlip(u);return}                                                          // quà 1 xu = ném dép Top 1
 const p=join(u)||players.get(u.id);if(!p)return;p.keep=T+GC.giftKeepSeconds;
 if(coins>GC.bigGiftCoins){bomb(p,coins);spotGift(p,coins);say(`${u.name} thả lưới lớn, cá khổng lồ nổi lên khắp biển!`+(comment?' '+comment:''),true)}
 else{p.boost=3;if(p.st!=='epic'&&p.st!=='fall'&&!p.sp){p.st='cast';p.t=0;p.wait=1.5}burst(p.x0,p.y-60,30,'#ff7a18',250);say(`Cảm ơn ${u.name} đã tặng quà.`+(comment?' '+comment:''),true)}}
function bomb(p,coins){LOG(`${p.name} thả lưới lớn (${coins} xu)`);shk=35;SFX.boom();banner={t:4,s:`💣 ${p.name} THẢ LƯỚI LỚN!`};
 for(let i=0;i<90;i++)parts.push({x:R(100,980),y:R(1200,1850),vx:R(-40,40),vy:R(-500,-150),l:R(1,2.2),c:'rgba(220,245,255,.8)',r:R(4,12)});
 let sum=0;for(let i=0;i<8;i++){const L=pick(LOOT.legend.it),kg=+R(100,300).toFixed(0);sum+=kg;
  pops.push({e:L[0],x:R(120,960),y:R(1300,1800),l:3.2,d:i*.15,kg})}addScore(p,sum)}
let frenzyCool=0;
function energyAdd(v){if(frenzy>0||T<frenzyCool)return;energy=Math.min(100,energy+v);if(energy>=100)startFrenzy()}
function startFrenzy(){LOG('Bão Cá Vàng BẮT ĐẦU');frenzy=GC.frenzySeconds;energy=0;banner={t:4,s:'🌟 BÃO CÁ VÀNG! x2 ĐIỂM 🌟'};say('Bão cá vàng đã tới! Cá hiếm đầy biển, điểm nhân đôi!',true);shk=20;SFX.bell();buildFish()}

