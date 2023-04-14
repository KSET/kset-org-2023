import { type InferGetServerSidePropsType } from "next";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ServerSideProps<T extends (args: any) => any> = Partial<
  InferGetServerSidePropsType<T>
>;
