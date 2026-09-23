import { permanentRedirect } from 'next/navigation'

/** Studio is part of Hanami Pro: keep the old entry point on the same journey. */
export default function StudioRedirect() {
  permanentRedirect('/pro/studio')
}
