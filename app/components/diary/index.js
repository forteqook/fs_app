/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {Component} from 'react';
 import {
   StyleSheet,
   Text,
   View,
   ScrollView,
   Image,
   TouchableOpacity,
   Dimensions
 } from 'react-native';
 import {connect} from 'react-redux';
 import { bindActionCreators } from 'redux';
 import {getDiaries} from '../../store/actions/diary_actions';
 import TextTruncate from 'react-native-text-truncate';

 const screenHeight = Dimensions.get('window').height;
 const screenWidth = Dimensions.get('window').width;
 
 class DiaryComponent extends Component {
   componentDidMount() {
     this.props.getDiaries()
   }

   renderDiary = (Diaries) => (
     Diaries.documents ?
     Diaries.documents.map((item, index)=>(
       <TouchableOpacity
       key={index}
       onPress={()=>{
         this.props.navigation.navigate('DiaryDocu',{
           newDiary:false,
           diaryData: item,
           index: index,
           id: item.data.id
         })
       }}
       >
         <View style={styles.diaryContainer}>
           <View style={{height: 160}}>
             {item.data.imagePath ? (
               <View style={styles.indexView}>
                 <Text style = {{fontSize:17, fontWeight:'bold'}}>
                   # {index+1}
                 </Text>
                 <Image
                 source={require('../../assets/images/image.png')}
                 style={{resizeMode:'contain', width:20, height:20}}
                 />
               </View>
             ):(
               <View style={{paddingTop:7,paddingLeft:7}}>
                 <Text style = {{fontSize:17, fontWeight:'bold'}}>
                   # {index+1}
                 </Text>
               </View>
             )}

             {item.data.date ? (
               <View style={styles.dateView}>
                 <Text style={{fontSize:16, fontWeight:'bold'}}>Date:  </Text>
                 <Text style={{fontSize:16}}>{item.data.date}</Text>
               </View>
             ):null}

             {item.data.title ? (
               <View style={styles.dateView}>
                 <Text style={{fontSize:16, fontWeight:'bold'}}>Title:  </Text>
                 <Text style={{fontSize:16}}>{item.data.title}</Text>
               </View>
             ):null}

             {item.data.description ? (
               <View style={{paddingTop:7, paddingLeft:7}}>
                 <Text style={{fontSize:16, fontWeight:'bold'}}>Description:  </Text>
                 <TextTruncate
                 style={{fontSize:16}}
                 numberOfLines={2}
                 >
                   {item.data.description}
                 </TextTruncate>
               </View>
             ):null}
           </View>
         </View>
       </TouchableOpacity>
     ))
     :
     null
   )

   checkNextID = (Diaries) => {
     if(Diaries.documents.length > 0) {
       let numOfArrElements = Diaries.documents.length;
       let lastDiaryIdx = Number(numOfArrElements) - 1;
       let nextDiaryID = Diaries.documents[lastDiaryIdx].data.id + 1;
       
       return nextDiaryID;
     }
     else {
       return 0;
     }
   }

   render () {
     return (
       <View>
         <ScrollView>
           {this.renderDiary(this.props.Diaries)}
         </ScrollView>

         <TouchableOpacity
         style={{position:'absolute', left: screenWidth*0.8, top: screenHeight*0.7}}
         onPress={()=>{
           this.props.navigation.navigate('DiaryDocu',{
             newDiary: true,
             index: this.props.Diaries.documents.length,
             id: this.checkNextID(this.props.Diaries)
           })
         }}
         >
           <Image
           source={require('../../assets/images/pen_circle.png')}
           style={{width:50, height:50, resizeMode: 'contain'}}
           />
         </TouchableOpacity>
       </View>
     )
   }
 }
 
 const styles = StyleSheet.create({
   diaryContainer:{
     backgroundColor: '#fff',
     margin: 10,
     shadowColor: '#cccccc',
     shadowOffset: {width: 0, height: 2},
     shadowOpacity: 0.8,
     shadowRadius: 2,
     borderRadius: 2
   },
   indexView:{
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     paddingTop:7,
     paddingLeft:7,
     paddingRight:12,
   },
   dateView:{
     flexDirection: 'row',
     alignItems: 'baseline',
     paddingTop: 7,
     paddingLeft: 7
   }
 });

 function mapStateToProps(state) {
   return {
     Diaries: state.Diaries
   }
 }

 function mapDispatchToProps(dispatch) {
   return bindActionCreators({getDiaries}, dispatch)
 }
 
 export default connect(mapStateToProps, mapDispatchToProps)(DiaryComponent);