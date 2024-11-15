import jsPDF, { jsPDFOptions } from 'jspdf'
import { RefObject, SetStateAction } from 'react'
import html2canvas from 'html2canvas'
import { PdfStructure } from '@/interfaces/pdf.interface'
import { extractErrorMessage } from './error.util'

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// export as pdf
export const LOAD_REPORT_MESSAGE = "Click on 'Load report data' button."
export const EXPORT_REPORT_MESSAGE = 'Exporting below page as a PDF. Do not hover with your mouse.'
export const HTML2CANVAS_SCALE = 4
export const JSPDF_CANVAS_PAGE_QUALITY = 4

export const jsPdfOptions = ({
    pdfOrientation = 'portrait',
    pdfUnit = 'mm',
    pdfFormat = 'a4',
}: {
    pdfOrientation?: 'portrait' | 'p' | 'l' | 'landscape' | undefined
    pdfUnit?: 'mm'
    pdfFormat?: 'a4'
}) => {
    return {
        unit: pdfUnit,
        format: pdfFormat,
        orientation: pdfOrientation,
        compressPdf: true, // very important as it reduces the size A LOT
    }
}

export const downloadAsPDF = async ({
    pdfName,
    reportConfig,
    currPageIdSetter,
    pageRef,
    onlyPageIds = [],
    sleepTimeInMsToLoadPage = 0.5 * 1000,
    pdfOptions = jsPdfOptions({}),
}: {
    pdfName: string
    reportConfig: PdfStructure
    currPageIdSetter: (value: SetStateAction<number>) => void
    pageRef: RefObject<HTMLDivElement>
    onlyPageIds?: number[]
    sleepTimeInMsToLoadPage?: number
    pdfOptions?: jsPDFOptions
}) => {
    const fnName = 'downloadAsPDF'

    // debug

    try {
        const pdf = new jsPDF(pdfOptions)

        let pageIndexCounter = 0
        // for each section
        for (let sectionIndex = 0; sectionIndex < reportConfig.sections.length; sectionIndex++) {
            // for each page
            for (let pageIndex = 0; pageIndex < reportConfig.sections[sectionIndex].pages.length; pageIndex++) {
                try {
                    // load page
                    currPageIdSetter(() => reportConfig.sections[sectionIndex].pages[pageIndex].id)

                    // filter out pages if need be
                    if (onlyPageIds.length && !onlyPageIds.includes(reportConfig.sections[sectionIndex].pages[pageIndex].id)) {
                        console.warn(fnName, `page ${reportConfig.sections[sectionIndex].pages[pageIndex].id} not included`)
                        continue
                    } else console.warn(fnName, 'processing page...', reportConfig.sections[sectionIndex].pages[pageIndex].id)

                    // wait for ref to mount
                    await sleep(sleepTimeInMsToLoadPage)

                    // ensure presence of the DOM element to be converted to PDF
                    if (!pageRef?.current) {
                        alert(`reference not found for page: ${reportConfig.sections[sectionIndex].pages[pageIndex].title}`)
                        return
                    }

                    // use html2canvas to capture the content as an image
                    const canvas = await html2canvas(pageRef?.current, { scale: HTML2CANVAS_SCALE })

                    // skipp adding first page since the first page is already created by default
                    if (pageIndexCounter > 0) await pdf.addPage(pdfOptions.unit, pdfOptions.orientation)

                    // increment page counter
                    pageIndexCounter += 1
                    pdf.setPage(pageIndexCounter)

                    // add the captured image to the pdf
                    await pdf.addImage(
                        // https://artskydj.github.io/jsPDF/docs/module-addImage.html
                        canvas.toDataURL(`image-${pageIndexCounter}/png`, JSPDF_CANVAS_PAGE_QUALITY),
                        'PNG',
                        // margins
                        0,
                        0,
                        // dimensions
                        pdf.internal.pageSize.getWidth(),
                        pdf.internal.pageSize.getHeight(),
                    )
                } catch (error) {
                    alert(extractErrorMessage(error) ?? JSON.stringify(error) ?? error)
                    console.log(fnName, 'downloadAsPDF', { error })
                }
            }
        }

        // download the PDF
        await pdf.save(pdfName)
    } catch (error) {
        alert(extractErrorMessage(error) ?? JSON.stringify(error) ?? error)
        console.log('save', { error })
    }
}
