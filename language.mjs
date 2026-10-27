// Bounded, explicit mathematical language; never executes JavaScript.
export function expression(text,line=1){
 if(text.length>200)throw Error(`Line ${line}: expression too long`);const ts=text.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|[a-z]+|\*\*|[()+\-*/%^]/g)||[];
 if(ts.join('')!==text.replace(/\s/g,''))throw Error(`Line ${line}: invalid expression`);let i=0,depth=0;
 const atom=()=>{if(++depth>24)throw Error('expression too deep');const t=ts[i++];let n;if(t==='('){n=sum();if(ts[i++]!==')')throw Error('missing )');}else if(t==='sin'||t==='cos'||t==='abs'){if(ts[i++]!=='(')throw Error('function needs (...)');n={op:t,a:sum()};if(ts[i++]!==')')throw Error('missing )');}else if(['t','sine','pi'].includes(t))n={op:t};else if(t&&/^[\d.]/.test(t))n={op:'number',value:Number(t)};else throw Error('use numbers, t, sine, pi, sin(), cos(), abs()');depth--;return n;};
 const power=()=>{let n=atom();if(ts[i]==='^'||ts[i]==='**'){i++;n={op:'^',a:n,b:unary()};}return n;};
 const unary=()=>{if(ts[i]==='+'||ts[i]==='-'){const op=ts[i++];return {op:'u'+op,a:unary()};}return power();};
 const product=()=>{let n=unary();while(['*','/','%'].includes(ts[i])){const op=ts[i++];n={op,a:n,b:unary()};}return n;};
 const sum=()=>{let n=product();while(['+','-'].includes(ts[i])){const op=ts[i++];n={op,a:n,b:product()};}return n;};
 try{const tree=sum();if(i!==ts.length)throw Error('unexpected token');return {tree,text,line};}catch(e){throw Error(`Line ${line}: ${e.message}`);}
}
export function evaluate(rule,env={}){
 const walk=n=>{if(n.op==='number')return n.value;if(n.op==='t')return env.t??0;if(n.op==='sine'){if(!Number.isFinite(env.sine))throw Error('sine is only a reference inside pair/gain');return env.sine;}if(n.op==='pi')return Math.PI;const a=walk(n.a);if(n.op==='sin')return Math.sin(a);if(n.op==='cos')return Math.cos(a);if(n.op==='abs')return Math.abs(a);if(n.op==='u-')return -a;if(n.op==='u+')return a;const b=walk(n.b);if((n.op==='/'||n.op==='%')&&b===0)throw Error('division by zero');return n.op==='+'?a+b:n.op==='-'?a-b:n.op==='*'?a*b:n.op==='/'?a/b:n.op==='%'?a%b:a**b;};
 try{const v=walk(rule.tree);if(!Number.isFinite(v))throw Error('non-finite result');return v;}catch(e){throw Error(`Line ${rule.line}: ${e.message}`);}
}
export function compile(source){
 if(source.length>8000)throw Error('Line 1: score too long');const p={sine:expression('110'),pair:expression('sine+1/4'),gain:expression('.12'),enclose:0,over:0},seen=new Set();
 for(const [i,raw] of source.split('\n').entries()){const text=raw.replace(/#.*$/,'').trim();if(!text)continue;const m=/^(sine|pair|gain|enclose)\s+(.+)$/.exec(text);if(!m)throw Error(`Line ${i+1}: use sine, pair, gain, enclose`);const [,key,value]=m;if(seen.has(key))throw Error(`Line ${i+1}: duplicate ${key}`);seen.add(key);
  if(key==='enclose'){const r=/^(.+)\s+over\s+(.+)$/.exec(value);if(!r)throw Error(`Line ${i+1}: enclose amount over seconds`);if(/\b(t|sine)\b/.test(value))throw Error(`Line ${i+1}: enclosure target and duration must be constant`);p.enclose=evaluate(expression(r[1],i+1));p.over=evaluate(expression(r[2],i+1));if(p.enclose<0||p.enclose>1||p.over<0||p.over>600)throw Error(`Line ${i+1}: enclosure 0–1, over 0–600 seconds`);}
  else p[key]=key==='pair'&&value==='off'?null:expression(value,i+1);
 }
 if(!seen.has('sine'))throw Error('Line 1: sine frequency required');valuesAt(p,0);return p;
}
export function valuesAt(p,t){const a=evaluate(p.sine,{t}),b=p.pair?evaluate(p.pair,{t,sine:a}):null,gain=evaluate(p.gain,{t,sine:a});if(a<30||a>2000)throw Error(`Line ${p.sine.line}: sine 30–2000 Hz`);if(b!==null&&(b<30||b>2000))throw Error(`Line ${p.pair.line}: pair 30–2000 Hz`);if(gain<0||gain>.25)throw Error(`Line ${p.gain.line}: gain 0–.25`);return {a,b,gain};}
