import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SignIn from './components/auth';
import Diary from './components/diary';
import News from './components/news';

import DiaryDocu from './components/diary/diaryDocu';
import Logo from './utils/logo';
import Loading from './components/auth/loading';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AuthStack = createStackNavigator();
const MainScreenTab = createBottomTabNavigator();
const DiaryStack = createStackNavigator();
const NewsStack = createStackNavigator();

const headerConfig = {
    headerTitleAlign: 'center',
    headerTintColor: '#fff',
    headerStyle:{
        backgroundColor: '#7487C5',
    },
    headerTitle:Logo,
}

const headerConfig_ = {
    headerTitleAlign: 'center',
    headerTintColor: '#fff',
    headerStyle:{
        backgroundColor: '#7487C5',
    },
    headerTitle:Logo,
    headerLeft: null
}

/*
    Stack Navigator
        -Stack Screen A
    Stack Navigator
        -Tab Navigator
            -Tab Screen B (Diary)
            -Tab Screen C (News)
*/

const isLoggedIn = false;

const TabBarIcon = (focused, name) => {
    let iconName, iconSize;
    if(name==='Diary') {
        iconName='book';
    }
    else if (name==='News') {
        iconName='newspaper-variant-outline';
    }

    if(focused) iconSize=37;
    else iconSize=32;

    return <Icon name={iconName} size={iconSize} color='#fff'/>
}

const DiaryStackComponent = () => {
    return (
        <DiaryStack.Navigator>
            <DiaryStack.Screen name="Diary" component={Diary} options={headerConfig_}/>
            <DiaryStack.Screen name="DiaryDocu" component={DiaryDocu} options={headerConfig}/>
        </DiaryStack.Navigator>
    )
}

const NewsStackComponent = () => {
    return (
        <NewsStack.Navigator>
            <NewsStack.Screen name="News" component={News} options={headerConfig_}/>
        </NewsStack.Navigator>
    )
}

const AppTabComponent = () => {
    return (
        <MainScreenTab.Navigator
            screenOptions={({route})=>({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveBackgroundColor: '#788DCF',
                tabBarInactiveBackgroundColor: '#7487C5',
                tabBarStyle: {
                    backgroundColor: '#7487C5'
                },
                tabBarIcon: ({focused}) => (
                    TabBarIcon(focused, route.name)
                ),
                tabBarHideOnKeyboard: true
            })}
            initialRouteName="Diary"
        >
            <MainScreenTab.Screen name="Diary" component={DiaryStackComponent}/>
            <MainScreenTab.Screen name="News" component={NewsStackComponent}/>
        </MainScreenTab.Navigator>
    )
}

export const RootNavigator = () => {
    return (
        <AuthStack.Navigator screenOptions={{headerShown: false}}>
            <AuthStack.Screen name="Loading" component={Loading}/>
            <AuthStack.Screen name="SignIn" component={SignIn} options={()=>({gestureEnabled:false})}/>
            <AuthStack.Screen name="AppTabComponent" component={AppTabComponent} options={()=>({gestureEnabled:false})}/>
        </AuthStack.Navigator>
    )
}