import React, {createContext, useContext, useEffect, useState} from 'react';
import * as Keychain from 'react-native-keychain';
import {User} from '../types/models';
import {STORAGE_KEYS} from './keys';
type AuthContextValue = {token: string|null; user: User|null; loading: boolean; signIn:(token:string,user:User)=>Promise<void>; signOut:()=>Promise<void>};
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export function AuthProvider({children}:{children:React.ReactNode}) {
  const [token,setToken]=useState<string|null>(null); const [user,setUser]=useState<User|null>(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{try{const creds=await Keychain.getGenericPassword({service:STORAGE_KEYS.auth}); if(creds){setToken(creds.password); setUser(JSON.parse(creds.username) as User);}} finally{setLoading(false);}})();},[]);
  const signIn=async(t:string,u:User)=>{await Keychain.setGenericPassword(JSON.stringify(u),t,{service:STORAGE_KEYS.auth,accessible:Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY});setToken(t);setUser(u);};
  const signOut=async()=>{await Keychain.resetGenericPassword({service:STORAGE_KEYS.auth});setToken(null);setUser(null);};
  return <AuthContext.Provider value={{token,user,loading,signIn,signOut}}>{children}</AuthContext.Provider>;
}
export function useAuth(){const ctx=useContext(AuthContext);if(!ctx)throw new Error('useAuth must be inside AuthProvider');return ctx;}
