// Technical browser-decoder/canvas fixtures. Not Safari, HEIC codec or visual-quality verification.
const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');const ts=require('typescript');
const code=ts.transpileModule(fs.readFileSync('src/lib/photo-utils.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function setup({width=8064,height=6048,failNative=false,failAll=false}={}){
 const blobs=new Map();let conversions=0,draws=0,revoked=0,sequence=0;
 class Img {naturalWidth=width;naturalHeight=height;async decode(){if(failAll||(failNative&&blobs.get(this.src)?.type==='image/heic'))throw Error('fixture codec failure');}}
 const ctx={fillRect(){},drawImage(){draws++}};
 const out={};vm.runInNewContext(code,{exports:out,TextDecoder,Uint8Array,Image:Img,URL:{createObjectURL(blob){const url='blob:fixture-'+sequence++;blobs.set(url,blob);return url},revokeObjectURL(url){blobs.delete(url);revoked++}},document:{createElement(){return {getContext:()=>ctx,toDataURL:()=> 'data:image/jpeg;base64,YWJj'}}},require(name){assert.equal(name,'heic-to');return {heicTo:async()=>{conversions++;return {type:'image/jpeg'}}}}});
 return {compress:out.compressPhoto,limit:out.MAX_PHOTO_INPUT_BYTES,stats:()=>({conversions,draws,revoked,active:blobs.size})};
}
const photo=(size=24*1024*1024,type='image/jpeg',name='iphone.jpg')=>({size,type,name,slice:()=>({arrayBuffer:async()=>new ArrayBuffer(64)})});
test('a 24 MiB, 48 MP decoder fixture is accepted and scaled before sending',async()=>{
 const s=setup();const prepared=await s.compress(photo());assert.equal(prepared.width,1200);assert.equal(prepared.height,900);assert.equal(s.stats().conversions,0);assert.equal(s.stats().active,0);
});
test('photos above 50 MiB are refused before decoding or allocating a canvas',async()=>{
 const s=setup();await assert.rejects(s.compress(photo(s.limit+1)),/50 Mo/);assert.equal(s.stats().draws,0);assert.equal(s.stats().revoked,0);
});
test('native HEIC support is preferred without loading the converter',async()=>{
 const s=setup();await s.compress(photo(18*1024*1024,'image/heic','iphone.HEIC'));assert.equal(s.stats().conversions,0);assert.equal(s.stats().revoked,1);
});
test('a HEIC decode failure tries the lazy converter once and releases both URLs',async()=>{
 const s=setup({failNative:true});const out=await s.compress(photo(18*1024*1024,'image/heic','iphone.heic'));assert.equal(out.width,1200);assert.equal(s.stats().conversions,1);assert.equal(s.stats().revoked,2);assert.equal(s.stats().active,0);
});
test('excessive pixel count is bounded and failed decoding is understandable',async()=>{
 const s=setup({width:10000,height:10000});await assert.rejects(s.compress(photo()),/64 mégapixels/);assert.equal(s.stats().draws,0);assert.equal(s.stats().active,0);
 const broken=setup({failAll:true});await assert.rejects(broken.compress(photo()),/ne peut pas être lue/);assert.equal(broken.stats().active,0);
});
