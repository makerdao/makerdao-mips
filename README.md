# makerdao-mips
This project is a MIPs Tracker for MakerDAO Improvement Proposals. 

## Dependencies
Requires git to be installed and that it can be called using the command git.

### Api search
In the search field, specify a string of words that the text operator parses and uses to query the text index. The text operator treats most punctuation in the string as delimiters, except a hyphen-minus (-) that negates term or an escaped double quotes \" that specifies a phrase.
https://docs.mongodb.com/manual/reference/operator/query/text/#search-field


# Diagrams
## Entity Relationship Diagram

![Maker Dao ERM_1](https://user-images.githubusercontent.com/17706489/104136852-c3b32800-5366-11eb-88a2-d9feb803b0ae.png)


## High Level Diagram

![MakerDAO_HLD_1](https://user-images.githubusercontent.com/17706489/104136890-037a0f80-5367-11eb-9208-fe83f6f0f1e5.png)


## Creating a personal access token
![creating-a-personal-access-token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token)

## Webhooks documentation
![Webhooks-documentation](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events/webhooks)

## Command to parse MakerDAO mips repository manualy
$ npx nestjs-command parse:mips
