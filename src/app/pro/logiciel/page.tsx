import { permanentRedirect } from 'next/navigation'

/** Preserve links to the former software page after separating Pro and Studio. */
export default function LegacySoftwarePage() {
  permanentRedirect('/pro')
}
