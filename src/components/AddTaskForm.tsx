import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import styled from "styled-components";
import { GET_TASK, GET_TASKS } from "../graphql-server/queries";
import { CREATE_SUBTASK, CREATE_TASK } from "../graphql-server/mutations";
import {
  GetTasksQuery,
  CreateSubTaskMutation,
  CreateSubTaskMutationVariables,
  CreateTaskMutation,
  CreateTaskMutationVariables,
  GetTaskQuery,
} from "../gql/graphql";

export default function AddTaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    data: tasksData,
    loading: tasksLoading,
    error: tasksError,
  } = useQuery<GetTasksQuery>(GET_TASKS);

  const [createTask] = useMutation<
    CreateTaskMutation,
    CreateTaskMutationVariables
  >(CREATE_TASK, {
    onCompleted: () => {
      setTitle("");
      setDescription("");
      setStatus("");
      setTaskId(null);
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const [createSubTask, { loading }] = useMutation<
    CreateSubTaskMutation,
    CreateSubTaskMutationVariables
  >(CREATE_SUBTASK, {
    onCompleted: () => {
      setTitle("");
      setDescription("");
      setStatus("");
      setTaskId(null);
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
    },
    update: (cache, { data }) => {
      // caching created subTask for GET_TASK
      if (data?.createSubTask) {
        const taskId = data.createSubTask.task.id;

        const existingTaskData = cache.readQuery<GetTaskQuery>({
          query: GET_TASK,
          variables: { id: taskId },
        });

        if (existingTaskData?.getTask) {
          const updatedTask = {
            ...existingTaskData.getTask,
            subTasks: [
              ...existingTaskData.getTask.subTasks,
              data.createSubTask,
            ],
          };

          cache.writeQuery({
            query: GET_TASK,
            variables: { id: taskId },
            data: { getTask: updatedTask },
          });
        }
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !status) {
      setError("Title and status are required.");
      return;
    }

    try {
      if (taskId) {
        await createSubTask({
          variables: { taskId, title, description, status },
        });
      } else {
        await createTask({
          variables: { title, description, status },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        {tasksLoading && <p>Loading tasks...</p>}
        {tasksError && <p>Error loading tasks: {tasksError.message}</p>}
        {tasksData?.getTasks && (
          <Field>
            <Label htmlFor="task">Parent Task</Label>
            <Select
              id="task"
              value={taskId || ""}
              onChange={(e) => setTaskId(e.target.value)}
            >
              <option value="">None</option>
              {tasksData.getTasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </Select>
          </Field>
        )}

        <Field>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Field>
        <Field>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="status">Status</Label>
          <Input
            id="status"
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
        </Field>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create SubTask"}
        </Button>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  width: 30vw;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;

  @media (max-width: 1024px) {
    width: 50vw;
  }

  @media (max-width: 768px) {
    width: 80vw;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Field = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  resize: vertical;
  height: 100px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 15px;
  text-align: center;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #005bb5;
  }
`;
