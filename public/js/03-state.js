const players=new Map(),queue=[],scores={},parts=[],pops=[];
let energy=0,frenzy=0,shk=0,banner={t:0,s:''},T=0,leader=null;
const slotPos=i=>({x:45+(i%12)*90,y:480+((i/12)|0)*80});
const used=()=>new Set([...players.values()].map(p=>p.slot));
const imgs={};
function img(u){if(!u)return null;let e=imgs[u];if(e)return e.ok?e.i:null;       // học từ village: tải trực tiếp, không gửi Referer
 const i=new Image();e=imgs[u]={i,ok:false,n:0};i.referrerPolicy='no-referrer';i.onload=()=>e.ok=true;
 i.onerror=()=>{if(e.n++===0&&u.startsWith('http')){i.referrerPolicy='';i.src='/avatar?u='+encodeURIComponent(u)}else LOG('Không tải được avatar: '+u.slice(0,80),'warn')};
 i.src=u;return null}
const hue=s=>[...s].reduce((a,c)=>a+c.charCodeAt(0),0)%360;

