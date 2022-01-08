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
   TextInput,
   ScrollView,
   Image,
   TouchableOpacity,
   KeyboardAvoidingView,
   Platform,
   TouchableWithoutFeedback,
   Keyboard
 } from 'react-native';
 import {getDownloadURL,
   ref as storageReference,
   uploadBytes,
   deleteObject} from "firebase/storage";
 import {set,
   ref as databaseReference,
   child,
   remove} from "firebase/database";
 import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
 import Spinner from 'react-native-loading-spinner-overlay';
 
 import {
   storage,
   database} from '../../utils/misc';
 
 class DiaryDocu extends Component {
   constructor(props) {
     super(props);
     const params = props.route.params;

     !params.newDiary ?
     this.state = {
       newDiary: false,
       isLoading: false,
       index: params.index,
       diaryData: {
         id: params.diaryData.data.id,
         date: params.diaryData.data.date,
         title: params.diaryData.data.title,
         description: params.diaryData.data.description,
         imagePath: params.diaryData.data.imagePath
       },
       image: '',
       userId: params.userId,
     }
   : this.state = {
       newDiary: true,
       isLoading: false,
       index: params.index,
       diaryData: {
         id: params.id,
         date: '',
         title: '',
         description: '',
         imagePath: ''
       },
       userId: params.userId,
     }
     
     !params.newDiary && params.diaryData.data.imagePath ? (
       this.getImage()
     ):null
   }

   onChangeInput = (item, value) => {
     if (item==='date') {
       this.setState(prevState=>({
         diaryData: {
          ...prevState.diaryData,
          date: value
         }
       }))
     }
     else if (item==='title') {
      this.setState(prevState=>({
        diaryData: {
          ...prevState.diaryData,
          title: value
        }
      }))
     }
     else if (item==='description') {
      this.setState(prevState=>({
        diaryData: {
          ...prevState.diaryData,
          description: value
        }
      }))
     }
   }

   getImage = () => {
    getDownloadURL(storageReference(storage, `diaryImage/${this.state.userId}/${this.state.diaryData.imagePath}/image.jpg`))
    .then(url=>{
      this.setState({
        image: url
      })
    })
   }

   selectImage = () => {
    launchImageLibrary({}, response=>{
      console.log(response.assets)
      this.setState({
        image: response.assets[0].uri
      })
    })

    let imageDir = `index${this.state.diaryData.id}`;
    this.setState(prevState=>({
      diaryData:{
        ...prevState.diaryData,
        imagePath: imageDir
      }
    }))
   }

   deleteData = async () => {
     const id = this.state.diaryData.id;
     const userId = this.state.userId;

     const databaseDirectory = `diary/${userId}/${id}`;
     const databaseRef = child(databaseReference(database, databaseDirectory), 'data');

     const storageDirectory = `diaryImage/${userId}/index${id}/image.jpg`;
     const storageRef = storageReference(storage, storageDirectory);

     try {
       await remove(databaseRef);
       await getDownloadURL(storageRef)
       .then(()=>{
         deleteObject(storageRef).then(()=>{
           this.props.navigation.push('Diary')
         })
       })
       .catch(()=>{
        this.props.navigation.push('Diary')
      })
     } catch(error) {
       alert("삭제 실패 : "+error.message)
     }
   }
   
   updateData = () => {
     this.setState({
       newDiary: true
     })
   }

   createData = async () => {
     this.setState({
       isLoading: true
     })

     const userId = this.state.userId;
     const data = this.state.diaryData;
     const id = data.id;

     const databaseDirectory = `diary/${userId}/${id}`
     const databaseRef = databaseReference(database, databaseDirectory)
     const storageDirectory = `diaryImage/${userId}/index${id}/image.jpg`

     try {
       await set(databaseRef, {data});
       this.uploadImage(storageDirectory)
     } catch (error) {
       this.setState({
         isLoading:false
       })
       alert("저장 실패 : "+error.message)
     }
   }

   uploadImage = async (imgDir) => {
     if (this.state.image) {
       const response = await fetch(this.state.image);
       const blob = await response.blob();

       try {
         await uploadBytes(storageReference(storage, imgDir), blob)
         .then(()=>{
           this.setState({
             isLoading:false
           })
           this.props.navigation.push('Diary')
         })
       } catch (error) {
         this.setState({
           isLoading:false
         })
         alert("저장 실패 : "+error.message)
       }
     }
     else {
       this.setState({
         isLoading:false
       })
       this.props.navigation.push('Diary')
     }
   }

   render () {
     return (
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios' ? 'padding' : null} enabled={true}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.diaryContainer}>
              <View style={styles.indexView}>
                <Text style={styles.indexText}># {this.state.index+1}</Text>
              </View>

              <View style={styles.dateView}>
                <Text style={styles.dateText}>Date:  </Text>
                <View style={styles.dateInputView}>
                  {this.state.newDiary? (
                    <TextInput
                    value={this.state.diaryData.date}
                    style={{fontSize:20, paddingTop:0, paddingBottom:0}}
                    placeholder='날짜'
                    placeholderTextColor='#777'
                    onChangeText={value=>this.onChangeInput('date', value)}
                    editable={true}
                    />
                  ):(
                    <TextInput
                    value={this.state.diaryData.date}
                    style={{fontSize:20, paddingTop:0, paddingBottom:0, color:'gray'}}
                    editable={false}
                    />
                  )}
                </View>
              </View>

              <View style={styles.dateView}>
                <Text style={styles.dateText}>Title:  </Text>
                <View style={styles.dateInputView}>
                  {this.state.newDiary? (
                    <TextInput
                    value={this.state.diaryData.title}
                    style={{fontSize:20, paddingTop:0, paddingBottom:0}}
                    placeholder='제목'
                    placeholderTextColor='#777'
                    onChangeText={value=>this.onChangeInput('title', value)}
                    editable={true}
                    />
                  ):(
                    <TextInput
                    value={this.state.diaryData.title}
                    style={{fontSize:20, paddingTop:0, paddingBottom:0, color:'gray'}}
                    editable={false}
                    />
                  )}
                </View>
              </View>

              <View style={styles.descriptionView}>
                <Text style={styles.dateText}>Description:  </Text>
                <View style={[styles.dateInputView, styles.descriptionInputView]}>
                  <ScrollView>
                    {this.state.newDiary? (
                      <TextInput
                      value={this.state.diaryData.description}
                      style={{fontSize:20, paddingTop:0, paddingBottom:0}}
                      placeholder='내용'
                      placeholderTextColor='#777'
                      onChangeText={value=>this.onChangeInput('description', value)}
                      editable={true}
                      multiline={true}
                      />      
                    ):(
                      <TextInput
                      value={this.state.diaryData.description}
                      style={{fontSize:20, paddingTop:0, paddingBottom:0, color:'gray'}}
                      editable={false}
                      multiline={true}
                      />
                    )}
                  </ScrollView>
                </View>
              </View>

              <View style={styles.imageView}>
                <View
                style={{flex:10, paddingRight:15}}
                >
                  <Text style={styles.dateText}>Image:  </Text>
                  <View style={[styles.dateInputView, styles.imageDisplayView]}>
                    {this.state.diaryData.imagePath ? (
                      <Image
                      source={{uri: this.state.image}}
                      style={{resizeMode:'contain', height:'100%', width:'100%'}}
                      />
                    ):null}
                  </View>

                </View>
                <View
                style={{flex:1, paddingTop:30, paddingRight:10}}
                >
                  {this.state.newDiary  ? (
                    <TouchableOpacity
                    onPress={()=>this.selectImage()}
                    >
                      <Image
                      source={require('../../assets/images/image.png')}
                      style={{resizeMode: 'contain', width:30, height:30}}
                      />
                    </TouchableOpacity>
                  ):(
                    <Image
                    source={require('../../assets/images/image.png')}
                    style={{resizeMode: 'contain', width:30, height:30, opacity: 0.2}}
                    />
                  )}
                </View>
              </View>

              <View style={styles.buttonView}>
                {!this.state.newDiary ? (
                  <View style={styles.buttonContainer}>
                  <TouchableOpacity
                  style={{fontSize:15, padding:5}}
                  onPress={()=>this.deleteData()}
                  >
                    <Text>삭제</Text>
                  </TouchableOpacity>
                </View>
                ):null}

                {!this.state.newDiary ? (
                  <View style={styles.buttonContainer}>
                  <TouchableOpacity
                  style={{fontSize:15, padding:5}}
                  onPress={()=>this.updateData()}
                  >
                    <Text>수정</Text>
                  </TouchableOpacity>
                </View>
                ):null}

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                  style={{fontSize:15, padding:5}}
                  onPress={()=>this.createData()}
                  >
                    <Text>완료</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Spinner
                visible={this.state.isLoading}
                textContent={'다이어리 업로드 중..'}
                overlayColor={'rgba(0,0,0,0.6)'}
                textStyle={{color: '#fff'}}
              />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        
     )
   }
 }
 
 const styles = StyleSheet.create({
  diaryContainer:{
    flexDirection:'column',
    backgroundColor:'#eee',
    height:'100%',
  },
  indexView:{
    // flex:1,
    height:40,
    paddingLeft:15,
    marginTop:10
  },
  indexText:{
    fontSize:23,
    fontWeight:'bold'
  },
  dateView:{
    // flex:1,
    height:40,
    paddingLeft:15,
    paddingRight:15,
    flexDirection:'row',
    alignItems:'baseline'
  },
  dateText:{
    fontSize:22,
    fontWeight:'bold',
  },
  dateInputView:{
    flex:1,
    paddingLeft:15,
    paddingRight:15,
    paddingTop:3,
    paddingBottom:3,
    borderWidth:1,
    borderRadius:5
  },
  descriptionView:{
    flex:7,
    paddingLeft:15,
    paddingRight:15,
  },
  descriptionInputView:{
    flex:0.95,
    marginTop:5
  },
  imageView:{
    flex:4,
    paddingLeft:15,
    paddingRight:15,
    flexDirection:'row'
  },
  imageDisplayView:{
    flex:0.9,
    marginTop:5
  },
  buttonView:{
    flex:1.5,
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
    paddingRight:15
  },
  buttonContainer:{
    width:80,
    height:30,
    marginLeft:20,
    borderWidth:1,
    alignItems:'center',
    justifyContent:'center'
  }
 });
 
 export default DiaryDocu;