/* =========================================================
   ESTIMATIVA IA
   ========================================================= */
function estimate(serviceId,urgency,size,radius,quantity){
  const service=svc(serviceId),count=serviceId==='cftv'?Math.max(1,Math.min(16,Number(quantity)||1)):1;
  const professionals=S.pros.filter(pro=>pro.service===serviceId);
  if(!DEMO_MODE)return {min:null,max:null,avg:null,unit:service.unit,quantity:count,
    pros:professionals.length,eta:null,confidence:null,
    factors:[['Categoria',service.n],['Estimativa individual','Ainda não fornecida pelo servidor'],['Profissionais cadastrados',String(professionals.length)]]};
  return {min:service.min*count,max:service.max*count,avg:null,unit:service.unit,quantity:count,
    pros:professionals.length,eta:null,confidence:null,
    factors:[['Categoria',service.n],['Referência publicada',money(service.min)+' a '+money(service.max)+' por '+service.unit],
      ['Proposta individual','Ainda não cadastrada'],['Profissionais cadastrados',String(professionals.length)]]};
}

