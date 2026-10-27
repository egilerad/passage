export const WINDOW=.024;
export function profile(state,voice,u){const gain=voice?(state.pairGain??state.gain):state.gain;if(gain===0)return 0;const frequency=voice?state.b:state.a,phase=state.slow+(voice?state.relative:0);return gain/.12*Math.sin(2*Math.PI*(frequency*WINDOW*u-phase));}
