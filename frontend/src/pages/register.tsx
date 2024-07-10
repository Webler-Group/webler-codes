import Metas from '../components/metas' ;
import RegisterForm from '../components/registerForm' ;
import { useNavigate } from '@solidjs/router' ;

const Register = () => {

  const navigate = useNavigate();

  const register = (errorCode:number, message:string) => {
    if(!errorCode){
      navigate(`/verification`);
    }
    else{
      alert(message + ", errorCode: " + errorCode);
    }
  }

  return (
    <>
      <Metas title="Webler Codes - Register" />
      <h1>Register</h1>
      <RegisterForm onRegister={register} />
      <a href="/login">Login</a>
    </>
  )
}

export default Register ;
