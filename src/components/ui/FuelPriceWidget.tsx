import React from 'react'
import { IFuelPricePricesDto } from '@yellowgarbagebag/snow-white-dto'
import Api from '../../utils/api'
import moment from 'moment'
import Widget from '../common/Widget'

interface IState {
  dto: Array<IFuelPricePricesDto>
  lastUpdate: string
}

interface IProps {
  refreshRate: number
  showE5: boolean
  showE10: boolean
  showDiesel: boolean
}

class FuelPriceWidget extends React.Component<IProps, IState> {
  private interval?: NodeJS.Timeout

  constructor(props: IProps) {
    super(props)
    this.state = {
      dto: [],
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
    // ToDo: Beachten, dass die Tankstelle auch geschlossen sein kann

    return (
      <Widget title="Kraftstoffpreise" footer={this.state.lastUpdate} width={400}>
        <table className="table table-borderless table-sm">
          <thead>
            <tr>
              <th>Tankstelle</th>
              {this.props.showE5 && (
                <th className="text-center" style={{ width: '50px' }}>
                  E5
                </th>
              )}
              {this.props.showE10 && (
                <th className="text-center" style={{ width: '50px' }}>
                  E10
                </th>
              )}
              {this.props.showDiesel && (
                <th className="text-center" style={{ width: '60px' }}>
                  Diesel
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {this.state.dto.map((station: IFuelPricePricesDto) => (
              <tr key={station.sortNo}>
                <td className="tdtext">{station.name}</td>
                {this.props.showE5 && <td className="text-center align-middle">{this.formatPrice(station.e5)}</td>}
                {this.props.showE10 && <td className="text-center align-middle">{this.formatPrice(station.e10)}</td>}
                {this.props.showDiesel && (
                  <td className="text-center align-middle">{this.formatPrice(station.diesel)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Widget>
    )
  }

  private formatPrice(price: number | false): JSX.Element {
    if (!price) {
      return <div>-,---</div>
    }

    const priceStr: string = price.toString().replace('.', ',')
    const part0: string = priceStr.substr(0, priceStr.length - 1)
    const part1: string = priceStr[priceStr.length - 1]

    return (
      <div>
        {part0}
        <sup>{part1}</sup>
      </div>
    )
  }

  private async loadData(): Promise<void> {
    const dto: Array<IFuelPricePricesDto> = await Api.get<Array<IFuelPricePricesDto>>('/v1/smartmirror/ui/fuelprice')
    this.setState({
      dto: dto.sort((a: IFuelPricePricesDto, b: IFuelPricePricesDto): number => a.sortNo - b.sortNo),
      lastUpdate: moment().format('HH:mm:ss'),
    })
  }
}

export default FuelPriceWidget
