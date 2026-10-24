const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');const pathUtil=require('node:path');const ts=require('typescript');
const modules={};function load(name){if(modules[name])return modules[name];const output={};const js=ts.transpileModule(fs.readFileSync('src/'+name+'.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;modules[name]=output;vm.runInNewContext(js,{exports:output,URL,require(path){if(path.startsWith('@/'))return load(path.slice(2));if(path.startsWith('.'))return load(pathUtil.posix.normalize(pathUtil.posix.join(pathUtil.posix.dirname(name),path)));return require(path);}});return output;}
const {localServiceSchema,localBusinessSchema,organizationSchema}=load('lib/structured-data');const {SITE_URL}=load('lib/seo');
test('renovation service references the real canonical business and region without fabricated offers or reviews',()=>{
 const service=localServiceSchema({id:'renovation-express',name:'Rénovation express du gazon',description:'Sans retourner le sol',path:'/renovation-express'});
 assert.equal(service['@type'],'Service');assert.equal(service.url,SITE_URL+'/renovation-express');
 assert.equal(service.provider['@id'],localBusinessSchema()['@id']);assert.equal(localBusinessSchema().parentOrganization['@id'],organizationSchema()['@id']);
 assert.equal(service.areaServed.name,'Le Vésinet');assert.equal(service.offers,undefined);assert.equal(service.aggregateRating,undefined);
 assert.ok(JSON.parse(JSON.stringify(service)));
});
