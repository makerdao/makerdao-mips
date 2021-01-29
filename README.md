# makerdao-mips
This project is a MIPs Tracker for MakerDAO Improvement Proposals. 

## Dependencies
Requires git to be installed and that it can be called using the command git.

## Requirements
Node version 14.x.x LTS or above

# Diagrams
## High Level Diagram

![MakerDAO_HLD_1](https://github.com/DSpotDevelopers/makerdao-mips/blob/develop/docs/img/MakerDAO_HLD_1.png)


## Command to parse MakerDAO mips repository manually
```bash
$ npx nestjs-command parse:mips
```

## Environment vars .env file
```.env
MONGODB_URI=mongodb://localhost:27017/dao
PORT=3000

FOLDER_REPOSITORY_NAME=mips_repository
REPO_PATH=https://github.com/makerdao/mips.git
FOLDER_PATTERN='MIP*'

WEBHOOKS_SECRET_TOKEN=AANBM78GGfffGGGKOIh
GIT_ACCESS_API_TOKEN=AANBM78GGfffGGGKOI
GITHUB_URL_ENDPOINT=https://api.github.com/graphql

GITHUB_REPOSITORY=mips
GITHUB_REPOSITORY_OWNER=makerdao
```

---
## Creating a personal access token (GIT_ACCESS_API_TOKEN)

You should create a personal access token to use in place of a password with the command line or with the API. Personal access tokens (PATs) are an alternative to using passwords for authentication to when using the [GitHub API](/rest/overview/other-authentication-methods#via-oauth-and-personal-access-tokens) or the [command line](#using-a-token-on-the-command-line). 

### Creating a token
1. In the upper-right corner of any page, click your profile photo, then click Settings.
   
   ![image](https://docs.github.com/assets/images/help/settings/userbar-account-settings.png)

2. In the left sidebar, click **Developer settings.**
   
   ![image](https://docs.github.com/assets/images/help/settings/developer-settings.png)

3. In the left sidebar, click **Personal access tokens.**
   
   ![image](https://docs.github.com/assets/images/help/settings/personal_access_tokens_tab.png)

4. Click **Generate new token**.
   
   ![image](https://docs.github.com/assets/images/help/settings/generate_new_token.png)

5. Give your token a descriptive name.
   
   ![Token description field](https://docs.github.com/assets/images/help/settings/token_description.png)

6. Select the scopes, or permissions, you'd like to grant this token. To use your token to access repositories from the command line, select **repo**.
   
   ![Selecting token scopes](https://docs.github.com/assets/images/help/settings/token_scopes.gif)

7. Click **Generate token**.
   
   ![Generate token button](https://docs.github.com/assets/images/help/settings/generate_token.png)

8. Click to copy the token to your clipboard. For security reasons, after you navigate off the page, you will not be able to see the token again.
   
   ![Newly created token](https://docs.github.com/assets/images/help/settings/personal_access_tokens.png)

   ![Newly created token](https://docs.github.com/assets/images/help/settings/personal_access_tokens_ghe.png)

   **Warning:** Treat your tokens like passwords and keep them secret. When working with the API, use tokens as environment variables instead of hardcoding them into your programs.

### Further reading
- [Github documentation](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token)
  
---

## Webhooks documentation (WEBHOOKS_SECRET_TOKEN equal to secret)
Webhooks allow you to build or set up integrations, such as GitHub Apps or OAuth Apps, which subscribe to certain events on GitHub.com. When one of those events is triggered, we'll send a HTTP POST payload to the webhook's configured URL. Webhooks can be used to update an external issue tracker, trigger CI builds, update a backup mirror, or even deploy to your production server. You're only limited by your imagination.

![image](https://github.com/DSpotDevelopers/makerdao-mips/blob/develop/docs/img/Configure-webhook.png)

### Further reading
- [Webhooks-documentation](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events/webhooks)

---

## Api URL. Documented with Swagger. 
- [API URL](http://159.203.86.45:3000/doc/)

### Findall endpoint
Function that lists all mips.

#### findall endpoint, search parameter
In the search parameter, specify a string of words that the text operator parses and uses to query the text index. The text operator treats most punctuation in the string as delimiters, except a hyphen-minus (-) that negates term or an escaped double quotes \" that specifies a phrase.
https://docs.mongodb.com/manual/reference/operator/query/text/#search-field

##### Examples of search (Ignore parenthesis)

- Specifies a phrase (\"General MIP Templat\")
- Negate term (-MIP)

#### findall endpoint, filter parameter
Filter field with various filter patterns. (contains, notcontains, equals, notequals)

##### Examples
```json
{
  "filter": {
    "contains": [
      {
        "field": "title",
        "value": "Proposal"
      }
    ],
    "notcontains": [
      {
        "field": "title",
        "value": "subproposal"
      }
    ],
    "equals": [
      {
        "field": "mip",
        "value": -1
      }
    ],
    "notequals": [
      {
        "field": "mip",
        "value": -1
      }
    ]
  }
}
```

#### findall endpoint, sort parameter
- Order 'mip -title', means: order parameter (mip ASC and title DESC)

#### findall endpoint, limit parameter
- Limit per page, default value 10

#### findall endpoint, page parameter
- Page, default value equal to zero
  
---

