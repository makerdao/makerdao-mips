"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pullRequestsCount = exports.pullRequestsLast = exports.pullRequestsAfter = exports.pullRequests = void 0;
const graphql_request_1 = require("graphql-request");
exports.pullRequests = graphql_request_1.gql `
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
exports.pullRequestsAfter = graphql_request_1.gql `
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
exports.pullRequestsLast = graphql_request_1.gql `
  query repository($name: String!, $owner: String!, $last: Int) {
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
exports.pullRequestsCount = graphql_request_1.gql `
  query repository($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      pullRequests {
        totalCount
      }
    }
  }
`;
//# sourceMappingURL=definitions.graphql.js.map