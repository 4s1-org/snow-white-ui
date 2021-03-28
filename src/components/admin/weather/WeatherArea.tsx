import React from 'react'
import Settings from './Settings'

interface IState {}

interface IProps {}

class WeatherArea extends React.Component<IProps, IState> {
  public render(): JSX.Element {
    return (
      <div className="content">
        <Settings />
      </div>
    )
  }
}

export default WeatherArea
