import React, { Component } from 'react';
import { push } from 'connected-react-router';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';


class TPaginator extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    let page = this.props.page ? this.props.page : 0;
    let pageSize = this.props.pageSize ? this.props.pageSize : 10;
    let totalPages = this.props.totalPages ? this.props.totalPages : 10;



    return (
      <div className="text-center">
        {
          totalPages > 0 ? (
            <React.Fragment>
              <button type="submit" className="btn " style={{ borderRadius: 25, margin: '0 3px', backgroundColor: "#888888", color: "#FFF", padding: "5px 30px" }}>
                Prev
              </button>
              <button type="submit" className="btn " style={{ borderRadius: 50, margin: '0 3px', backgroundColor: "#0088CC", color: "#FFF" }}>
                55
              </button>
              <button type="submit" className="btn " style={{ borderRadius: 50, margin: '0 3px', backgroundColor: "#888888", color: "#FFF" }}>
                1
              </button>
              <button type="submit" className="btn " style={{ borderRadius: 50, margin: '0 3px', backgroundColor: "#888888", color: "#FFF" }}>
                1
              </button>
              <button type="submit" className="btn " style={{ borderRadius: 25, margin: '0 3px', backgroundColor: "#0088CC", color: "#FFF", padding: "5px 30px" }}>
                Next
              </button>
            </React.Fragment>
          ) : ""
        }

      </div>
    );
  }
}

export default withLocalize(connect(null, { push })(TPaginator));