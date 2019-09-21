import React, { Component } from 'react';
import { push } from 'connected-react-router';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';


class TPaginator extends Component {

  constructor(props) {
    super(props);
    this.state = {
        prevBtn : false, 
        nextBtn : false
    }
  }

  onClickChangePage = (myPage) =>{
    if(!myPage || myPage < 1) {
      myPage =1;
    } else if(myPage > this.props.totalPages) {
      myPage = this.props.totalPages;
    }

    console.log(myPage);
    this.props.changePage(myPage-1);
  }

  renderBtns = (totalPages, aPage) => {

    let btns = 0;
    let prevBtn = this.state.prevBtn;
    let nextBtn = this.state.nextBtn;
    let paginator = [];
    let initPage = 1;

    if (totalPages && totalPages > 0) {
      if (totalPages < 6) {
        btns = totalPages;
      } else if (totalPages >= 6) {


        if(aPage-2 < 2){
          initPage = 1;
        }else if((aPage + 2) <totalPages){
          initPage = aPage-2;
        }else if((aPage + 2) >= totalPages){
          initPage = totalPages - 4;
        }else{
          initPage = aPage;
        }

        btns = initPage + 5;
        prevBtn = true;
        nextBtn = true;
      }
    }

    if (prevBtn) {
      paginator.push(
        <button type="submit" className="btn " 
            onClick={()=>this.onClickChangePage(aPage-1)} 
            style={{ borderRadius: 25, margin: '0 3px', backgroundColor: "#888888", color: "#FFF", padding: "5px 30px" }}>
          
          Prev
        </button>
      );
    }

    if (btns > 0) {
      
      for (let i = initPage; i < btns; i++) {
        let btnClass = '#888888';
        if(i==aPage){
          btnClass='#0088CC'
        }
        paginator.push(
          <button type="submit" className="btn  " onClick={()=>this.onClickChangePage(i)} style={{ borderRadius: 50, margin: '0 3px', backgroundColor: btnClass, color: "#FFF" }}>
            {i}
          </button>
        )
      }
    }


    if (nextBtn) {
      paginator.push(
        <button type="submit" className="btn " onClick={()=>this.onClickChangePage(aPage+1)} style={{ borderRadius: 25, margin: '0 3px', backgroundColor: "#0088CC", color: "#FFF", padding: "5px 30px" }}>
          Next
        </button>
      );
    }

    return paginator;
  }

  render() {

    let totalPages = this.props.totalPages ? this.props.totalPages : 1;
    let actualPage = this.props.actualPage +1; 

    return (

      <div className="text-center">

        {
          this.renderBtns(totalPages, actualPage)
        }

      </div>
    );
  }
}

let mapStatetoProps = (state) => ({    //rootReducer calls 'postReducer' which returns an object with previous(current) state and new data(items) onto a prop called 'posts' as we specified below
    paginatorList: state.tempEdge.paginatorList,    //'posts', new prop in component 'Posts'. 'state.postReducer', the object where our reducer is saved in the redux state, must have same name as the reference
    totalPages : state.tempEdge.paginatorList.data.totalPages,
    actualPage : state.tempEdge.paginatorList.data.number,
})

export default withLocalize(connect(mapStatetoProps, { push })(TPaginator));