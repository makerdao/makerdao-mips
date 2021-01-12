import { Injectable } from "@nestjs/common";
// query MyQuery {
//     repository(name: "mips", owner: "makerdao") {
//       pullRequests(orderBy: {field: CREATED_AT, direction: ASC}, first: 10) {
//         totalCount
//         nodes {
//           author {
//             login
//           }
//           url
//           title
//           body
//           createdAt
//         }
//       }
//     }
//   }
  
//   query MyQuery1 {
//     repository(name: "mips", owner: "makerdao") {
//       pullRequests(orderBy: {field: CREATED_AT, direction: ASC}, first: 10, states: OPEN) {
//         totalCount
//       }      
//     }
//   }
  
//   query MyQuery2 {
//     repository(name: "mips", owner: "makerdao") {
//       pullRequests(orderBy: {field: CREATED_AT, direction: ASC}, first: 10, states: CLOSED) {
//         totalCount
//       }      
//     }
//   }

@Injectable()
export class GithubService {
    
}