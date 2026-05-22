import { describe, it, expect, vi } from 'vitest'
import { getAllPrompts } from '@/lib/mdx'
import fs from 'fs'

vi.mock('fs')

describe('getAllPrompts', () => {
  it('should return an empty array if the directory does not exist', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false)
    const prompts = getAllPrompts()
    expect(prompts).toEqual([])
  })

  it('should filter out non-mdx files', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true)
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['test.txt', 'prompt.mdx'] as any)
    vi.spyOn(fs, 'readFileSync').mockReturnValue('---\ntitle: Test\ndate: 2026-01-01\ndescription: test desc\ncategory: test cat\n---\nContent')

    const prompts = getAllPrompts()
    expect(prompts).toHaveLength(1)
    expect(prompts[0].title).toBe('Test')
  })
})
