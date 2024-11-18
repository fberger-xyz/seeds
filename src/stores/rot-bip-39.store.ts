import { BIP39DisplayOption } from '@/enums'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useRotBip39Store = create<{
    currentPage: number
    shiftToNWordsInList: number
    shiftToNLetters: number
    onlyShowFirst4Letters: BIP39DisplayOption
    reverseWord: 'Yes' | 'No'
    actions: {
        setShiftToNWordsInList: (n: number) => void
        setShiftToNLetters: (n: number) => void
        setOnlyShowFirst4Letters: (option: BIP39DisplayOption) => void
        setCurrentPage: (currentPage: number) => void
        setReverseWord: (reverseWord: 'Yes' | 'No') => void
    }
}>()(
    devtools(
        // persist(
        (set) => ({
            currentPage: 1,
            shiftToNWordsInList: 0,
            shiftToNLetters: 0,
            onlyShowFirst4Letters: BIP39DisplayOption.ONLY_FIRST_4_LETTERS,
            reverseWord: 'No',
            actions: {
                setShiftToNWordsInList: (shiftToNWordsInList) => set(() => ({ shiftToNWordsInList })),
                setShiftToNLetters: (shiftToNLetters) => set(() => ({ shiftToNLetters })),
                setOnlyShowFirst4Letters: (onlyShowFirst4Letters) => set(() => ({ onlyShowFirst4Letters })),
                setCurrentPage: (currentPage) => set(() => ({ currentPage })),
                setReverseWord: (reverseWord) => set(() => ({ reverseWord })),
            },
        }),
        { name: 'rot-bip-0039-store' },
        // ),
    ),
)
