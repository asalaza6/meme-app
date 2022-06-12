import React from "react"
import { GetServerSideProps } from "next"
import Home from "../components/Home";

// export const getServerSideProps: GetServerSideProps = async () => {
//   const feed = [
//     {
//       id: "1",
//       title: "Prisma is the perfect ORM for Next.js",
//       content: "[Prisma](https://github.com/prisma/prisma) and Next.js go _great_ together!",
//       published: false,
//       author: {
//         name: "Nikolas Burk",
//         email: "burk@prisma.io",
//       },
//     },
//   ]
//   return { props: { feed } }
// }

// type Props = {
//   feed: PostProps[]
// }

// async function login(): Promise<void> {
//   const payload = {
//     email: 'testemail@gmail.com',
//     password: 'password'
//   }
//   console.log('login started');
//   const results = await fetch(`/api/login`, {
//     method: 'POST',
//     body: JSON.stringify(payload),
//   });
//   console.log(results);
// }

// async function register(): Promise<void> {
//   const payload = {
//     email: 'test2crazyemail@gmail.com',
//     password: 'password',
//     name: 'ALEX2azyazy',
//   }
//   console.log('register started');
//   const results = await fetch(`/api/register`, {
//     method: 'POST',
//     body: JSON.stringify(payload),
//   });
//   console.log(results);
// }

// const Blog: React.FC<Props> = (props) => {
//   return (
//     <Layout>
//       <button onClick={(login)}>login</button>
//       <button onClick={(register)}>register</button>
//     </Layout>
//   )
// }

export default Home;
