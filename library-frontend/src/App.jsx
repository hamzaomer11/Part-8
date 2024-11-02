import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

const App = () => {

  const padding = {
    padding: 5
  }

  return (
    <div>
      <Router>
        <div>
          <Link style={padding} to="/">authors</Link>
          <Link style={padding} to="/books">books</Link>
          <Link style={padding} to="/add-book">add</Link>
        </div>

        <Routes>
          <Route path="/" element={<Authors />} />
          <Route path="/books" element={<Books />} />
          <Route path="/add-book" element={<NewBook />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
