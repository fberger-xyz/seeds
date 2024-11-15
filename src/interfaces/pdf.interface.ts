import { IconIds } from '@/enums'
import dayjs from 'dayjs'

export interface PdfStructure {
    sections: PdfSection[]
}

export interface PdfSection {
    id: number
    title: {
        value: null | string
        icon: null | IconIds
    }
    isPartOfSummary: boolean
    pages: PdfPage[]
}

export interface PdfPage {
    id: number
    filteredOut: boolean
    title: {
        show: boolean
        value: null | string
        icon: null | IconIds
    }
}

export interface DateHelper {
    ts: number
    date: Date
    dayjs: dayjs.Dayjs
}
