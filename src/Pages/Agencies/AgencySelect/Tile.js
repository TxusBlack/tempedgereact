import React from 'react';

class Tile extends React.Component{
  onClick = () => {
    //DO SOMETHING
  }

  render(){
    return(
      <div className="col-lg-4 col-xs-12">
        <img className="hvr-grow" src={this.props.agency.image} onClick={ () => {this.onClick()} } />
      </div>
    );
  }
}

export default Tile;
