const H_={chat:u=>{energyAdd(GC.chatEnergy);join(u);tugComment(u);if(norm(u.comment).includes('nemdep'))throwSlip(u)},like:u=>{energyAdd(GC.likeEnergy*(u.count||1));inkWipe(u.count||1);tugLike(u)},
 follow:u=>{join(u);say(`Chào mừng ${u.name} đã follow kênh!`,true)},gift:u=>gift(u,u.coins,u.comment)};
if(typeof io!=='undefined'){const sk=SK=io();const cnt={};for(const e in H_)sk.on(e,d=>{cnt[e]=(cnt[e]||0)+1;try{stat()}catch(x){}try{H_[e](d)}catch(x){LOG(`Lỗi xử lý ${e}: ${x.message}`,'error')}});
 let ts={state:'',msg:''};const ic={connected:'🟢',connecting:'🟡',error:'🔴',mock:'⚪'};
 function stat(){ttstat.textContent=`${ic[ts.state]||'⏳'} ${ts.msg||'...'} | thật: chat ${cnt.chat||0}, tim ${cnt.like||0}, follow ${cnt.follow||0}, quà ${cnt.gift||0}`}
 sk.on('status',s=>{ts=s||ts;stat();if(s)LOG('TikTok: '+s.state+' '+(s.msg||''))});sk.on('disconnect',()=>{ts={state:'error',msg:'Mất kết nối server'};stat()})}
const NAMES=['Lan','Hùng','Minh','Mai','Tuấn','Hoa','Bảo','Vy','Nam','Thảo'];
function mock(t){const n=pick(NAMES),u={id:n+(Math.random()*30|0),name:n,img:''};startAudio();
 ({chat:()=>H_.chat({...u,comment:'cau'}),like:()=>H_.like({...u,count:10}),follow:()=>H_.follow(u),
  small:()=>H_.gift({...u,coins:5,comment:'câu giùm mình nha'}),big:()=>H_.gift({...u,coins:100,comment:'bom luôn'}),frenzy:()=>{energy=100;energyAdd(1)},fake:()=>{const p=join(u)||players.get(u.id);if(p){p.force='fake';p.st='wait';p.t=0;p.wait=.3}},keo:()=>{for(let i=0;i<24;i++)setTimeout(()=>{H_.chat({id:'m'+i%5,name:NAMES[i%5],img:'',comment:'KEO'});H_.like({id:'m'+i%5,name:'x',count:6})},i*220)},slip:()=>H_.gift({...u,coins:1}),boat:()=>evBoat(),storm:()=>evStorm(),ink:()=>evInk(),spot:()=>{const p=join(u)||players.get(u.id);if(p){p.force=1;p.st='wait';p.t=0;p.wait=.3}}})[t]()}
