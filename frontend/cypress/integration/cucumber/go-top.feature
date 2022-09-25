Feature: Go Top functionality

  Background: Mock
    Given Backend data is set to be mocked
    And MIPs list is set to be mocked as a large list

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

