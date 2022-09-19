Feature: Go Top functionality

 Scenario: Show and Hide Go Top component
    Given The user opens the main page
    Then Go Top component should not be visible
    When Scrolls down 500 pixels
    Then Go Top component should be visible
    When Clicks Go Top component
    Then Go Top component should be visible
    When Scrolls to the top
    Then Go Top component should not be visible

  Scenario: Show and Hide Go Top component in darkmode
    Given The user opens the main page
    When Activates the darkmode
    When Scrolls to the top
    Then Go Top component should not be visible
    When Scrolls down 500 pixels
    Then Go Top component should be visible
    When Clicks Go Top component
    Then Go Top component should be visible
    When Scrolls to the top
    Then Go Top component should not be visible

  Scenario: Show and Hide Go Top component in spanish language
    Given The user opens the main page
    When Activates the spanish language
    When Scrolls to the top
    Then Go Top component should not be visible
    When Scrolls down 500 pixels
    Then Go Top component should be visible
    When Clicks Go Top component
    Then Go Top component should be visible
    When Scrolls to the top
    Then Go Top component should not be visible

