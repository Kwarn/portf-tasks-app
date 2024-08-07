import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "@apollo/client";
import { GetTaskQuery } from "../../gql/graphql";
import styled from "styled-components";
import { GET_TASK } from "../../graphql-server/queries";

const Task: React.FC = () => {
  const router = useRouter();
  const { taskId } = router.query;

  const { data, loading, error } = useQuery<GetTaskQuery>(GET_TASK, {
    variables: { id: taskId },
    skip: !taskId,
  });

  if (!taskId) return <p>Loading...</p>;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const task = data?.getTask;

  if (!task) return <p>No task found</p>;

  return (
    <Container>
      <Head>
        <title>{`Task ${task.id}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <TaskHeader>
          <Title>{`Task ${task.id}`}</Title>
          <SubTitle>{task.title}</SubTitle>
          <Description>{task.description}</Description>
        </TaskHeader>

        {task.subTasks.length > 0 && (
          <SubTasks>
            <SubTitle>Subtasks:</SubTitle>
            {task.subTasks.map((subTask) => (
              <SubTask key={subTask.id}>
                <SubTaskTitle>{subTask.title}</SubTaskTitle>
                <SubTaskDescription>{subTask.description}</SubTaskDescription>
                <Status>Status: {subTask.status}</Status>
              </SubTask>
            ))}
          </SubTasks>
        )}
      </Main>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TaskHeader = styled.div`
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 1rem;
  margin-bottom: 20px;
`;

const SubTasks = styled.div`
  width: 100%;
`;

const SubTask = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  width: 100%;
`;

const SubTaskTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 5px;
`;

const SubTaskDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 5px;
`;

const Status = styled.p`
  font-size: 1rem;
  color: gray;
`;

export default Task;
