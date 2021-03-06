import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Reservation from './Reservation';
import ReservationSlot from './ReservationSlot';
import { resourcesSelector } from '../../../../../state/selectors/dataSelectors';

class UnconnectedAvailabilityTimeline extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['reservation', 'reservation-slot']).isRequired,
        data: PropTypes.object,
      }),
    ).isRequired,
    onReservationClick: PropTypes.func,
    onReservationSlotClick: PropTypes.func,
    onReservationSlotMouseEnter: PropTypes.func,
    onReservationSlotMouseLeave: PropTypes.func,
    onSelectionCancel: PropTypes.func,
    products: PropTypes.array,
    selection: PropTypes.object,
    slotSize: PropTypes.string,
  };

  shouldComponentUpdate(nextProps) {
    const isSelected = nextProps.selection && nextProps.selection.resourceId === this.props.id;
    const wasSelected = this.props.selection && this.props.selection.resourceId === this.props.id;
    return this.props.items !== nextProps.items || isSelected || wasSelected;
  }

  render() {
    const {
      onReservationClick,
      onReservationSlotClick,
      onSelectionCancel,
      onReservationSlotMouseEnter,
      onReservationSlotMouseLeave,
      products,
      selection,
      slotSize,
    } = this.props;
    return (
      <div className="availability-timeline">
        {this.props.items.map((item, index) => {
          if (item.type === 'reservation-slot') {
            return (
              <ReservationSlot
                {...item.data}
                itemIndex={index}
                key={item.key}
                onClick={onReservationSlotClick}
                onMouseEnter={onReservationSlotMouseEnter}
                onMouseLeave={onReservationSlotMouseLeave}
                onSelectionCancel={onSelectionCancel}
                resourceId={this.props.id}
                selection={selection}
                slotSize={slotSize}
              />
            );
          }
          return (
            <Reservation
              {...item.data}
              key={item.key}
              onClick={onReservationClick}
              products={products}
            />
          );
        })}
      </div>
    );
  }
}

export function selector() {
  function idSelector(state, props) {
    return props.id;
  }
  const resourceSelector = createSelector(
    resourcesSelector,
    idSelector,
    (resources, id) => resources[id],
  );
  return createSelector(
    resourceSelector,
    resource => ({
      products: resource.products ? resource.products : [],
      slotSize: resource.slotSize,
    }),
  );
}
export { UnconnectedAvailabilityTimeline };
const AvailabilityTimeline = connect(selector)(UnconnectedAvailabilityTimeline);
export default AvailabilityTimeline;
