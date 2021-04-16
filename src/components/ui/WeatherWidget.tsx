import React from 'react'
import { IWeatherDatasDto, IWeatherDataDto } from '@yellowgarbagebag/snow-white-shared'
import Api from '../../utils/api'
import moment from 'moment'
import Widget from '../common/Widget'

interface IState {
  dto: IWeatherDatasDto
  lastUpdate: string
}

interface IProps {
  refreshRate: number
}

class WeatherWidget extends React.Component<IProps, IState> {
  private interval?: NodeJS.Timeout

  constructor(props: IProps) {
    super(props)
    this.state = {
      dto: {
        infos: [],
        name: '',
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
      <Widget title={this.state.dto.name} footer={this.state.lastUpdate} width={400}>
        <div className="container">
          <div className="row">
            {this.state.dto.infos.map((info: IWeatherDataDto) => (
              <div key={info.timestamp} className="col-sm weatherEntry text-center">
                {moment(info.timestamp * 1000).format('HH:mm')} Uhr
                <br />
                <img src={`weathericons/${info.icon}.png`} alt="" />
                <br />
                {Math.round(info.temperature)}&deg / {Math.round(info.temperatureFeelsLike)}&deg
                <br />
                {info.conditionText}
              </div>
            ))}
          </div>
        </div>
      </Widget>
    )
  }

  private async loadData(): Promise<void> {
    const dto: IWeatherDatasDto = await Api.get<IWeatherDatasDto>('/v1/smartmirror/ui/weather')
    this.setState({
      dto,
      lastUpdate: moment().format('HH:mm:ss'),
    })
  }
}

export default WeatherWidget
