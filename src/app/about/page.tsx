import PageWrapper from '@/components/common/PageWrapper'
import { APP_METADATA } from '@/config/app.config'

export default function Page() {
    return (
        <PageWrapper>
            <div className="mt-10 flex w-full flex-col items-center justify-center gap-8">
                <p className="text-sm">{APP_METADATA.SITE_DESCRIPTION}</p>
            </div>
        </PageWrapper>
    )
}
