import React from 'react';
import PropTypes from 'prop-types';
import './imagePreview.less';

export default class ImagePreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgs: [],
      index: 0,
      scrollLeft: 0,
    };
    this.clickCount = 0;
    this.optType = null;
    this.isDbLarger = false;
    this.distance = 0;
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
    this.imgScroll.addEventListener('touchmove', this.onTouchMove);
    this.imgScroll.addEventListener('touchend', this.onTouchEnd, {
      passive: true,
    });
  }

  onTouchStart = (e) => {
    this.setState({
      scrollLeft: this.imgScroll.scrollLeft,
    });
    this.startTime = new Date().getTime();
  };

  onTouchMove = (e) => {
    const {scrollLeft} = this.state;
    const lastestX = e.changedTouches[0].clientX;
    this.distance += (this.lastestX || lastestX) - lastestX;
    this.imgScroll.scrollLeft = scrollLeft + this.distance;
    this.lastestX = lastestX;
  };

  onTouchEnd = () => {
    const {index, imgs} = this.state;
    const {urls} = this.props;
    let toIndex;
    let judgeD = new Date().getTime() - this.startTime < 200 ? 1 : 60;
    if (
      this.distance > judgeD &&
      this.imgScroll.scrollLeft < window.innerWidth * (imgs.length - 1)
    ) {
      this.initImgSize();
      console.log(this.imgScroll.scrollLeft);
      toIndex = index + 1 > urls.length - 1 ? urls.length - 1 : index + 1;
      this.setState({index: toIndex});
      this.move(10, toIndex);
    }
    if (this.distance <= judgeD && this.distance >= -judgeD) {
      toIndex = index;
      this.setState({index: toIndex});
      this.move(10, toIndex);
    }
    if (this.distance < -judgeD && this.imgScroll.scrollLeft > 0) {
      this.initImgSize();
      toIndex = index - 1 < 0 ? 0 : index - 1;
      this.setState({index: toIndex});
      this.move(-10, toIndex);
    }
    this.distance = 0;
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
    urls.forEach((item) => {
      this.getImgSize(item);
    });
  };

  initImgSize = () => {
    const {imgs} = this.state;
    this.isDbLarger = false;
    imgs.forEach((item) => {
      item.style.width = '';
      item.style.height = '';
    });
  };

  setImgHandler = (img) => {
    img.addEventListener('dblclick', () => {
      const {imgs, index} = this.state;
      this.isDbLarger = !this.isDbLarger;
      if (img.height / img.width > window.innerHeight / window.innerWidth) {
        imgs[index].style.height = this.isDbLarger
          ? window.innerHeight * 1.5 + 'px'
          : '';
        img.parentNode.scrollTop = window.innerHeight / 4;
      } else {
        imgs[index].style.width = this.isDbLarger
          ? window.innerWidth * 1.5 + 'px'
          : '';
        img.parentNode.scrollLeft = window.innerWidth / 4;
      }
    });
    img.addEventListener('touchstart', (e) => {
      this.imgLeftStart = e.changedTouches[0].clientX;
      this.imgScrollLeft = img.parentNode.scrollLeft;
      this.imgTopStart = e.changedTouches[0].clientY;
      this.imgScrollTop = img.parentNode.scrollTop;
    });

    img.addEventListener('touchmove', (e) => {
      if (!this.isDbLarger) {
        return e.preventDefault();
      }
      if (
        img.parentNode.scrollLeft < img.width - window.innerWidth &&
        img.width > window.innerWidth &&
        img.parentNode.scrollLeft > 0
      ) {
        this.lastestX = null;
        e.stopPropagation();
      }
      const scrollLeft =
        this.imgScrollLeft + this.imgLeftStart - e.changedTouches[0].clientX;
      const scrollTop =
        this.imgScrollTop + this.imgTopStart - e.changedTouches[0].clientY;

      img.parentNode.scrollLeft =
        scrollLeft > img.width - window.innerWidth
          ? img.width - window.innerWidth
          : scrollLeft;
      img.parentNode.scrollTop =
        scrollTop > img.height - window.innerHeight
          ? img.height - window.innerHeight
          : scrollTop;
    });
  };

  getImgSize = (url) => {
    let img = new Image();
    let timer = null;
    img.src = url;

    this.setImgHandler(img);
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
