import React from 'react';
import { connect } from 'react-redux';

class PositionsTable extends React.Component{
  render(){
    let deptPosList = this.props.deptPosList;
    let index = this.props.deptPosList.length < 1? this.props.deptPosList.length: this.props.deptPosList.length-1;

    //console.log("deptPosList: --PositionsTable--", deptPosList);
    console.log("index: --PositionsTable-- ", index);

    return(
      <table className="table table-borderless">
        <thead>
          <tr>
            <th>Pay Rate</th>
            <th>Markup</th>
            <th>OT Markup</th>
            <th>Employee Contact</th>
            <th>Contact Phone</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{(deptPosList[index] !== undefined)? deptPosList[index].payRate: ""}</td>
            <td>{(deptPosList[index] !== undefined)? deptPosList[index].markup: ""}</td>
            <td>{(deptPosList[index] !== undefined)? deptPosList[index].otmarkup: ""}</td>
            <td>{(deptPosList[index] !== undefined)? deptPosList[index].employeeContact: ""}</td>
            <td>{(deptPosList[index] !== undefined)? deptPosList[index].contactPhone: ""}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

let mapStateToProps = (state) => {
  let deptPosList = [];

  if(state.tempEdge !== undefined){
    if(state.tempEdge.deptPosList !== undefined){
      console.log("state.tempEdge.deptPosList --PositionsTable--: ", state.tempEdge.deptPosList);
      deptPosList = state.tempEdge.deptPosList;
    }
  }

  return({
    deptPosList: deptPosList
  });
}

export default connect(mapStateToProps, {})(PositionsTable);
