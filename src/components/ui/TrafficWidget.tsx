import React from 'react'
import { ICarRoutesDto, ICarRouteDto } from '@yellowgarbagebag/snow-white-shared'
import Api from '../../utils/api'
import moment from 'moment'
import Widget from '../common/Widget'

interface IState {
  dto: ICarRoutesDto
  lastUpdate: string
}

interface IProps {
  refreshRate: number
}

class TrafficWidget extends React.Component<IProps, IState> {
  private interval?: NodeJS.Timeout

  constructor(props: IProps) {
    super(props)
    this.state = {
      dto: {
        routes: [],
        text: '',
      },
      lastUpdate: '',
    }
  }

  public componentDidMount(): void {
    this.loadData()
    this.interval = setInterval(() => this.loadData(), this.props.refreshRate)
  }

  public componentWillUnmount(): void {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  public render(): JSX.Element {
    return (
      <Widget title={this.state.dto.text} footer={this.state.lastUpdate} width={400}>
        <table className="table table-borderless table-sm">
          <thead>
            <tr>
              <th>Straßen</th>
              <th className="text-center" style={{ width: '75px' }}>
                Fahrzeit
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.dto.routes
              .sort((a: ICarRouteDto, b: ICarRouteDto): number => a.expectedTime - b.expectedTime)
              .map((route: ICarRouteDto) => (
                <tr key={route.text}>
                  <td className="tdtext">{route.streetTypes.join(', ')}</td>
                  <td className="text-center">{this.formatTime(route.expectedTime)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </Widget>
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

  private async loadData(): Promise<void> {
    const dto: ICarRoutesDto = await Api.get<ICarRoutesDto>('/v1/smartmirror/ui/traffic')
    this.setState({
      dto,
      lastUpdate: moment().format('HH:mm:ss'),
    })
  }
}

export default TrafficWidget
