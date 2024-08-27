import { Suspense } from 'react'
import './App.scss'
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { routes } from './routes';

import PagePending from './pages/PendingPage';
import Login from './pages/Login';
import Loading from './components/common/Loading';
import Dashboard from './pages/Dashboard';
import CommingSoon from './components/CommingSoon';
// const routes = [
 
//   {
//     path: '/',
//     element: <Dashboard />, 
//   },
//   {
//     path: '*',
//     element: <CommingSoon />, 
//   },
// ]
function App() {
  
  
  return (
    <>
      <Suspense fallback={<Loading variant="fullScreen" />}>
          <Router>
              <div className="App">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/pending" element={<PagePending />} />
                    {routes.map((publicRoute, index) => {
                      const Layout = publicRoute.layout;
                      const Page = publicRoute.component;
                      return (
                        <Route
                          key={index}
                          path={publicRoute.path}
                          element={
                            <Layout>
                              <Page />
                            </Layout>
                          }
                        />
                      );
                    })}
                  </Routes>
              </div>
          </Router>
      </Suspense>
      <Toaster/>
    </>
  )
}

export default App
