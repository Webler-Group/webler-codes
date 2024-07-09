import { createSignal } from "solid-js";
import { useParams } from "@solidjs/router";

interface Event {
  preventDefault: () => void,
}

interface VerificationFormProps {
  onVerification: (errorCode:number, message:string) => void,
}

const VerificationForm = ({onVerification}: VerificationFormProps) => {
  const [code, setCode] = createSignal("");

  const params = useParams();
  const userId = params.id ;

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if(!userId){
      return ;
    }
    const data = {
      userId: userId,
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
    <form name="verificationForm" onSubmit={(e) => {handleSubmit(e); return false;}} method="post">
      <input type="string" name="code" onChange={(e)=>{setCode(e.target.value)}} required placeholder="code" />
      <input type="submit" />
    </form>
  ) ;
}

export default VerificationForm ;
