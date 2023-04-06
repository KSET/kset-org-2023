import { api } from "~/utils/api";

const Home = async () => {
  const resp = await api.example.hello.query({
    text: "World",
  });

  return (
    <>
      <h1>Hello World</h1>
      <p>Budući da su priznavanje urođenog dostojanstva</p>
      <p>БУДУЂИ да су признавање урођеног достојанства</p>
      <p>Пошто је признавање урођеног достојанства</p>
      <span>{resp.greeting}</span>
    </>
  );
};

export default Home;
