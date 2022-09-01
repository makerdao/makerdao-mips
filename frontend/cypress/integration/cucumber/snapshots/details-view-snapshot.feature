Feature: Details view snapshots

  Background: Preset conditions
    Given Backend data is set to be mocked
    And The viewport is fixed to macbook-16
    And The user opens Details view for MIP1

  Scenario: Global Snapshot
    Then Global snapshot matches with image "details-view/entire-view"

  Scenario Outline: Specific Snapshot
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
    And Dark mode is toggled
    Then Global snapshot matches with image "details-view/entire-view-dark"

  Scenario Outline: Specific Snapshot (Dark Mode)
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
    And The user selects "Spanish" language
    And Vars data is set to be mocked in spanish
    Then Global snapshot matches with image "details-view/entire-view-spanish"

  Scenario Outline: Specific Snapshot (Spanish)
    And The user selects "Spanish" language
    And Vars data is set to be mocked in spanish
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name            | selector              | image                               |
      | Content Table   | .content              | details-view/content-table-spanish  |
      | Main content    | app-detail-content    | details-view/main-content-spanish   |
      | Details content | #details-component    | details-view/details-spanish        |
      | References      | app-references        | details-view/references-spanish     |
      | Recent changes  | #pull-request-history | details-view/recent-changes-spanish |
