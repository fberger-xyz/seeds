'use client'

import PageWrapper from '@/components/common/PageWrapper'
import { useSearchParams } from 'next/navigation'
import { useParamsStore } from '@/stores/params.store'
import { useEffect } from 'react'
import { cn, shortenAddress } from '@/utils'
import IconWrapper from '@/components/common/IconWrapper'
import { IconIds, SupportedChains } from '@/enums'
import { chainsConfig, supportedCategoriesConfig } from '@/config/app.config'
import Image from 'next/image'
import LinkWrapper from '@/components/common/LinkWrapper'
import SvgMapper from '@/components/common/SvgMapper'
import { copyToClipboard, getSafesFromParams, linkForChainAppAndAddress } from '@/utils/apps.util'
import { useRouter } from 'next/navigation'
import { toastStyle } from '@/config/toasts.config'
import toast from 'react-hot-toast'

// server side only
// export async function generateMetadata({
//     searchParams,
// }: {
//     searchParams: Promise<{ [key: string]: string | string[] | undefined }>
// }): Promise<Metadata> {
//     // read searchParams
//     const queryString = await searchParams
//     const { _selected } = getSafes(String(queryString))

//     return {
//         title: `safes | ${_selected}`,
//     }
// }

export default function Page() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { selectedSafe, selectedChain, parsedSafes, actions } = useParamsStore()

    useEffect(() => {
        // parse safes
        const _rawSafes = searchParams.get('safes') ?? ''
        const { _parsedSafes, _selected } = getSafesFromParams(_rawSafes)

        // parse chain
        const _rawChain = searchParams.get('chain') ?? ''
        const _parsedChain = Number(_rawChain) in SupportedChains ? (Number(_rawChain) as SupportedChains) : SupportedChains.ETH

        // set page title
        if (document) document.title = `safes | ${chainsConfig[_parsedChain].gnosisPrefix}:${shortenAddress(_selected)}`

        // set parameters in store
        actions.setParams(_rawSafes, _parsedSafes, _selected, _rawChain, _parsedChain)
    }, [searchParams])

    useEffect(() => {
        // update router only if needed
        const currentURLParams = `?chain=${selectedChain}&safes=${parsedSafes
            .filter((param) => param.isAddress)
            .map((address) => address.value)
            .join(',')}`

        const queryString = searchParams.toString()

        if (queryString !== currentURLParams) {
            router.replace(currentURLParams)
        }
    }, [parsedSafes, selectedChain])

    useEffect(() => {
        // update router only if needed
        const othersSafes = parsedSafes
            .filter((param) => param.isAddress)
            .filter((param) => param.value !== selectedSafe)
            .map((address) => address.value)
            .join(',')
        const safes = `${selectedSafe},${othersSafes}`
        const currentURLParams = `?chain=${selectedChain}&safes=${safes}`

        const queryString = searchParams.toString()

        if (queryString !== currentURLParams) {
            router.replace(currentURLParams)
        }
    }, [selectedChain, searchParams])

    return (
        <PageWrapper className="mb-10 gap-5">
            <div className="flex w-full flex-col gap-2.5 border-l border-light-hover">
                {/* addresses */}
                <p className="pl-5 text-light-hover">safes</p>
                <div className="flex items-start gap-5 border-b border-light-hover pb-5 pl-5">
                    {parsedSafes
                        .filter((param) => param.isAddress)
                        .sort((curr, next) => curr.value.localeCompare(next.value))
                        .map((address, index) => (
                            <div key={address.value} className="flex w-fit items-center gap-2">
                                <p className="text-inactive">{index + 1}</p>
                                <button
                                    className={cn('flex gap-3 rounded-md border px-2.5 py-1.5 transition-all duration-100', {
                                        'bg-light-hover border-primary text-primary': selectedSafe === address.value,
                                        'text-inactive hover:text-primary border-light-hover': selectedSafe !== address.value,
                                    })}
                                    onClick={() => actions.setSelectedAddress(address.value)}
                                >
                                    <p>{shortenAddress(address.value)}</p>
                                </button>
                                <button className="flex items-center text-inactive hover:text-primary">
                                    <IconWrapper icon={IconIds.CARBON_COPY} className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                </div>

                {/* chains */}
                <p className="pl-5 text-light-hover">chains</p>
                <div className="flex items-start gap-2.5 border-b border-light-hover pb-5 pl-5">
                    {Object.values(chainsConfig)
                        .sort((a, b) => a.index - b.index)
                        .map((chain) => (
                            <div key={chain.id} className="flex items-center gap-1.5 transition-all duration-100">
                                <button
                                    className={cn('flex gap-3 rounded-md border px-2.5 py-1.5', {
                                        'text-primary bg-light-hover border-primary': selectedChain === chain.id,
                                        'text-inactive hover:text-primary border-light-hover': selectedChain !== chain.id,
                                    })}
                                    onClick={() => actions.setSelectedChain(chain.id)}
                                >
                                    <Image
                                        src={`https://safe-transaction-assets.safe.global/chains/${chain.id}/chain_logo.png`}
                                        width={24}
                                        height={24}
                                        alt={chain.gnosisPrefix}
                                    />
                                </button>
                            </div>
                        ))}
                </div>

                {/* apps */}
                <div className="flex flex-wrap gap-x-6 gap-y-4 border-b border-light-hover pb-5 pl-5">
                    {supportedCategoriesConfig.map((category) => (
                        <div key={category.name} className="flex flex-col gap-2.5">
                            <p className="w-12 text-light-hover">{category.name}</p>
                            <div className="flex gap-1.5">
                                {category.apps.map((app) => (
                                    <div
                                        key={app.id}
                                        className={cn('flex items-center gap-3 rounded-md border border-light-hover px-2.5 py-1.5', {
                                            'opacity-20 border-dashed': !app.networks.includes(selectedChain),
                                        })}
                                    >
                                        <LinkWrapper
                                            target="_blank"
                                            className={cn('flex items-center gap-3 w-fit', {
                                                group: app.networks.includes(selectedChain),
                                                'cursor-not-allowed': !app.networks.includes(selectedChain),
                                            })}
                                            disabled={!app.networks.includes(selectedChain)}
                                            href={linkForChainAppAndAddress(chainsConfig[selectedChain], app, selectedSafe)}
                                        >
                                            {app.svg ? (
                                                <SvgMapper icon={app.svg} className="size-6 text-inactive" />
                                            ) : (
                                                <Image
                                                    loading="lazy"
                                                    src={app.iconUrl}
                                                    width={24}
                                                    height={24}
                                                    alt={app.id}
                                                    className="min-w-6 rounded-full"
                                                />
                                            )}
                                            <IconWrapper
                                                icon={IconIds.IC_BASELINE_OPEN_IN_NEW}
                                                className="size-4 text-inactive group-hover:text-primary"
                                            />
                                        </LinkWrapper>
                                        <button
                                            disabled={!app.networks.includes(selectedChain)}
                                            onClick={() => {
                                                copyToClipboard(linkForChainAppAndAddress(chainsConfig[selectedChain], app, selectedSafe))
                                                toast.success(`Copied link to ${app.name}`, { style: toastStyle })
                                            }}
                                            className={cn('text-inactive size-5', {
                                                'hover:text-primary': app.networks.includes(selectedChain),
                                                'cursor-not-allowed': !app.networks.includes(selectedChain),
                                            })}
                                        >
                                            <IconWrapper icon={IconIds.CARBON_COPY} className="size-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* pending orders */}
                <p className="pl-5 text-light-hover">url to save in your favorite password manager</p>
                <div className="flex items-start gap-2.5 border-b border-light-hover pb-5 pl-5">
                    <button
                        onClick={() => {
                            copyToClipboard(String(window.location))
                            toast.success(`Copied current URL`, { style: toastStyle })
                        }}
                        className="flex gap-2 text-sm text-inactive hover:text-primary"
                    >
                        <p>URL</p>
                        <IconWrapper icon={IconIds.CARBON_COPY} className="size-4" />
                    </button>
                </div>

                {/* pending orders */}
                <p className="pl-5 text-light-hover">reach out on telegram to suggest another section</p>
            </div>
        </PageWrapper>
    )
}
