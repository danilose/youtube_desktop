import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router';

import Navbar from './navbar';
import Footer from './footer';

class App extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
      return(
        <div>
          <Navbar />
          { this.props.children }
          <Footer />
        </div>
      );
  }

}

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(App));