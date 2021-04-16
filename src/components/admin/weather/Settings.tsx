import React from 'react'
import Api from '../../../utils/api'
import Card from '../../common/Card'
import { IWeatherSettingsDto, ICommonLocationDto } from '@yellowgarbagebag/snow-white-shared'
import Select from 'react-select'

interface IState {
  dto: IWeatherSettingsDto
  locations: Array<ICommonLocationDto>
}

interface IProps {}

class Settings extends React.Component<IProps, IState> {
  private timer: any = null

  constructor(props: IProps) {
    super(props)
    this.state = {
      dto: {
        apiKey: '',
        isActive: false,
        locationId: '',
      },
      locations: [],
    }

    this.onCheckboxIsActiveChange = this.onCheckboxIsActiveChange.bind(this)
    this.onTextApiKeyChange = this.onTextApiKeyChange.bind(this)
    this.onSelectLocationChange = this.onSelectLocationChange.bind(this)
  }

  public async componentDidMount(): Promise<void> {
    const dto: IWeatherSettingsDto = await Api.get<IWeatherSettingsDto>('/v1/smartmirror/admin/weather/settings')
    const locations: Array<ICommonLocationDto> = await Api.get<Array<ICommonLocationDto>>(
      '/v1/smartmirror/admin/common/locations',
    )

    this.setState({
      dto,
      locations: locations.sort((a: ICommonLocationDto, b: ICommonLocationDto): number => a.sortNo - b.sortNo),
    })
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
                <a href="https://openweathermap.org/appid/" target="_blank" rel="noopener noreferrer">
                  API-Key beantragen
                </a>
              </div>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Ort</label>
            <div className="col-sm-8">
              <Select
                isDisabled={!this.state.dto.isActive}
                options={this.state.locations}
                onChange={this.onSelectLocationChange}
                value={this.state.locations.filter(
                  (location: ICommonLocationDto): boolean => location.id === this.state.dto.locationId,
                )}
                getOptionLabel={(option: ICommonLocationDto): string => option.name}
                getOptionValue={(option: ICommonLocationDto): string => option.id}
                placeholder={'Bitte auswählen...'}
              />
            </div>
          </div>
        </form>
      </Card>
    )
  }

  private onSelectLocationChange(value: any): void {
    this.setState(
      {
        dto: {
          ...this.state.dto,
          locationId: value.id,
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
      await Api.put<IWeatherSettingsDto>('/v1/smartmirror/admin/weather/settings', this.state.dto)
    }, 333)
  }
}

export default Settings
