import { graphql } from "../gql";

export const GET_TASKS = graphql(`
  query GetTasks {
    getTasks {
      id
      title
      description
      status
      createdAt
      subTaskCount
    }
  }
`);

export const GET_TASK = graphql(`
  query GetTask($id: Int!) {
    getTask(id: $id) {
      id
      title
      description
      status
      createdAt
      subTasks {
        id
        title
        description
        status
        createdAt
      }
    }
  }
`);
