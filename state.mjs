// Frequencies use the exact exponential smoothing applied to AudioParams.
export class PairState{
 constructor(){this.time=0;this.a=110;this.b=110.25;this.gain=0;this.pairGain=0;this.targetPairGain=0;this.targetA=110;this.targetB=110.25;this.targetGain=0;this.phaseA=0;this.phaseB=0;this.slow=0;this.pair=true;this.journey=null;this.tau=.12;}
 advance(time){if(time<this.time)return this.snapshot();const dt=time-this.time,k=Math.exp(-dt/this.tau);for(const key of ['a','b']){const target=key==='a'?this.targetA:this.targetB,old=this[key],cycles=target*dt+(old-target)*this.tau*(1-k);this[key]=target+(old-target)*k;if(key==='a'){this.phaseA+=cycles;this.slow+=cycles/110*.18;}else this.phaseB+=cycles;}this.gain=this.targetGain+(this.gain-this.targetGain)*k;this.pairGain=this.targetPairGain+(this.pairGain-this.targetPairGain)*k;this.time=time;return this.snapshot();}
 target(v,time){this.advance(time);this.targetA=v.a;this.targetB=v.b??v.a;this.targetGain=v.gain;this.pair=v.b!==null;this.targetPairGain=this.pair?v.gain:0;if(!this.journey||v.enclose!==this.journey.to||v.over!==this.journey.over)this.journey={from:this.amount(),to:v.enclose,over:v.over,start:time};return this.snapshot();}
 amount(){const j=this.journey;if(!j)return 0;const u=j.over===0?1:Math.max(0,Math.min(1,(this.time-j.start)/j.over));return j.from+(j.to-j.from)*(1-Math.cos(u*Math.PI))/2;}
 snapshot(){return {time:this.time,a:this.a,b:this.b,gain:this.gain,pairGain:this.pairGain,pair:this.pair,phaseA:this.phaseA,phaseB:this.phaseB,relative:this.phaseB-this.phaseA,slow:this.slow,enclose:this.amount()};}
}
