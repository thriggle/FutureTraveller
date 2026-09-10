"""
Seeded Pseudo-Random Number Generator implementing xmur3 hasher and xoshiro128ss generator.
Matches Traveller/js/rnd.js implementation with exact bit-for-bit parity.
"""
import ctypes

def _imul(a: int, b: int) -> int:
    """Emulate Math.imul 32-bit integer multiplication."""
    return ctypes.c_int32(ctypes.c_int32(a).value * ctypes.c_int32(b).value).value

def _u32(val: int) -> int:
    """Mask to 32-bit unsigned integer (>>> 0)."""
    return val & 0xFFFFFFFF

def _i32(val: int) -> int:
    """Cast to signed 32-bit integer."""
    return ctypes.c_int32(val).value

def xmur3(seed_str: str):
    """32-bit string hash state generator matching JS xmur3."""
    h = 1779033703 ^ len(seed_str)
    for char in seed_str:
        h = _imul(h ^ ord(char), 3432918353)
        h = _i32(((h << 13) & 0xFFFFFFFF) | (_u32(h) >> 19))
    
    def generator() -> int:
        nonlocal h
        h = _imul(h ^ (_u32(h) >> 16), 2246822507)
        h = _imul(h ^ (_u32(h) >> 13), 3266489909)
        h = _u32(h ^ (_u32(h) >> 16))
        return h
    
    return generator

class Xoshiro128SS:
    """xoshiro128** 32-bit state generator returning floating point [0.0, 1.0)."""
    def __init__(self, a: int, b: int, c: int, d: int):
        self.a = _u32(a)
        self.b = _u32(b)
        self.c = _u32(c)
        self.d = _u32(d)

    def random(self) -> float:
        t = _u32((self.b << 9) & 0xFFFFFFFF)
        r = _u32((self.a * 5) & 0xFFFFFFFF)
        r = _u32((((r << 7) & 0xFFFFFFFF) | (r >> 25)) * 9)
        
        self.c = _u32(self.c ^ self.a)
        self.d = _u32(self.d ^ self.b)
        self.b = _u32(self.b ^ self.c)
        self.a = _u32(self.a ^ self.d)
        self.c = _u32(self.c ^ t)
        self.d = _u32(((self.d << 11) & 0xFFFFFFFF) | (self.d >> 21))
        
        return r / 4294967296.0

def create_prng(seed: str) -> Xoshiro128SS:
    """Create a seeded xoshiro128ss generator from a string seed."""
    hasher = xmur3(seed)
    return Xoshiro128SS(hasher(), hasher(), hasher(), hasher())
