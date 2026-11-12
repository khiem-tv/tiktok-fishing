let fish=[];
function buildFish(){fish=[];const E=frenzy>0?['🐟','🐠','🐙','🦑','🐬','🦈','🐡']:['🐟','🐠','🐡','🪼','🦀','🐟','🐠'],N=frenzy>0?14:9;
 for(let s=0;s<N;s++){const e=pick(E),y=R(WL+120,H-120),v=R(40,110)*(Math.random()<.5?-1:1),x=R(0,W);
  for(let k=0;k<(frenzy>0?6:5);k++)fish.push({e,x:x+R(-90,90),y:y+R(-50,50),v:v*R(.9,1.1),sz:R(34,64),ph:R(0,6),gold:frenzy>0})}
 [['🤿',''],['🦀','🔪'],['🐢','🕶️'],['🤿',''],['🦀','🔪']].forEach(c=>fish.push({e:c[0],acc:c[1],x:R(0,W),y:R(WL+200,H-150),v:R(35,70)*(Math.random()<.5?-1:1),sz:72,ph:R(0,6)}));
 for(let i=0;i<3;i++)fish.push({e:'💰',x:R(0,W),y:H-R(40,120),v:0,sz:56,ph:0})}
buildFish();

