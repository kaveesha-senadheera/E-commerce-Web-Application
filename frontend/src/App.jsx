import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/Header';
import { routes } from './routes';
import './app.css'
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <NavBar />
      <div className="router-container">
        <div className="route-content">
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
                exact={route.path === '/'}
              />
            ))}
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;