<?php
\Magento\Framework\Component\ComponentRegistrar::register(
    \Magento\Framework\Component\ComponentRegistrar::MODULE,
    'MB_ThreeStepsCheckout',
    isset($file) ? dirname($file) : __DIR__
);