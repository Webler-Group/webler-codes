import { MetaProvider, Meta, Title } from "@solidjs/meta";

function Metas(props){
  return (
    <>
      <Title>{props.title}</Title>
      <Meta charset="utf-8" />
      <Meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta name="theme-color" content="#000000" />
    </>
  )
}

export default Metas ;

