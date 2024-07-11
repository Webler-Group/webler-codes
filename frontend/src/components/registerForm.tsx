import { createSignal } from "solid-js";

interface RegisterFormProps {
    onRegister: (errorCode:number, message:string, email:string) => void;
}

interface Event {
  preventDefault: () => void,
}

const RegisterForm = ({onRegister}: RegisterFormProps) => {
  const [username, setUsername] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const data = {
      username:username(),
      password:password(),
      email:email()
    };
    const response = await fetch("/api/auth/register",
    {
      method: "POST",
      headers:{'content-type': 'application/json'},
      body: JSON.stringify(data)
    }) ;
    const json = await response.json();
    if(json.userInfo){
      window.sessionStorage.setItem("userInfo", JSON.stringify(json.userInfo));
    }
    await onRegister(json.errorCode, json.message, data.email) ;
  }

  return (
    <form name="registerForm" onSubmit={(e) => {handleSubmit(e); return false;}} method="post">
      <input type="string" name="username" onChange={(e)=>{setUsername(e.target.value)}} required placeholder="username" />
      <input type="email" name="email" onChange={(e)=>{setEmail(e.target.value)}} required placeholder="email" />
      <input type="password" name="password" onChange={(e)=>{setPassword(e.target.value)}} required placeholder="password" />
      <input type="submit" />
    </form>
  ) ;
}

export default RegisterForm ;
