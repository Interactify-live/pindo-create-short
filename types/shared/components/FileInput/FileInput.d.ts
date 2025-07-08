import React from 'react';
interface FileInputProps {
    onSelect: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
declare const FileInput: React.FC<FileInputProps>;
export default FileInput;
