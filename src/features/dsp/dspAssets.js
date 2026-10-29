const files = import.meta.glob('../../assets/figma/dsp/*', { eager: true, query: '?url', import: 'default' })
export function dspAsset(name) { return files[`../../assets/figma/dsp/${name}`] }
