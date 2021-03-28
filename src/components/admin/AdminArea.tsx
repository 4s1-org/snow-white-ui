import React from 'react'
import { BrowserRouter as Router, Switch, Route, RouteComponentProps, NavLink, Redirect } from 'react-router-dom'
import CommonArea from './common/CommonArea'
import DateArea from './date/DateArea'
import FuelPriceArea from './fuelPrice/FuelPriceArea'
import TimetableArea from './timetable/TimetableArea'
import TrafficArea from './traffic/TrafficArea'
import WeatherArea from './weather/WeatherArea'
import './AdminArea.css'

interface IState {
  collapsed: boolean
}

interface IProps extends RouteComponentProps<MatchParams> {}

interface MatchParams {}

class AdminArea extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      collapsed: true,
    }

    this.toggleNavbar = this.toggleNavbar.bind(this)
  }

  public render(): JSX.Element {
    const collapsed: boolean = this.state.collapsed
    const classOne: string = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show'
    const classTwo: string = collapsed
      ? 'navbar-toggler navbar-toggler-right collapsed'
      : 'navbar-toggler navbar-toggler-right'

    return (
      <div className="adminarea">
        <Router>
          <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
            <button
              type="button"
              onClick={this.toggleNavbar}
              className={`${classTwo}`}
              data-toggle="collapse"
              data-target="#navbarResponsive"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <img width="40" height="40" alt="Smart Mirror" />
            <div className={`${classOne}`} id="navbarResponsive">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <NavLink to="/admin/common" className="nav-link" activeClassName="active" onClick={this.toggleNavbar}>
                    Allgemein
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/date" className="nav-link" activeClassName="active" onClick={this.toggleNavbar}>
                    Datum
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/admin/fuelPrice"
                    className="nav-link"
                    activeClassName="active"
                    onClick={this.toggleNavbar}
                  >
                    Kraftstoffpreise
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/admin/timetable"
                    className="nav-link"
                    activeClassName="active"
                    onClick={this.toggleNavbar}
                  >
                    Fahrplan
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/admin/traffic"
                    className="nav-link"
                    activeClassName="active"
                    onClick={this.toggleNavbar}
                  >
                    Verkehr
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/admin/weather"
                    className="nav-link"
                    activeClassName="active"
                    onClick={this.toggleNavbar}
                  >
                    Wetter
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>

          <Switch>
            <Route path="/admin/common" component={CommonArea} />
            <Route path="/admin/date" component={DateArea} />
            <Route path="/admin/fuelPrice" component={FuelPriceArea} />
            <Route path="/admin/timetable" component={TimetableArea} />
            <Route path="/admin/traffic" component={TrafficArea} />
            <Route path="/admin/weather" component={WeatherArea} />
            <Route path="/admin">
              <Redirect to="/admin/common" />
            </Route>
          </Switch>
        </Router>
      </div>
    )
  }

  private toggleNavbar(): void {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }
}

export default AdminArea
