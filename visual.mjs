import {profile,WINDOW} from './geometry.mjs';
export function createVisual(canvas,getState){
 const g=canvas.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let mode='passage',drag=0,last=0;
 const project=(x,y,z,W,H)=>{const perspective=1/(1+z*1.45);return [W*.58+(x+drag*.15)*Math.min(W*.44,H*.54)*perspective,H*.48+(y+z*.12)*Math.min(W*.44,H*.54)*perspective];};
 function draw(ms){requestAnimationFrame(draw);if(reduced&&ms-last<120)return;last=ms;const data=getState(),s=data.state,W=canvas.clientWidth,H=canvas.clientHeight,d=Math.min(2,devicePixelRatio||1);if(canvas.width!==Math.round(W*d)||canvas.height!==Math.round(H*d)){canvas.width=Math.round(W*d);canvas.height=Math.round(H*d);}g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,W,H);
  if(mode==='profile')drawProfile(s,W,H,data);else drawPassage(s,W,H,data);
 }
 function drawPassage(s,W,H,data){
  const gap=.32-.13*s.enclose,amplitude=.18,voices=s.pair||s.pairGain>.0002?[1,0]:[0];
  for(const voice of voices){const side=voice?1:-1;
   // Two large ruled surfaces: all profile displacement comes from oscillator state.
   for(let j=23;j>=0;j--){const z=j/23;g.beginPath();for(let i=0;i<=160;i++){const u=i/160,x=side*(gap+amplitude*profile(s,voice,u)),y=(u-.5)*1.65;const p=project(x,y,z,W,H);i?g.lineTo(...p):g.moveTo(...p);}g.lineWidth=j===0?1.4:.6;g.strokeStyle=j===0?'rgba(0,0,0,.8)':`rgba(0,0,0,${.035+(1-z)*.035})`;g.stroke();}
   // Sparse cross-strands clarify depth without adding independent movement.
   for(let k=0;k<=16;k++){const u=k/16,x=side*(gap+amplitude*profile(s,voice,u)),y=(u-.5)*1.65;g.beginPath();g.moveTo(...project(x,y,0,W,H));g.lineTo(...project(x,y,1,W,H));g.strokeStyle='rgba(0,0,0,.12)';g.lineWidth=.55;g.stroke();}
  }
  const labelY=H*.84;g.font='11px Helvetica';g.fillStyle='#555';g.fillText('A',W*.42,labelY);if(s.pair)g.fillText('B',W*.72,labelY);
  g.strokeStyle='#d5d5d5';g.lineWidth=.6;g.beginPath();g.moveTo(W*.58,H*.84);g.lineTo(W*.58,H*.84-40);g.stroke();
  g.fillStyle='#000';g.beginPath();g.arc(W*.58,H*.84,2.5,0,Math.PI*2);g.fill();
 }
 function drawProfile(s,W,H,data){
  const left=40,right=W-40,y1=H*.3,y2=H*.53,scale=H*.085,voices=s.pair?2:1;g.font='11px Helvetica';g.fillStyle='#555';g.fillText('24 ms window · slowed carrier; relative phase is real time',left,70);
  for(let voice=0;voice<voices;voice++){const base=voice?y2:y1;g.strokeStyle='#ddd';g.lineWidth=.6;g.beginPath();g.moveTo(left,base);g.lineTo(right,base);g.stroke();g.strokeStyle='#000';g.lineWidth=1.1;g.beginPath();for(let i=0;i<=400;i++){const u=i/400,p=[left+u*(right-left),base-profile(s,voice,u)*scale];i?g.lineTo(...p):g.moveTo(...p);}g.stroke();g.fillStyle='#555';g.fillText(voice?'B':'A',left,base-scale-15);}
  if(s.pair){const base=H*.77;g.strokeStyle='#aaa';g.lineWidth=.8;g.beginPath();for(let i=0;i<=400;i++){const u=i/400,y=base-(profile(s,0,u)+profile(s,1,u))*scale*.55;i?g.lineTo(left+u*(right-left),y):g.moveTo(left,y);}g.stroke();g.fillStyle='#555';g.fillText('A + B · source sum',left,base-scale-18);}
 }
 requestAnimationFrame(draw);return {setMode(value){mode=value;},setView(value){drag=value;}};
}
