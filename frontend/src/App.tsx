import { MetaProvider } from '@solidjs/meta';
import { Router, Route } from '@solidjs/router';

import About from './pages/about' ;
import Home from './pages/home' ;
import Login from './pages/login' ;
import Register from './pages/register' ;
import Verification from './pages/verification' ;

import Nav from './components/nav' ;
import Footer from './components/footer' ;

const App = () => (
  <MetaProvider>
    <Nav />
    <Router>
      <Route path="/about" component={About} />
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/verification/:id" component={Verification} />
    </Router>
    <Footer />
  </MetaProvider>
);

export default App ;
