import {describe, expect, it} from 'vitest'
import {readFileSync} from 'node:fs'
import {join} from 'node:path'

import {decodeFile} from './decodeFile'

describe('decodeFile', () => {
	it('decodes UTF-8 without BOM', () => {
		const text = 'Hello, World!'
		const encoder = new TextEncoder()
		const arrayBuffer = encoder.encode(text).buffer

		const result = decodeFile(arrayBuffer)

		expect(result).toBe(text)
	})

	it('decodes UTF-8 with BOM', () => {
		const text = 'Hello, World!'
		const encoder = new TextEncoder()
		const textBytes = encoder.encode(text)
		const bom = new Uint8Array([0xef, 0xbb, 0xbf])
		const withBom = new Uint8Array(bom.length + textBytes.length)
		withBom.set(bom, 0)
		withBom.set(textBytes, bom.length)

		const result = decodeFile(withBom.buffer)

		expect(result).toBe(text)
	})

	it('decodes UTF-16LE with BOM', () => {
		const text = 'Hello, World!'
		const bom = new Uint8Array([0xff, 0xfe])

		const utf16Bytes = new Uint16Array(text.length)
		for (let i = 0; i < text.length; i++) {
			utf16Bytes[i] = text.charCodeAt(i)
		}

		const utf16Buffer = new Uint8Array(utf16Bytes.buffer)
		const withBom = new Uint8Array(bom.length + utf16Buffer.length)
		withBom.set(bom, 0)
		withBom.set(utf16Buffer, bom.length)

		const result = decodeFile(withBom.buffer)

		expect(result).toBe(text)
	})

	it('decodes UTF-16BE with BOM', () => {
		const text = 'Hello!'
		const bom = new Uint8Array([0xfe, 0xff])

		const utf16Bytes = new Uint16Array(text.length)
		for (let i = 0; i < text.length; i++) {
			utf16Bytes[i] = text.charCodeAt(i)
		}

		const utf16Buffer = new Uint8Array(utf16Bytes.buffer)
		const swapped = new Uint8Array(utf16Buffer.length)
		for (let i = 0; i < utf16Buffer.length; i += 2) {
			swapped[i] = utf16Buffer[i + 1]!
			swapped[i + 1] = utf16Buffer[i]!
		}

		const withBom = new Uint8Array(bom.length + swapped.length)
		withBom.set(bom, 0)
		withBom.set(swapped, bom.length)

		const result = decodeFile(withBom.buffer)

		expect(result).toBe(text)
	})

	it('handles empty buffer', () => {
		const arrayBuffer = new ArrayBuffer(0)

		const result = decodeFile(arrayBuffer)

		expect(result).toBe('')
	})

	it('handles small buffer without BOM', () => {
		const bytes = new Uint8Array([0x41])

		const result = decodeFile(bytes.buffer)

		expect(result).toBe('A')
	})

	it('decodes CSV-like content with UTF-16LE BOM', () => {
		const csvContent = 'Name\tAge\nJohn\t30'
		const bom = new Uint8Array([0xff, 0xfe])

		const utf16Bytes = new Uint16Array(csvContent.length)
		for (let i = 0; i < csvContent.length; i++) {
			utf16Bytes[i] = csvContent.charCodeAt(i)
		}

		const utf16Buffer = new Uint8Array(utf16Bytes.buffer)
		const withBom = new Uint8Array(bom.length + utf16Buffer.length)
		withBom.set(bom, 0)
		withBom.set(utf16Buffer, bom.length)

		const result = decodeFile(withBom.buffer)

		expect(result).toBe(csvContent)
		expect(result).toContain('\t')
		expect(result).toContain('\n')
	})

	it('preserves special characters', () => {
		const text = 'café ñoño 日本語'
		const encoder = new TextEncoder()
		const arrayBuffer = encoder.encode(text).buffer

		const result = decodeFile(arrayBuffer)

		expect(result).toBe(text)
	})

	it('decodes the actual test-segments.csv file', () => {
		const csvPath = join(__dirname, 'test-segments.csv')
		const buffer = readFileSync(csvPath).buffer

		const result = decodeFile(buffer)

		expect(result).toContain('Marker Name')
		expect(result).toContain('Description')
		expect(result).toContain('intro')
		expect(result).toContain('astra award victory lap')
		expect(result).toContain('ad break')
		expect(result).toContain('uncommon goods ad')
		expect(result.split('\n').length).toBeGreaterThan(10)
	})
})
