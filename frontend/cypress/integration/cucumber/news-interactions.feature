Feature: News interactions

  Scenario: The news appear again at the proper time after being closed
    Given Fake fixture is set to replace news.yaml configuration files with each new reset time set to 4 seconds
    And The user opens the main page
    When The user closes the existent news
    And The page is reloaded
    Then The news should not yet be present again
    When "4000" ms are past
    And The page is reloaded
    Then The news should be present again

  Scenario: The news display with the propper title, description and style
    Given news.yaml and var.yaml requests are set to be spied on
    And The user opens the main page
    And The corresponding yaml values are stored
    Then News title, description, style and icon should match the ones read from the news.yaml file

  Scenario: The news are rendered above the list of MIPs
    Given The user opens the main page
    Then News should be rendered above the list of MIPs

  # Dark Mode
  Scenario: The news appear again at the proper time after being closed (Dark Mode)
    Given Fake fixture is set to replace news.yaml configuration files with each new reset time set to 4 seconds
    And The user opens the main page
    And Dark mode is toggled
    When The user closes the existent news
    And The page is reloaded
    Then The news should not yet be present again
    When "4000" ms are past
    And The page is reloaded
    Then The news should be present again
    And The main container should use the darkmode classes

  Scenario: The news are displayed with the propper title, description and style (Dark Mode)
    Given news.yaml and var.yaml requests are set to be spied on
    And The user opens the main page
    And Dark mode is toggled
    And The corresponding yaml values are stored
    Then News title, description, style and icon should match the ones read from the news.yaml file
    And The main container should use the darkmode classes

  Scenario: The news are rendered above the list of MIPs (Dark Mode)
    Given The user opens the main page
    And Dark mode is toggled
    Then News should be rendered above the list of MIPs
    And The main container should use the darkmode classes

  # Spanish
  Scenario: The news appear again at the proper time after being closed (Spanish)
    Given Fake fixture is set to replace news.yaml configuration files with each new reset time set to 4 seconds
    And The user opens the main page
    And The user selects "Spanish" language
    When The user closes the existent news
    And The page is reloaded
    Then The news should not yet be present again
    When "4000" ms are past
    And The page is reloaded
    Then The news should be present again

  Scenario: The news display with the propper title, description and style (Spanish)
    Given news.yaml and var.yaml requests are set to be spied on
    And The user opens the main page
    And The user selects "Spanish" language
    And The corresponding yaml values are stored
    Then News title, description, style and icon should match the ones read from the news.yaml file

  Scenario: The news are rendered above the list of MIPs (Spanish)
    Given The user opens the main page
    And The user selects "Spanish" language
    Then News should be rendered above the list of MIPs
