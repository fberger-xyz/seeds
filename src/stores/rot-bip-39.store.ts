import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useRotBip39Store = create<{
    shiftToRotWordInList: number
    shiftToRotWordLetters: number
    onlyShowFirst4Letters: 'Yes' | 'No'
    actions: {
        setShiftToRotWordInList: (n: number) => void
        setShiftToRotWordLetters: (n: number) => void
        setOnlyShowFirst4Letters: (option: 'Yes' | 'No') => void
    }
}>()(
    devtools(
        // persist(
        (set) => ({
            shiftToRotWordInList: 1,
            shiftToRotWordLetters: 1,
            onlyShowFirst4Letters: 'Yes',
            actions: {
                setShiftToRotWordInList: (shiftToRotWordInList) => set(() => ({ shiftToRotWordInList })),
                setShiftToRotWordLetters: (shiftToRotWordLetters) => set(() => ({ shiftToRotWordLetters })),
                setOnlyShowFirst4Letters: (onlyShowFirst4Letters) => set(() => ({ onlyShowFirst4Letters })),
            },
        }),
        { name: 'rot-bip-0039-store' },
        // ),
    ),
)
