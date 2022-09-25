Feature: Submenu interactions                                                                                                          |

  Background: Mocks
    Given Backend data is set to be mocked
    And Origin "https://mips.makerdao.com" is set to be mocked as baseUrl with alias "mips"
    And Origin "http://chat.makerdao.com" is set to be mocked as fake site with alias "chat"
    And Origin "https://forum.makerdao.com" is set to be mocked as fake site with alias "chat"

  #Dark Mode
  Scenario Outline: Submenu items navigate to the expected links
    Given The user opens the main page
    And Dark mode is toggled
    When Menu "<menu>" is open
    And Mouse goes over submenu dropdown "<subMenu>"
    And Leaf subMenu item "<subMenuItem>" is clicked
    Then Should visit "<url>"

    Examples:
      | menu | subMenu | subMenuItem | url |

      # Status
      | Views | Status | RFC               | /mips/list?customViewName=RFC%20Status:%20Proposals%20Requesting%20Comments&search=$@RFC                                               |
      | Views | Status | Formal Submission | /mips/list?customViewName=Formal%20Submission%20Status:%20Proposals%20formally%20submitted%20for%20voting&search=$@Formal%20Submission |
      | Views | Status | Accepted          | /mips/list?customViewName=Accepted%20Proposals&search=$@Accepted                                                                       |
      | Views | Status | Obsolete          | /mips/list?customViewName=Obsolete%20Proposals&search=$@Obsolete                                                                       |
      | Views | Status | Rejected          | /mips/list?customViewName=Rejected%20Proposals&search=$@Rejected                                                                       |
      | Views | Status | Withdrawn         | /mips/list?customViewName=Withdrawn%20Proposals&search=$@Withdrawn                                                                     |

      # Technical
      | Views | Technical | Implemented            | /mips/list?search=$AND(%23technical,%20NOT(%23pending-implementation))&subproposalsMode=false |
      | Views | Technical | Pending Implementation | /mips/list?search=$AND(@accepted,%20%23pending-implementation)&subproposalsMode=false         |
