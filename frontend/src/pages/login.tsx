import Metas from '../components/metas' ;
import LoginForm from '../components/loginForm' ;
import { useNavigate } from '@solidjs/router' ;

const Login = () => {

  const navigate = useNavigate();

  const login = (errorCode:number, message:string) => {
    if(errorCode){
      alert(message + ", error: " + errorCode);
    }else{
      navigate("/about");
    }
  };

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
