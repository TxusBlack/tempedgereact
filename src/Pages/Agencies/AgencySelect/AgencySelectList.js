import React from 'react';
import Tile from './Tile';
import { connect } from 'react-redux';

class AgencySelectList extends React.Component{
  render(){
    return(
      <div className="row">
        {this.props.agencies.map((agency, index) => {
            return <Tile agency={agency} key={index} />;
         })}
      </div>
    );
  }
}

export default connect(null, {})(AgencySelectList)
