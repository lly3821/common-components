import React from 'react';
import  ListView from '@components/listview/listview'
import './base.less';

const testData = Array.from(new Array(4), (_, index) => ({ name: `title ${index + 1}`, content: `content ${index + 1 }`}))

export default class App extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      dataSource: testData,
      refreshStatus: 'pull',
      loadingMore: true,
      loading: false,
    }
  }

  fetchData = () => {
    setTimeout(() => {
      this.setState({ dataSource: testData })
    }, 2000)
  }

  onReachBottom = () => {
    const { dataSource } = this.state
    const baseIndex = dataSource.length
    this.setState({ loading: true })
    setTimeout(() => {
      const nextDatas = Array.from(new Array(4), (_, index) => (
        { name: `title ${index + baseIndex + 1}`, content: `content ${index + baseIndex + 1 }`}
      ))
      const newDataSource = [...dataSource, ...nextDatas]
      if (newDataSource.length >= 20) {
        this.setState({ loadingMore: false })
      }
      this.setState({ dataSource: [...dataSource, ...nextDatas], loading: false})
    }, 2000)
  }

  render () {
    const { dataSource, refreshStatus, loadingMore, loading } = this.state
    return (
      <div style={{ height: 400 }}>
        <ListView
          refreshStatus={refreshStatus}
          refreshHandler={this.fetchData}
          onReachBottom={this.onReachBottom}
          loadingMore={loadingMore}
          loading={loading}
        >
          {
            dataSource.map((item, index) => {
              return (
                <div key={`card-${index}`} style={{border: '1px solid #ddd', borderRadius: 5, margin: 10 }}>
                  <p style={{ borderBottom: '1px solid #ddd' }}>{item.name}</p>
                  <p>{item.content}</p>
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
