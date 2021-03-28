import React from 'react'
import Api from '../../utils/api'
import moment from 'moment'
import Widget from '../common/Widget'

interface IState {
  pattern: string
  value: string
}

interface IProps {
  refreshRate: number
  fontSize: number
}

class DateWidget extends React.Component<IProps, IState> {
  private interval?: NodeJS.Timeout

  constructor(props: IProps) {
    super(props)
    this.state = {
      pattern: '',
      value: '',
    }
  }

  public async componentDidMount(): Promise<void> {
    await this.loadData()
  }

  public componentWillUnmount(): void {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  public render(): JSX.Element {
    return (
      <Widget title="Datum" width={400}>
        <div className="text-center" style={{ fontSize: this.props.fontSize }}>
          {this.state.value}
        </div>
      </Widget>
    )
  }

  private async loadData(): Promise<void> {
    const pattern: string = await Api.get<string>('/v1/smartmirror/ui/date')
    this.setState(
      {
        pattern,
      },
      this.refresh,
    )
  }

  private refresh(): void {
    this.interval = setInterval(
      () => this.setState({ value: moment().format(this.state.pattern) }),
      this.props.refreshRate,
    )
  }
}

export default DateWidget
