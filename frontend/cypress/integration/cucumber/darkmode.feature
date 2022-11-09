Feature: Dark Mode

  Background: Mock
    Given Backend data is set to be mocked

  Scenario Outline: Check dark mode for multiple components
    Given The user opens the main page
    When Dark mode is toggled
    Then View "<selector>" should have a dark background class with value "<color>"

    Examples:
      | selector                          | color                     |
      | #logo                             | logoDarkMode              |
      | app-root > div.container          | container-dark            |
      | img.internalizationIcon           | internalizationIconDark   |
      | img.internalizationIcon           | internalizationIconDark   |
      | app-menu > a.dropdown             | dropdown-dark             |
      | app-news > div[class^=container-] | container-dark            |
      | div[data-cy=search-input]         | contentEditableInput-dark |
      | .container > p.title              | title-dark                |
      | .container > p.title              | title-dark                |
      | app-list > div.maker-container    | maker-container-dark      |

  Scenario: Check dark mode multiple times
    Given The user opens the main page
    When Dark mode is toggled
    Then The main container should use the darkmode classes
    When Dark mode is toggled
    Then The main container should NOT use the darkmode classes
    When Dark mode is toggled
    Then The main container should use the darkmode classes
    When Dark mode is toggled
    Then The main container should NOT use the darkmode classes
    When Dark mode is toggled
    Then The main container should use the darkmode classes
    When Dark mode is toggled
    Then The main container should NOT use the darkmode classes
