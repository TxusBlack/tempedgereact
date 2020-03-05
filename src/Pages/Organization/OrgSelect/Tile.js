import React from 'react';
import { validateOrg } from '../../../Redux/actions/tempEdgeActions.js';

class Tile extends React.Component{
  onClick = (org) => {
    validateOrg(org);
  }

  render(){
    let orgName = this.props.agency.organizationEntity.organizationName;
    let image = "https://via.placeholder.com/250";

    let styles = {
      width: "100%",
      cursor: "pointer"
    }

    let imgStyle = {
      display: "block",
      margin: "0 auto"
    }

    return(
      <div className="col-lg-3 col-xs-12" style={{display: "inline-block"}}>
        <div className="hvr-grow" style={styles}>
          <img src={image} style={imgStyle} onClick={ () => {this.onClick(this.props.agency)} } alt={`${orgName}`}/>
        </div>
      </div>
    );
  }
}

export default Tile;
