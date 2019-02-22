import React from 'react';
import ReactLoading from 'react-loading';

//Use 'spin' for type
const Example = ({ type, color }) => (
    <ReactLoading type={type} color={color} height={667} width={375} />
);

export default Example;
