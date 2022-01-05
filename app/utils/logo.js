import React from 'react';
import {Image} from 'react-native';

const LogoTitle = () => {
    return(
        <Image
            source={require('../assets/images/winthiary_login_logo.png')}
            style={{
                resizeMode:"cover",
                width:120,
                height:35,
            }}
        />
    )
}

export default LogoTitle;