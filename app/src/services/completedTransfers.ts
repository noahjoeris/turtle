import { StoredTransfer } from '@/models/transfer'

/**
 * Fetches the finished transfers for a given address. Or for all addresses if no address is provided.
 *
 * @param address - The address to fetch the transfer history for.
 * @returns A promise that resolves to completed transfers for the given address.
 * @throws An error if the fetch request fails.
 */
export const getCompletedTransfers = async (address?: string): Promise<StoredTransfer[]> => {
  // TODO: adjust function parameters as needed once api works
  // add query params
  const searchParams = new URLSearchParams()
  if (address) searchParams.append('address', address)

  const response = await fetch('/api/completed-transfers?' + searchParams.toString()) // TODO: Update the endpoint once it is defined

  if (!response.ok)
    throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`)

  const transfers: StoredTransfer[] = await response.json()

  return transfers
}
