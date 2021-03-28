import React from 'react'
import StationSearch from './StationSearch'
import StationList from './StationList'
import TimetableSettings from './TimetableSettings'

interface IState {
  updateList: number
  updateSettings: number
}

interface IProps {}

class TimetableArea extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      updateList: 0,
      updateSettings: 0,
    }

    this.onStationAdded = this.onStationAdded.bind(this)
    this.onStationChanged = this.onStationChanged.bind(this)
  }

  public render(): JSX.Element {
    return (
      <div className="content">
        <TimetableSettings update={this.state.updateSettings} />
        <StationList update={this.state.updateList} onStationChanged={this.onStationChanged} />
        <StationSearch onStationAdded={this.onStationAdded} />
      </div>
    )
  }

  private onStationAdded(): void {
    this.setState({
      updateList: new Date().valueOf(),
      updateSettings: new Date().valueOf(),
    })
  }

  private onStationChanged(): void {
    this.setState({
      updateSettings: new Date().valueOf(),
    })
  }
}

export default TimetableArea
