import Metas from '../components/metas' ;
import LoginForm from '../components/loginForm' ;

const Login = () => {

  const login = () => {};

  return (
    <>
      <Metas title="Webler Codes - Login" />
      <h1>Login</h1>
      <LoginForm onLogin={login}/>
      <a href="/register">Register</a>
    </>
  )
}

export default Login ;
