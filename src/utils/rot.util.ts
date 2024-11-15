import { bip0039Words } from '@/config/bip-0039-words.config'

export const rotBip0039WordIndex = (srcWordIndex: number, shift: number): string => {
    const destWordIndex = (srcWordIndex + shift) % bip0039Words.length
    if (destWordIndex < 0) return bip0039Words[bip0039Words.length + destWordIndex]
    return bip0039Words[destWordIndex]
}

// nb lowercase only
export const rotN = (srcWord: string, rotation: number) => {
    // always fall between 0 and 25
    const normalizedRotation = ((rotation % 26) + 26) % 26

    return srcWord
        .split('')
        .map((char) => {
            // rotate lowercase letters
            if (char >= 'a' && char <= 'z') return String.fromCharCode(97 + ((char.charCodeAt(0) - 97 + normalizedRotation) % 26))
            return char // else just return the char
        })
        .join('')
}
