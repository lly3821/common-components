import React from 'react';
import PropTypes from 'prop-types';
import './listview.less';

const REFRESHTIP = { 
  pull: '下拉刷新',
  release: '释放刷新',
  loading: '加载中...',
  refreshed: '已刷新'
}

const BOTTOMTIP = {
  loading: '正在加载中...',
  loaded: '已经到底啦~'
}

export default class ListView extends React.Component{
  constructor (props) {
    super(props);
    this.state = {
      refreshProps: {
        pullHeight: 0,
        touchStart: 0,
        status: 'pull',
      }
    }
  }

  static defaultProps = {
    height: 400,
    refreshing: false,
    refreshHandler: () => {}, 
    onReachBottom: () => {},
    loadingMore: true,
    loading: false,  
    refreshTip: REFRESHTIP,
    bottomTip: BOTTOMTIP,  
  };

  static propTypes = {
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    refreshing: PropTypes.bool,
    refreshHandler: PropTypes.func,
    onReachBottom: PropTypes.func,
    loadingMore: PropTypes.bool,
    loading: PropTypes.bool,
    refreshTip: PropTypes.object,
    bottomTip: PropTypes.object,
  };

  componentDidMount() {
    this.scroll.addEventListener('scroll', this.onReachBottom);
    this.scroll.addEventListener('touchstart', this.onTouchStart, { passive: true });
    this.scroll.addEventListener('touchmove', this.onTouchMove, { passive: false });
    this.scroll.addEventListener('touchend', this.onTouchEnd, { passive: true });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.refreshing !== this.props.refreshing && !this.props.refreshing) {
      this.endRefreshFetching()
    }    
  }

  componentWillUnmount() {
    this.scroll.removeEventListener('scroll', this.onReachBottom);
    this.scroll.removeEventListener('touchstart', this.onTouchStart);
    this.scroll.removeEventListener('touchmove', this.onTouchMove);
    this.scroll.removeEventListener('touchend', this.onTouchEnd);
  }

  onTouchStart = e => {
    const { refreshProps } = this.state;
    const touchStart = e.changedTouches[0].clientY;
    this.setState({ refreshProps: { ...refreshProps, status: 'pull', touchStart },
      scrollStart: this.scroll.scrollTop
    });
  };

  onTouchMove = e => {
    if(this.state.scrollStart === 0) {
      const { refreshProps } = this.state;
      const lastestTop = e.changedTouches[0].clientY;
      let distance = lastestTop - refreshProps.touchStart;
      if (distance < 0) return;
      if (this.scroll.scrollTop <= 0) {
        e.preventDefault();
        if (distance > 80) {
          refreshProps.status = 'release';
        }
        if (distance >= 100) {
          distance = 100;
        }
        refreshProps.pullHeight = distance;
        this.setState({ refreshProps });
      }
    }
  };

  onTouchEnd = async () => {
    const { refreshProps } = this.state;
    if (refreshProps.pullHeight > 80) {
      refreshProps.pullHeight = 40;
      refreshProps.status = 'loading';
      this.setState({ refreshProps });
      this.props.refreshHandler()
    } else {
      this.reset();
    }
  };

  endRefreshFetching = () => {
    this.setState(({ refreshProps }) => { return (
      { refreshProps: { ...refreshProps, pullHeight: 40, status: 'refreshed'} }
    )});
    setTimeout(this.reset, 1000)
  }

  reset = () => {
    this.setState(({ refreshProps }) => { return (
      { refreshProps: { ...refreshProps, pullHeight: 0, status: 'pull'} }
    )}, );
  }

  onReachBottom = e => {
    const { clientHeight, scrollHeight, scrollTop } = e.target;
    const isBottom = scrollTop + clientHeight === scrollHeight;
    const { loading, loadingMore } = this.props;
    if (isBottom && loadingMore && !loading) {
      this.props.onReachBottom();
    }
  };

  render () {
    const { height, loadingMore, loading, refreshTip, bottomTip } = this.props;
    const { refreshProps } = this.state;
    const { pullHeight, status } = refreshProps;

    const combineRefreshTip = {...REFRESHTIP, ...refreshTip}
    const combineBottomTip = {...BOTTOMTIP, ...bottomTip}

    return (
      <div className="listview-wrap" style={{ height }} ref={e => this.scroll = e}>
        <div className="refresh-wrap" style={{ height: pullHeight }}>
          {combineRefreshTip[status]}
        </div>
        {this.props.children}
        {loading && 
          <div className="bottom-tip">{combineBottomTip.loading}</div>
        }
        {!loading && !loadingMore && 
          <div className="bottom-tip">{combineBottomTip.loaded}</div>
        }
      </div>
    )
  }
}
