# Table of contents
* [Introduction](#introduction)
    * [Dependencies](#dependencies)
    * [Requirements](#requirements)
* [Diagrams](#diagrams)
    * [High Level Diagram](#high-level-diagram)
* [Command to parse MakerDAO mips repository manually](#command-to-parse-makerdao)
* [Environment vars .env file](#environment-vars)
* [Creating a personal access token (GIT_ACCESS_API_TOKEN)](#creating-personal-access-token)
    * [Creating a token](#creating-a-token)
    * [Further reading](#further-reading-token)
* [Webhooks documentation (WEBHOOKS_SECRET_TOKEN equal to secret)](#webhooks-documentation)
    * [Further reading](#further-reading-webhooks)
* [Api URL. Documented with Swagger](#api-documented-swagger)
    * [Findall endpoint](#findall-endpoint)
        * [findall endpoint, search parameter](#findall-endpoint-search-parameter)
        * [findall endpoint, filter parameter](#findall-endpoint-filter-parameter)
        * [findall endpoint, sort parameter](#findall-endpoint-sort-parameter)
        * [findall endpoint, limit parameter](#findall-endpoint-limit-parameter)
        * [findall endpoint, page parameter](#findall-endpoint-page-parameter)
* [Menu](#menu)
    * [Creating a menu](#creating-a-menu)
* [Database](#db)
    * [Introduction](#db-introduction)
    * [Data Dictionary](#db-data-dictionary)

# Introduction <a name="introduction"></a>
This project (makerdao-mips) is a MIPs Tracker for MakerDAO Improvement Proposals. 

## Dependencies <a name="dependencies"></a>
Requires git to be installed and that it can be called using the command git.

## Requirements <a name="requirements"></a>
Node version 14.x.x LTS or above

# Diagrams <a name="diagrams"></a>
## High Level Diagram <a name="high-level-diagram"></a>

![MakerDAO_HLD_1](https://github.com/DSpotDevelopers/makerdao-mips/blob/develop/docs/img/MakerDAO_HLD_1.png)


## Command to parse MakerDAO mips repository manually <a name="command-to-parse-makerdao"></a>
```bash
$ npx nestjs-command parse:mips
```

## Environment vars .env file <a name="environment-vars"></a>
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
## Creating a personal access token (GIT_ACCESS_API_TOKEN) <a name="creating-personal-access-token"></a>

You should create a personal access token to use in place of a password with the command line or with the API. Personal access tokens (PATs) are an alternative to using passwords for authentication to when using the [GitHub API](/rest/overview/other-authentication-methods#via-oauth-and-personal-access-tokens) or the [command line](#using-a-token-on-the-command-line). 

### Creating a token <a name="creating-a-token"></a>
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

### Further reading <a name="further-reading-token"></a>
- [Github documentation](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token)
  
---

## Webhooks documentation (WEBHOOKS_SECRET_TOKEN equal to secret) <a name="webhooks-documentation"></a>
Webhooks allow you to build or set up integrations, such as GitHub Apps or OAuth Apps, which subscribe to certain events on GitHub.com. When one of those events is triggered, we'll send a HTTP POST payload to the webhook's configured URL. Webhooks can be used to update an external issue tracker, trigger CI builds, update a backup mirror, or even deploy to your production server. You're only limited by your imagination.

![image](https://github.com/DSpotDevelopers/makerdao-mips/blob/develop/docs/img/Configure-webhook.png)

### Further reading <a name="further-reading-webhooks"></a>
- [Webhooks-documentation](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events/webhooks)

---

## Api URL. Documented with Swagger. <a name="api-documented-swagger"></a>
- [API URL](http://159.203.86.45:3000/doc/)

### Findall endpoint <a name="findall-endpoint"></a>
Function that lists all mips.

#### findall endpoint, search parameter <a name="findall-endpoint-search-parameter"></a>
In the search parameter, specify a string of words that the text operator parses and uses to query the text index. The text operator treats most punctuation in the string as delimiters, except a hyphen-minus (-) that negates term or an escaped double quotes \" that specifies a phrase.
https://docs.mongodb.com/manual/reference/operator/query/text/#search-field

##### Examples of search (Ignore parenthesis)

- Specifies a phrase (\"General MIP Templat\")
- Negate term (-MIP)

#### findall endpoint, filter parameter <a name="findall-endpoint-filter-parameter"></a>
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

#### findall endpoint, sort parameter <a name="findall-endpoint-sort-parameter"></a>
- Order 'mip -title', means: order parameter (mip ASC and title DESC)

#### findall endpoint, limit parameter <a name="findall-endpoint-limit-parameter"></a>
- Limit per page, default value 10

#### findall endpoint, page parameter <a name="findall-endpoint-page-parameter"></a>
- Page, default value equal to zero
  
---

## Menu <a name="menu"></a>
Menu appears horizontally along of top page, and is formed through a config JSON file existing in MIPs repository. 
Menu support second level menu items and can link to any valid URL.
It is located at _frontend/src/assets/data/menu.json_

### Creating a menu <a name="creating-a-menu"></a>
#### Example:
```json
{
  "data": [
      {
          "id": "item1",
          "name": "Item 1",
          "href": "URL1"          
      },
      {
          "id": "item2",
          "name": "Item 2",
          "children": [
              {
                  "id": "subitem2",
                  "name": "Sub Item 2",
                  "href": "URL2"
              }
          ]
      }
  ]    
}
```
#### Result in frontend
![image](https://github.com/DSpotDevelopers/makerdao-mips/blob/readme-table-of-content/docs/img/menu001.png)
![image](https://github.com/DSpotDevelopers/makerdao-mips/blob/readme-table-of-content/docs/img/menu002.png)

## Database <a name="db"></a>
Documentation referent to the DAO MIPs Portal database (MongoDB)

### Introduction <a name="db-introduction"></a>
This data dictionary describes the fields available in the collections within the DAO database.

The database's technology is MongoDB and the diagram is detailed in the diagram below:
![image](https://github.com/DSpotDevelopers/makerdao-mips/blob/develop/docs/img/MIPs_MongoDB_Diagram.jpeg)

### Data Dictionary <a name="db-data-dictionary"></a>

#### Collections


| Name |
| :-------- |
| MIP |
| PullRequest |
| Meta |

#### Fields

|	Collection	|	Field Name	|	Type	|	Description	|
|	:--------	|	:--------	|	:--------	|	:----------------	|
|	`MIP`	|	_id	|	`objectid`	|	**PK.** Unique identifier generated by MongoDB	|
|	`MIP`	|	components [{}]	|	`MIP`.`components`	|	List of Items used to show the sidebar under the Content 	|
|	`MIP`	|	cName	|	`string`	|	Sub Items (MIP subsection's nomenclature) used to show the sidebar under the Content 	|
|	`MIP`	|	cTitle	|	`string`	|	Sub Items (title subsection) used to show the sidebar under the Content 	|
|	`MIP`	|	cBody	|	`string`	|	Sub Items (text of subsection) used to show the sidebar under the Content 	|
|	`MIP`	|	references [{}]	|	`MIP`.`references`	|	List of Items used to show under the References section 	|
|	`MIP`	|	name	|	`string`	|	Sub Item (name of the reference) of Items used to show under the References section 	|
|	`MIP`	|	link	|	`string`	|	Sub Item (link to the reference) of Items used to show under the References section 	|
|	`MIP`	|	sectionsRaw []	|	`string`	|	List of every section in the document (raw format of the md)	|
|	`MIP`	|	sections[{}]	|	`MIP`.`sections`	|	List of the headings in the document and their heading level	|
|	`MIP`	|	heading	|	`string`	|	Sub item (text of the heading) of the headings in the document and their heading level	|
|	`MIP`	|	depth	|	`double`	|	Sub item (level of the heading) of the headings in the document and their heading level	|
|	`MIP`	|	mipComponent	|	`string`	|		|
|	`MIP`	|	dependencies []	|	`string`	|	Field used to list the references	|
|	`MIP`	|	tags []	|	`string`	|	Field used to list the tags	|
|	`MIP`	|	contributors []	|	`string`	|	Field used to list the contributors	|
|	`MIP`	|	author	|	`string`	|	Field used to show the author	|
|	`MIP`	|	proposal	|	`string`	|	MIP name of the father, in the case of a subproposal	|
|	`MIP`	|	mipFather	|	`bool`	|	Boolean indicating if the item is a father of a subproposal	|
|	`MIP`	|	subproposal	|	`double`	|	Subproposal number	|
|	`MIP`	|	mip	|	`double`	|	Quantity of MIPs	|
|	`MIP`	|	language	|	`string`	|	Language of the MIP, nomenclature 	|
|	`MIP`	|	hash	|	`string`	|	Hash code of the file source of the mips	|
|	`MIP`	|	file	|	`string`	|	File text of the source	|
|	`MIP`	|	filename	|	`string`	|	File url inside Github repository	|
|	`MIP`	|	mipName	|	`string`	|	MIP name	|
|	`MIP`	|	sentenceSummary	|	`string`	|	Sentence summary text	|
|	`MIP`	|	dateProposed	|	`string`	|	Date the MIP was proposed	|
|	`MIP`	|	dateRatified	|	`string`	|	Date the MIP was ratified	|
|	`MIP`	|	status	|	`string`	|	MIP status	|
|	`MIP`	|	title	|	`string`	|	MIP title	|
|	`MIP`	|	subproposalCount	|	`double`	|	Amount of subproposals if any	|
|	`MIP`	|	mipCodeNumber	|	`string`	|	MIP code used to sorting purposes	|
|	`MIP`	|	_v	|	`double`	|	Version of the dataset	|
|	`MIP`	|	paragraphSummary	|	`string`	|	Paragraph summary text	|
|	`MIP`	|	replaces	|	`string`	|	Replace the text based on the translation	|
|	`MIP`	|	types	|	`string`	|	MIP type	|
|	`MIP`	|	votingPortalLink	|	`string`	|	Link to the Voting Portal	|
|	`MIP`	|	forumLink	|	`string`	|	Link to the Forum	|
|	`PullRequest`	|	_id	|	`objectid`	|	**PK.** Unique identifier generated by MongoDB	|
|	`PullRequest`	|	author {}	|	`PullRequest`.`author`	|	Author to the PullRequest	|
|	`PullRequest`	|	login	|	`string`	|	PullRequest's author login account	|
|	`PullRequest`	|	state	|	`string`	|	State of the PullRequest	|
|	`PullRequest`	|	files {}	|	`PullRequest`.`files`	|	Files Affected by the PullRequest	|
|	`PullRequest`	|	nodes [{}]	|	`PullRequest`.`files`.`nodes`	|	Sub item (nodes in git structure) of Files Affected by the PullRequest	|
|	`PullRequest`	|	path	|	`string`	|	Sub item (path of each node) of Files Affected by the PullRequest	|
|	`PullRequest`	|	totalCount	|	`double`	|	Sub item (total amount) of Files Affected by the PullRequest	|
|	`PullRequest`	|	url	|	`string`	|	Url of the PullRequest	|
|	`PullRequest`	|	title	|	`string`	|	Title of the PullRequest	|
|	`PullRequest`	|	body	|	`string`	|	Body text of the PullRequest	|
|	`PullRequest`	|	createdAt	|	`string`	|	Creation Date of the PullRequest	|
|	`PullRequest`	|	_v	|	`double`	|	Version od the dataset	|
|	`Meta`	|	_id	|	`objectid`	|	**PK.** Unique identifier generated by MongoDB	|
|	`Meta`	|	language	|	`string`	|	Language nomenclature	|
|	`Meta`	|	translations	|	`string`	|	List of Translations of the language	|
|	`Meta`	|	_v	|	`double`	|	Version of the dataset	|
