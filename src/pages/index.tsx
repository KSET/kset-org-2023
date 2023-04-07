import { api } from "~/utils/queryApi";

const Home = () => {
  const resp = api.example.hello.useQuery({
    text: "World",
  });

  if (resp.isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <>
      <h1>Hello World</h1>
      <p>Budući da su priznavanje urođenog dostojanstva</p>
      <p>БУДУЂИ да су признавање урођеног достојанства</p>
      <p>Пошто је признавање урођеног достојанства</p>
      <span>{resp.data?.greeting}</span>
    </>
  );
};

export default Home;
