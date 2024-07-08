import React from "react";
import Head from "next/head";
import styled from "styled-components";
import AddTaskForm from "../../components/AddTaskForm";

export default function AddTask() {
  return (
    <Container>
      <Head>
        <title>Create New Task</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <Title>Create a New Task</Title>
        <AddTaskForm />
      </Main>
    </Container>
  );
}

const Container = styled.div`
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const Main = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;
