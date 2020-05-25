import React from 'react';
import PropTypes from 'prop-types';
import {setGesture, scaleImg} from './method';
import './imagePreview.less';

export default class ImagePreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgs: [],
      index: 0,
      scrollLeft: 0,
    };
    this.isScale = false;
    this.scale = 1;
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

  onTouchStart = () => {
    this.setState({
      scrollLeft: this.imgScroll.scrollLeft,
    });
    this.startTime = new Date().getTime();
  };

  onTouchMove = (e) => {
    const {scrollLeft} = this.state;
    const lastestX = e.changedTouches[0].clientX;
    this.dx += (this.lastestX || lastestX) - lastestX;
    this.imgScroll.scrollLeft = scrollLeft + this.dx;
    this.lastestX = lastestX;
  };

  onTouchEnd = () => {
    const {index, imgs} = this.state;
    const {urls} = this.props;
    let toIndex;
    let judgeD = new Date().getTime() - this.startTime < 200 ? 1 : 60;
    if (
      this.dx > judgeD &&
      this.imgScroll.scrollLeft < window.innerWidth * (imgs.length - 1)
    ) {
      this.initImgSize();
      toIndex = index + 1 > urls.length - 1 ? urls.length - 1 : index + 1;
      this.setState({index: toIndex});
      this.move(10, toIndex);
    }
    if (this.dx <= judgeD && this.dx >= -judgeD) {
      toIndex = index;
      this.setState({index: toIndex});
      this.move(10, toIndex);
    }
    if (this.dx < -judgeD && this.imgScroll.scrollLeft > 0) {
      this.initImgSize();
      toIndex = index - 1 < 0 ? 0 : index - 1;
      this.setState({index: toIndex});
      this.move(-10, toIndex);
    }
    this.dx = 0;
    this.lastestX = null;
  };

  move = (step, index) => {
    let timer = setInterval(() => {
      if (
        (step > 0 && this.imgScroll.scrollLeft >= window.innerWidth * index) ||
        (step < 0 && this.imgScroll.scrollLeft <= window.innerWidth * index)
      ) {
        this.imgScroll.scrollLeft = window.innerWidth * index;
        return clearInterval(timer);
      }
      this.imgScroll.scrollLeft += step;
    }, 5);
  };

  imgSizeMap = (urls) => {
    urls.forEach((item, index) => {
      this.getImgSize(item, index);
    });
  };

  initImgSize = () => {
    const {imgs} = this.state;
    this.isScale = false;
    imgs.forEach((item) => {
      item.style = '';
    });
  };

  setImgHandler = (img) => {
    const imgGesture = setGesture(img);
    imgGesture.gesturedbl = () => {
      this.isScale = !this.isScale;
      if (!this.isScale) {
        return this.initImgSize();
      }
      const {width, height} = scaleImg(img, 1.5, {});
      img.parentNode.scrollLeft = (width - window.innerWidth) / 2;
      img.parentNode.scrollTop = (height - window.innerHeight) / 2;
    };
    imgGesture.gesturestart = () => {
      this.startSize = {height: img.height, width: img.width};
      this.imgWrapScroll = {
        l: img.parentNode.scrollLeft,
        t: img.parentNode.scrollTop,
      };
    };
    imgGesture.gesturemove = (e) => {
      img.parentNode.scrollLeft = this.imgWrapScroll.l + e.move.dx;
      img.parentNode.scrollTop = this.imgWrapScroll.t + e.move.dy;
    };
    imgGesture.gestureresize = (e) => {
      this.isScale = true;
      const {scale, width, height} = scaleImg(img, e.scale, this.startSize);
      if (scale === 1) {
        this.isScale = false;
      }
      img.parentNode.scrollLeft = (width - window.innerWidth) / 2;
      img.parentNode.scrollTop = (height - window.innerHeight) / 2;
    };
  };

  getImgSize = (url, index) => {
    let img = new Image();
    let timer = null;
    img.src = url;

    this.setImgHandler(img, index);
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
