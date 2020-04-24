import React from 'react';
import  ListView from '@components/listview/listview';
import './index.less';

const testData = Array.from(new Array(10), (_, index) => ({ name: `title ${index + 1}`, content: `content ${index + 1 }`}))

export default class ListViewDemo extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      dataSource: testData,
      refreshing: false,
      loadingMore: true,
      loading: false,
    }
  }

  fetchData = async () => {
    this.setState({ refreshing: true })
    setTimeout(() => {
      this.setState({ dataSource: testData, refreshing: false, loadingMore: true })
    }, 1000)
  }

  onReachBottom = () => {
    const { dataSource } = this.state
    const baseIndex = dataSource.length
    this.setState({ loading: true })
    setTimeout(() => {
      const nextDatas = Array.from(new Array(10), (_, index) => (
        { name: `title ${index + baseIndex + 1}`, content: `content ${index + baseIndex + 1 }`}
      ))
      const newDataSource = [...dataSource, ...nextDatas]
      if (newDataSource.length >= 20) {
        this.setState({ loadingMore: false })
      }
      this.setState({ dataSource: [...dataSource, ...nextDatas], loading: false})
    }, 1000)
  }

  render () {
    const { dataSource, refreshing, loadingMore, loading } = this.state
    return (
      <div className="listview-demo">
        <ListView
          height="100%"
          refreshing={refreshing}
          refreshHandler={this.fetchData}
          onReachBottom={this.onReachBottom}
          loadingMore={loadingMore}
          loading={loading}
        >
          {
            dataSource.map((item, index) => {
              return (
                <div key={`card-${index}`} className="card" >
                  <p className="card-title">{item.name}</p>
                  <div className="card-content">{item.content}</div>
                  <br />
                </div>
              )
            })
          }
        </ListView>
      </div>
    )
  }
}
