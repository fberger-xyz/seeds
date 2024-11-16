import IconWrapper from '@/components/common/IconWrapper'
import { IconIds } from '@/enums'
import LinkWrapper from './LinkWrapper'

export default function LinkWithIcon({ children, href }: { href: string; children?: React.ReactNode }) {
    return (
        <LinkWrapper
            href={href}
            className="group flex w-fit items-center gap-1 rounded-md underline decoration-inactive underline-offset-4 hover:decoration-primary"
            target="_blank"
        >
            {children}
            <IconWrapper icon={IconIds.IC_BASELINE_OPEN_IN_NEW} className="h-3.5 w-3.5 text-inactive group-hover:text-primary" />
        </LinkWrapper>
    )
}
