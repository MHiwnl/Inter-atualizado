const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

function loadStorage(fetchImpl){
  const context={
    fetch:fetchImpl,window:{fetch:fetchImpl,TASKGO_CONFIG:{apiBaseUrl:''}},
    location:{href:'http://taskgo.test/',origin:'http://taskgo.test',hostname:'taskgo.test',protocol:'http:',search:''},
    document:{cookie:''},localStorage:{getItem(){return null;},setItem(){}},
    seed:()=>({session:null,users:[],pros:[],clients:[],orders:[],tx:[],chats:[],notifs:[]}),
    API_BASE_URL:'',API_ORIGIN:'http://taskgo.test',DEMO_MODE:false,S:{orders:[],users:[],pros:[],clients:[],tx:[],chats:[],notifs:[]},
    me:()=>({id:'db_17',email:'ana@example.com'}),URL,URLSearchParams,Headers,Request,
    console,setTimeout,clearTimeout
  };
  const source=fs.readFileSync('js/core/storage.js','utf8');
  vm.runInNewContext(source+'\nglobalThis.taskgoStorageTests={persistirPedido,enviarMensagemPedido};',context);
  return context.taskgoStorageTests;
}

test('pedido não é marcado como persistido quando a API recusa o salvamento',async()=>{
  const {persistirPedido}=loadStorage(async()=>({ok:false,text:async()=>'Pedido inválido'}));
  const pedido={id:'pedido-1',_persisted:false};
  await assert.rejects(()=>persistirPedido(pedido,'ana@example.com'),/Pedido inválido/);
  assert.equal(pedido._persisted,false);
});

test('mensagem enviada não é confirmada no frontend quando a API falha',async()=>{
  const {enviarMensagemPedido}=loadStorage(async()=>({ok:false}));
  await assert.rejects(()=>enviarMensagemPedido('pedido-1','Olá','client-msg-1'),/não foi confirmada pelo servidor/);
});
