# 常用移动端组件封装

努力学习并更新中...

## 项目开始
```
npm install
npm start
```
打开localhost:3000/

## 组件介绍

### ListView
属性 | 说明 | 类型 | 默认值
:-: | :-: | :-: | :-:
height | 容器高度 | string, number | 400 
refreshing | 刷新请求是否进行中| bool | false
refreshHandler | 释放刷新时触发| func | -
onReachBottom | 滑动到容器底部时触发| func | -
loadingMore | 是否加载完毕所有的数据| bool | true
loading | 加载更多数据请求是否进行中| bool | false
refreshTip | 刷新tip, 传入一个object，属性值有pull, release, loading, refreshed | object | -
bottomTip | 底部加载tip, 传入一个object，属性值有loading, loaded | object | -
