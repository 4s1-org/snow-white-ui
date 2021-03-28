import React from 'react'

interface IState {}

interface IProps {}

class Header extends React.Component<IProps, IState> {
  // constructor (props) {
  //   super(props)
  // }

  public render(): JSX.Element {
    return (
      <div>
        <p>Hello World!</p>
      </div>
    )
  }
}

export default Header
