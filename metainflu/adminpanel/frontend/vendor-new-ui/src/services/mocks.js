import { vendorApi } from '../services/vendorApi'

export async function fetchProgramsMock() {
  try { return await vendorApi.programs() } catch { return { items:[{ id:1, name:'Perplexity', url:'pplx.ai/abhinav-kk7k', earnings:0 }] } }
}
export async function fetchPayoutsSummaryMock(){
  try { return await vendorApi.payoutsSummary() } catch { return { pending:0, processing:0, processed:0, sent:0, completed:0 } }
}
export async function fetchNotificationsMock(){
  try { return await vendorApi.notifications() } catch { return { items:[ { key:'new_commission', label:'New commission event', enabled:true }, { key:'application_approval', label:'Application approval', enabled:true }, { key:'new_message', label:'New message from program', enabled:true } ] } }
}
