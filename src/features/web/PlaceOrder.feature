@ui @PlaceOrderTest
Feature: Web - TestCaseB_Place_Order_With_Multiple_Products_And_check_price_calculation

    Background: Navigate to Home Page
        Given user is logged into the application

    @TestCaseB_PlaceOrderWithMultipleProducts
    Scenario: TestCaseB_Place_Order_With_Multiple_Products_with_price_calculation_check
        # Given user navigate to Home page
        When user clicks on Shop New Yoga
        And user selects product number 1
        And user selects first available size and color
        And user adds the product to cart
        When user searches for a valid product name "men hoodie"
        And user selects product number 2
        And user selects first available size and color
        And user adds the product to cart
        And user go to the cart page
        Then user verifies cart items and pricing
        When user proceeds to checkout
        And user fills shipping details
        And user proceed to payment page
        Then verify order is placed successfully


    @TestCaseC_PlaceOrderWithWishlist
    Scenario: TestCaseC_Add_Product_To_Wishlist_And_Checkout
        When user clicks on Shop New Yoga
        And user selects product number 1
        And user adds the first product to wishlist
        And user proceeds to checkout from wishlist
        And user selects first available size and color
        And user adds the product to cart
        Then Verify product is removed from wishlist
        # When user proceeds to checkout
