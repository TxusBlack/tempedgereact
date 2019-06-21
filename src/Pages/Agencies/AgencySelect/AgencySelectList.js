import React from 'react';
import Tile from './Tile';
import { connect } from 'react-redux';
import Container from '../../../components/common/Container/Container';

class AgencySelectList extends React.Component{
  render(){
    return(
      <Container title="">
        {this.props.agencies.map((agency, index) => {
           return <Tile agency={agency} key={index} />;
         })}
      </Container>
    );
  }
}

export default connect(null, {})(AgencySelectList)
