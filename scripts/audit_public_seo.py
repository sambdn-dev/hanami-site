from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path
import urllib.request,json,re,time,argparse
from datetime import datetime,timezone
args=argparse.ArgumentParser(description='Read-only SEO inventory; no ranking or performance score.');args.add_argument('--base',default='https://www.hanami-gazon.fr');args.add_argument('--output');opts=args.parse_args();base=opts.base.rstrip('/')
paths=['/','/coaching','/renovation-express','/interventions-locales','/pourquoi-hanami','/blog','/mon-chantier','/pro','/pro/studio','/calculatrice']
class Page(HTMLParser):
 def __init__(self):super().__init__();self.inHead=False;self.title=[];self.h1=[];self.description=[];self.canonical=[];self.robots=[];self.types=[];self.h1active=False;self.titleactive=False;self.schema=False;self.schemaText=[];self.badImages=0
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if t=='head':self.inHead=True
  if t=='title' and self.inHead:self.titleactive=True
  if t=='h1':self.h1active=True;self.h1.append('')
  if t=='meta' and a.get('name')=='description':self.description.append(a.get('content'))
  if t=='meta' and a.get('name') in ('robots','googlebot'):self.robots.append(a.get('content'))
  if t=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href'))
  if t=='img' and 'alt' not in a:self.badImages+=1
  if t=='script' and a.get('type')=='application/ld+json':self.schema=True;self.schemaText=[]
 def handle_data(self,d):
  if self.titleactive:self.title.append(d)
  if self.h1active:self.h1[-1]+=d
  if self.schema:self.schemaText.append(d)
 def handle_endtag(self,t):
  if t=='head':self.inHead=False
  if t=='title':self.titleactive=False
  if t=='h1':self.h1active=False
  if t=='script' and self.schema:
   self.schema=False
   try:
    data=json.loads(''.join(self.schemaText));items=data if isinstance(data,list) else data.get('@graph',[data]);self.types.extend(x.get('@type') for x in items)
   except (ValueError,AttributeError):self.types.append('INVALID_JSON')
def audit(path):
 start=time.monotonic();req=urllib.request.Request(base+path,headers={'User-Agent':'Hanami-owned-site-readonly-audit/1.0'})
 try:
  with urllib.request.urlopen(req,timeout=30) as r:
   body=r.read().decode();p=Page();p.feed(body)
   return {'path':path,'status':r.status,'finalUrl':r.url,'title':''.join(p.title),'h1':p.h1,'canonical':p.canonical,'description':p.description,'robots':p.robots,'schemaTypes':p.types,'imagesWithoutAlt':p.badImages,'xRobotsTag':r.headers.get('x-robots-tag'),'fetchSeconds':round(time.monotonic()-start,2)}
 except Exception as e:return {'path':path,'error':str(e)}
with ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(audit,paths))
report={'observedAt':datetime.now(timezone.utc).isoformat(),'scope':'Public read-only HTML fetch; no rankings or browser performance measurement','pages':results}
output=json.dumps(report,ensure_ascii=False,indent=2)+'\n'
if opts.output:Path(opts.output).write_text(output)
else:print(output)
