import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons'
import Api from '../../../utils/api'
import { IOpenStreetMapLocationDto } from '@yellowgarbagebag/snow-white-shared'
import Card from '../../common/Card'

interface IState {
  searchText: string
  locations: Array<IOpenStreetMapLocationDto>
}

interface IProps {
  onLocationAdd: () => void
}

class LocationSearch extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      searchText: '',
      locations: [],
    }

    // ToDo: onButtonSearchClick
    this.onSearchStart = this.onSearchStart.bind(this)
    // ToDo: onTextSearchChange
    this.onSearchTextChange = this.onSearchTextChange.bind(this)
    // ToDo: onTextSearchKeyDown
    this.onSearchTextKeyDown = this.onSearchTextKeyDown.bind(this)
    // ToDo: onBtnSearchClick
    this.onSearchStart = this.onSearchStart.bind(this)
  }

  public render(): JSX.Element {
    const { locations }: IState = this.state

    return (
      <Card title="Standorte hinzufügen">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="z.B. Frankfurt am Main, Hauptbahnhof"
            value={this.state.searchText}
            onChange={this.onSearchTextChange}
            onKeyDown={this.onSearchTextKeyDown}
          />
          <div className="input-group-append">
            <button className="btn btn-secondary" type="button" onClick={this.onSearchStart}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>

        <table className="table">
          <tbody>
            {locations.map((location: IOpenStreetMapLocationDto) => (
              <tr key={location.remoteId}>
                <td>{location.name}</td>
                <td>
                  <button type="button" className="btn btn-light" onClick={this.onBtnAddClick.bind(this, location)}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    )
  }

  private async onSearchTextKeyDown(event: React.KeyboardEvent): Promise<void> {
    if (event.keyCode === 13) {
      await this.doSearch()
    }
  }

  private onSearchTextChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      searchText: event.currentTarget.value,
    })
  }

  // ToDo: event -> e (auch an den anderen Stellen)
  // ToDo: Typ von event nochmal prüfen
  private async onSearchStart(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    event.preventDefault()
    await this.doSearch()
  }

  private async onBtnAddClick(
    location: IOpenStreetMapLocationDto,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> {
    event.preventDefault()
    await this.doAddLocation(location)
  }

  private async doAddLocation(location: IOpenStreetMapLocationDto): Promise<void> {
    await Api.post<void>(`/v1/smartmirror/admin/common/locations`, location)
    this.props.onLocationAdd()
  }

  private async doSearch(): Promise<void> {
    const res: Array<IOpenStreetMapLocationDto> = await Api.get<Array<IOpenStreetMapLocationDto>>(
      `/v1/smartmirror/admin/common/locations/search/${this.state.searchText}`,
    )
    this.setState({
      locations: res,
    })
  }
}

export default LocationSearch
