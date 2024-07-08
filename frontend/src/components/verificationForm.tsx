import { createSignal } from "solid-js";

interface Event {
  preventDefault: () => void,
}

const VerificationForm = () => {
  const [code, setCode] = createSignal("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const userString = sessionStorage.getItem('user');
    if(!userString){
      return ;
    }
    const user = JSON.parse(userString);
    const data = {
      userId: user.id,
      code:code(),
    };
    alert(JSON.stringify(data));
    const response = await fetch("/api/auth/verifyEmail",
    {
      method: "POST",
      headers:{'content-type': 'application/json'},
      body: JSON.stringify(data)
    }) ;
    const json = await response.json();
    alert(JSON.stringify(json)) ;
  }

  return (
    <form name="verificationForm" onSubmit={(e) => {handleSubmit(e); return false;}} method="post">
      <input type="string" name="code" onChange={(e)=>{setCode(e.target.value)}} required placeholder="code" />
      <input type="submit" />
    </form>
  ) ;
}

export default VerificationForm ;
