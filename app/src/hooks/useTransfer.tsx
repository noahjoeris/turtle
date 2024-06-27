import { Chain } from '@/models/chain'
import { Token } from '@/models/token'
import { Direction, getErc20TokenContract, resolveDirection } from '@/services/transfer'
import { Environment } from '@/store/environmentStore'
import { Account as SubstrateAccount } from '@/store/substrateWalletStore'
import { WalletOrKeypair, WalletSigner } from '@snowbridge/api/dist/toEthereum'
import { JsonRpcSigner, Signer } from 'ethers'
import useOngoingTransfers from './useOngoingTransfers'
import useNotification from './useNotification'
import { NotificationSeverity } from '@/models/notification'
import * as Snowbridge from '@snowbridge/api'
import { getContext, getEnvironment } from '@/context/snowbridge'
import { useState } from 'react'

export type Sender = JsonRpcSigner | SubstrateAccount

interface TransferParams {
  environment: Environment
  sender: Sender
  sourceChain: Chain
  token: Token
  destinationChain: Chain
  recipient: string
  amount: bigint
}

interface TransferValidationParams {
  sender?: Sender | null
  sourceChain: Chain | null
  token: Token | null
  destinationChain: Chain | null
  recipient?: string | null
  amount: bigint | null
}

export type Status = 'Idle' | 'Loading' | 'Validating' | 'Sending'

/**
 * Used to initiate a transfer from source chain to destination chain.
 * It figures out which api to use based on token, source and destination chain.
 */
const useTransfer = () => {
  const [status, setStatus] = useState<Status>('Idle')
  const { addTransfer } = useOngoingTransfers()
  const { addNotification } = useNotification()

  const transfer = async ({
    environment,
    sender,
    sourceChain,
    token,
    destinationChain,
    recipient,
    amount,
  }: TransferParams) => {
    setStatus('Loading')

    let direction = resolveDirection(sourceChain, destinationChain)
    const snowbridgeEnv = getEnvironment(environment)
    const context = await getContext(snowbridgeEnv)
    const tokenContract = getErc20TokenContract(token, snowbridgeEnv)

    switch (direction) {
      case Direction.ToPolkadot: {
        setStatus('Validating')
        let plan = await Snowbridge.toPolkadot.validateSend(
          context,
          sender as Signer,
          recipient,
          tokenContract,
          destinationChain.chainId,
          amount,
          BigInt(0),
        )

        if (plan.failure) {
          console.log('Validation failed: ' + plan.failure)

          addNotification({
            header: 'Transfer validation failed!',
            message: plan.failure.errors[0].message,
            severity: NotificationSeverity.Error,
          })
          if (plan.failure.errors[0].code === 9) {
            await Snowbridge.toPolkadot.approveTokenSpend(
              context,
              sender as Signer,
              tokenContract,
              amount,
            )
          }
          setStatus('Idle')
          return
        }

        try {
          setStatus('Sending')
          let sendResult = await Snowbridge.toPolkadot.send(context, sender as Signer, plan)
          setStatus('Idle')

          if (sendResult.failure) {
            addNotification({
              header: 'This transfer failed!',
              message: '',
              severity: NotificationSeverity.Error,
            })
            return
          }

          console.log('Sent success, will add to ongoing transfers. Amount: ', amount)
          addTransfer({
            id: sendResult.success!.messageId,
            sourceChain,
            token,
            sender: await (sender as Signer).getAddress(),
            destChain: destinationChain,
            amount: amount,
            recipient: recipient,
            date: new Date(),
            context,
            sendResult,
            feeAmount: await Snowbridge.toPolkadot.getSendFee(
              context,
              tokenContract,
              destinationChain.chainId,
              BigInt(0),
            ),
            feeToken: {
              id: 'eth',
              symbol: 'ETH',
              name: 'ETHER',
              logoURI: '',
              decimals: 18,
            },
          })
        } catch (e) {
          addNotification({
            header: 'Transfer validation failed!',
            message: '',
            severity: NotificationSeverity.Error,
          })
          setStatus('Idle')
        }

        break
      }
      case Direction.ToEthereum:
        setStatus('Validating')
        let plan = await Snowbridge.toEthereum.validateSend(
          context,
          sender as WalletOrKeypair,
          sourceChain.chainId,
          recipient,
          tokenContract,
          amount,
        )

        if (plan.failure) {
          console.log('Validation failed: ' + plan.failure)
          addNotification({
            header: 'Transfer validation failed',
            message: plan.failure.errors[0].message,
            severity: NotificationSeverity.Error,
          })
          setStatus('Idle')
          return
        }

        setStatus('Sending')
        try {
          let sendResult = await Snowbridge.toEthereum.send(
            context,
            sender as WalletOrKeypair,
            plan,
          )
          setStatus('Idle')
          if (sendResult.failure) {
            addNotification({
              header: 'This transfer failed!',
              message: '',
              severity: NotificationSeverity.Error,
            })
            return
          }

          console.log('Sent success, will add to ongoing transfers. Amount:', amount)
          addTransfer({
            id: sendResult.success!.messageId ?? 'todo(nuno)',
            sourceChain,
            token,
            sender: sender.address,
            destChain: destinationChain,
            amount: amount,
            recipient: recipient,
            date: new Date(),
            context,
            sendResult,
            // todo(nuno): discussing with Snowfork a better way to fetch the fee token without harcoding it in the logic
            feeAmount: await Snowbridge.toEthereum.getSendFee(context),
            feeToken: {
              id: 'dot',
              symbol: 'DOT',
              name: 'Polkadot',
              logoURI: '',
              decimals: environment == Environment.Mainnet ? 10 : 12,
            },
          })
        } catch (e) {
          addNotification({
            header: 'This transfer failed!',
            message: '',
            severity: NotificationSeverity.Error,
          })
          setStatus('Idle')
        }

        break
      default:
        throw Error('Unsupported flow')
    }
  }

  return { transfer, transferStatus: status }
}

export default useTransfer
