import React from "react";

type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<NativeInputProps> = (props) => <input {...props} />;

export default Input;
