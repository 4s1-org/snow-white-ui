import React from 'react'
import Api from '../../../utils/api'
import Card from '../../common/Card'
import { ITrafficSettingsDto, IDateSettingsDto } from '@yellowgarbagebag/snow-white-shared'
import moment from 'moment'
import 'moment/locale/de'
import Select from 'react-select'
moment.locale('de')

interface IState {
  dto: IDateSettingsDto
  preview: string
}

interface IProps {}

class Settings extends React.Component<IProps, IState> {
  private timer: any = null

  constructor(props: IProps) {
    super(props)
    this.state = {
      dto: {
        fontSize: 12,
        isActive: false,
        pattern: '',
      },
      preview: '',
    }

    this.onCheckboxIsActiveChange = this.onCheckboxIsActiveChange.bind(this)
    this.onTextPatternChange = this.onTextPatternChange.bind(this)
    this.onSelectFontSizeChange = this.onSelectFontSizeChange.bind(this)
  }

  public async componentDidMount(): Promise<void> {
    const dto: IDateSettingsDto = await Api.get<IDateSettingsDto>('/v1/smartmirror/admin/date/settings')

    this.setState({
      dto,
      preview: moment().format(dto.pattern),
    })
  }

  public render(): JSX.Element {
    const fontSizeOptions: Array<{ id: number }> = []
    for (let i = 8; i <= 28; i += 2) {
      fontSizeOptions.push({ id: i })
    }

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
            <label className="col-sm-4 col-form-label">Format</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                disabled={!this.state.dto.isActive}
                value={this.state.dto.pattern}
                onChange={this.onTextPatternChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Schriftgröße</label>
            <div className="col-sm-8">
              <Select
                isDisabled={!this.state.dto.isActive}
                options={fontSizeOptions}
                onChange={this.onSelectFontSizeChange}
                value={fontSizeOptions.filter(
                  (option: { id: number }): boolean => option.id === this.state.dto.fontSize,
                )}
                getOptionLabel={(option: { id: number }): string => option.id.toString()}
                getOptionValue={(option: { id: number }): string => option.id.toString()}
                placeholder={'Bitte auswählen...'}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Vorschau</label>
            <div className="col-sm-8">
              <input type="text" className="form-control" disabled={true} value={this.state.preview} />
            </div>
          </div>
        </form>
        <table className="table">
          <thead>
            <tr>
              <th>Wert</th>
              <th>Beschreibung</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>DD</td>
              <td>Tag als Zahl</td>
            </tr>
            <tr>
              <td>MM</td>
              <td>Monat als Zahl</td>
            </tr>
            <tr>
              <td>MMM</td>
              <td>Monat als Text (Kurzform)</td>
            </tr>
            <tr>
              <td>MMMM</td>
              <td>Monat als Text (Langform)</td>
            </tr>
            <tr>
              <td>YY</td>
              <td>Jahr (zweistellig)</td>
            </tr>
            <tr>
              <td>YYYY</td>
              <td>Jahr (zweistellig)</td>
            </tr>
            <tr>
              <td>HH</td>
              <td>Stunden (24-Stunden-Format)</td>
            </tr>
            <tr>
              <td>hh</td>
              <td>Stunden (12-Stunden-Format)</td>
            </tr>
            <tr>
              <td>mm</td>
              <td>Minuten</td>
            </tr>
            <tr>
              <td>ss</td>
              <td>Sekunden</td>
            </tr>
            <tr>
              <td>dd</td>
              <td>Wochentag (2-stellig)</td>
            </tr>
            <tr>
              <td>ddd</td>
              <td>Wochentag (3-stellig)</td>
            </tr>
            <tr>
              <td>dddd</td>
              <td>Wochentag (vollständig)</td>
            </tr>
          </tbody>
        </table>
      </Card>
    )
  }

  private onSelectFontSizeChange(value: any): void {
    this.setState(
      {
        dto: {
          ...this.state.dto,
          fontSize: value.id,
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

  private onTextPatternChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState(
      {
        dto: {
          ...this.state.dto,
          pattern: e.currentTarget.value,
        },
        preview: moment().format(e.currentTarget.value),
      },
      this.saveValues,
    )
  }

  private saveValues(): void {
    clearTimeout(this.timer)
    this.timer = setTimeout(async () => {
      await Api.put<ITrafficSettingsDto>('/v1/smartmirror/admin/date/settings', this.state.dto)
    }, 333)
  }
}

export default Settings
