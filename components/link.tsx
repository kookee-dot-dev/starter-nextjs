import Link from 'next/link';
import type { RenderLink } from '@kookee/react/entry';

/** Gives the server-rendered Kookee components client-side navigation. */
export const renderLink: RenderLink = ({ href, ...props }) => <Link href={href} {...props} />;
