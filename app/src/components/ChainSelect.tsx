'use client'
import { forwardRef, useRef, useState } from 'react'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import { Chain } from '@/models/chain'
import { ManualRecipient, SelectProps } from '@/models/select'
import useLookupName from '@/hooks/useLookupName'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { truncateAddress } from '@/utils/address'

import Dropdown from './Dropdown'
import ChainIcon from './svg/ChainIcon'
import ChevronDown from './svg/ChevronDown'
import { Tooltip } from './Tooltip'
import VerticalDivider from './VerticalDivider'

interface ChainSelectProps extends SelectProps<Chain> {
  walletAddress?: string
  manualRecipient?: ManualRecipient
  onChangeManualRecipient?: (newVal: ManualRecipient) => void
}

const ChainSelect = forwardRef<HTMLDivElement, ChainSelectProps>(
  (
    {
      value,
      onChange,
      options,
      floatingLabel,
      placeholder,
      placeholderIcon = <ChainIcon />,
      walletAddress,
      manualRecipient,
      onChangeManualRecipient,
      trailing,
      error,
      disabled,
      className,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const triggerRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    useOutsideClick(triggerRef, dropdownRef, () => setIsOpen(false))
    const addressLookup = useLookupName(value?.network, walletAddress?.toLowerCase())

    const addressPlaceholder = walletAddress ? truncateAddress(walletAddress, 4, 4) : ''
    const accountName = addressLookup ? addressLookup : addressPlaceholder

    const handleSelectionChange = (selectedChain: Chain) => {
      onChange(selectedChain)
      setIsOpen(false)
    }

    const handleTriggerClick = () => {
      if (!disabled) setIsOpen(!isOpen)
    }

    const handleManualRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChangeManualRecipient && manualRecipient)
        onChangeManualRecipient({ ...manualRecipient, address: e.target.value })
    }

    const shouldShowChainName =
      (!walletAddress && (!manualRecipient?.enabled || !manualRecipient?.address)) ||
      (manualRecipient?.enabled && !manualRecipient.address)

    return (
      <div ref={ref} className={twMerge('relative w-full', className)}>
        {floatingLabel && (
          <label className="absolute -top-2 left-3 z-30 origin-top-left bg-background px-1 text-xs text-turtle-level5">
            {floatingLabel}
          </label>
        )}
        <Tooltip content={error}>
          <div
            ref={triggerRef}
            className={twMerge(
              'flex items-center justify-between rounded-md border-1 border-turtle-level3 bg-background px-3 text-sm',
              disabled && 'opacity-30',
              error && 'border-turtle-error',
            )}
            onClick={handleTriggerClick}
          >
            <div className="flex h-[3.5rem] flex-grow items-center gap-1">
              {value ? (
                <>
                  <Image
                    src={value.logoURI}
                    alt={value.name}
                    width={24}
                    height={24}
                    className="h-[1.5rem] w-[1.5rem] rounded-full border-1 border-turtle-foreground"
                  />
                  {shouldShowChainName && <span className="text-nowrap">{value.name}</span>}
                </>
              ) : (
                <>
                  {placeholderIcon}
                  {placeholder}
                </>
              )}

              <ChevronDown strokeWidth={0.2} className="ml-1" />
              {!manualRecipient?.enabled && !!value && accountName}
              {manualRecipient && manualRecipient.enabled && (
                <>
                  <VerticalDivider className={!manualRecipient.address ? 'visible' : 'invisible'} />
                  <input
                    type="text"
                    className="h-[70%] w-full bg-transparent focus:border-0 focus:outline-none"
                    placeholder="Address"
                    autoFocus
                    value={manualRecipient.address}
                    onChange={handleManualRecipientChange}
                    onClick={e => e.stopPropagation()}
                  />
                </>
              )}
            </div>
            {trailing && <div className="ml-2">{trailing}</div>}
          </div>
        </Tooltip>

        <Dropdown isOpen={isOpen} dropdownRef={dropdownRef}>
          {options.map(option => (
            <li
              key={option.uid}
              className="flex cursor-pointer items-center gap-1 p-2"
              onClick={() => handleSelectionChange(option)}
            >
              <Image
                src={option.logoURI}
                alt={option.name}
                width={24}
                height={24}
                className="h-[1.5rem] w-[1.5rem] rounded-full border-1 border-turtle-foreground"
              />
              <span className="text-sm">{option.name}</span>
            </li>
          ))}
        </Dropdown>
      </div>
    )
  },
)

ChainSelect.displayName = 'ChainSelect'

export default ChainSelect
