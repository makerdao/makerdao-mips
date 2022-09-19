Feature: Details view snapshots

  Background: Preset conditions
    Given Backend data is set to be mocked

  ## ----------------------DESKTOP-----------------------
  Scenario: Global Snapshot
    And The viewport is fixed to 1536x600
    And The user opens Details view for MIP1
    And The go-to-top button is removed from the view
    Then Global snapshot matches with image "details-view/entire-view"

  Scenario Outline: Specific Snapshot
    And The viewport is fixed to 1536x600
    And The user opens Details view for MIP1
    And The go-to-top button is removed from the view
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name            | selector              | image                       |
      | Content Table   | .content              | details-view/content-table  |
      | Main content    | app-detail-content    | details-view/main-content   |
      | Details content | #details-component    | details-view/details        |
      | References      | app-references        | details-view/references     |
      | Recent changes  | #pull-request-history | details-view/recent-changes |

  #Dark Mode
  Scenario: Global Snapshot (Dark Mode)
    And The viewport is fixed to 1536x600
    And The user opens Details view for MIP1
    And The go-to-top button is removed from the view
    And Dark mode is toggled
    Then Global snapshot matches with image "details-view/entire-view-dark"

  Scenario Outline: Specific Snapshot (Dark Mode)
    And The viewport is fixed to 1536x600
    And The user opens Details view for MIP1
    And The go-to-top button is removed from the view
    And Dark mode is toggled
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name            | selector              | image                            |
      | Content Table   | .content              | details-view/content-table-dark  |
      | Main content    | app-detail-content    | details-view/main-content-dark   |
      | Details content | #details-component    | details-view/details-dark        |
      | References      | app-references        | details-view/references-dark     |
      | Recent changes  | #pull-request-history | details-view/recent-changes-dark |

  #Spanish
  Scenario: Global Snapshot (Spanish)
    And The viewport is fixed to 1536x600
    And The user opens Details view for MIP1
    And The go-to-top button is removed from the view
    And Vars data is set to be mocked in spanish
    And The user selects "Spanish" language
    Then Global snapshot matches with image "details-view/entire-view-spanish"

  Scenario Outline: Specific Snapshot (Spanish)
    And The viewport is fixed to 1536x600
    And The user opens Details view for MIP1
    And The go-to-top button is removed from the view
    And Vars data is set to be mocked in spanish
    And The user selects "Spanish" language
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name            | selector              | image                               |
      | Content Table   | .content              | details-view/content-table-spanish  |
      | Main content    | app-detail-content    | details-view/main-content-spanish   |
      | Details content | #details-component    | details-view/details-spanish        |
      | References      | app-references        | details-view/references-spanish     |
      | Recent changes  | #pull-request-history | details-view/recent-changes-spanish |


  # ---------------------MOBILE--------------------
  Scenario: Global Snapshot (Mobile)
    And The viewport is fixed to 375x667
    And The user opens Details view for MIP1
    And The go-to-top button is removed from the view
    And "1000" ms are past
    Then Global snapshot matches with image "details-view/entire-view-mobile"

  Scenario Outline: Specific Snapshot (Mobile)
    And The viewport is fixed to 375x667
    And The user opens Details view for MIP1
    And The go-to-top button is removed from the view
    And "1000" ms are past
    Then "<name>" component with selector "<selector>" opened by clicking "<activator>" matches snapshot for image name "<image>"
    Examples:
      | name            | selector                        | activator                                           | image                              |
      | Content Table   | div.MipContentOverlayPanelClass | app-details-mobiles-buttons > div > div.iconWrapper | details-view/content-table-mobile  |
      | Main content    | app-detail-content              | app-detail-content                                  | details-view/main-content-mobile   |
      | Details content | #details-component              | div.tabs-container > :nth-child(2)                  | details-view/details-mobile        |
      | References      | app-references                  | div.tabs-container > :nth-child(4)                  | details-view/references-mobile     |
      | Recent changes  | #pull-request-history           | div.tabs-container > :nth-child(3)                  | details-view/recent-changes-mobile |

  #Dark Mode
  Scenario: Global Snapshot (Mobile) (Dark Mode)
    And The viewport is fixed to 375x667
    And The user opens Details view for MIP1
    And The go-to-top button is removed from the view
    And Dark mode is toggled
    And "1000" ms are past
    Then Global snapshot matches with image "details-view/entire-view-dark-mobile"

  Scenario Outline: Specific Snapshot (Mobile) (Dark Mode)
    And The viewport is fixed to 375x667
    And The user opens Details view for MIP1
    And The go-to-top button is removed from the view
    And Dark mode is toggled
    And "1000" ms are past
    Then "<name>" component with selector "<selector>" opened by clicking "<activator>" matches snapshot for image name "<image>"
    Examples:
      | name            | selector                        | activator                                           | image                                   |
      | Content Table   | div.MipContentOverlayPanelClass | app-details-mobiles-buttons > div > div.iconWrapper | details-view/content-table-dark-mobile  |
      | Main content    | app-detail-content              | app-detail-content                                  | details-view/main-content-dark-mobile   |
      | Details content | #details-component              | div.tabs-container > :nth-child(2)                  | details-view/details-dark-mobile        |
      | References      | app-references                  | div.tabs-container > :nth-child(4)                  | details-view/references-dark-mobile     |
      | Recent changes  | #pull-request-history           | div.tabs-container > :nth-child(3)                  | details-view/recent-changes-dark-mobile |

  #Spanish
  Scenario: Global Snapshot (Mobile) (Spanish)
    And The viewport is fixed to 375x667
    And The user opens Details view for MIP1
    And The go-to-top button is removed from the view
    And Vars data is set to be mocked in spanish
    And The user selects "Spanish" language
    And "1000" ms are past
    Then Global snapshot matches with image "details-view/entire-view-spanish-mobile"

  Scenario Outline: Specific Snapshot (Mobile) (Spanish)
    And The viewport is fixed to 375x667
    And The user opens Details view for MIP1
    And The go-to-top button is removed from the view
    And Vars data is set to be mocked in spanish
    And The user selects "Spanish" language
    And "1000" ms are past
    Then "<name>" component with selector "<selector>" opened by clicking "<activator>" matches snapshot for image name "<image>"
    Examples:
      | name            | selector                        | activator                                           | image                                      |
      | Content Table   | div.MipContentOverlayPanelClass | app-details-mobiles-buttons > div > div.iconWrapper | details-view/content-table-spanish-mobile  |
      | Main content    | app-detail-content              | app-detail-content                                  | details-view/main-content-spanish-mobile   |
      | Details content | #details-component              | div.tabs-container > :nth-child(2)                  | details-view/details-spanish-mobile        |
      | References      | app-references                  | div.tabs-container > :nth-child(4)                  | details-view/references-spanish-mobile     |
      | Recent changes  | #pull-request-history           | div.tabs-container > :nth-child(3)                  | details-view/recent-changes-spanish-mobile |
