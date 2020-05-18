import React from 'react';
import {ImagePreview} from '@components';
import './index.less';

export default class ImagePreviewDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="img-preview-demo">
        <ImagePreview
          urls={[
            require('../../../public/user.jpg'),
            require('../../../public/performance.png'),
            require('../../../public/long.jpg'),
          ]}
          visible={true}
        />
      </div>
    );
  }
}
