import { GET_DIARIES } from "../types";
import {auth, database} from '../../utils/misc';
import { onAuthStateChanged } from "firebase/auth";
import { ref as databaseReference, onValue } from "firebase/database"

export function getDiaries(User) {
    // onAuthStateChanged(auth, (user)=>{
    //     if(user) {
    //         console.warn('user id is...', user)
    //     }
    //     else {
    //         console.warn('not logged in')
    //     }
    // })

    return (dispatch) => {
        onValue (databaseReference(database, `diary/${User.auth.userId}`), (snapshot) => {
            const diaryData = [];
            for (let key in snapshot.val()) {
                if (snapshot.val()[key]) {
                    diaryData.push({
                        ...snapshot.val()[key]
                    })
                }
            }
            dispatch({type:GET_DIARIES, payload:diaryData})
        })
    }
}