'use client'

import Button from '@/components/common/Button'
import LinkWithIcon from '@/components/common/LinkWithIcon'
import PageWrapper from '@/components/common/PageWrapper'
import { bip0039Words } from '@/config/bip-0039-words.config'
import { toastStyle } from '@/config/toasts.config'
import { BIP39DisplayOption } from '@/enums'
import { useRotBip39Store } from '@/stores/rot-bip-39.store'
import { cn } from '@/utils'
import { rotBip0039WordIndex, rotN } from '@/utils/rot.util'
import { useRef } from 'react'
import toast from 'react-hot-toast'

export default function Page() {
    const A4Ref = useRef<HTMLDivElement>(null)
    const { currentPage, shiftToNWordsInList, shiftToNLetters, onlyShowFirst4Letters, actions } = useRotBip39Store()
    const displayWord = (word: string) => word.slice(0, onlyShowFirst4Letters === BIP39DisplayOption.ONLY_FIRST_4_LETTERS ? 4 : word.length)
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
                            onChange={(e) => {
                                const n = parseFloat(e.target.value)
                                if (n < -2048 || n > 2048) return
                                actions.setShiftToNWordsInList(Math.floor(n))
                                toast.success(`Shift ${n} word${Math.abs(n) > 1 ? 's' : ''}`, { style: toastStyle })
                            }}
                            value={shiftToNWordsInList}
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
                            onChange={(e) => {
                                const n = parseFloat(e.target.value)
                                if (n < -26 && n > 26) return
                                actions.setShiftToNLetters(Math.floor(n))
                                toast.success(`Shift ${n} letter${Math.abs(n) > 1 ? 's' : ''}`, { style: toastStyle })
                            }}
                            value={shiftToNLetters}
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
                        <p>Display words</p>
                        {[BIP39DisplayOption.ONLY_FIRST_4_LETTERS, BIP39DisplayOption.FULL].map((option) => (
                            <button
                                key={option}
                                className={cn('py-0.5 px-2 bg-very-light-hover rounded-md hover:bg-light-hover', {
                                    'font-bold': onlyShowFirst4Letters === option,
                                    'opacity-40': onlyShowFirst4Letters !== option,
                                })}
                                onClick={() => actions.setOnlyShowFirst4Letters(option)}
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
                <p className="text-inactive">
                    <span className="hidden lg:flex">in A4 format</span>
                    <span className="lg:hidden">See on desktop</span>
                </p>
            </div>
            <div
                ref={A4Ref}
                className="group relative flex h-a4 w-full max-w-a4 flex-wrap gap-x-0.5 overflow-scroll border border-light-hover p-1 text-2xs leading-2"
            >
                <div className="absolute right-2 top-2 hidden w-fit items-center justify-end gap-2 rounded-md p-2 text-base backdrop-blur-md group-hover:flex">
                    <Button onClickFn={() => actions.setCurrentPage(1)} disabled={currentPage === 1} text="Prev" />
                    <p>
                        <span className="text-primary">{currentPage}</span> / 2
                    </p>
                    <Button onClickFn={() => actions.setCurrentPage(2)} disabled={currentPage === 2} text="Next" />
                </div>
                <div className="w-full">
                    <p className="mb-1 text-xs">
                        BIP39 words with rot on word position in list (shift={shiftToNWordsInList}) coupled with rot on letter index in alphabet
                        (shift={shiftToNLetters})
                    </p>
                </div>
                {bip0039Words.slice((currentPage - 1) * 1024, currentPage * 1024).map((word, wordIndex) => (
                    <div key={`${word}-${wordIndex}`} className="flex items-center gap-x-0.5 hover:bg-light-hover">
                        <p className="text-inactive">{1024 * (currentPage - 1) + wordIndex + 1}</p>
                        <div className="flex flex-wrap items-center">
                            <p>{displayWord(word)}</p>
                            {shiftToNWordsInList !== 0 && (
                                <>
                                    <p className="text-inactive">-</p>
                                    <p className="text-primary">
                                        {displayWord(rotBip0039WordIndex(1024 * (currentPage - 1) + wordIndex, shiftToNWordsInList))}
                                    </p>
                                </>
                            )}
                            {shiftToNLetters !== 0 && (
                                <>
                                    <p className="text-inactive">-</p>
                                    <p className="text-secondary">{displayWord(rotN(word, shiftToNLetters))}</p>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </PageWrapper>
    )
}
