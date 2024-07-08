import React, { use } from "react";
import { useQuery } from "@apollo/client";
import { GET_TASKS } from "../../graphql-server/queries";
import { GetTasksQuery, Task } from "../../gql/graphql";
import styled from "styled-components";
import { useRouter } from "next/router";

const TasksList = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery<GetTasksQuery>(GET_TASKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data || !data.getTasks.length) return <p>No tasks found</p>;

  const handleTaskClick = (id: number) => {
    router.push(`/task/${id}`);
  };

  return (
    <Container>
      {data.getTasks.map((task: Task) => (
        <TaskItem key={task.id} onClick={() => handleTaskClick(task.id)}>
          <TaskTitle>{task.title}</TaskTitle>
          <TaskDescription>{task.description}</TaskDescription>
          <TaskStatus>Status: {task.status}</TaskStatus>
          <SubTaskCount># sub tasks: {task.subTaskCount}</SubTaskCount>
        </TaskItem>
      ))}
    </Container>
  );
};

export default TasksList;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const TaskItem = styled.a`
  display: block;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  text-decoration: none;
  color: inherit;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const TaskTitle = styled.h2`
  margin: 0 0 10px;
  font-size: 1.5rem;
`;

const TaskDescription = styled.p`
  margin: 0 0 10px;
  font-size: 1rem;
`;

const TaskStatus = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: gray;
`;

const SubTaskCount = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: gray;
`;
