import React, { Component } from 'react';
import NotificationsSystem from 'reapop';
import theme from 'reapop-theme-bootstrap';

class Notifications extends Component {
  render() {
    return (
      <div>
        <NotificationsSystem theme={theme} />
      </div>
    );
  }
}

export default Notifications;
