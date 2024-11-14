import { SupportedChains } from '@/enums'
import { ParsedParam } from '@/interfaces'
import { create } from 'zustand'

export const useParamsStore = create<{
    rawSafes: string
    parsedSafes: { value: string; isAddress: boolean }[]
    selectedSafe: string
    rawChain: string
    selectedChain: SupportedChains
    actions: {
        setParams: (rawSafes: string, parsedSafes: ParsedParam[], selectedSafe: string, rawChain: string, selectedChain: SupportedChains) => void
        setSelectedAddress: (selectedSafe: string) => void
        setSelectedChain: (selectedChain: SupportedChains) => void
    }
    computeds: Record<string, () => void>
}>((set) => ({
    rawSafes: '',
    parsedSafes: [],
    selectedSafe: '',
    rawChain: '',
    selectedChain: SupportedChains.ETH,
    actions: {
        setParams: (rawSafes, parsedSafes, selectedSafe, rawChain, selectedChain) =>
            set(() => ({ rawSafes, parsedSafes, selectedSafe, rawChain, selectedChain })),
        setSelectedAddress: (selectedSafe) => set(() => ({ selectedSafe })),
        setSelectedChain: (selectedChain) => set(() => ({ selectedChain })),
    },
    computeds: {},
}))
