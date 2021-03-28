import React from 'react'
import Api from '../../../utils/api'
import { ICommonSettingsDto } from '@yellowgarbagebag/snow-white-dto'
import Card from '../../common/Card'

interface IState {
  morningStart: string
  morningEnd: string
}

interface IProps {}

// ToDo: In "Settings" ohne "Common" umbennen
class CommonSettings extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      morningEnd: '00:00',
      morningStart: '00:00',
    }

    this.onMorningStartChange = this.onMorningStartChange.bind(this)
    this.onMorningEndChange = this.onMorningEndChange.bind(this)
  }

  public async componentDidMount(): Promise<void> {
    // ToDo: Laden in eigene Funktion
    const res: ICommonSettingsDto = await Api.get<ICommonSettingsDto>('/v1/smartmirror/admin/common/settings')

    this.setState({
      morningEnd: this.formatTime(res.morningEnd),
      morningStart: this.formatTime(res.morningStart),
    })
  }

  public render(): JSX.Element {
    return (
      <Card title="Allgemeine Einstellungen">
        <form>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Vormittag</label>
            <div className="col-sm-8">
              <div className="form-row">
                <div className="col">
                  <label className="col-form-label">von</label>
                </div>
                <div className="col">
                  <input
                    className="form-control"
                    type="time"
                    value={this.state.morningStart}
                    onChange={this.onMorningStartChange}
                  />
                </div>
                <div className="col">
                  <label className="col-form-label">bis</label>
                </div>
                <div className="col">
                  <input
                    className="form-control"
                    type="time"
                    value={this.state.morningEnd}
                    onChange={this.onMorningEndChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Nachmittag</label>
            <div className="col-sm-8">
              <div className="form-row">
                <div className="col">
                  <label className="col-form-label">von</label>
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.morningEnd}
                    readOnly
                    style={{ width: 100 }}
                  />
                </div>
                <div className="col">
                  <label className="col-form-label">bis</label>
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.morningStart}
                    readOnly
                    style={{ width: 100 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Card>
    )
  }

  private formatTime(value: number): string {
    const date: Date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setSeconds(value)

    const hours: number = date.getHours()
    const minutes: number = date.getMinutes()

    const hoursStr: string = hours < 10 ? `0${hours}` : `${hours}`
    const minutesStr: string = minutes < 10 ? `0${minutes}` : `${minutes}`

    return `${hoursStr}:${minutesStr}`
  }

  private parseTime(value: string): number {
    const parts: Array<string> = value.split(':')
    return +parts[0] * 3600 + +parts[1] * 60
  }

  private onMorningStartChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState(
      {
        morningStart: event.currentTarget.value,
      },
      async () => this.saveValues(),
    )
  }

  private onMorningEndChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState(
      {
        morningEnd: event.currentTarget.value,
      },
      async () => this.saveValues(),
    )
  }

  private async saveValues(): Promise<void> {
    // ToDo: Delay bei Speicher einbauen
    await Api.put<ICommonSettingsDto>('/v1/smartmirror/admin/common/settings', {
      morningEnd: this.parseTime(this.state.morningEnd),
      morningStart: this.parseTime(this.state.morningStart),
    })
  }
}

export default CommonSettings
