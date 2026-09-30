import {LoginResponse, Shift} from '../types/models';
import {getStoredShifts, saveStoredShifts} from '../storage/shiftStorage';

const TEST_EMAIL='staff@shifttrack.test'; const TEST_PASSWORD='Password123';
const wait=(ms:number)=>new Promise<void>(r=>setTimeout(r,ms));
let forceError=false;
export function setMockApiError(value:boolean){forceError=value;}
function maybeError(){if(forceError) throw new Error('Mock API error. Please retry.');}
function sort(shifts:Shift[]){return [...shifts].sort((a,b)=>a.startTime.localeCompare(b.startTime));}
export async function login(email:string,password:string):Promise<LoginResponse>{await wait(450);maybeError();if(email.trim().toLowerCase()!==TEST_EMAIL||password!==TEST_PASSWORD)throw new Error('Invalid email or password.');return {token:'abc123',user:{id:'u1',name:'Alex'}};}
export async function getShifts(weekStart:string):Promise<Shift[]>{await wait(400);maybeError();const all=await getStoredShifts();return sort(all.filter(s=>s.date>=weekStart&&s.date<=addDays(weekStart,6)));}
export async function createShift(input:Omit<Shift,'id'>):Promise<Shift>{await wait(350);maybeError();const all=await getStoredShifts();const shift={...input,id:`s_${Date.now()}_${Math.random().toString(36).slice(2,7)}`};await saveStoredShifts([...all,shift]);return shift;}
export async function startShift(input:{date:string;breakMinutes?:number}):Promise<Shift>{await wait(350);maybeError();const all=await getStoredShifts();if(all.some(s=>!s.endTime))throw new Error('An active shift is already running.');const shift={id:`s_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,date:input.date,startTime:new Date().toISOString(),endTime:null,breakMinutes:input.breakMinutes ?? 0};await saveStoredShifts([...all,shift]);return shift;}
export async function updateShift(id:string,patch:Partial<Shift>):Promise<Shift>{await wait(350);maybeError();const all=await getStoredShifts();const index=all.findIndex(s=>s.id===id);if(index<0)throw new Error('Shift not found.');const updated={...all[index],...patch} as Shift;all[index]=updated;await saveStoredShifts(all);return updated;}
export async function deleteShift(id:string){await wait(300);maybeError();const all=await getStoredShifts();await saveStoredShifts(all.filter(s=>s.id!==id));}
function addDays(date:string,days:number){const d=new Date(`${date}T00:00:00`);d.setDate(d.getDate()+days);return formatDate(d);}
function formatDate(d:Date){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export const MOCK_CREDENTIALS={email:TEST_EMAIL,password:TEST_PASSWORD};
