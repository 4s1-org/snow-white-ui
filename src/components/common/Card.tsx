import React from 'react'

interface IState {}

interface IProps {
  title: string
}

class Card extends React.Component<IProps, IState> {
  public render(): JSX.Element {
    return (
      <div
        className="card"
        style={{
          marginBottom: '20px',
        }}
      >
        <div className="card-header">{this.props.title}</div>
        <div className="card-body">{this.props.children}</div>
      </div>
    )
  }
}

export default Card
