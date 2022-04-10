// External Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
// Styles
import './styles/index.css';
// Components
import Layout from './components/layout';
import HomePage from './views/home';

const REPO_PATHS: Record<string, string> = {
  '/': 'src/views/home',
};

const App = () => {
  const [path, setPath] = React.useState(
    REPO_PATHS?.[window?.location?.pathname || '']);

  React.useEffect(() => {
    const updatepath = (event: PopStateEvent) => {
      console.log(event.state);
      setPath(REPO_PATHS?.[event?.state?.path?.toString()] ?? '');
    };
    window?.addEventListener('popstate', updatepath);
    return () => window?.removeEventListener('popstate', updatepath);
  }, []);

  return (
    <Router>
      <Layout
        path={path}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

