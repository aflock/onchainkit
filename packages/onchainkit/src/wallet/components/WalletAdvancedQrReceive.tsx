'use client';

import { CopyButton } from '@/internal/components/CopyButton';
import { PressableIcon } from '@/internal/components/PressableIcon';
import { QrCodeSvg } from '@/internal/components/QrCode/QrCodeSvg';
import { backArrowSvg } from '@/internal/svg/backArrowSvg';
import { copySvg } from '@/internal/svg/copySvg';
import { zIndex } from '@/styles/constants';
import { border, cn, color, pressable, text } from '@/styles/theme';
import { useCallback, useState } from 'react';
import type { WalletAdvancedQrReceiveProps } from '../types';
import { useWalletContext } from './WalletProvider';

export function WalletAdvancedQrReceive({
  classNames,
}: WalletAdvancedQrReceiveProps) {
  const {
    address,
    setActiveFeature,
    isActiveFeatureClosing,
    setIsActiveFeatureClosing,
  } = useWalletContext();

  const [copyText, setCopyText] = useState('Copy');
  const [copyButtonText, setCopyButtonText] = useState('Copy address');

  const handleCloseQr = useCallback(() => {
    setIsActiveFeatureClosing(true);
  }, [setIsActiveFeatureClosing]);

  const handleAnimationEnd = useCallback(() => {
    if (isActiveFeatureClosing) {
      setActiveFeature(null);
      setIsActiveFeatureClosing(false);
    }
  }, [isActiveFeatureClosing, setActiveFeature, setIsActiveFeatureClosing]);

  const resetAffordanceText = useCallback(() => {
    setTimeout(() => {
      setCopyText('Copy');
      setCopyButtonText('Copy address');
    }, 2000);
  }, []);

  const handleCopyButtonSuccess = useCallback(() => {
    setCopyButtonText('Address copied');
    resetAffordanceText();
  }, [resetAffordanceText]);

  const handleCopyButtonError = useCallback(() => {
    setCopyButtonText('Failed to copy address');
    resetAffordanceText();
  }, [resetAffordanceText]);

  const handleCopyIconSuccess = useCallback(() => {
    setCopyText('Copied');
    resetAffordanceText();
  }, [resetAffordanceText]);

  const handleCopyIconError = useCallback(() => {
    setCopyText('Failed to copy');
    resetAffordanceText();
  }, [resetAffordanceText]);

  return (
    <div
      data-testid="ockWalletAdvancedQrReceive"
      className={cn(
        border.radius,
        color.foreground,
        text.headline,
        'flex flex-col items-center justify-between',
        'h-120 w-88 px-4 pt-3 pb-4',
        isActiveFeatureClosing
          ? 'fade-out slide-out-to-left-5 animate-out fill-mode-forwards ease-in-out'
          : 'fade-in slide-in-from-left-5 linear animate-in duration-150',
        classNames?.container,
      )}
      onAnimationEnd={handleAnimationEnd}
    >
      <div
        className={cn(
          'flex h-[34px] w-full flex-row items-center justify-between',
          classNames?.header,
        )}
      >
        <PressableIcon ariaLabel="Back button" onClick={handleCloseQr}>
          <div className="p-2">{backArrowSvg}</div>
        </PressableIcon>
        <div className="flex flex-col items-center">
          <span className="font-semibold">Scan to receive</span>
          <span className="text-xs opacity-70 mt-0.5">Share your wallet address</span>
        </div>
        <div className="group relative">
          <CopyButton
            label={copySvg}
            copyValue={address ?? ''}
            onSuccess={handleCopyIconSuccess}
            onError={handleCopyIconError}
            className={cn(
              pressable.default,
              border.radiusInner,
              border.default,
              'flex items-center justify-center p-2',
            )}
            aria-label="Copy your address by clicking the icon"
          />
          <CopyButton
            label={copyText}
            copyValue={address ?? ''}
            onSuccess={handleCopyIconSuccess}
            onError={handleCopyIconError}
            className={cn(
              pressable.alternate,
              text.legal,
              color.foreground,
              border.default,
              border.radius,
              zIndex.dropdown,
              'absolute top-full right-0 mt-0.5 px-1.5 py-0.5 opacity-0 transition-opacity group-hover:opacity-100',
            )}
            aria-label="Copy your address by clicking the tooltip"
          />
        </div>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-white rounded-2xl shadow-lg">
          <QrCodeSvg 
            value={address}
            size={200}
            gradientType="linear"
            quietZoneBorderRadius={16}
          />
        </div>
        <div className="text-center max-w-[280px]">
          <p className="text-sm opacity-80 break-all font-mono px-2 py-1 bg-gray-100 rounded">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
          </p>
        </div>
      </div>
      <CopyButton
        copyValue={address ?? ''}
        label={copyButtonText}
        className={cn(
          border.radius,
          pressable.alternate,
          'w-full p-3 font-medium',
          classNames?.copyButton,
        )}
        onSuccess={handleCopyButtonSuccess}
        onError={handleCopyButtonError}
        aria-label="Copy your address by clicking the button"
      />
    </div>
  );
}
