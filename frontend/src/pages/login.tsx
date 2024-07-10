import Metas from '../components/metas' ;
import LoginForm from '../components/loginForm' ;
import VerificationForm from '../components/verificationForm' ;
import { useNavigate } from '@solidjs/router' ;
import { Show , createSignal } from "solid-js"

const Login = () => {

  const [showVerification, setShowVerification] = createSignal(false) ;
  const [email, setEmail] = createSignal("") ;

  const navigate = useNavigate();

  const login = (errorCode:number, message:string, emailStr:string) => {
    if(errorCode){
      alert(message + ", error: " + errorCode);
      if(errorCode == 2002){
        alert('is your account verified?');
        setEmail(emailStr);
        setShowVerification(true);
      }
    }else{
      navigate("/about");
    }
  };

  const verification = (errorCode:number, message:string) => {
    if(errorCode){
      alert(message + ", error: " + errorCode);
    }else{
      navigate("/about");
    }
  }

  return (
    <>
      <Metas title="Webler Codes - Login" />
      <h1>Login</h1>
      <LoginForm onLogin={login}/>
      <a href="/register">Register</a>
      <Show when={showVerification()}>
        <VerificationForm onVerification={verification} email={email()} />
      </Show>
    </>
  )
}

export default Login ;
