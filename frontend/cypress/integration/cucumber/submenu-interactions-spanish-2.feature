Feature: Submenu interactions

  #Spanish
  Scenario Outline: Submenu items navigate to the expected links
    Given The user opens the main page
    And The user selects "Spanish" language
    When Menu "<menu>" is open
    And Mouse goes over submenu dropdown "<subMenu>"
    And Leaf subMenu item "<subMenuItem>" is clicked
    Then Should visit "<url>"

    Examples:
      | menu | subMenu | subMenuItem | url |

      # Estado
      | Vistas | Estado | RFC               | /mips/list?customViewName=RFC%20Status:%20Proposals%20Requesting%20Comments&search=$@RFC                                               |
      | Vistas | Estado | Formal Submission | /mips/list?customViewName=Formal%20Submission%20Status:%20Proposals%20formally%20submitted%20for%20voting&search=$@Formal%20Submission |
      | Vistas | Estado | Aceptada          | /mips/list?customViewName=Accepted%20Proposals&search=$@Accepted                                                                       |
      | Vistas | Estado | Obsoleta          | /mips/list?customViewName=Obsolete%20Proposals&search=$@Obsolete                                                                       |
      | Vistas | Estado | Rechazada         | /mips/list?customViewName=Rejected%20Proposals&search=$@Rejected                                                                       |
      | Vistas | Estado | Retirada          | /mips/list?customViewName=Withdrawn%20Proposals&search=$@Withdrawn                                                                     |

      # Técnicas
      | Vistas | Técnicas | Implementadas                | /mips/list?search=$AND(%23technical,%20NOT(%23pending-implementation))&subproposalsMode=false |
      | Vistas | Técnicas | Pendientes de Implementación | /mips/list?search=$AND(@accepted,%20%23pending-implementation)&subproposalsMode=false         |
