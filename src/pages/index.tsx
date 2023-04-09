import { api } from "~/utils/queryApi";

const PageIndex = () => {
  const [resp] = api.example.hello.useSuspenseQuery({
    text: "World",
  });

  return (
    <>
      <h1>Hello World</h1>
      <p>Budući da su priznavanje urođenog dostojanstva</p>
      <p>БУДУЂИ да су признавање урођеног достојанства</p>
      <p>Пошто је признавање урођеног достојанства</p>
      <pre>{resp.greeting}</pre>
    </>
  );
};

export default PageIndex;
