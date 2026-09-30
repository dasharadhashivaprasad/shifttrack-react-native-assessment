import React from 'react';
import {ActivityIndicator,View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {useAuth} from '../storage/AuthContext';
import {LoginScreen} from '../screens/LoginScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {CreateShiftScreen} from '../screens/CreateShiftScreen';
import {ActiveShiftScreen} from '../screens/ActiveShiftScreen';
import {colors} from '../theme/colors';
const Stack=createNativeStackNavigator<RootStackParamList>();
export function RootNavigator(){const {token,loading}=useAuth();if(loading)return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><ActivityIndicator color={colors.primary}/></View>;return <Stack.Navigator screenOptions={{headerShadowVisible:false,headerTitleStyle:{fontWeight:'800'}}}>{!token?<Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>:<><Stack.Screen name="Home" component={HomeScreen} options={{title:'ShiftTrack'}}/><Stack.Screen name="CreateShift" component={CreateShiftScreen} options={{title:'Create shift'}}/><Stack.Screen name="ActiveShift" component={ActiveShiftScreen} options={{title:'Active shift'}}/></>}</Stack.Navigator>;}
