import {Shift} from '../types/models';
export function startOfWeek(date=new Date()){const d=new Date(date);const day=d.getDay();const diff=(day+6)%7;d.setDate(d.getDate()-diff);d.setHours(0,0,0,0);return d;}
export function dateKey(d:Date){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function formatDateLabel(date:string){return new Intl.DateTimeFormat(undefined,{weekday:'short',month:'short',day:'numeric'}).format(new Date(`${date}T12:00:00`));}
export function formatTime(iso:string){return new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit'}).format(new Date(iso));}
export function durationMinutes(shift:Shift,now=Date.now()){const start=new Date(shift.startTime).getTime();const end=shift.endTime?new Date(shift.endTime).getTime():now;return Math.max(0,Math.round((end-start)/60000)-shift.breakMinutes);}
export function durationLabel(minutes:number){const h=Math.floor(minutes/60);const m=minutes%60;return h?`${h}h ${m}m`:`${m}m`;}
export function toIso(date:string,time:string){return new Date(`${date}T${time}:00`).toISOString();}
export function todayKey(){return dateKey(new Date());}
