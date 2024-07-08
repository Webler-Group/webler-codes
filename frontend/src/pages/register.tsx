import Metas from '../components/metas' ;
import RegisterForm from '../components/registerForm' ;

const Register = () => {

  const register = () => {}

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
