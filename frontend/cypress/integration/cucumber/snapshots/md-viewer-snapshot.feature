Feature: MD viewer snapshots

  Background: Preset conditions
    Given Backend data is set to be mocked

  ## ----------------------DESKTOP-----------------------
  Scenario: Global Snapshot
    And The viewport is fixed to 1536x600
    And The user opens md viewer for Mip 1 component 4 sub proposal
    And The go-to-top button is removed from the view
    Then Global snapshot matches with image "md-viewer/entire-view"

  Scenario Outline: Specific Snapshot
    And The viewport is fixed to 1536x600
    And The user opens md viewer for Mip 1 component 4 sub proposal
    And The go-to-top button is removed from the view
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name          | selector           | image                   |
      | Content Table | .content           | md-viewer/content-table |
      | Main content  | app-detail-content | md-viewer/main-content  |

  #Dark Mode
  Scenario: Global Snapshot (Dark Mode)
    And The viewport is fixed to 1536x600
    And The user opens md viewer for Mip 1 component 4 sub proposal
    And The go-to-top button is removed from the view
    And Dark mode is toggled
    Then Global snapshot matches with image "md-viewer/entire-view-dark"

  Scenario Outline: Specific Snapshot (Dark Mode)
    And The viewport is fixed to 1536x600
    And The user opens md viewer for Mip 1 component 4 sub proposal
    And The go-to-top button is removed from the view
    And Dark mode is toggled
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name          | selector           | image                        |
      | Content Table | .content           | md-viewer/content-table-dark |
      | Main content  | app-detail-content | md-viewer/main-content-dark  |

  #Spanish
  Scenario: Global Snapshot (Spanish)
    And The viewport is fixed to 1536x600
    And The user opens md viewer for Mip 1 component 4 sub proposal
    And The go-to-top button is removed from the view
    And Vars data is set to be mocked in spanish
    And The user selects "Spanish" language
    And "1000" ms are past
    Then Global snapshot matches with image "md-viewer/entire-view-spanish"

  Scenario Outline: Specific Snapshot (Spanish)
    And The viewport is fixed to 1536x600
    And The user opens md viewer for Mip 1 component 4 sub proposal
    And The go-to-top button is removed from the view
    And Vars data is set to be mocked in spanish
    And The user selects "Spanish" language
    And "1000" ms are past
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name          | selector           | image                           |
      | Content Table | .content           | md-viewer/content-table-spanish |
      | Main content  | app-detail-content | md-viewer/main-content-spanish  |

  # ---------------------MOBILE--------------------
  Scenario: Global Snapshot (Mobile)
    And The viewport is fixed to 375x667
    And The user opens md viewer for Mip 1 component 4 sub proposal
    And The go-to-top button is removed from the view
    And "1000" ms are past
    Then Global snapshot matches with image "md-viewer/entire-view-mobile"

  Scenario Outline: Specific Snapshot (Mobile)
    And The viewport is fixed to 375x667
    And The user opens md viewer for Mip 1 component 4 sub proposal
    And The go-to-top button is removed from the view
    And "1000" ms are past
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name         | selector           | image                         |
      | Main content | app-detail-content | md-viewer/main-content-mobile |

  #Dark Mode
  Scenario: Global Snapshot (Mobile) (Dark Mode)
    And The viewport is fixed to 375x667
    And The user opens md viewer for Mip 1 component 4 sub proposal
    And The go-to-top button is removed from the view
    And Dark mode is toggled
    And "1000" ms are past
    Then Global snapshot matches with image "md-viewer/entire-view-dark-mobile"

  Scenario Outline: Specific Snapshot (Mobile) (Dark Mode)
    And The viewport is fixed to 375x667
    And The user opens md viewer for Mip 1 component 4 sub proposal
    And The go-to-top button is removed from the view
    And Dark mode is toggled
    And "1000" ms are past
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name         | selector           | image                              |
      | Main content | app-detail-content | md-viewer/main-content-dark-mobile |

  #Spanish
  Scenario: Global Snapshot (Mobile) (Spanish)
    And The viewport is fixed to 375x667
    And The user opens md viewer for Mip 1 component 4 sub proposal
    And The go-to-top button is removed from the view
    And Vars data is set to be mocked in spanish
    And The user selects "Spanish" language
    And "1000" ms are past
    And "1000" ms are past
    Then Global snapshot matches with image "md-viewer/entire-view-spanish-mobile"

  Scenario Outline: Specific Snapshot (Mobile) (Spanish)
    And The viewport is fixed to 375x667
    And The user opens md viewer for Mip 1 component 4 sub proposal
    And The go-to-top button is removed from the view
    And Vars data is set to be mocked in spanish
    And The user selects "Spanish" language
    And "1000" ms are past
    And "1000" ms are past
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name         | selector           | image                                 |
      | Main content | app-detail-content | md-viewer/main-content-spanish-mobile |
