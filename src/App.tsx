import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import AdminArea from './components/admin/AdminArea'
import UiArea from './components/ui/UiArea'

const App: React.FC = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route path="/admin" component={AdminArea} />
        <Route path="/" component={UiArea} />
      </Switch>
    </Router>
  )
}

export default App
