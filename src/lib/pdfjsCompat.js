if (typeof Map.prototype.getOrInsertComputed !== 'function') {
  Object.defineProperty(Map.prototype, 'getOrInsertComputed', {
    configurable: true,
    value(key, callback) {
      if (this.has(key)) return this.get(key)

      const value = callback(key)
      this.set(key, value)
      return value
    },
    writable: true,
  })
}

if (typeof Map.prototype.getOrInsert !== 'function') {
  Object.defineProperty(Map.prototype, 'getOrInsert', {
    configurable: true,
    value(key, value) {
      if (this.has(key)) return this.get(key)

      this.set(key, value)
      return value
    },
    writable: true,
  })
}
