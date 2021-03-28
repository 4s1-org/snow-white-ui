import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons'
import Api from '../../../utils/api'
import { IRmvStationDto, ICommonLocationDto, ICoordinatesDto } from '@yellowgarbagebag/snow-white-dto'
import Card from '../../common/Card'
import Select from 'react-select'

interface IState {
  selectedLocation: ICommonLocationDto | null
  stations: Array<IRmvStationDto>
  locations: Array<ICommonLocationDto>
}

interface IProps {
  onStationAdded: () => void
}

class StationSearch extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      locations: [],
      selectedLocation: null,
      stations: [],
    }
    this.onSelectLocationChange = this.onSelectLocationChange.bind(this)
    this.onBtnSearchClick = this.onBtnSearchClick.bind(this)
  }

  public async componentDidMount(): Promise<void> {
    const locations: Array<ICommonLocationDto> = await Api.get<Array<ICommonLocationDto>>(
      '/v1/smartmirror/admin/common/locations',
    )

    this.setState({
      locations: locations.sort((a: ICommonLocationDto, b: ICommonLocationDto): number => a.sortNo - b.sortNo),
    })
  }

  public render(): JSX.Element {
    const { stations, locations }: IState = this.state

    const style: any = {
      container: (provided: any): any => ({
        ...provided,
        flex: 1,
      }),
      control: (base: any): any => ({
        ...base,
        borderBottomRightRadius: 0,
        borderRadius: '0.25rem',
        borderTopRightRadius: 0,
      }),
    }

    return (
      <Card title="Haltestellen hinzufügen">
        <div className="input-group mb-3">
          <Select
            styles={style}
            options={locations}
            onChange={this.onSelectLocationChange}
            getOptionLabel={(option: ICommonLocationDto): string => option.name}
            getOptionValue={(option: ICommonLocationDto): string => option.id}
            placeholder={'Bitte auswählen...'}
          />

          <div className="input-group-append">
            <button className="btn btn-secondary" type="button" onClick={this.onBtnSearchClick}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>

        <table className="table">
          <tbody>
            {stations.map((station: IRmvStationDto) => (
              <tr key={station.remoteId}>
                <td>{station.name}</td>
                <td>
                  <button type="button" className="btn btn-light" onClick={this.onBtnAddClick.bind(this, station)}>
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

  private onSelectLocationChange(value: any): void {
    this.setState({
      selectedLocation: value,
    })
  }

  // ToDo: Typ von event nochmal prüfen
  private async onBtnSearchClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    e.preventDefault()
    await this.doSearch()
  }

  private async onBtnAddClick(
    location: IRmvStationDto,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> {
    e.preventDefault()
    await this.doAdd(location)
  }

  private async doAdd(location: IRmvStationDto): Promise<void> {
    await Api.post<void>(`/v1/smartmirror/admin/timetable/stations`, location)
    this.props.onStationAdded()
  }

  private async doSearch(): Promise<void> {
    if (this.state.selectedLocation) {
      const coords: ICoordinatesDto = {
        latitude: this.state.selectedLocation.latitude,
        longitude: this.state.selectedLocation.longitude,
      }

      const res: Array<IRmvStationDto> = await Api.post<Array<IRmvStationDto>>(
        `/v1/smartmirror/admin/timetable/stations/search/`,
        coords,
      )
      this.setState({
        stations: res,
      })
    }
  }
}

export default StationSearch
