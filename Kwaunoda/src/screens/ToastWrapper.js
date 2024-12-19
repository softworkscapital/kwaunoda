// ToastWrapper.js
import React, { forwardRef } from "react";
import Toast from "react-native-toast-message";

const ToastWrapper = forwardRef((props, ref) => {
  return <Toast ref={ref} {...props} />;
});

export default ToastWrapper;
