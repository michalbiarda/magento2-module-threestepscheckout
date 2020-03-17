# MB_ThreeStepsCheckout Magento 2 module
## Overview
This module adds "Finalization" step at the end of standard Magento 2 checkout. It is currently in work in progress stage. Use at your own risk.

## Configuration
The module requires that "Configuration > Sales > Checkout > Checkout Options > Display Billing Address On" config is set to "Payment Page".

The module itself has no configuration. If module is enabled, checkout is overwritten.

## Payment methods coverage
Due to the fact that "Place order" button is hardcoded in each payment method's template, there is a need to overwrite these templates. Currently covered payment methods:

* Magento_OfflinePayments: Bank transfer
* Magento_OfflinePayments: Checkmo

If you need to use other methods, you must overwrite them by your own.