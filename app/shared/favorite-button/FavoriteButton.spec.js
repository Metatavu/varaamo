import { expect } from 'chai';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import FavoriteButton from './FavoriteButton';

describe('shared/favorite-button/FavoriteButton', () => {
  const defaultProps = {
    favorited: true,
    onClick: simple.mock(),
  };

  function getWrapper(props) {
    return shallowWithIntl(<FavoriteButton {...defaultProps} {...props} />);
  }
  let wrapper;

  beforeEach(() => {
    wrapper = getWrapper();
  });

  it('is a Button', () => {
    expect(wrapper.is(Button)).to.be.true;
  });

  it('has favorite-button class name', () => {
    expect(getWrapper({ favorited: false }).prop('className')).to.equal('favorite-button');
  });

  it('has favorite class modifier if it is favorited', () => {
    expect(getWrapper({ favorited: true }).prop('className')).to.equal(
      'favorite-button favorite-button--favorite'
    );
  });

  it('passes onClick prop', () => {
    expect(wrapper.prop('onClick')).to.deep.equal(defaultProps.onClick);
  });

  it('has remove favorite text if favorited', () => {
    const buttonText = getWrapper({ favorited: true }).find('span');
    expect(buttonText).to.have.length(1);
    expect(buttonText.text()).to.equal('ResourceHeader.favoriteRemoveButton');
  });

  it('has add favorite text if not favorited', () => {
    const buttonText = getWrapper({ favorited: false }).find('span');
    expect(buttonText).to.have.length(1);
    expect(buttonText.text()).to.equal('ResourceHeader.favoriteAddButton');
  });
});
