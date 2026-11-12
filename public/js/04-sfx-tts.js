let AC,master;
function startAudio(){if(AC){if(AC.state==='suspended')AC.resume();Music.start();return}AC=new AudioContext();master=AC.createGain();master.gain.value=GC.sfxVolume;master.connect(AC.destination);
 const b=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 window.nb=b;const s=AC.createBufferSource(),f=AC.createBiquadFilter(),v=AC.createGain();s.buffer=b;s.loop=true;f.type='lowpass';f.frequency.value=500;v.gain.value=.12;
 const l=AC.createOscillator(),lg=AC.createGain();l.frequency.value=.12;lg.gain.value=.08;l.connect(lg);lg.connect(v.gain);l.start();
 s.connect(f);f.connect(v);v.connect(master);s.start();Music.start();speechSynthesis.getVoices()}
function noise(dur,fq,vol){if(!AC)return;const s=AC.createBufferSource(),f=AC.createBiquadFilter(),v=AC.createGain();s.buffer=nb;f.type='bandpass';f.frequency.value=fq;
 v.gain.setValueAtTime(vol,AC.currentTime);v.gain.exponentialRampToValueAtTime(.001,AC.currentTime+dur);s.connect(f);f.connect(v);v.connect(master);s.start();s.stop(AC.currentTime+dur)}
function tone(fq,dur,type='sine',vol=.2,delay=0){if(!AC)return;const o=AC.createOscillator(),v=AC.createGain(),t=AC.currentTime+delay;o.type=type;o.frequency.value=fq;
 v.gain.setValueAtTime(vol,t);v.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(v);v.connect(master);o.start(t);o.stop(t+dur)}
const SFX={cast:()=>noise(.4,1500,.25),splash:()=>noise(.5,3000,.4),bell:()=>[1568,2093,2637].forEach((f,i)=>tone(f,.6,'sine',.2,i*.12)),
 junk:()=>{tone(300,.2,'sawtooth',.15);tone(200,.3,'sawtooth',.15,.2)},boom:()=>{noise(1,200,.8);tone(60,.8,'sine',.5)},fire:()=>{noise(.3,5000,.3)}};
const sayQ=[];let talking=false;
function say(t,pri){if(!GC.tts)return;if(sayQ.length>6){if(!pri)return;sayQ.shift()}pri?sayQ.unshift(t):sayQ.push(t);next()}
function next(){if(talking||!sayQ.length||!AC)return;talking=true;const u=new SpeechSynthesisUtterance(sayQ.shift());u.lang=GC.ttsLang;u.rate=1.1;
 const v=speechSynthesis.getVoices().find(v=>v.lang.startsWith('vi'));if(v)u.voice=v;
 const done=()=>{if(talking){talking=false;next()}};u.onend=u.onerror=done;setTimeout(done,9000);speechSynthesis.speak(u)}

