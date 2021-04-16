import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Api from '../../../utils/api'
import { ICommonLocationDto, ISortOrderDto } from '@yellowgarbagebag/snow-white-shared'
import { faCaretDown, faCaretUp, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Dialog from '../../common/Dialog'
import LocationEdit from './LocationEdit'
import Card from '../../common/Card'

interface IState {
  locations: ICommonLocationDto[]
  showDeleteDialog: boolean
  showEditDialog: boolean
  selectedLocation: ICommonLocationDto | null
}

interface IProps {
  update: number
}

class LocationList extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      locations: [],
      showDeleteDialog: false,
      showEditDialog: false,
      selectedLocation: null,
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
    const { locations }: IState = this.state

    return (
      <div>
        <Card title="Standorte verwalten">
          <table className="table">
            <tbody>
              {locations.map((location: ICommonLocationDto) => (
                <tr key={location.id}>
                  <td className="tdtext">{location.name}</td>
                  <td className="text-right">
                    <div className="btn-group" role="group">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={locations[0] === location}
                        onClick={this.onBtnUpClick.bind(this, location)}
                      >
                        <FontAwesomeIcon icon={faCaretUp} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={locations[locations.length - 1] === location}
                        onClick={this.onBtnDownClick.bind(this, location)}
                      >
                        <FontAwesomeIcon icon={faCaretDown} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={this.onBtnEditClick.bind(this, location)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={this.onBtnDeleteClick.bind(this, location)}
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
        {this.state.showDeleteDialog && this.state.selectedLocation && (
          <Dialog title="Löschen" dialogCloseCallback={this.onDeleteDialogClose} showBtnYes={true} showBtnNo={true}>
            Möchten Sie "{this.state.selectedLocation.name}" wirklich löschen?
          </Dialog>
        )}
        {this.state.showEditDialog && this.state.selectedLocation && (
          <Dialog
            title="Bearbeiten"
            dialogCloseCallback={this.onEditDialogClose}
            showBtnSave={true}
            showBtnAbort={true}
          >
            <LocationEdit location={this.state.selectedLocation} />
          </Dialog>
        )}
      </div>
    )
  }

  private async onEditDialogClose(name: DialogButtonName): Promise<void> {
    if (this.state.selectedLocation && name === 'save') {
      const location: ICommonLocationDto = this.state.selectedLocation
      await Api.put<void>(`/v1/smartmirror/admin/common/locations/${location.id}`, location)

      const existingLocation: ICommonLocationDto | undefined = this.state.locations.find(
        (x: ICommonLocationDto) => x.id === location.id,
      )
      Object.assign(existingLocation, location)

      this.setState({
        selectedLocation: null,
        showEditDialog: false,
      })
    } else {
      this.setState({
        showEditDialog: false,
      })
    }
  }

  private async onDeleteDialogClose(name: DialogButtonName): Promise<void> {
    if (this.state.selectedLocation && name === 'yes') {
      const location: ICommonLocationDto = this.state.selectedLocation
      await Api.delete<void>(`/v1/smartmirror/admin/common/locations/${location.id}`)
      this.setState({
        locations: this.state.locations.filter((x: ICommonLocationDto) => x.id !== location.id),
        selectedLocation: null,
        showDeleteDialog: false,
      })
    } else {
      this.setState({
        showDeleteDialog: false,
      })
    }
  }

  private async onBtnDeleteClick(
    location: ICommonLocationDto,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> {
    event.preventDefault()

    this.setState({
      selectedLocation: location,
      showDeleteDialog: true,
    })
  }

  private async onBtnEditClick(
    location: ICommonLocationDto,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> {
    event.preventDefault()

    this.setState({
      selectedLocation: Object.assign({}, location),
      showEditDialog: true,
    })
  }

  private async onBtnUpClick(
    location: ICommonLocationDto,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> {
    event.preventDefault()

    const idx: number = this.state.locations.indexOf(location)
    if (idx > 0) {
      await this.insertAndShift(this.state.locations, idx, idx - 1)
    }
  }

  private async onBtnDownClick(
    location: ICommonLocationDto,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> {
    event.preventDefault()

    const idx: number = this.state.locations.indexOf(location)
    if (idx < this.state.locations.length - 1) {
      await this.insertAndShift(this.state.locations, idx, idx + 1)
    }
  }

  private async insertAndShift(arr: ICommonLocationDto[], from: number, to: number): Promise<void> {
    const cutOut: ICommonLocationDto = arr.splice(from, 1)[0]
    arr.splice(to, 0, cutOut)

    this.setState({
      locations: arr,
    })

    const data: ISortOrderDto[] = []
    for (let i = 0; i < arr.length; i++) {
      data.push({
        id: arr[i].id,
        sortNo: i,
      })
    }
    // ToDo: Delay bei Speicher einbauen
    await Api.put<void>(`/v1/smartmirror/admin/common/locations/reorder`, data)
  }

  private async loadData(): Promise<void> {
    const res: ICommonLocationDto[] = await Api.get<ICommonLocationDto[]>('/v1/smartmirror/admin/common/locations')

    this.setState({
      locations: res.sort((a: ICommonLocationDto, b: ICommonLocationDto) => a.sortNo - b.sortNo),
    })
  }
}

export default LocationList
