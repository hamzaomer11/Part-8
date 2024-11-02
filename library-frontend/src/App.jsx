import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

const App = () => {

  const [errorMessage, setErrorMessage] = useState(null)

  const padding = {
    padding: 5
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />

      <Router>
        <div>
          <Link style={padding} to="/">authors</Link>
          <Link style={padding} to="/books">books</Link>
          <Link style={padding} to="/add-book">add</Link>
        </div>

        <Routes>
          <Route path="/" element={<Authors />} />
          <Route path="/books" element={<Books />} />
          <Route path="/add-book" element={<NewBook setError={notify}/>} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
    {errorMessage}
    </div>
  )
}