/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {Component} from 'react';
 import {
   ActivityIndicator,
   ScrollView,
   StyleSheet,
   Text,
   View,
 } from 'react-native';

 import AuthLogo from './authLogo';
 import AuthForm from './authForm';
 import {getTokens, setTokens} from '../../utils/misc';
 import {autoSignIn} from '../../store/actions/user_actions';
 import {connect} from 'react-redux';
 import {bindActionCreators} from 'redux';
 
 class AuthComponent extends Component {

     goWithoutLogin = () => {
        this.props.navigation.navigate("AppTabComponent")
     }

     componentDidMount() {
         getTokens((value)=>{
             if(value[1][1] !== null) {
                 this.props.autoSignIn(value[2][1]).then(()=>{
                     if(this.props.User.auth.token) {
                         setTokens(this.props.User.auth, ()=>{
                             this.goWithoutLogin();
                         })
                     }
                 })
             }
         });
         
         this.props.navigation.addListener('beforeRemove', (e)=>{
             e.preventDefault();
         })
     }

     render () {
            return (
                <ScrollView contentContainerStyle={styles.container}>
                    <View>
                        <AuthLogo/>
                        <AuthForm
                        goWithoutLogin={this.goWithoutLogin}
                        />
                    </View>
                </ScrollView>
            )
     }
 }
 
 const styles = StyleSheet.create({
    loading : {
        flex:1,
        backgroundColor:'#fff',
        alignItems:'center',
        justifyContent:'center'
    },
    container : {
        flex:1,
        backgroundColor:'#7487C5',
        paddingTop:60,
        paddingLeft:50,
        paddingRight:50
    }
 });

 function mapStateToProps(state) {
     return {
         User:state.User
     }
 }

 function mapDispatchToProps(dispatch) {
     return bindActionCreators({autoSignIn}, dispatch);
 }
 
 export default connect(mapStateToProps, mapDispatchToProps)(AuthComponent);