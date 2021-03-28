import React from 'react'
import './Widget.css'

interface IState {}

interface IProps {
  title: string
  footer?: string
  width: number
}

class Widget extends React.Component<IProps, IState> {
  public render(): JSX.Element {
    return (
      <div className="card text-white border-light bg-dark widget" style={{ width: this.props.width }}>
        <div className="card-header">{this.props.title}</div>
        <div className="card-body">{this.props.children}</div>
        {this.props.footer && <div className="card-footer text-right">Stand: {this.props.footer} Uhr</div>}
      </div>
    )
  }
}

export default Widget
