import React from 'react';
import placeholder from './assets/image-placeholder.jpg';

class Tile extends React.Component{
  onClick = () => {
    //DO SOMETHING
  }

  render(){
    return(
      <div className="col-lg-4 col-xs-12">
        <img className="hvr-grow" style={{width: "100%", height: "100%"}} src={placeholder} onClick={ () => {this.onClick()} } />
      </div>
    );
  }
}

export default Tile;
