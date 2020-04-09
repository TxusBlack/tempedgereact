import React from 'react';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import '../../../assets/styles/components/ResultBar.css';

const OutcomeBar = (props) => {
  const { classApplied, translateId, customData } = props;
  return (
    <div className={classApplied}>
      <p>
        <Translate id={translateId} data={customData} options={{ renderInnerHtml: true }} />
      </p>
    </div>
  );
};

OutcomeBar.propTypes = {
  classApplied: PropTypes.string.isRequired,
  translateId: PropTypes.string.isRequired,
  customData: PropTypes.shape({
    data: PropTypes.oneOfType([PropTypes.string, PropTypes.string])
  })
};

OutcomeBar.defaultProps = {
  customData: { data: '' }
};

export default withLocalize(connect(null, {})(OutcomeBar));
