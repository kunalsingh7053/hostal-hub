import { useCallback, useEffect, useState } from 'react'
import api from '../api/axios'

export const useApi = (endpoint, { method = 'get', body, params, immediate = true, transform } = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)

  const execute = useCallback(async (override = {}) => {
    setLoading(true)
    try {
      const response = await api.request({
        url: override.endpoint || endpoint,
        method: override.method || method,
        params: override.params ?? params,
        data: override.body ?? body,
      })
      const payload = transform ? transform(response.data) : response.data
      setData(payload)
      setError(null)
      return payload
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [endpoint, method, params, body, transform])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { data, loading, error, refetch: execute }
}
