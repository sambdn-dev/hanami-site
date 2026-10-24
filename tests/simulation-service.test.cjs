// Real BFF route and proxy helpers; the upstream HTTP provider is simulated.
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');
const React=require('react');const {renderToStaticMarkup}=require('react-dom/server');
function compile(path, deps={}, extra={}) {
 const output={};const code=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
 vm.runInNewContext(code,{exports:output,require:name=>name in deps?deps[name]:require(name),...extra});return output;
}
const service=compile('src/components/simulator/service-state.ts');
test('configuration errors never propose page refresh as a recovery',()=>{
 for(const code of ['SIMULATION_CONFIGURATION_REQUIRED','SIMULATION_PREVIEW_ACCESS_REQUIRED','SIMULATION_UNAVAILABLE']) {
  const error=service.simulationServiceError(503,{code,message:'Configuration requise'});assert.equal(error.retryable,false);assert.equal(error.message,'Configuration requise');
 }
 assert.equal(service.simulationServiceError(503,null).retryable,true);
 assert.equal(service.simulationServiceError(403,null).retryable,false);
 assert.equal(service.simulationServiceError(429,null).retryable,true);
});
const css={__esModule:true,default:new Proxy({},{get:(_,key)=>key})};
const Preferences=compile('src/components/simulator/SimulationPreferences.tsx',{'./Simulator.module.css':css}).default;
test('appearance options are immediately visible, labelled, grouped and preserve the selected values',()=>{
 const html=renderToStaticMarkup(React.createElement(Preferences,{finish:'manicured',height:'comfortable',onFinishChange(){},onHeightChange(){}}));
 assert.equal((html.match(/type="radio"/g)||[]).length,5);assert.equal((html.match(/<fieldset/g)||[]).length,2);
 assert.match(html,/name="finish" checked="" value="manicured"/);assert.match(html,/name="height" checked="" value="comfortable"/);
 assert.doesNotMatch(html,/<details|<summary/);assert.match(html,/Les autres éléments du jardin sont à conserver/);
 const busy=renderToStaticMarkup(React.createElement(Preferences,{finish:'natural',height:'source',disabled:true,onFinishChange(){},onHeightChange(){}}));assert.equal((busy.match(/<fieldset disabled=""/g)||[]).length,2);
});

test('the initial screen has one system photo picker without forced camera capture',()=>{
 const Simulator=compile('src/components/simulator/LawnSimulator.tsx',{
  'next/link':{__esModule:true,default:({children,...props})=>React.createElement('a',props,children)},
  './SimulationProcessing':{__esModule:true,default:()=>null},
  './SimulationPreferences':{__esModule:true,default:Preferences},
  '@/components/shared/BeforeAfterSlider':{__esModule:true,default:()=>null},
  '@/lib/photo-utils':{MAX_PHOTO_INPUT_BYTES:50*1024*1024},
  './types':{},'./service-state':service,'./Simulator.module.css':css,
 }).default;
 const html=renderToStaticMarkup(React.createElement(Simulator));
 assert.equal((html.match(/type="file"/g)||[]).length,1);assert.match(html,/Ajouter ma photo/);
 assert.match(html,/accept="image\/\*,.heic,.heif"/);assert.doesNotMatch(html,/capture=|Prendre une photo/);
 assert.match(html,/50 Mo maximum/);
});
function setup({upstream, env={}}={}) {
 const calls=[];const jar=new Map();const proxy=compile('src/lib/gazon-simulation-proxy.ts',{}, {URL,Request,Uint8Array});
 const route=compile('src/app/api/gazon-simulations/[[...path]]/route.ts',{'next/headers':{cookies:async()=>({get:name=>jar.has(name)?{value:jar.get(name)}:undefined,set:(name,value)=>jar.set(name,value)})},resend:{Resend:class {constructor(){throw Error('No email sends in this suite')}}},'@/lib/gazon-simulation-proxy':proxy}, {process:{env:{HANAMI_LAWN_SIMULATOR_ENABLED:'1',HANAMI_SIMULATION_API_ORIGIN:'https://engine.example.test',HANAMI_SIMULATION_WORKER_KEY:'technical-fixture-secret-32-bytes-minimum',...env}},Headers,Response,Request,Buffer,URL,TextDecoder,AbortSignal,fetch:async(url,init)=>{calls.push({url,init});return upstream?.(url,init)||Response.json({jobs:[]})}});
 const request=(path='',init={})=>route[init.method||'GET'](new Request(`https://preview.example.test/api/gazon-simulations${path?'/'+path:''}`,init),{params:Promise.resolve({path:path?path.split('?')[0].split('/'):[]})});
 return {calls,request,jar};
}
test('the actual protected-upstream failure returns an actionable configuration code without retries',async()=>{
 for(const response of [()=>new Response(null,{status:307,headers:{location:'https://vercel.com/login'}}),()=>new Response('<html>Sign in</html>',{status:401,headers:{'content-type':'text/html'}})]) {
  const app=setup({upstream:response});const r=await app.request();const body=await r.json();assert.equal(r.status,503);assert.equal(body.error.code,'SIMULATION_PREVIEW_ACCESS_REQUIRED');assert.match(body.error.message,/Actualiser la page ne suffit pas/);assert.equal(app.calls.length,1);
 }
});
test('missing backend configuration fails before sending any photo',async()=>{
 const app=setup({env:{HANAMI_SIMULATION_WORKER_KEY:''}});const r=await app.request();assert.equal(r.status,503);assert.equal((await r.json()).error.code,'SIMULATION_CONFIGURATION_REQUIRED');assert.equal(app.calls.length,0);
});
const id='550e8400-e29b-41d4-a716-446655440000';
test('session initialization binds later writes; forged binding and cross-origin writes never reach the backend',async()=>{
 const app=setup();const initial=await app.request();const binding=initial.headers.get('x-hanami-simulation-session');assert.match(binding,/^[a-f0-9]{24}$/);
 const before=app.calls.length;
 const bad=await app.request(`${id}/start`,{method:'POST',headers:{origin:'https://preview.example.test','x-hanami-simulation-session':'0'.repeat(24)}});assert.equal(bad.status,409);
 const cross=await app.request(`${id}/start`,{method:'POST',headers:{origin:'https://evil.example','x-hanami-simulation-session':binding}});assert.equal(cross.status,403);assert.equal(app.calls.length,before);
 const valid=await app.request(`${id}/start`,{method:'POST',headers:{origin:'https://preview.example.test','x-hanami-simulation-session':binding}});assert.equal(valid.status,200);assert.equal(app.calls.length,before+1);
 assert.equal(app.calls.at(-1).url,`https://engine.example.test/api/gazon-simulations/${id}/start`);
 assert.equal(app.calls.at(-1).init.redirect,'manual');
});
test('JSON backend failures remain failures and private images are never cacheable',async()=>{
 const app=setup({upstream:()=>Response.json({error:{code:'SIMULATION_UNAVAILABLE',message:'Configuration requise'}},{status:503})});const r=await app.request();assert.equal(r.status,503);assert.equal((await r.json()).error.code,'SIMULATION_UNAVAILABLE');
 const images=setup({upstream:()=>new Response(new Uint8Array([137,80,78,71]),{headers:{'content-type':'image/png'}})});const photo=await images.request(`${id}/image?kind=original`);
 assert.equal(photo.status,200);assert.match(photo.headers.get('cache-control'),/private, no-store/);assert.equal(photo.headers.get('content-type'),'image/png');assert.equal((await photo.arrayBuffer()).byteLength,4);
});
