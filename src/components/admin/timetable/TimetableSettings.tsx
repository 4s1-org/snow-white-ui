import React from 'react'
import Api from '../../../utils/api'
import Card from '../../common/Card'
import { ITimetableSettingsDto, ITimetableStationDto } from '@yellowgarbagebag/snow-white-dto'
import Select from 'react-select'

interface IState {
  dto: ITimetableSettingsDto
  stations: Array<ITimetableStationDto>
}

interface IProps {
  update: number
}

class TimetableSettings extends React.Component<IProps, IState> {
  private timer: any = null

  constructor(props: IProps) {
    super(props)
    this.state = {
      dto: {
        apiKey: '',
        isActive: false,
        lines: {
          showBus: false,
          showIC: false,
          showICE: false,
          showRB: false,
          showRE: false,
          showSBahn: false,
          showTram: false,
          showUBahn: false,
        },
        maxChanges: 3,
        stationFromId: null,
        stationToId: null,
      },
      stations: [],
    }

    this.onCheckboxIsActiveChange = this.onCheckboxIsActiveChange.bind(this)
    this.onTextApiKeyChange = this.onTextApiKeyChange.bind(this)
    this.onSelectStationFromChange = this.onSelectStationFromChange.bind(this)
    this.onSelectStationToChange = this.onSelectStationToChange.bind(this)

    this.onCheckboxICEChange = this.onCheckboxICEChange.bind(this)
    this.onCheckboxICChange = this.onCheckboxICChange.bind(this)
    this.onCheckboxREChange = this.onCheckboxREChange.bind(this)
    this.onCheckboxRBChange = this.onCheckboxRBChange.bind(this)
    this.onCheckboxSBahnChange = this.onCheckboxSBahnChange.bind(this)
    this.onCheckboxBusChange = this.onCheckboxBusChange.bind(this)
    this.onCheckboxTramChange = this.onCheckboxTramChange.bind(this)
    this.onCheckboxUBahnChange = this.onCheckboxUBahnChange.bind(this)
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
    return (
      <Card title="Einstellungen">
        <form>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Widget aktiv</label>
            <div className="col-sm-8">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={this.state.dto.isActive}
                  onChange={this.onCheckboxIsActiveChange}
                />
              </div>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">API-Key</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                disabled={!this.state.dto.isActive}
                value={this.state.dto.apiKey}
                onChange={this.onTextApiKeyChange}
              />
              <div className="text-right">
                <a href="https://opendata.rmv.de/" target="_blank" rel="noopener noreferrer">
                  API-Key beantragen
                </a>
              </div>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Von</label>
            <div className="col-sm-8">
              <Select
                isDisabled={!this.state.dto.isActive}
                options={this.state.stations}
                onChange={this.onSelectStationFromChange}
                value={this.state.stations.filter(
                  (station: ITimetableStationDto): boolean => station.id === this.state.dto.stationFromId,
                )}
                getOptionLabel={(option: ITimetableStationDto): string => option.name}
                getOptionValue={(option: ITimetableStationDto): string => option.id}
                placeholder={'Bitte auswählen...'}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Nach</label>
            <div className="col-sm-8">
              <Select
                isDisabled={!this.state.dto.isActive}
                options={this.state.stations}
                onChange={this.onSelectStationToChange}
                value={this.state.stations.filter(
                  (station: ITimetableStationDto): boolean => station.id === this.state.dto.stationToId,
                )}
                getOptionLabel={(option: ITimetableStationDto): string => option.name}
                getOptionValue={(option: ITimetableStationDto): string => option.id}
                placeholder={'Bitte auswählen...'}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Verkehrsmittel</label>
            <div className="col-sm-8">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  disabled={!this.state.dto.isActive}
                  checked={this.state.dto.lines.showICE}
                  onChange={this.onCheckboxICEChange}
                />
                <label className="form-check-label">ICE</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  disabled={!this.state.dto.isActive}
                  checked={this.state.dto.lines.showIC}
                  onChange={this.onCheckboxICChange}
                />
                <label className="form-check-label">IC</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  disabled={!this.state.dto.isActive}
                  checked={this.state.dto.lines.showRE}
                  onChange={this.onCheckboxREChange}
                />
                <label className="form-check-label">RE</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  disabled={!this.state.dto.isActive}
                  checked={this.state.dto.lines.showRB}
                  onChange={this.onCheckboxRBChange}
                />
                <label className="form-check-label">RB</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  disabled={!this.state.dto.isActive}
                  checked={this.state.dto.lines.showUBahn}
                  onChange={this.onCheckboxUBahnChange}
                />
                <label className="form-check-label">U-Bahn</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  disabled={!this.state.dto.isActive}
                  checked={this.state.dto.lines.showSBahn}
                  onChange={this.onCheckboxSBahnChange}
                />
                <label className="form-check-label">S-Bahn</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  disabled={!this.state.dto.isActive}
                  checked={this.state.dto.lines.showTram}
                  onChange={this.onCheckboxTramChange}
                />
                <label className="form-check-label">Tram</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  disabled={!this.state.dto.isActive}
                  checked={this.state.dto.lines.showBus}
                  onChange={this.onCheckboxBusChange}
                />
                <label className="form-check-label">Bus</label>
              </div>
            </div>
          </div>
        </form>
      </Card>
    )
  }

  private onCheckboxTramChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState(
      {
        dto: {
          ...this.state.dto,
          lines: {
            ...this.state.dto.lines,
            showTram: e.currentTarget.checked,
          },
        },
      },
      this.saveValues,
    )
  }

  private onCheckboxICEChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState(
      {
        dto: {
          ...this.state.dto,
          lines: {
            ...this.state.dto.lines,
            showICE: e.currentTarget.checked,
          },
        },
      },
      this.saveValues,
    )
  }

  private onCheckboxICChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState(
      {
        dto: {
          ...this.state.dto,
          lines: {
            ...this.state.dto.lines,
            showIC: e.currentTarget.checked,
          },
        },
      },
      this.saveValues,
    )
  }

  private onCheckboxSBahnChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState(
      {
        dto: {
          ...this.state.dto,
          lines: {
            ...this.state.dto.lines,
            showSBahn: e.currentTarget.checked,
          },
        },
      },
      this.saveValues,
    )
  }

  private onCheckboxUBahnChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState(
      {
        dto: {
          ...this.state.dto,
          lines: {
            ...this.state.dto.lines,
            showUBahn: e.currentTarget.checked,
          },
        },
      },
      this.saveValues,
    )
  }

  private onCheckboxRBChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState(
      {
        dto: {
          ...this.state.dto,
          lines: {
            ...this.state.dto.lines,
            showRB: e.currentTarget.checked,
          },
        },
      },
      this.saveValues,
    )
  }

  private onCheckboxREChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState(
      {
        dto: {
          ...this.state.dto,
          lines: {
            ...this.state.dto.lines,
            showRE: e.currentTarget.checked,
          },
        },
      },
      this.saveValues,
    )
  }

  private onCheckboxBusChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState(
      {
        dto: {
          ...this.state.dto,
          lines: {
            ...this.state.dto.lines,
            showBus: e.currentTarget.checked,
          },
        },
      },
      this.saveValues,
    )
  }

  private onSelectStationFromChange(value: any): void {
    this.setState(
      {
        dto: {
          ...this.state.dto,
          stationFromId: value.id,
        },
      },
      this.saveValues,
    )
  }

  private onSelectStationToChange(value: any): void {
    this.setState(
      {
        dto: {
          ...this.state.dto,
          stationToId: value.id,
        },
      },
      this.saveValues,
    )
  }

  private onCheckboxIsActiveChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState(
      {
        dto: {
          ...this.state.dto,
          isActive: e.currentTarget.checked,
        },
      },
      this.saveValues,
    )
  }

  private onTextApiKeyChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState(
      {
        dto: {
          ...this.state.dto,
          apiKey: e.currentTarget.value,
        },
      },
      this.saveValues,
    )
  }

  private saveValues(): void {
    clearTimeout(this.timer)
    this.timer = setTimeout(async () => {
      await Api.put<ITimetableSettingsDto>('/v1/smartmirror/admin/timetable/settings', this.state.dto)
    }, 333)
  }

  private async loadData(): Promise<void> {
    const stations: Array<ITimetableStationDto> = await Api.get<Array<ITimetableStationDto>>(
      '/v1/smartmirror/admin/timetable/stations',
    )
    const dto: ITimetableSettingsDto = await Api.get<ITimetableSettingsDto>('/v1/smartmirror/admin/timetable/settings')
    this.setState({
      dto,
      stations: stations.sort((a: ITimetableStationDto, b: ITimetableStationDto): number => a.sortNo - b.sortNo),
    })
  }
}

export default TimetableSettings
