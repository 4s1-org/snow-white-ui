import React from 'react'
import { IFuelPriceStationDto } from '@4s1/snow-white-shared'

interface IState {
  name: string
  nameOrigin: string
}

interface IProps {
  station: IFuelPriceStationDto
}

class FuelPriceStationEdit extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      name: this.props.station.name,
      nameOrigin: this.props.station.nameOrigin,
    }

    this.onNameChange = this.onNameChange.bind(this)
  }

  public render(): JSX.Element {
    return (
      <form>
        <div className="form-group row">
          <label className="col-sm-4 col-form-label">Originalname</label>
          <div className="col-sm-8">
            <input type="text" className="form-control" value={this.state.nameOrigin} readOnly />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-4 col-form-label">Neuer Name</label>
          <div className="col-sm-8">
            <input type="text" className="form-control" value={this.state.name} onChange={this.onNameChange} />
          </div>
        </div>
      </form>
    )
  }

  private onNameChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      name: event.currentTarget.value,
    })
    this.props.station.name = event.currentTarget.value
  }
}

export default FuelPriceStationEdit
