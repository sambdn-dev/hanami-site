const {test}=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');
const React=require('react');const {renderToStaticMarkup}=require('react-dom/server');
const source=fs.readFileSync('src/components/simulator/SimulationProcessing.tsx','utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
const exports_={};vm.runInNewContext(code,{exports:exports_,require(name){if(name.endsWith('.css'))return {__esModule:true,default:new Proxy({},{get:(_,key)=>key})};return require(name);}});
const Panel=exports_.default;
const render=(props={})=>renderToStaticMarkup(React.createElement(Panel,{originalSrc:'/private/original',...props}));
test('processing retains the labelled original and never invents a percentage, ETA or completed comparison',()=>{
 const html=render();assert.match(html,/PHOTO ORIGINALE/);assert.match(html,/Génération en cours/);assert.match(html,/Comparaison à venir/);
 assert.match(html,/<progress/);assert.doesNotMatch(html,/<progress[^>]*\bvalue=|aria-valuenow|secondes restantes|100 %|Simulation terminée/);
});
test('waiting advice can be paused and is not repeatedly announced by screen readers',()=>{
 const html=render({tips:[{title:'Titre conseil',text:'Conseil factuel'}]});
 assert.match(html,/LE SAVIEZ-VOUS/);assert.match(html,/Mettre les conseils en pause/);assert.match(html,/aria-live="off"/);assert.match(html,/Conseil factuel/);
});
test('lost connection reports only the last known stage and does not claim ongoing server progress',()=>{
 const html=render({connectionLost:true});assert.match(html,/Dernier état/);assert.match(html,/peut continuer/);assert.doesNotMatch(html,/Nous attendons le résultat/);
});
test('older API responses without advice stay usable, and advice text remains escaped',()=>{
 assert.doesNotMatch(render(),/LE SAVIEZ-VOUS/);
 const html=render({tips:[{title:'<script>bad</script>',text:'<img src=x onerror=bad>'}]});
 assert.ok(html.includes('&lt;script&gt;'));assert.doesNotMatch(html,/<script>|onerror="bad"/);
});

test('a confirmed provider result moves to saving, without exposing a completed comparison',()=>{
 const html=render({phase:'saving'});assert.match(html,/Génération terminée/);assert.match(html,/Enregistrement du résultat/);assert.match(html,/Le rendu a été reçu/);assert.doesNotMatch(html,/Simulation terminée/);
});
