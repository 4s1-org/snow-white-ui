import React from 'react'
import CommonSettings from './CommonSettings'
import LocationSearch from './LocationSearch'
import LocationList from './LocationList'

interface IState {
  updateLocationList: number
}

interface IProps {}

class CommonArea extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      updateLocationList: 0,
    }

    this.onLocationAdd = this.onLocationAdd.bind(this)
  }

  public render(): JSX.Element {
    return (
      <div className="content">
        <CommonSettings />
        <LocationList update={this.state.updateLocationList} />
        <LocationSearch onLocationAdd={this.onLocationAdd} />
      </div>
    )
  }

  private onLocationAdd(): void {
    this.setState({
      updateLocationList: new Date().valueOf(),
    })
  }
}

export default CommonArea
