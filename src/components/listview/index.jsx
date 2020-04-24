import ListView from './listview';

export default ListView;

/**
 * ListView组件
 * props:
 *  height: 容器高度， 默认400px
 *  refreshing: 刷新请求是否进行中，默认false
 *  refreshHandler: 释放刷新时触发
 *  onReachBottom: 滑动到容器底部时触发
 *  loadingMore: 是否加载完毕所有的数据，默认true
 *  loading: 加载更多数据请求是否进行中, 默认false
 *  refreshTip: 刷新tip, 传入一个object，属性值有pull, release, loading, refreshed
 *  bottomTip: 底部加载tip, 传入一个object，属性值有loading, loaded  
 */
