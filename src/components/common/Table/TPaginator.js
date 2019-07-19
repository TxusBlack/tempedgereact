import React, { Component } from 'react';
import { push } from 'connected-react-router';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';


class TPaginator extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let pageSize = this.props.pageSize ? this.props.pageSize : 10;
  }

  newPage = (newPage) =>{
    this.props.changePage(newPage);
  }

  renderBtns = () => {
    console.log(this.props.rowInfo);
    let totalPages = this.props.rowInfo.totalPages ? this.props.rowInfo.totalPages : 1;
    let actualPage = this.props.rowInfo.number+1;
    let btns = 0;
    let prevBtn = false;
    let nextBtn = false;
    let paginator = [];
    let firstPage =1;

    if (totalPages && totalPages > 0) {
      if (totalPages < 5) {
        btns = totalPages;
      } else if (totalPages >= 5) {
        btns = 5;
        nextBtn = true;
      }

      if(actualPage>4){
        prevBtn = true;
      }
    }

    if (prevBtn) {
      paginator.push(
        <button type="submit" className="btn " onClick={()=>this.props.changePage((actualPage-2))} style={{ borderRadius: 25, margin: '0 3px', backgroundColor: "#888888", color: "#FFF", padding: "5px 30px" }}>
          Prev
        </button>
      );
    }

    if (btns > 0) {
      
      for (let i = 1; i < btns; i++) {
        let btnClass = '#888888';
        if(i==actualPage){
          btnClass='#0088CC'
        }
        paginator.push(
          <button type="submit" className="btn  " onClick={()=>this.props.changePage((i-1))} style={{ borderRadius: 50, margin: '0 3px', backgroundColor: btnClass, color: "#FFF" }}>
            {i}
          </button>
        )
      }
    }


    if (nextBtn) {
      paginator.push(
        <button type="submit" className="btn " onClick={()=>this.props.changePage((actualPage))} style={{ borderRadius: 25, margin: '0 3px', backgroundColor: "#0088CC", color: "#FFF", padding: "5px 30px" }}>
          Next
        </button>
      );
    }

    return paginator;
  }

  render() {
    let page = this.props.page ? this.props.page : 0;
    let pageSize = this.props.pageSize ? this.props.pageSize : 10;



    return (

      <div className="text-center">

        {
          this.renderBtns()
        }

      </div>
    );
  }
}

export default withLocalize(connect(null, { push })(TPaginator));