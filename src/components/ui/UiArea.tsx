import React from 'react'
import TrafficWidget from './TrafficWidget'
import './UiArea.css'
import DateWidget from './DateWidget'
import FuelPriceWidget from './FuelPriceWidget'
import TimetableWidget from './TimetableWidget'
import { IUiSettingsDto } from '@yellowgarbagebag/snow-white-dto'
import Api from '../../utils/api'
import WeatherWidget from './WeatherWidget'

interface IState {
  dto: IUiSettingsDto
}

interface IProps {}

class UiArea extends React.Component<IProps, IState> {
  private interval?: NodeJS.Timeout
  private readonly refreshRate: number = 2 * 60 * 1000 // 2 minutes

  constructor(props: IProps) {
    super(props)
    this.state = {
      dto: {
        date: {
          fontSize: 12,
          isActive: false,
        },
        fuelPrice: {
          interval: 15 * 3600,
          isActive: false,
          showDiesel: false,
          showE10: false,
          showE5: false,
        },
        timetable: {
          isActive: false,
        },
        traffic: {
          isActive: false,
        },
        weather: {
          isActive: false,
        },
      },
    }
  }

  public componentDidMount(): void {
    this.loadData()
    this.interval = setInterval(() => this.loadData(), this.refreshRate)
  }

  public componentWillUnmount(): void {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  public render(): JSX.Element {
    // Hacky background color
    document.body.style.backgroundColor = 'black'
    document.body.style.lineHeight = 'unset'

    return (
      <div>
        <div className="float-lg-left">
          {this.state.dto.weather.isActive && <WeatherWidget refreshRate={2 * 60 * 1000} />}
          {this.state.dto.traffic.isActive && <TrafficWidget refreshRate={2 * 60 * 1000} />}
          {this.state.dto.fuelPrice.isActive && (
            <FuelPriceWidget
              refreshRate={this.state.dto.fuelPrice.interval * 1000}
              showDiesel={this.state.dto.fuelPrice.showDiesel}
              showE10={this.state.dto.fuelPrice.showE10}
              showE5={this.state.dto.fuelPrice.showE5}
            />
          )}
        </div>
        <div className="float-lg-right">
          {this.state.dto.date.isActive && (
            <DateWidget refreshRate={1 * 1000} fontSize={this.state.dto.date.fontSize} />
          )}
          {this.state.dto.timetable.isActive && <TimetableWidget refreshRate={2 * 60 * 1000} />}
        </div>
      </div>
    )
  }

  private async loadData(): Promise<void> {
    const dto: IUiSettingsDto = await Api.get<IUiSettingsDto>('/v1/smartmirror/ui/settings')
    this.setState({
      dto,
    })
  }
}

export default UiArea
