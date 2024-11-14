import { AppPagePaths, IconIds, SupportedApps, SupportedChains, SupportedSocials } from '../enums'

export interface InterfaceAppLink {
    name: string
    path: AppPagePaths
    icon?: IconIds
    enabled: boolean
    description?: string
    sublinks: InterfaceAppLink[]
}

export interface APIResponse<Data> {
    data?: Data
    error: string
}

/**
 * specific
 */

export type ParsedParam = { value: string; isAddress: boolean }

export interface SupportedChainConfig {
    id: SupportedChains
    index: number
    gnosisPrefix: string
}

export interface SupportedAppConfig {
    id: SupportedApps
    networks: SupportedChains[]
    name: string
    svg?: IconIds
    iconUrl: string
    socialProfiles: {
        platform: SupportedSocials
        url: string
    }[]
}
