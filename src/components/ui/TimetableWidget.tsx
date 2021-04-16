import React from 'react'
import { IRmvTripsDto, IRmvTripDto } from '@yellowgarbagebag/snow-white-shared'
import Api from '../../utils/api'
import moment from 'moment'
import Widget from '../common/Widget'

interface IState {
  dto: IRmvTripsDto
  lastUpdate: string
}

interface IProps {
  refreshRate: number
}

class TimetableWidget extends React.Component<IProps, IState> {
  private interval?: NodeJS.Timeout
  private readonly okDelaySec: number = 180

  constructor(props: IProps) {
    super(props)
    this.state = {
      dto: {
        text: '',
        trips: [],
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
              <th className="text-center">Abfahrt</th>
              <th className="text-center">Ankunft</th>
              <th className="text-center">Dauer</th>
              <th className="text-center">Gleis</th>
              <th className="text-center">Linie</th>
            </tr>
          </thead>
          <tbody>
            {this.state.dto.trips.map((trip: IRmvTripDto) => (
              <tr key={trip.tripId}>
                <td className="text-center">
                  {this.formatTime(trip.startTimePlanned)}
                  <br />
                  <div
                    className={
                      trip.startTimeReal > trip.startTimePlanned + this.okDelaySec ? 'text-danger' : 'text-success'
                    }
                  >
                    {this.formatTime(trip.startTimeReal)}
                  </div>
                </td>
                <td className="text-center">
                  {this.formatTime(trip.arrivalTimePlanned)}
                  <br />
                  <div
                    className={
                      trip.arrivalTimeReal > trip.arrivalTimePlanned + this.okDelaySec ? 'text-danger' : 'text-success'
                    }
                  >
                    {this.formatTime(trip.arrivalTimeReal)}
                  </div>
                </td>
                <td className="text-center">
                  {this.formatTime(trip.durationPlanned)}
                  <br />
                  <div
                    className={
                      trip.durationReal > trip.durationPlanned + this.okDelaySec ? 'text-danger' : 'text-success'
                    }
                  >
                    {this.formatTime(trip.durationReal)}
                  </div>
                </td>
                <td className="text-center">
                  {trip.trackPlanned}
                  <br />
                  <div className={trip.trackPlanned !== trip.trackReal ? 'text-danger' : 'text-success'}>
                    {trip.trackReal}
                  </div>
                </td>
                <td className="text-center">{trip.lines.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Widget>
    )
  }

  private formatTime(value: number): string {
    return moment.utc(value * 1000).format('HH:mm')
  }

  private async loadData(): Promise<void> {
    const dto: IRmvTripsDto = await Api.get<IRmvTripsDto>('/v1/smartmirror/ui/timetable')
    this.setState({
      dto,
      lastUpdate: moment().format('HH:mm:ss'),
    })
  }
}

export default TimetableWidget
