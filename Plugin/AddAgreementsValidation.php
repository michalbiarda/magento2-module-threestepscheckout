<?php

namespace MB\ThreeStepsCheckout\Plugin;

use Magento\CheckoutAgreements\Model\AgreementsProvider;
use Magento\Store\Model\ScopeInterface;
use Magento\CheckoutAgreements\Model\Api\SearchCriteria\ActiveStoreAgreementsFilter;

/**
 * MB_ThreeStepsCheckout: Original plugins are replaced, because we don't need agreement validation
 * for savePaymentInformation method.
 *
 * Class Validation
 */
class AddAgreementsValidation
{
    /**
     * @var \Magento\Framework\App\Config\ScopeConfigInterface
     */
    protected $scopeConfiguration;

    /**
     * @var \Magento\Checkout\Api\AgreementsValidatorInterface
     */
    protected $agreementsValidator;

    /**
     * @var \Magento\CheckoutAgreements\Api\CheckoutAgreementsListInterface
     */
    private $checkoutAgreementsList;

    /**
     * @var \Magento\CheckoutAgreements\Model\Api\SearchCriteria\ActiveStoreAgreementsFilter
     */
    private $activeStoreAgreementsFilter;

    /**
     * @param \Magento\Checkout\Api\AgreementsValidatorInterface $agreementsValidator
     * @param \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfiguration
     * @param \Magento\CheckoutAgreements\Api\CheckoutAgreementsListInterface $checkoutAgreementsList
     * @param ActiveStoreAgreementsFilter $activeStoreAgreementsFilter
     */
    public function __construct(
        \Magento\Checkout\Api\AgreementsValidatorInterface $agreementsValidator,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfiguration,
        \Magento\CheckoutAgreements\Api\CheckoutAgreementsListInterface $checkoutAgreementsList,
        \Magento\CheckoutAgreements\Model\Api\SearchCriteria\ActiveStoreAgreementsFilter $activeStoreAgreementsFilter
    ) {
        $this->agreementsValidator = $agreementsValidator;
        $this->scopeConfiguration = $scopeConfiguration;
        $this->checkoutAgreementsList = $checkoutAgreementsList;
        $this->activeStoreAgreementsFilter = $activeStoreAgreementsFilter;
    }

    /**
     * @param \Magento\Checkout\Api\PaymentInformationManagementInterface $subject
     * @param int $cartId
     * @param \Magento\Quote\Api\Data\PaymentInterface $paymentMethod
     * @param \Magento\Quote\Api\Data\AddressInterface|null $billingAddress
     * @throws \Magento\Framework\Exception\CouldNotSaveException
     * @return void
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function beforeSavePaymentInformationAndPlaceOrder(
        \Magento\Checkout\Api\PaymentInformationManagementInterface $subject,
        $cartId,
        \Magento\Quote\Api\Data\PaymentInterface $paymentMethod,
        \Magento\Quote\Api\Data\AddressInterface $billingAddress = null
    ) {
        if ($this->isAgreementEnabled()) {
            $this->validateAgreements($paymentMethod);
        }
    }

    /**
     * @param \Magento\Quote\Api\Data\PaymentInterface $paymentMethod
     * @throws \Magento\Framework\Exception\CouldNotSaveException
     * @return void
     */
    protected function validateAgreements(\Magento\Quote\Api\Data\PaymentInterface $paymentMethod)
    {
        $agreements = $paymentMethod->getExtensionAttributes() === null
            ? []
            : $paymentMethod->getExtensionAttributes()->getAgreementIds();

        if (!$this->agreementsValidator->isValid($agreements)) {
            throw new \Magento\Framework\Exception\CouldNotSaveException(
                __(
                    "The order wasn't placed. "
                    . "First, agree to the terms and conditions, then try placing your order again."
                )
            );
        }
    }

    /**
     * Verify if agreement validation needed
     * @return bool
     */
    protected function isAgreementEnabled()
    {
        $isAgreementsEnabled = $this->scopeConfiguration->isSetFlag(
            AgreementsProvider::PATH_ENABLED,
            ScopeInterface::SCOPE_STORE
        );
        $agreementsList = $isAgreementsEnabled
            ? $this->checkoutAgreementsList->getList($this->activeStoreAgreementsFilter->buildSearchCriteria())
            : [];
        return (bool)($isAgreementsEnabled && count($agreementsList) > 0);
    }
}