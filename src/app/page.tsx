'use client'

import LinkWithIcon from '@/components/common/LinkWithIcon'
import PageWrapper from '@/components/common/PageWrapper'
import { bip0039Words } from '@/config/bip-0039-words.config'
import { useRotBip39Store } from '@/stores/rot-bip-39.store'
import { cn } from '@/utils'
import { rotBip0039WordIndex, rotN } from '@/utils/rot.util'
import { useRef } from 'react'

export default function Page() {
    const A4Ref = useRef<HTMLDivElement>(null)
    const { shiftToRotWordInList, shiftToRotWordLetters, onlyShowFirst4Letters, actions } = useRotBip39Store()
    const displayWord = (word: string) => word.slice(0, onlyShowFirst4Letters === 'Yes' ? 4 : word.length)
    return (
        <PageWrapper className="gap-3">
            <div className="flex flex-col gap-3 text-sm">
                <p className="text-base font-bold underline decoration-inactive underline-offset-2">1. Color code</p>
                <div className="flex flex-col gap-0.5 pl-2">
                    <div className="flex flex-wrap items-center gap-1">
                        <p className="text-inactive">a. Index of word in</p>
                        <LinkWithIcon href="https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt">
                            <p className="text-nowrap">BIP 39 list</p>
                        </LinkWithIcon>
                    </div>
                    <p className="text-default">b. Word</p>
                    <div className="flex flex-wrap items-center gap-x-2">
                        <p className="text-primary">c. Rot on word index in BIP 39 list</p>
                        <input
                            type="number"
                            onChange={(e) => actions.setShiftToRotWordInList(parseFloat(e.target.value))}
                            defaultValue={shiftToRotWordInList}
                            min={-2048}
                            max={2048}
                            className="w-12 rounded-sm bg-very-light-hover text-center hover:bg-light-hover focus:text-primary"
                        />
                        <p className="text-inactive">[ min -2048 ; default 0 ; max 2048 ]</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2">
                        <p className="text-secondary">d. Rot on letters in alphabet</p>
                        <input
                            type="number"
                            onChange={(e) => actions.setShiftToRotWordLetters(parseFloat(e.target.value))}
                            defaultValue={shiftToRotWordLetters}
                            min={-26}
                            max={26}
                            className="w-12 rounded-sm bg-very-light-hover text-center hover:bg-light-hover focus:text-primary"
                        />
                        <p className="text-inactive">[ min -26 ; default 0 ; max 26 ]</p>
                    </div>
                </div>
                <p className="text-base font-bold underline decoration-inactive underline-offset-2">2. Options</p>
                <div className="flex flex-col gap-0.5 pl-2">
                    <div className="flex flex-wrap items-center gap-x-2">
                        <p>Only display first 4 letters</p>
                        {['Yes', 'No'].map((option) => (
                            <button
                                className={cn('py-0.5 px-2 bg-very-light-hover rounded-md hover:bg-light-hover', {
                                    'font-bold': onlyShowFirst4Letters === option,
                                    'opacity-40': onlyShowFirst4Letters !== option,
                                })}
                                onClick={() => actions.setOnlyShowFirst4Letters(option as 'Yes' | 'No')}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <p className="text-base font-bold underline decoration-inactive underline-offset-2">3. Output</p>
                ⬇️
                <p className="text-inactive">in A4 format</p>
            </div>
            <div
                ref={A4Ref}
                className="flex h-full max-h-a4 w-full max-w-a4 flex-wrap gap-x-0.5 overflow-scroll border border-light-hover p-2 text-2xs leading-2"
            >
                {bip0039Words.map((word, wordIndex) => (
                    <div key={word} className="flex flex-wrap items-center gap-0.5 hover:bg-light-hover">
                        <p className="opacity-50">{wordIndex + 1}</p>
                        <p>{displayWord(word)}</p>
                        {shiftToRotWordInList !== 0 && (
                            <p className="text-primary">{displayWord(rotBip0039WordIndex(wordIndex, shiftToRotWordInList))}</p>
                        )}
                        {shiftToRotWordLetters !== 0 && <p className="text-secondary">{displayWord(rotN(word, shiftToRotWordLetters))}</p>}
                    </div>
                ))}
            </div>
        </PageWrapper>
    )
}
