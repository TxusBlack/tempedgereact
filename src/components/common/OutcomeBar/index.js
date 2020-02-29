import React from 'react';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';

import '../../../assets/styles/components/ResultBar.css';

const OutcomeBar = (props) => {
  const { classApplied, translateId } = props;
  return (
    <div className={classApplied}>
      <p>
        <Translate id={translateId} />
      </p>
    </div>
  );
};

OutcomeBar.propTypes = {
  classApplied: PropTypes.string.isRequired,
  translateId: PropTypes.string.isRequired,
};

export default withLocalize(connect(null, {})(OutcomeBar));
