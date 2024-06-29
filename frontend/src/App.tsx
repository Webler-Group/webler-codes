import { createWS } from '@solid-primitives/websocket';

import { createSignal, createResource, Switch, Match, Show } from "solid-js";

const fetchUser = async (id: number) =>
 {
  const response = await fetch('/api');
  return response.json();
}

function App() {
  const [userId, setUserId] = createSignal<number>();
  const [user] = createResource(userId, fetchUser);
  const ws = createWS("wss://localhost:8080/api");

  const testWs = () => {
    ws.send("it works");
  }

  return (
    <div>
      <button onClick={() => testWs()}>Test WS</button>
      <input
        type="number"
        min="1"
        placeholder="Enter Numeric Id"
        onInput={(e) => setUserId(+e.currentTarget.value)}
      />
      <Show when={user.loading}>
        <p>Loading...</p>
      </Show>
      <Switch>
        <Match when={user.error}>
          <span>Error: </span>
        </Match>
        <Match when={user()}>
          <div>{JSON.stringify(user())}</div>
        </Match>
      </Switch>

    </div>
  );
}

export default App;
