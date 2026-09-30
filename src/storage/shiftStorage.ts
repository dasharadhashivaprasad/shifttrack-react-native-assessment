import AsyncStorage from '@react-native-async-storage/async-storage';
import {Shift} from '../types/models';
import {STORAGE_KEYS} from './keys';
export async function getStoredShifts(): Promise<Shift[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.shifts); return raw ? JSON.parse(raw) as Shift[] : [];
}
export async function saveStoredShifts(shifts: Shift[]) { await AsyncStorage.setItem(STORAGE_KEYS.shifts, JSON.stringify(shifts)); }
