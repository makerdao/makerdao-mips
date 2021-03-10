import { gql } from "graphql-request";

export const pullRequests = gql`
  query repository($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      pullRequests(
        orderBy: { field: CREATED_AT, direction: ASC }
        first: 100
        states: [OPEN, CLOSED, MERGED]
      ) {
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        nodes {
          author {
            login
          }
          state
          files(first: 100) {
            nodes {
              path
            }
            totalCount
          }
          url
          title
          body
          createdAt
        }
      }
    }
  }
`;

export const pullRequestsAfter = gql`
  query repository($name: String!, $owner: String!, $after: String!) {
    repository(name: $name, owner: $owner) {
      pullRequests(
        orderBy: { field: CREATED_AT, direction: ASC }
        first: 100
        states: [OPEN, CLOSED, MERGED]
        after: $after
      ) {
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        nodes {
          author {
            login
          }
          state
          files(first: 100) {
            nodes {
              path
            }
            totalCount
          }
          url
          title
          body
          createdAt
        }
      }
    }
  }
`;

export const pullRequestsLast = gql`
  query repository($name: String!, $owner: String!, $last: Number!) {
    repository(name: $name, owner: $owner) {
      pullRequests(
        orderBy: { field: CREATED_AT, direction: ASC }
        last: $last
        states: [OPEN, CLOSED, MERGED]
      ) {
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        nodes {
          author {
            login
          }
          state
          files(first: 100) {
            nodes {
              path
            }
            totalCount
          }
          url
          title
          body
          createdAt
        }
      }
    }
  }
`;

export const pullRequestsCount = gql`
  query repository($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      pullRequests {
        totalCount
      }
    }
  }
`;
