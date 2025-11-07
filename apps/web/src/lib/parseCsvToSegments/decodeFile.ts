type Encoding = 'utf-8' | 'utf-16le' | 'utf-16be'

type DetectedEncoding = {
	encoding: Encoding
	bomLength: number
}

const detectEncoding = (bytes: Uint8Array): DetectedEncoding => {
	if (bytes.length >= 2) {
		if (bytes[0] === 0xff && bytes[1] === 0xfe) {
			return {encoding: 'utf-16le', bomLength: 2}
		}

		if (bytes[0] === 0xfe && bytes[1] === 0xff) {
			return {encoding: 'utf-16be', bomLength: 2}
		}

		if (
			bytes.length >= 3 &&
			bytes[0] === 0xef &&
			bytes[1] === 0xbb &&
			bytes[2] === 0xbf
		) {
			return {encoding: 'utf-8', bomLength: 3}
		}
	}

	return {encoding: 'utf-8', bomLength: 0}
}

export const decodeFile = (arrayBuffer: ArrayBuffer): string => {
	const bytes = new Uint8Array(arrayBuffer)
	const {encoding, bomLength} = detectEncoding(bytes)
	const decoder = new TextDecoder(encoding)
	return decoder.decode(arrayBuffer.slice(bomLength))
}
