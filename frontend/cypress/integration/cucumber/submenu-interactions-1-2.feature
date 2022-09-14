Feature: Submenu interactions

  Scenario Outline: Submenu items navigate to the expected links
    Given The user opens the main page
    When Menu "<menu>" is open
    And Mouse goes over submenu dropdown "<subMenu>"
    And Leaf subMenu item "<subMenuItem>" is clicked
    Then Should visit "<url>"

    Examples:
      | menu | subMenu | subMenuItem | url |

      # Core units
      | Views | Core Units | ORA-001: Oracles                       | /mips/list?customViewName=Oracles%20Core%20Unit%20(ORA-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-ora-001)&_Archive=$AND(NOT(%23active),%23cu-ora-001)                             |
      | Views | Core Units | PE-001: Protocol Engineering           | /mips/list?customViewName=Protocol%20Engineering%20Core%20Unit%20(PE-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-pe-001)&_Archive=$AND(NOT(%23active),%23cu-pe-001)                 |
      | Views | Core Units | RISK-001: Risk                         | mips/list?customViewName=Risk%20Core%20Unit%20(RISK-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-risk-001)&_Archive=$AND(NOT(%23active),%23cu-risk-001)                              |
      | Views | Core Units | RWF-001: Real-World Finance            | /mips/list?customViewName=Real%20World%20Finance%20Core%20Unit%20(RWF-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-rwf-001)&_Archive=$AND(NOT(%23active),%23cu-rwf-001)              |
      # TODO define if the redirect on cors navigation (from localhost to site url) is an spected behavior
      # | Views | Core Units | SAS-001: Sidestream Auction Services   | /mips/list?customViewName=Sidestream%20Auction%20Services%20Core%20Unit%20(SAS-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-sas-001)&_Archive=$AND(NOT(%23active),%23cu-sas-001)     |
      | Views | Core Units | SES-001: Sustainable Ecosystem Scaling | /mips/list?customViewName=Sustainable%20Ecosystem%20Scaling%20Core%20Unit%20(SES-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-ses-001)&_Archive=$AND(NOT(%23active),%23cu-ses-001)   |
      | Views | Core Units | SF-001: Strategic Finance              | /mips/list?customViewName=TechOps%20Core%20Unit%20(SF-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-sf-001)&_Archive=$AND(NOT(%23active),%23cu-sf-001)                                |
      | Views | Core Units | SNE-001: StarkNet Engineering          | /mips/list?customViewName=StarkNet%20Engineering%20Core%20Unit%20(SNE-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-sne-001)&_Archive=$AND(NOT(%23active),%23cu-sne-001)              |
      | Views | Core Units | SH-001: Strategic Happiness            | /mips/list?customViewName=Strategic%20Happiness%20Core%20Unit%20(SH-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-sh-001)&_Archive=$AND(NOT(%23active),%23cu-sh-001)                  |
      | Views | Core Units | TECH-001: TechOps                      | /mips/list?customViewName=TechOps%20Core%20Unit%20(TECH-001)%20Subproposals&_Active%20Subproposals=$AND(%23active,%23cu-tech-001)&_Archive=$AND(NOT(%23active),%23cu-tech-001)                          |
