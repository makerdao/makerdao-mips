Feature: Normal view snapshots

  Background: Preset conditions
    Given Backend data is set to be mocked
    And The viewport is fixed to macbook-16
    And The user opens the main page

  Scenario: Global Snapshot
    Then Global snapshot matches with image "normal-view/entire-view"

  Scenario Outline: Specific Snapshot
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name   | selector                           | image                      |
      | Table  | [data-cy=table-list-mips]          | normal-view/mips-table     |
      | Header | [data-cy=table-list-mips] thead tr | normal-view/mip-row-header |
      | Row    | [data-cy=table-list-mips] tbody tr | normal-view/mip-row        |

  Scenario: MIP description
    Then MIP description component matches snapshot

  Scenario: MIP components
    Then MIP components match snapshots
