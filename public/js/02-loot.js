// Tỷ lệ gốc: rác 15% · thường 50% · hiếm 20% · Thủy Quái 15%. Mục thứ 3 = "đồ troll" (có thể kích hoạt Fake Focus)
const LOOT={junk:{kg:[0,0],it:[['🥾','Ủng rách'],['🦆','Vịt cao su khổng lồ',1],['🩳','Quần đùi hoa'],['🚽','Bồn cầu vàng',1]]},
 common:{kg:[1,5],it:[['🐟','Cá chép'],['🐠','Cá hề'],['🐡','Cá thu']]},
 rare:{kg:[10,50],it:[['🐟','Cá ngừ đại dương'],['🗡️','Cá kiếm'],['🐙','Bạch tuộc']]},
 legend:{kg:[100,500],it:[['🦈','Cá mập trắng'],['🐢','Rùa thần'],['💰','Rương kho báu'],['🧜‍♀️','Nàng tiên cá']]}};
function roll(boost,fr){const w={junk:15,common:50,rare:20,legend:15};
 if(boost){w.junk*=.3;w.common*=.4;w.rare*=2;w.legend*=3}      // Cần Câu Lửa: dễ gặp Thủy Quái hơn
 if(fr){w.rare*=3;w.legend*=3}                                  // Bão Cá Vàng: gấp 3 tỷ lệ cá hiếm
 let r=Math.random()*Object.values(w).reduce((a,b)=>a+b,0);
 for(const k in w){if((r-=w[k])<0){const L=LOOT[k],i=pick(L.it);return{tier:k,e:i[0],n:i[1],kg:+R(L.kg[0],L.kg[1]).toFixed(1),fake:!!i[2]}}}
 return{tier:'common',e:'🐟',n:'Cá chép',kg:2,fake:false}}
