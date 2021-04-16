import React from 'react'
import { ICommonLocationDto } from '@yellowgarbagebag/snow-white-shared'

interface IState {
  name: string
  nameOrigin: string
}

interface IProps {
  location: ICommonLocationDto
}

class LocationEdit extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      name: this.props.location.name,
      nameOrigin: this.props.location.nameOrigin,
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

  private async onNameChange(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    this.setState({
      name: event.currentTarget.value,
    })
    this.props.location.name = event.currentTarget.value
  }
}

export default LocationEdit
