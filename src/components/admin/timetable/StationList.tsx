import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Api from '../../../utils/api'
import { ISortOrderDto, ITimetableStationDto } from '@yellowgarbagebag/snow-white-shared'
import { faCaretDown, faCaretUp, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Dialog from '../../common/Dialog'
import Card from '../../common/Card'
import StationEdit from './StationEdit'

interface IState {
  stations: Array<ITimetableStationDto>
  showDeleteDialog: boolean
  showEditDialog: boolean
  selectedStation: ITimetableStationDto | null
}

interface IProps {
  update: number
  onStationChanged: () => void
}

class StationList extends React.Component<IProps, IState> {
  private timer: any = null

  constructor(props: IProps) {
    super(props)

    this.state = {
      selectedStation: null,
      showDeleteDialog: false,
      showEditDialog: false,
      stations: [],
    }

    this.onDeleteDialogClose = this.onDeleteDialogClose.bind(this)
    this.onEditDialogClose = this.onEditDialogClose.bind(this)
  }

  public async componentDidMount(): Promise<void> {
    await this.loadData()
  }

  public async componentDidUpdate(prevProps: IProps): Promise<void> {
    if (prevProps.update !== this.props.update) {
      await this.loadData()
    }
  }

  public render(): JSX.Element {
    const { stations }: IState = this.state

    return (
      <div>
        <Card title="Haltestellen verwalten">
          <table className="table">
            <tbody>
              {stations.map((station: ITimetableStationDto) => (
                <tr key={station.id}>
                  <td className="tdtext">{station.name}</td>
                  <td className="text-right">
                    <div className="btn-group" role="group">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={stations[0] === station}
                        onClick={this.onBtnUpClick.bind(this, station)}
                      >
                        <FontAwesomeIcon icon={faCaretUp} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={stations[stations.length - 1] === station}
                        onClick={this.onBtnDownClick.bind(this, station)}
                      >
                        <FontAwesomeIcon icon={faCaretDown} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={this.onBtnEditClick.bind(this, station)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={this.onBtnDeleteClick.bind(this, station)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        {this.state.showDeleteDialog && this.state.selectedStation && (
          <Dialog title="Löschen" dialogCloseCallback={this.onDeleteDialogClose} showBtnYes={true} showBtnNo={true}>
            Möchten Sie "{this.state.selectedStation.name}" wirklich löschen?
          </Dialog>
        )}
        {this.state.showEditDialog && this.state.selectedStation && (
          <Dialog
            title="Bearbeiten"
            dialogCloseCallback={this.onEditDialogClose}
            showBtnSave={true}
            showBtnAbort={true}
          >
            <StationEdit station={this.state.selectedStation} />
          </Dialog>
        )}
      </div>
    )
  }

  private async onEditDialogClose(name: DialogButtonName): Promise<void> {
    if (this.state.selectedStation && name === 'save') {
      const station: ITimetableStationDto = this.state.selectedStation
      await Api.put<void>(`/v1/smartmirror/admin/timetable/stations/${station.id}`, station)

      const existingLocation: ITimetableStationDto | undefined = this.state.stations.find(
        (x: ITimetableStationDto) => x.id === station.id,
      )
      Object.assign(existingLocation, station)

      this.setState({
        selectedStation: null,
        showEditDialog: false,
      })

      this.props.onStationChanged()
    } else {
      this.setState({
        showEditDialog: false,
      })
    }
  }

  private async onDeleteDialogClose(name: DialogButtonName): Promise<void> {
    if (this.state.selectedStation && name === 'yes') {
      const station: ITimetableStationDto = this.state.selectedStation
      await Api.delete<void>(`/v1/smartmirror/admin/timetable/stations/${station.id}`)

      this.setState({
        selectedStation: null,
        showDeleteDialog: false,
        stations: this.state.stations.filter((x: ITimetableStationDto) => x.id !== station.id),
      })

      this.props.onStationChanged()
    } else {
      this.setState({
        showDeleteDialog: false,
      })
    }
  }

  private onBtnDeleteClick(
    station: ITimetableStationDto,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    event.preventDefault()

    this.setState({
      selectedStation: station,
      showDeleteDialog: true,
    })
  }

  private onBtnEditClick(station: ITimetableStationDto, event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault()

    this.setState({
      selectedStation: Object.assign({}, station),
      showEditDialog: true,
    })
  }

  private onBtnUpClick(station: ITimetableStationDto, event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault()

    const idx: number = this.state.stations.indexOf(station)
    if (idx > 0) {
      this.insertAndShift(this.state.stations, idx, idx - 1)
    }
  }

  private onBtnDownClick(station: ITimetableStationDto, event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault()

    const idx: number = this.state.stations.indexOf(station)
    if (idx < this.state.stations.length - 1) {
      this.insertAndShift(this.state.stations, idx, idx + 1)
    }
  }

  private insertAndShift(arr: Array<ITimetableStationDto>, from: number, to: number): void {
    const cutOut: ITimetableStationDto = arr.splice(from, 1)[0]
    arr.splice(to, 0, cutOut)

    this.setState({
      stations: arr,
    })

    const data: Array<ISortOrderDto> = []
    for (let i = 0; i < arr.length; i++) {
      data.push({
        id: arr[i].id,
        sortNo: i,
      })
    }

    clearTimeout(this.timer)
    this.timer = setTimeout(async () => {
      await Api.put<void>('/v1/smartmirror/admin/timetable/stations/reorder', data)
    }, 500)
  }

  private async loadData(): Promise<void> {
    const res: Array<ITimetableStationDto> = await Api.get<Array<ITimetableStationDto>>(
      '/v1/smartmirror/admin/timetable/stations',
    )

    this.setState({
      stations: res.sort((a: ITimetableStationDto, b: ITimetableStationDto) => a.sortNo - b.sortNo),
    })
  }
}

export default StationList
