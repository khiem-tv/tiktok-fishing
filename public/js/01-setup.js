const GC=Object.assign({maxFishers:36,frenzySeconds:45,frenzyCooldown:90,bigGiftCoins:50,giftKeepSeconds:25,tts:true,ttsLang:'vi-VN',sfxVolume:.5,musicVolume:.35,musicShuffle:true,spotlight:true,spotZoom:1.8,spotCooldown:6,qteSeconds:12,qteStart:35,qteDecay:3.5,qtePush:7,qtePushOwner:12,qteLike:1,fakeFocusChance:.6,eventMin:60,eventMax:90,inkLikes:60,vipSeconds:180,spotMinTier:'rare',musicFadeMs:1500,chatEnergy:.6,likeEnergy:.1},window.GAME_CONFIG||{});
const Q=new URLSearchParams(location.search),TR=Q.has('transparent');
if(TR)document.body.className='t'; if(Q.get('mock')==='0')bar.style.display='none';
let SK=null;const LOG=(m,l='info')=>{if(GC.debug)console.log('[game]',m);if(SK)SK.emit('clientlog',{l,m:String(m).slice(0,200)})};
addEventListener('error',e=>LOG('LỖI JS: '+e.message+' @'+(e.filename||'').split('/').pop()+':'+e.lineno,'error'));addEventListener('unhandledrejection',e=>LOG('LỖI Promise: '+(e.reason&&e.reason.message||e.reason),'error'));
const cv=document.getElementById('c'),g=cv.getContext('2d'),W=1080,H=1920,WL=720,MAX=GC.maxFishers;
const fit=()=>cv.style.transform=`translate(-50%,-50%) scale(${Math.min(innerWidth/W,innerHeight/H)})`;fit();onresize=fit;
const R=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.random()*a.length|0];

