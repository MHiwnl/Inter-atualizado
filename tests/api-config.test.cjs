const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const configSource=fs.readFileSync(path.join(__dirname,'../js/core/config.js'),'utf8');
function loadConfig(hostname,origin,apiBaseUrl='',search=''){
  const context={location:{hostname,origin,href:origin+'/',protocol:new URL(origin).protocol,search},window:{TASKGO_CONFIG:{apiBaseUrl}},URL,URLSearchParams};
  vm.runInNewContext(configSource+';globalThis.result={API_BASE_URL,API_ORIGIN,TASKGO_DEMO_MODE};',context);
  return JSON.parse(JSON.stringify(context.result));
}

test('permite API local e modo de demonstração apenas em endereço local',()=>{
  assert.deepEqual(loadConfig('localhost','http://localhost:5500','http://localhost:8080','?demo=1'),{
    API_BASE_URL:'http://localhost:8080',API_ORIGIN:'http://localhost:8080',TASKGO_DEMO_MODE:true
  });
});

test('produção vazia usa API same-origin para proxy /api',()=>{
  assert.deepEqual(loadConfig('taskgo.example','https://taskgo.example','','?demo=1'),{
    API_BASE_URL:'',API_ORIGIN:'https://taskgo.example',TASKGO_DEMO_MODE:false
  });
});

test('produção aceita apenas base HTTPS configurada',()=>{
  assert.deepEqual(loadConfig('taskgo.example','https://taskgo.example','https://api.taskgo.example'),{
    API_BASE_URL:'https://api.taskgo.example',API_ORIGIN:'https://api.taskgo.example',TASKGO_DEMO_MODE:false
  });
  assert.throws(()=>loadConfig('taskgo.example','https://taskgo.example','http://api.taskgo.example'),/HTTPS/);
  assert.throws(()=>loadConfig('taskgo.example','http://taskgo.example'),/HTTPS/);
});

test('arquivos de frontend não têm URLs fixas do túnel nem do backend local',()=>{
  const root=path.join(__dirname,'../js');
  const files=[];
  function visit(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())visit(full);else if(full.endsWith('.js'))files.push(full);}}
  visit(root);
  for(const file of files){const source=fs.readFileSync(file,'utf8');assert.doesNotMatch(source,/ngrok|http:\/\/localhost:8080/i,file);}
});
