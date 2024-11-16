'use client'

import Button from '@/components/common/Button'
import IconWrapper from '@/components/common/IconWrapper'
import LinkWithIcon from '@/components/common/LinkWithIcon'
import LinkWrapper from '@/components/common/LinkWrapper'
import PageWrapper from '@/components/common/PageWrapper'
import { bip0039Words } from '@/config/bip-0039-words.config'
import { toastStyle } from '@/config/toasts.config'
import { BIP39DisplayOption, IconIds } from '@/enums'
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
                <p className="text-base font-bold text-secondary">Context</p>
                <div className="flex flex-wrap items-center gap-1">
                    <p>This tools aims to help you encrypt your seed phrase with a basic</p>
                    <LinkWithIcon href="https://en.wikipedia.org/wiki/Substitution_cipher">
                        <p className="text-nowrap">substitution cipher method</p>
                    </LinkWithIcon>
                </div>
                <p className="text-base font-bold text-secondary">How to read below output</p>
                <div className="flex flex-col gap-0.5 pl-2">
                    <div className="flex flex-wrap items-center gap-1">
                        <p className="text-inactive">a. Position of the word</p>
                    </div>
                    <p className="text-default">b. Word</p>
                    <div className="flex flex-wrap items-center gap-x-2">
                        <p className="text-primary">c. Shift on word position =</p>
                        <input
                            type="number"
                            pattern="[0-9]*"
                            onChange={(e) => {
                                const n = parseFloat(e.target.value)
                                if (isNaN(n)) return
                                if (n < -2048 || n > 2048) return
                                actions.setShiftToNWordsInList(Math.floor(n))
                                toast.success(`Shift ${n} word${Math.abs(n) > 1 ? 's' : ''}`, { style: toastStyle })
                            }}
                            value={shiftToNWordsInList}
                            min={-2048}
                            max={2048}
                            className="h-5 w-12 rounded-sm bg-very-light-hover text-center hover:bg-light-hover focus:text-primary"
                        />
                        <p className="text-inactive">[ min -2048 ; default 0 ; max 2048 ]</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2">
                        <p className="text-secondary">d. Shift on letters of the word =</p>
                        <input
                            type="number"
                            pattern="[0-9]*"
                            onChange={(e) => {
                                const n = parseFloat(e.target.value)
                                if (isNaN(n)) return
                                if (n < -26 && n > 26) return
                                actions.setShiftToNLetters(Math.floor(n))
                                toast.success(`Shift ${n} letter${Math.abs(n) > 1 ? 's' : ''}`, { style: toastStyle })
                            }}
                            value={shiftToNLetters}
                            min={-26}
                            max={26}
                            className="h-5 w-12 rounded-sm bg-very-light-hover text-center hover:bg-light-hover focus:text-primary"
                        />
                        <p className="text-inactive">[ min -26 ; default 0 ; max 26 ]</p>
                    </div>
                </div>
                <p className="text-base font-bold text-secondary">Display options</p>
                <div className="flex flex-col gap-0.5 pl-2">
                    <div className="flex flex-wrap items-center gap-x-1.5">
                        <p>For words</p>
                        {[BIP39DisplayOption.FULL, BIP39DisplayOption.ONLY_FIRST_4_LETTERS].map((option) => (
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
                        <LinkWrapper href="https://cryptotag.io/blog/why-do-i-only-need-the-first-4-letters-of-a-bip39-seed/" target="_blank">
                            <IconWrapper icon={IconIds.CARBON_HELP} className="h-3.5 w-3.5 cursor-alias text-inactive hover:text-primary" />
                        </LinkWrapper>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <p className="text-base font-bold text-secondary">Output to save ⬇️</p>
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
                        BIP39 words with shift={shiftToNWordsInList} on word position in list coupled with shift={shiftToNLetters} on letters of
                        alphabet
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
                                    <p className="text-secondary">
                                        {displayWord(
                                            rotN(rotBip0039WordIndex(1024 * (currentPage - 1) + wordIndex, shiftToNWordsInList), shiftToNLetters),
                                        )}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </PageWrapper>
    )
}
