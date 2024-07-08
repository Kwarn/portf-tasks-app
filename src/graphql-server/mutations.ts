import { graphql } from "../gql";

export const CREATE_TASK = graphql(`
  mutation CreateTask($title: String!, $description: String, $status: String!) {
    createTask(title: $title, description: $description, status: $status) {
      id
      title
      description
      status
      createdAt
    }
  }
`);

export const CREATE_SUBTASK = graphql(`
  mutation CreateSubTask(
    $taskId: Int!
    $title: String!
    $description: String
    $status: String!
  ) {
    createSubTask(
      taskId: $taskId
      title: $title
      description: $description
      status: $status
    ) {
      id
      title
      description
      status
      createdAt
      task {
        id
      }
    }
  }
`);
