import React from 'react'

interface IState {}

interface IProps {
  title: string
  dialogCloseCallback: (name: DialogButtonName) => void
  showBtnYes?: boolean
  showBtnNo?: boolean
  showBtnSave?: boolean
  showBtnOk?: boolean
  showBtnAbort?: boolean
}

class Dialog extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.onBtnYesClick = this.onBtnYesClick.bind(this)
    this.onBtnNoClick = this.onBtnNoClick.bind(this)
    this.onBtnSaveClick = this.onBtnSaveClick.bind(this)
    this.onBtnOkClick = this.onBtnOkClick.bind(this)
    this.onBtnAbortClick = this.onBtnAbortClick.bind(this)
  }

  public render(): JSX.Element {
    return (
      <div
        className="modal fade show"
        style={{
          display: 'block',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{this.props.title}</h5>
            </div>
            <div className="modal-body">{this.props.children}</div>
            <div className="modal-footer">
              {this.props.showBtnYes && (
                <button key="yes" type="button" className="btn btn-success" onClick={this.onBtnYesClick}>
                  Ja
                </button>
              )}
              {this.props.showBtnNo && (
                <button key="no" type="button" className="btn btn-danger" onClick={this.onBtnNoClick}>
                  Nein
                </button>
              )}
              {this.props.showBtnSave && (
                <button key="save" type="button" className="btn btn-success" onClick={this.onBtnSaveClick}>
                  Speichern
                </button>
              )}
              {this.props.showBtnOk && (
                <button key="abort" type="button" className="btn btn-success" onClick={this.onBtnOkClick}>
                  Ok
                </button>
              )}
              {this.props.showBtnAbort && (
                <button key="abort" type="button" className="btn btn-danger" onClick={this.onBtnAbortClick}>
                  Abbrechen
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ToDo: Eine Funktion für alle Button klicks

  private onBtnYesClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault()
    this.close('yes')
  }

  private onBtnNoClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault()
    this.close('no')
  }

  private onBtnOkClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault()
    this.close('ok')
  }

  private onBtnSaveClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault()
    this.close('save')
  }

  private onBtnAbortClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault()
    this.close('abort')
  }

  private close(name: DialogButtonName): void {
    this.props.dialogCloseCallback(name)
  }
}

export default Dialog
