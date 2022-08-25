Feature: Menu interactions

  Scenario Outline: Submenus render when hovering dropdown menu items
    Given The user opens the main page
    When Menu "<menu>" is open
    And Mouse goes over submenu dropdown "<subMenu>"
    Then Corresponding subMenu containing "<content>" should become visible

    Examples:
      | menu  | subMenu    | content                                                                                                                  |
      | Views | Status     | RFC,Formal Submission,Accepted,Obsolete,Rejected,Withdrawn                                                               |
      | Views | Core Units | All (MIP38c2),Active Budgets,CES-001: Collateral Engineering,COM-001: Governance Communications,DAIF-001: Dai Foundation |
      | Views | Technical  | Implemented,Pending Implementation                                                                                       |

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
      | Get in Touch | Chat                     | discord.com/invite/RBRumCpEDH                                                                                                              |

  #Dark Mode
  Scenario Outline: Submenus render when hovering dropdown menu items (Dark Mode)
    Given The user opens the main page
    And Dark mode is toggled
    When Menu "<menu>" is open
    And Mouse goes over submenu dropdown "<subMenu>"
    Then Corresponding subMenu containing "<content>" should become visible

    Examples:
      | menu  | subMenu    | content                                                                                                                  |
      | Views | Status     | RFC,Formal Submission,Accepted,Obsolete,Rejected,Withdrawn                                                               |
      | Views | Core Units | All (MIP38c2),Active Budgets,CES-001: Collateral Engineering,COM-001: Governance Communications,DAIF-001: Dai Foundation |
      | Views | Technical  | Implemented,Pending Implementation                                                                                       |

  Scenario Outline: Navigates to corresponding view wen clicking non-dropdown menu items (Dark Mode)
    Given The user opens the main page
    And Dark mode is toggled
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
      | Get in Touch | Chat                     | discord.com/invite/RBRumCpEDH                                                                                                              |

  #Spanish
  Scenario Outline: Submenus render when hovering dropdown menu items (Spanish)
    Given The user opens the main page
    And The user selects "Spanish" language
    When Menu "<menu>" is open
    And Mouse goes over submenu dropdown "<subMenu>"
    Then Corresponding subMenu containing "<content>" should become visible

    Examples:
      | menu   | subMenu    | content                                                                                                                          |
      | Vistas | Estado     | RFC,Formal Submission,Aceptada,Obsoleta,Rechazada,Retirada                                                                       |
      | Vistas | Core Units | Todas (MIP38c2),Presupuestos Activos,CES-001: Collateral Engineering,COM-001: Governance Communications,DAIF-001: Dai Foundation |
      | Vistas | Técnicas   | Implementadas,Pendientes de Implementación                                                                                       |

  Scenario Outline: Navigates to corresponding view wen clicking non-dropdown menu items (Spanish)
    Given The user opens the main page
    And The user selects "Spanish" language
    When Menu "<menu>" is open
    And Leaf menu item "<subMenu>" is clicked
    Then Should visit "<url>"

    Examples:
      | menu              | subMenu                     | url                                                                                                                                        |
      | Aprende           | Intro para Autores          | /mips/md-viewer?mdUrl=https:%2F%2Fraw.githubusercontent.com%2Fmakerdao%2Fmips%2Fmaster%2Fmeta%2Fprimer_for_authors%2Fprimer_for_authors.md |
      | Aprende           | El Framework de MIP         | /mips/details/MIP0                                                                                                                         |
      | Aprende           | Ciclo de Gobernanza Mensual | /mips/details/MIP51                                                                                                                        |
      | Vistas            | MIP Sets                    | /mips/list?mipsetMode=true                                                                                                                 |
      | Vistas            | Propuestas Registrales      | /mips/list?search=$AND(@Accepted,%23living)                                                                                                |
      | Vistas            | Procesos                    | /mips/list?search=$AND(%23process,@ACCEPTED)&orderDirection=ASC&hideParents=false                                                          |
      | Ponte en Contacto | Foro                        | forum.makerdao.com/c/mips/                                                                                                                 |
      | Ponte en Contacto | Chat                        | discord.com/invite/RBRumCpEDH                                                                                                              |
