import { gql } from "graphql-request";

export const pullRequests = gql`
  query repository($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      url
      pullRequests(orderBy: { field: CREATED_AT, direction: DESC }, first: 10) {
        totalCount        
        nodes {
          url
          title
          body
          createdAt
          author {
            avatarUrl
            login
            resourcePath
            url
          }
        }
      }
    }
  }
`;

export const pullRequestsTotalOpen = gql`
  query repository($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      pullRequests(
        orderBy: { field: CREATED_AT, direction: DESC }
        first: 10
        states: OPEN
      ) {
        totalCount
      }
    }
  }
`;

export const pullRequestsTotalClosed = gql`
  query repository($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      pullRequests(
        orderBy: { field: CREATED_AT, direction: ASC }
        first: 10
        states: CLOSED
      ) {
        totalCount
      }
    }
  }
`;
