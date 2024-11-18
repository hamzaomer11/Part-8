import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommend from "./components/Recommend";

import {
  Routes, Route, Link, useNavigate
} from 'react-router-dom'

import { useApolloClient } from "@apollo/client";

const App = () => {

  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  const navigate = useNavigate()

  const padding = {
    padding: 5
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('library-user-token')
    if (loggedUserJSON) {
      setToken(loggedUserJSON)
    }
  }, [])

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.clearStore()
    navigate('/login-form')
  }

  if (!token) {
    return (
      <>
        <Notify errorMessage={errorMessage} />
        <LoginForm setToken={setToken} setError={notify} />
      </>
    )
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <Link style={padding} to="/">authors</Link>
        <Link style={padding} to="/books">books</Link>
        <Link style={padding} to="/add-book">add</Link>
        <Link style={padding} to="/recommend">recommend</Link>
        {token && (
          <Link style={padding} onClick={logout}>logout</Link>
        )}
      </div>
      <Routes>
        <Route path="/" element={<Authors setErrorMessage={setErrorMessage} />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add-book" element={<NewBook setError={notify} />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/login-form" element={<LoginForm setToken={setToken} setError={notify} />} />
      </Routes>
    </div>
  );
};

export default App;

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }
  return (
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>
  )
}