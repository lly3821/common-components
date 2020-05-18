import React from 'react';
import PropTypes from 'prop-types';
import './imagePreview.less';

export default class ImagePreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgs: [],
      touchStart: 0,
      index: 0,
    };
  }

  static defaultProps = {
    urls: [],
    zIndex: 1000,
    index: 0,
    visible: false,
  };

  static propTypes = {
    urls: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    zIndex: PropTypes.number,
    index: PropTypes.number,
    visible: PropTypes.bool,
  };

  componentDidMount() {
    this.imgSizeMap(this.props.urls);
    this.imgScroll.addEventListener('touchstart', this.onTouchStart, {
      passive: true,
    });
    this.imgScroll.addEventListener('touchmove', this.onTouchMove, {
      passive: false,
    });
    this.imgScroll.addEventListener('touchend', this.onTouchEnd, {
      passive: true,
    });
  }

  onTouchStart = (e) =>
    this.setState({touchStart: e.changedTouches[0].clientX});

  onTouchMove = (e) => {
    e.preventDefault();
    const {touchStart} = this.state;
    const lastestX = e.changedTouches[0].clientX;
    let distance = touchStart - lastestX;
    this.setState({distance});
  };

  onTouchEnd = () => {
    const {distance, index} = this.state;
    const {urls} = this.props;
    let toIndex;
    if (distance > 0) {
      toIndex = index + 1 > urls.length - 1 ? urls.length - 1 : index + 1;
      this.setState({index: toIndex});
      return this.move(10, toIndex);
    }
    if (distance < 0) {
      toIndex = index - 1 < 0 ? 0 : index - 1;
      this.setState({index: toIndex});
      return this.move(-10, toIndex);
    }
    this.move(0, index);
  };

  move = (step, index) => {
    let timer = setInterval(() => {
      if (
        (step > 0 && this.imgScroll.scrollLeft >= window.innerWidth * index) ||
        (step < 0 && this.imgScroll.scrollLeft <= window.innerWidth * index)
      ) {
        return clearInterval(timer);
      }
      if (step === 0) {
      } else {
        this.imgScroll.scrollLeft += step;
      }
    }, 5);
  };

  imgSizeMap = (urls) => {
    urls.forEach((item) => {
      this.getImgSize(item);
    });
  };

  getImgSize = (url) => {
    let img = new Image();
    let timer = null;
    img.src = url;
    timer = setInterval(() => {
      if (img.width > 0 && img.height > 0) {
        clearInterval(timer);
        this.setState((state) => {
          let node = document.createElement('div');
          node.className = 'img-wrap';
          img.className =
            img.height / img.width > window.innerHeight / window.innerWidth
              ? 'height-larger'
              : 'width-larger';
          node.appendChild(img);
          this.imgScroll.appendChild(node);
          return {imgs: [...state.imgs, img]};
        });
      }
    }, 50);
  };

  render() {
    let {zIndex, visible} = this.props;

    return (
      <div
        style={{zIndex, display: visible ? 'block' : 'none'}}
        className="image-preview-wrap">
        <div className="scroll-x-wrap">
          <div
            ref={(e) => (this.imgScroll = e)}
            className="img-item-wrap"></div>
        </div>
      </div>
    );
  }
}
