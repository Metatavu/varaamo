import React, { Component } from 'react';
import Overlay from 'react-bootstrap/lib/Overlay';
import DayPicker from 'react-day-picker';
import moment from 'moment';

const DatePickerWrapper = ({ children }) => (
  <div className="app-NotificatorDatePicker__datePicker">
    {children}
  </div>
);

class NotificatorDatePicker extends Component {
  state = {
    isOpen: false
  };

  onChange = (newDate) => {
    const { onChange } = this.props;

    this.setState({ isOpen: false });

    onChange({ target: { value: newDate } }, 'until');
  }

  render() {
    const { date } = this.props;
    const { isOpen } = this.state;
    return (
      <div className="app-NotificatorDatePicker">
        <div className="date-holder" onClick={() => this.setState({ isOpen: true })}>
          {moment(date).format('DD.MM.YYYY')}
        </div>
        <Overlay
          animation={false}
          container={this}
          onHide={() => this.setState({ isOpen: false })}
          placement="bottom"
          rootClose
          show={isOpen}
        >
          <DatePickerWrapper>
            <DayPicker
              onDayClick={newDate => this.onChange(newDate)}
              selectedDays={date}
            />
          </DatePickerWrapper>
        </Overlay>
      </div>
    );
  }
}

export default NotificatorDatePicker;
