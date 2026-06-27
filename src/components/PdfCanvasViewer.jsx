import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

function PdfCanvasViewer({ title, url }) {
  const viewerRef = useRef(null)
  const renderTaskRef = useRef(null)
  const [status, setStatus] = useState('Duke ngarkuar PDF-në...')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const abortController = new AbortController()

    async function renderPdf() {
      setStatus('Duke ngarkuar PDF-në...')
      setError('')

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel()
        renderTaskRef.current = null
      }

      const viewer = viewerRef.current
      if (!viewer) return

      viewer.replaceChildren()

      try {
        const response = await fetch(url, { signal: abortController.signal })

        if (!response.ok) {
          throw new Error(`Kërkesa për PDF dështoi me ${response.status}`)
        }

        const pdfBytes = await response.arrayBuffer()
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes })
        const pdf = await loadingTask.promise

        if (cancelled) {
          await loadingTask.destroy()
          return
        }

        setStatus(`${pdf.numPages} faqe`)

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (cancelled) break

          const page = await pdf.getPage(pageNumber)
          const baseViewport = page.getViewport({ scale: 1 })
          const availableWidth = Math.min(viewer.clientWidth || 760, 920)
          const scale = Math.max(0.75, availableWidth / baseViewport.width)
          const viewport = page.getViewport({ scale })
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')

          if (!context) {
            throw new Error('Shfaqja në canvas nuk është e disponueshme.')
          }

          canvas.width = Math.floor(viewport.width)
          canvas.height = Math.floor(viewport.height)
          canvas.className = 'pdf-canvas-page'
          canvas.setAttribute('aria-label', `${title} faqja ${pageNumber}`)

          viewer.append(canvas)

          const renderTask = page.render({
            canvasContext: context,
            viewport,
          })

          renderTaskRef.current = renderTask
          await renderTask.promise
        }
      } catch (renderError) {
        if (
          renderError?.name === 'AbortError' ||
          renderError?.name === 'RenderingCancelledException'
        ) {
          return
        }

        if (!cancelled) {
          const detail = import.meta.env.DEV ? ` (${renderError.message})` : ''
          setError(
            `PDF-ja nuk mund të shfaqet brenda faqes. Përdor butonin Hap.${detail}`,
          )
          setStatus('')
        }
      } finally {
        renderTaskRef.current = null
      }
    }

    renderPdf()

    return () => {
      cancelled = true
      abortController.abort()

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel()
        renderTaskRef.current = null
      }
    }
  }, [title, url])

  return (
    <div className="pdf-canvas-viewer">
      <div className="pdf-render-status" aria-live="polite">
        {error || status}
      </div>
      <div className="pdf-canvas-pages" ref={viewerRef} />
    </div>
  )
}

export default PdfCanvasViewer
