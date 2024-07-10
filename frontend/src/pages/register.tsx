import Metas from '../components/metas' ;
import RegisterForm from '../components/registerForm' ;
import VerificationForm from '../components/verificationForm' ;
import { useNavigate, A } from '@solidjs/router' ;
import { Show , createSignal } from "solid-js"

const Register = () => {

  const [showVerification, setShowVerification] = createSignal(false) ;
  const [email, setEmail] = createSignal("") ;
  const navigate = useNavigate();

  const register = (errorCode:number, message:string, emailStr:string) => {
    if(!errorCode){
      setEmail(emailStr);
      setShowVerification(true);
    }
    else{
      alert(message + ", errorCode: " + errorCode);
    }
  }

  const verification = (errorCode:number, message:string) => {
    if(errorCode){
      alert(message + ", error: " + errorCode);
    }else{
      navigate("/about");
    }
  }

  return (
    <>
      <Metas title="Webler Codes - Register" />
      <h1>Register</h1>
      <RegisterForm onRegister={register} />
      <A href="/login">Login</A>
      <Show when={showVerification()}>
        <VerificationForm onVerification={verification} email={email()} />
      </Show>
    </>
  )
}

export default Register ;
