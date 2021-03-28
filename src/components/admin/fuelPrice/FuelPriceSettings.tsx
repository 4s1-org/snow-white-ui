import React from 'react'
import Api from '../../../utils/api'
import Card from '../../common/Card'
import { IFuelPriceSettingsDto, IFuelPriceStationDto } from '@yellowgarbagebag/snow-white-dto'
import Select from 'react-select'

interface IState {
  dto: IFuelPriceSettingsDto
  stations: Array<IFuelPriceStationDto>
}

interface IProps {
  update: number
}

class FuelPriceSettings extends React.Component<IProps, IState> {
  private timer: any = null

  constructor(props: IProps) {
    super(props)
    this.state = {
      dto: {
        apiKey: '',
        interval: 15,
        isActive: false,
        showDiesel: false,
        showE10: false,
        showE5: false,
      },
      stations: [],
    }

    this.onCheckboxIsActiveChange = this.onCheckboxIsActiveChange.bind(this)
    this.onTextApiKeyChange = this.onTextApiKeyChange.bind(this)
    this.onCheckboxE5Change = this.onCheckboxE5Change.bind(this)
    this.onCheckboxE10Change = this.onCheckboxE10Change.bind(this)
    this.onCheckboxDieselChange = this.onCheckboxDieselChange.bind(this)
    this.onSelectIntervalChange = this.onSelectIntervalChange.bind(this)
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
    const intervalOptions: Array<{ value: number; label: string }> = [
      {
        label: '15 Minuten',
        value: 15 * 3600,
      },
      {
        label: '30 Minuten',
        value: 30 * 3600,
      },
      {
        label: '60 Minuten',
        value: 60 * 3600,
      },
    ]

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
                <a href="https://creativecommons.tankerkoenig.de/" target="_blank" rel="noopener noreferrer">
                  API-Key beantragen
                </a>
              </div>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Abfrageintervall</label>
            <div className="col-sm-8">
              <Select
                isDisabled={!this.state.dto.isActive}
                options={intervalOptions}
                onChange={this.onSelectIntervalChange}
                value={intervalOptions.filter(
                  (option: { value: number; label: string }): boolean => option.value === this.state.dto.interval,
                )}
                getOptionLabel={(option: { value: number; label: string }): string => option.label}
                getOptionValue={(option: { value: number; label: string }): string => option.value.toString()}
                placeholder={'Bitte auswählen...'}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Kraftstoffsorten</label>
            <div className="col-sm-8">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  disabled={!this.state.dto.isActive}
                  checked={this.state.dto.showE5}
                  onChange={this.onCheckboxE5Change}
                />
                <label className="form-check-label">E5</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  disabled={!this.state.dto.isActive}
                  checked={this.state.dto.showE10}
                  onChange={this.onCheckboxE10Change}
                />
                <label className="form-check-label">E10</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  disabled={!this.state.dto.isActive}
                  checked={this.state.dto.showDiesel}
                  onChange={this.onCheckboxDieselChange}
                />
                <label className="form-check-label">Diesel</label>
              </div>
            </div>
          </div>
        </form>
      </Card>
    )
  }

  private async loadData(): Promise<void> {
    const stations: Array<IFuelPriceStationDto> = await Api.get<Array<IFuelPriceStationDto>>(
      '/v1/smartmirror/admin/fuelprice/stations',
    )
    const dto: IFuelPriceSettingsDto = await Api.get<IFuelPriceSettingsDto>('/v1/smartmirror/admin/fuelprice/settings')
    this.setState({
      dto,
      stations,
    })
  }

  private onSelectIntervalChange(value: any): void {
    this.setState(
      {
        dto: {
          ...this.state.dto,
          interval: value.value,
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

  private onCheckboxE5Change(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState(
      {
        dto: {
          ...this.state.dto,
          showE5: e.currentTarget.checked,
        },
      },
      this.saveValues,
    )
  }

  private onCheckboxE10Change(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState(
      {
        dto: {
          ...this.state.dto,
          showE10: e.currentTarget.checked,
        },
      },
      this.saveValues,
    )
  }

  private onCheckboxDieselChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState(
      {
        dto: {
          ...this.state.dto,
          showDiesel: e.currentTarget.checked,
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
      await Api.put<IFuelPriceSettingsDto>('/v1/smartmirror/admin/fuelprice/settings', this.state.dto)
    }, 333)
  }
}

export default FuelPriceSettings
