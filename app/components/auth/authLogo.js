import React from "react";
import {
    View,
    Image
} from 'react-native';

import LogoImage from '../../assets/images/winthiary_login_logo.png';

const LogoComponent = () => (
    <View style={{alignItems:'center', marginBottom:30}}>
        <Image
            source={LogoImage}
            style={{
                resizeMode: "cover",
                width:300,
                height:88
            }}
        />
    </View>
)

export default LogoComponent;