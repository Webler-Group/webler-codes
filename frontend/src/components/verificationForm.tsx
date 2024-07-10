import { createSignal } from "solid-js";

interface Event {
  preventDefault: () => void,
}

interface VerificationFormProps {
  onVerification: (errorCode:number, message:string) => void,
}

const VerificationForm = ({onVerification}: VerificationFormProps) => {
  const [code, setCode] = createSignal("");

  const userInfo = window.sessionStorage.getItem("userInfo");
  const email = userInfo? JSON.parse(userInfo).email : "" ;

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if(!userInfo){
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
    alert(JSON.stringify(json))
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
