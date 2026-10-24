import { LandingTemplate, type LandingAction } from 'weimo-ui-template/components/landing-template'

import { exampleHref } from '../routes'
import './landing-template-demo.css'

const asset = (name: string) => `${import.meta.env.BASE_URL}landing/${name}`

const actions: LandingAction[] = [
  {
    href: 'https://github.com/robbietilton/Compositor/releases/latest/download/Compositor.dmg',
    iconSrc: asset('apple-logo.svg'),
    label: 'Download for Mac',
    variant: 'primary',
  },
  {
    href: 'https://github.com/robbietilton/Compositor',
    iconSrc: asset('github-logo.svg'),
    label: 'View on GitHub',
    target: '_blank',
    variant: 'ghost',
  },
]

/** Full-page demo of LandingTemplate, reproducing the Compositor product page. */
export function LandingTemplateDemo() {
  return (
    <LandingTemplate
      actions={actions}
      backHref={exampleHref()}
      backIconSrc={asset('ic-back-arrow.png')}
      backLabel="返回文档"
      flashImages={[asset('example1.png'), asset('example2.png'), asset('example3.png'), asset('example4.png')]}
      hero={{
        title: 'The Photoshop\nalternative for Mac',
        subtitle: 'Free, open source, and always yours',
        imageSrc: asset('hero.png'),
        imageAlt: 'Compositor running on a Mac',
      }}
      legal="Photoshop and Adobe are trademarks of Adobe Inc. Compositor is not affiliated with or endorsed by Adobe."
      productName="Compositor"
      productIconSrc={asset('app-icon.png')}
      purpose={{
        label: 'Purpose',
        heading: 'All the tools you need for\nprofessional compositing',
        paragraphs: [
          'Adobe Photoshop costs too much, and free editors like GIMP never felt familiar enough to keep me in flow. So I built Compositor.',
          'The goal: a full-featured image editor that is free and open source, full stop. Photoshop used to be my tool for compositing and post-processing, so Compositor follows that same workflow, with everything needed to finish a pixel-perfect image.',
          'Because the whole Xcode project is open source, you can download it and add, remove, or modify any feature to fit the way you work.',
        ],
        features: [
          { iconSrc: asset('ic-layer.png'), label: 'Layers' },
          { iconSrc: asset('ic-folderspng.png'), label: 'Folders' },
          { iconSrc: asset('ic-layer-maks.png'), label: 'Layer Masks' },
          { iconSrc: asset('ic-clipping-masks.png'), label: 'Clipping Masks' },
          { iconSrc: asset('ic-blend-modes.png'), label: 'Blend Modes' },
          { iconSrc: asset('ic-selection-tools.png'), label: 'Selection Tools' },
          { iconSrc: asset('ic-adjustment-layers.png'), label: 'Adjustment Layers' },
          { iconSrc: asset('ic-filters.png'), label: 'Filters' },
          { iconSrc: asset('ic-background-removal.png'), label: 'Background Removal' },
          { iconSrc: asset('ic-gaussian-blur.png'), label: 'Gaussian Blur' },
          { iconSrc: asset('ic-motion-blur.png'), label: 'Motion Blur' },
          { iconSrc: asset('ic-lens-correction.png'), label: 'Lens Correction' },
          { iconSrc: asset('ic-grain-noise.png'), label: 'Grain & Noise' },
          { iconSrc: asset('ic-liquify.png'), label: 'Liquify & Smear' },
          { iconSrc: asset('ic-spot-healing.png'), label: 'Spot Healing' },
          { iconSrc: asset('ic-clone-stamp.png'), label: 'Clone Stamp' },
          { iconSrc: asset('ic-brush.png'), label: 'Brush' },
        ],
        gallery: [
          asset('example1.png'),
          asset('example2.png'),
          asset('example3.png'),
          asset('example4.png'),
        ],
      }}
      releaseApiUrl="https://api.github.com/repos/robbietilton/Compositor/releases/latest"
      statusText="Last update: 9/24/26"
    />
  )
}
