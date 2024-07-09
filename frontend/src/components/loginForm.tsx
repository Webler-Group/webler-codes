import { createSignal } from "solid-js";

interface LoginFormProps {
    onLogin: (errorCode:number, message:string) => void;
}

interface Event {
  preventDefault: () => void,
}

const LoginForm = ({onLogin}: LoginFormProps) => {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const data = {
      password:password(),
      username:username()
    };
    const response = await fetch("/api/auth/login",
    {
      method: "POST",
      headers:{'content-type': 'application/json'},
      body: JSON.stringify(data)
    }) ;
    const json = await response.json();
    await onLogin(json.errorCode, json.message) ;
  }

  return (
    <form name="loginForm" onSubmit={(e) => {handleSubmit(e); return false;}} method="post">
      <input type="string" name="username" onChange={(e)=>{setUsername(e.target.value)}} required placeholder="username" />
      <input type="password" name="password" onChange={(e)=>{setPassword(e.target.value)}} required placeholder="password" />
      <input type="submit" />
    </form>
  ) ;
}

export default LoginForm ;
