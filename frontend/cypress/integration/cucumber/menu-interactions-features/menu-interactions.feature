Feature: Menu interactions

  Background: Mocks
    Given Backend data is set to be mocked
    And Origin "https://mips.makerdao.com" is set to be mocked as baseUrl with alias "mips"
    And Origin "http://chat.makerdao.com" is set to be mocked as fake site with alias "chat"
    And Origin "https://forum.makerdao.com" is set to be mocked as fake site with alias "chat"


  Scenario Outline: Navigates to corresponding view wen clicking non-dropdown menu items
    Given The user opens the main page
    When Menu "<menu>" is open
    And Leaf menu item "<subMenu>" is clicked
    Then Should visit "<url>"

    Examples:
      | menu         | subMenu                  | url                                                                                                                                        |
      | Learn        | Primer for Authors       | /mips/md-viewer?mdUrl=https:%2F%2Fraw.githubusercontent.com%2Fmakerdao%2Fmips%2Fmaster%2Fmeta%2Fprimer_for_authors%2Fprimer_for_authors.md |
      | Learn        | The MIPs Framework       | /mips/details/MIP0                                                                                                                         |
      | Learn        | Monthly Governance Cycle | /mips/details/MIP51                                                                                                                        |
      | Views        | MIP Sets                 | /mips/list?mipsetMode=true                                                                                                                 |
      | Views        | Living MIPs              | /mips/list?search=$AND(@Accepted,%23living)                                                                                                |
      | Views        | Processes                | /mips/list?search=$AND(%23process,@ACCEPTED)&orderDirection=ASC&hideParents=false                                                          |
      | Get in Touch | Forum                    | forum.makerdao.com/c/mips/                                                                                                                 |
      | Get in Touch | Chat                     | chat.makerdao.com                                                                                                                          |
