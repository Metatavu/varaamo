import React from 'react';
import Helmet from 'react-helmet';

import favicon from './mikkeli-favicon.ico';

function Favicon() {
  return <Helmet link={[{ href: favicon, rel: 'icon', type: 'image/x-icon' }]} />;
}

Favicon.propTypes = {};

export default Favicon;
