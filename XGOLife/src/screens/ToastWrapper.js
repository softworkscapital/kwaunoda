// ToastWrapper.js
import React from 'react';
import Toast from 'react-native-toast-message';

const ToastWrapper = ({ children }) => {
    return (
        <>
            {children}
            <Toast ref={(ref) => Toast.setRef(ref)} />
        </>
    );
};

export default ToastWrapper;