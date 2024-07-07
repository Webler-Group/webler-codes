import { MetaProvider } from '@solidjs/meta';
import { Router, Route } from '@solidjs/router';

import About from './pages/about.tsx' ;
import Home from './pages/home.tsx' ;
import Login from './pages/login.tsx' ;

import Nav from './components/nav.tsx' ; 
import Footer from './components/footer.tsx' ; 

const App = () => (
  <MetaProvider>
    <Nav />
    <Router>
      <Route path="/about" component={About} />
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
    </Router>
    <Footer />
  </MetaProvider>
);

export default App ;
