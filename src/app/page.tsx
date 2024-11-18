'use client'

import Button from '@/components/common/Button'
import IconWrapper from '@/components/common/IconWrapper'
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
    const { currentPage, shiftToNWordsInList, shiftToNLetters, onlyShowFirst4Letters, reverseWord, actions } = useRotBip39Store()
    const displayWord = (word: string) => {
        return word.slice(0, onlyShowFirst4Letters === BIP39DisplayOption.ONLY_FIRST_4_LETTERS ? 4 : word.length)
    }
    return (
        <PageWrapper className="gap-3">
            <div className="flex flex-col gap-5 text-sm">
                {/*  */}
                <div className="flex flex-col text-sm">
                    <p className="text-base font-bold text-secondary">Context</p>
                    <div className="flex flex-wrap items-center gap-1">
                        <p className="text-xs md:text-sm">
                            This page aims to help you encrypt your seed phrase with a simple substitution cipher method
                        </p>
                        <LinkWrapper href="https://en.wikipedia.org/wiki/Substitution_cipher" target="_blank">
                            <IconWrapper icon={IconIds.CARBON_HELP} className="mb-1 size-4 cursor-alias text-secondary hover:text-primary" />
                        </LinkWrapper>
                    </div>
                </div>

                {/* 2 */}
                <div className="flex flex-col gap-1 text-sm">
                    <p className="text-base font-bold text-secondary">Inputs</p>

                    {/* option */}
                    <div className="flex flex-wrap items-center gap-x-2 pl-2 text-xs md:text-sm">
                        <p>&#x2022; Number of shift to apply on word position in list {'=>'}</p>
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
                            className="h-5 w-12 rounded-md bg-very-light-hover text-center text-primary hover:bg-light-hover"
                        />
                        <p className="text-xs text-inactive">[ min -2048 ; default 0 ; max 2048 ]</p>
                    </div>

                    {/* option */}
                    <div className="flex flex-wrap items-center gap-x-2 pl-2 text-xs md:text-sm">
                        <p>&#x2022; Number of shift to apply on letters of the word {'=>'}</p>
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
                            className="h-5 w-12 rounded-md bg-very-light-hover text-center text-primary hover:bg-light-hover"
                        />
                        <p className="text-xs text-inactive">[ min -26 ; default 0 ; max 26 ]</p>
                    </div>

                    {/* option */}
                    <div className="flex flex-col gap-0.5 pl-2">
                        <div className="flex flex-wrap items-center gap-x-1.5 text-xs md:text-sm">
                            <p>&#x2022; Reverse words</p>
                            {['Yes', 'No'].map((option) => (
                                <button
                                    key={option}
                                    className={cn('px-2 bg-very-light-hover rounded-md hover:bg-light-hover', {
                                        'font-bold text-primary': reverseWord === option,
                                        'opacity-80': reverseWord !== option,
                                    })}
                                    onClick={() => actions.setReverseWord(option as 'Yes' | 'No')}
                                >
                                    {option}
                                </button>
                            ))}
                            <LinkWrapper href="https://cryptotag.io/blog/why-do-i-only-need-the-first-4-letters-of-a-bip39-seed/" target="_blank">
                                <IconWrapper icon={IconIds.CARBON_HELP} className="size-4 cursor-alias text-secondary hover:text-primary" />
                            </LinkWrapper>
                        </div>
                    </div>

                    {/* option */}
                    <div className="flex flex-col gap-0.5 pl-2">
                        <div className="flex flex-wrap items-center gap-x-1.5 text-xs md:text-sm">
                            <p>&#x2022; Display words</p>
                            {[BIP39DisplayOption.FULL, BIP39DisplayOption.ONLY_FIRST_4_LETTERS].map((option) => (
                                <button
                                    key={option}
                                    className={cn('px-2 bg-very-light-hover rounded-md hover:bg-light-hover', {
                                        'font-bold text-primary': onlyShowFirst4Letters === option,
                                        'opacity-80': onlyShowFirst4Letters !== option,
                                    })}
                                    onClick={() => actions.setOnlyShowFirst4Letters(option)}
                                >
                                    {option}
                                </button>
                            ))}
                            <LinkWrapper href="https://cryptotag.io/blog/why-do-i-only-need-the-first-4-letters-of-a-bip39-seed/" target="_blank">
                                <IconWrapper icon={IconIds.CARBON_HELP} className="size-4 cursor-alias text-secondary hover:text-primary" />
                            </LinkWrapper>
                        </div>
                    </div>
                </div>

                {/* 3 */}
                <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-secondary">
                        Output <span className="text-xs">⬇️</span>
                    </p>
                    <p className="text-inactive">
                        <span className="hidden lg:flex">in A4 format</span>
                        <span className="lg:hidden">Better on desktop</span>
                    </p>
                </div>
            </div>

            {/* pdf */}
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
                        BIP39 words with {shiftToNWordsInList} shift{Math.abs(shiftToNWordsInList) > 1 ? 's' : ''} on word position in list +
                        {shiftToNLetters} shift{Math.abs(shiftToNLetters) > 1 ? 's' : ''} on letters of alphabet
                    </p>
                    <p className="mb-1 w-fit border border-default p-1 text-2xs">
                        <span className="px-0.5 text-inactive">index</span>
                        <span className="px-0.5 text-default">BIP39 word</span>
                        <span className="px-0.5">+</span>
                        <span className="px-0.5 text-primary">{shiftToNWordsInList} shift in list</span>
                        <span className="px-0.5">+</span>
                        <span className="px-0.5 text-secondary">{shiftToNLetters} on letters</span>
                        {reverseWord === 'Yes' && (
                            <>
                                <span className="px-0.5">+</span>
                                <span className="px-0.5 text-orange-400">reversed word</span>
                            </>
                        )}
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
                            {reverseWord === 'Yes' && (
                                <>
                                    <p className="text-inactive">-</p>
                                    <p className="text-orange-400">
                                        {displayWord(
                                            rotN(rotBip0039WordIndex(1024 * (currentPage - 1) + wordIndex, shiftToNWordsInList), shiftToNLetters),
                                        )
                                            .split('')
                                            .reverse()
                                            .join('')}
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
