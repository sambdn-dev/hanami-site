// Actual Next Image renderer in development mode: guards the homepage's fill/width 500.
process.env.NODE_ENV='development';
const {test}=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');
const React=require('react');const {renderToStaticMarkup}=require('react-dom/server');const NextImage=require('next/image').default;
const source=fs.readFileSync('src/components/shared/BeforeAfterSlider.tsx','utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
const exports_={};
vm.runInNewContext(code,{exports:exports_,require(name){if(name==='@/hooks/usePortalRoot')return {usePortalRoot:()=>null};return require(name);}});
const Slider=exports_.default;
const crop={x:0,y:30,width:1170,height:1300,sourceWidth:1200,sourceHeight:1600};
test('the real Next renderer rejects custom width on a fill image, reproducing the old failure',()=>{
 assert.throws(()=>renderToStaticMarkup(React.createElement(NextImage,{src:'/images/avant-susan.jpg',alt:'test',fill:true,style:{width:'120cqw'}})),/fill.*style.width/);
});
test('registered crops render through real Next Image without an illegal fill style',()=>{
 const html=renderToStaticMarkup(React.createElement(Slider,{beforeSrc:'/images/avant-susan.jpg',afterSrc:'/images/apres-susan.jpg',beforeCrop:crop,afterCrop:{...crop,x:25,y:300}}));
 assert.ok(html.includes('role="slider"'));assert.ok(html.includes('Ouvrir la comparaison'));
 assert.match(html,/<div[^>]+style="width:max\(/);
 const images=[...html.matchAll(/<img[^>]+>/g)].map(match=>match[0]);
 assert.equal(images.length,2);
 for(const image of images){assert.match(image,/data-nimg="fill"/);assert.doesNotMatch(image,/cqw|cqh/);}
});
test('uncropped and mini comparisons still render, with opt-out for the fullscreen control',()=>{
 const html=renderToStaticMarkup(React.createElement(Slider,{beforeSrc:'/images/avant-susan.jpg',afterSrc:'/images/apres-susan.jpg',allowFullscreen:false}));
 assert.ok(html.includes('role="slider"'));assert.equal(html.includes('Ouvrir la comparaison'),false);
});
