import { createSignal } from "solid-js";

interface LoginFormProps {
    onLogin: (errorCode:number, message:string, email:string) => void;
}

interface Event {
  preventDefault: () => void,
}

const LoginForm = ({onLogin}: LoginFormProps) => {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const data = {
      password:password(),
      email:email()
    };
    const response = await fetch("/api/auth/login",
    {
      method: "POST",
      headers:{'content-type': 'application/json'},
      body: JSON.stringify(data)
    }) ;
    const json = await response.json();
    if(json.accessToken){
      window.sessionStorage.setItem("accessToken", json.accessToken);
    }
    if(json.accessTokenInfo){
      window.sessionStorage.setItem("accessTokenInfo", JSON.stringify(json.accessTokenInfo));
    }
    if(json.userInfo){
      window.sessionStorage.setItem("userInfo", JSON.stringify(json.userInfo));
    }
    await onLogin(json.errorCode, json.message, data.email) ;
  }

  return (
    <form name="loginForm" onSubmit={(e) => {handleSubmit(e); return false;}} method="post">
      <input type="email" name="email" onChange={(e)=>{setEmail(e.target.value)}} required placeholder="email" />
      <input type="password" name="password" onChange={(e)=>{setPassword(e.target.value)}} required placeholder="password" />
      <input type="submit" />
    </form>
  ) ;
}

export default LoginForm ;
