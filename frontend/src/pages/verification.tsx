import Metas from '../components/metas' ;
import VerificationForm from '../components/verificationForm' ;
import { useNavigate } from '@solidjs/router' ;

const Verification = () => {

  const navigate = useNavigate();

  const verification = (errorCode:number, message:string) => {
    if(errorCode){
      alert(message + ", error: " + errorCode);
      navigate("/about");
    }else{
      navigate("/about");
    }
  }

  return (
    <>
      <Metas title="Webler Codes - Email verification" />
      <h1>Verification</h1>
      <p>Please check your email and enter the code here to verify your email.</p>
      <VerificationForm onVerification={verification}/>
    </>
  )
}

export default Verification ;
