import React from 'react'
import FuelPriceStationSearch from './FuelPriceStationSearch'
import FuelPriceStationList from './FuelPriceStationList'
import FuelPriceSettings from './FuelPriceSettings'

interface IState {
  updateList: number
  updateSettings: number
}

interface IProps {}

class FuelPriceArea extends React.Component<IProps, IState> {
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
        <FuelPriceSettings update={this.state.updateSettings} />
        <FuelPriceStationList update={this.state.updateList} onStationChanged={this.onStationChanged} />
        <FuelPriceStationSearch onStationAdded={this.onStationAdded} />
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

export default FuelPriceArea
