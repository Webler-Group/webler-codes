import { createSignal } from "solid-js";

interface Event {
  preventDefault: () => void,
}

interface VerificationFormProps {
  onVerification: (errorCode:number, message:string) => void;
  email: string;
}

const VerificationForm = ({onVerification, email}: VerificationFormProps) => {
  const [code, setCode] = createSignal("");

  const sendNewCode = async () => {
    if(!email){
      return ;
    }
    const data = {
      email:email,
    };
    const response = await fetch("/api/auth/resendEmailVerificationCode",
    {
      method: "POST",
      headers:{'content-type': 'application/json'},
      body: JSON.stringify(data)
    }) ;
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if(!email){
      return ;
    }
    const data = {
      email:email,
      code:code(),
    };
    const response = await fetch("/api/auth/verifyEmail",
    {
      method: "POST",
      headers:{'content-type': 'application/json'},
      body: JSON.stringify(data)
    }) ;
    const json = await response.json();
    onVerification(json.errorCode, json.message) ;
  }

  return (
    <>
      <form name="verificationForm" onSubmit={(e) => {handleSubmit(e); return false;}} method="post">
        <input type="string" name="code" onChange={(e)=>{setCode(e.target.value)}} required placeholder="code" />
        <input type="submit" />
      </form>
      <button onClick={sendNewCode} >Send New Verification Code</button>
    </>
  ) ;
}

export default VerificationForm ;
