import { useEffect, useRef, useState } from 'react'
import '../lib/pdfjsCompat.js'
import pdfWorkerUrl from '../lib/pdf.worker.compat.mjs?url'

const maxCanvasPixels = 18000000
const minCanvasPixelRatio = 2
const maxCanvasPixelRatio = 3
const minZoom = 0.8
const maxZoom = 2.4
const zoomStep = 0.2

function PdfCanvasViewer({ title, url }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const loadingTaskRef = useRef(null)
  const panStateRef = useRef(null)
  const pdfjsLibRef = useRef(null)
  const pdfRef = useRef(null)
  const renderTaskRef = useRef(null)
  const [pageCount, setPageCount] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [renderWidth, setRenderWidth] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [status, setStatus] = useState('Duke ngarkuar PDF-në...')
  const [error, setError] = useState('')

  function clearCanvas() {
    const canvas = canvasRef.current
    const context = canvas?.getContext?.('2d')

    if (!canvas || !context) return

    context.clearRect(0, 0, canvas.width, canvas.height)
    canvas.removeAttribute('style')
  }

  function cleanupPdf() {
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel()
      renderTaskRef.current = null
    }

    if (loadingTaskRef.current) {
      loadingTaskRef.current.destroy()
      loadingTaskRef.current = null
    }

    if (pdfRef.current) {
      pdfRef.current.destroy()
      pdfRef.current = null
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    function updateWidth() {
      const nextWidth = Math.floor(container.clientWidth)
      setRenderWidth((currentWidth) =>
        nextWidth > 0 && nextWidth !== currentWidth ? nextWidth : currentWidth,
      )
    }

    updateWidth()

    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    let active = true
    const abortController = new AbortController()

    async function loadPdf() {
      setStatus('Duke ngarkuar PDF-në...')
      setError('')
      setPageCount(0)
      setPageNumber(1)
      setZoom(1)
      clearCanvas()

      cleanupPdf()

      try {
        if (!pdfjsLibRef.current) {
          pdfjsLibRef.current = await import('pdfjs-dist/legacy/build/pdf.mjs')
          pdfjsLibRef.current.GlobalWorkerOptions.workerSrc = pdfWorkerUrl
        }

        const response = await fetch(url, {
          cache: 'force-cache',
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error(`Kërkesa për PDF dështoi me ${response.status}`)
        }

        const pdfBytes = await response.arrayBuffer()
        const loadingTask = pdfjsLibRef.current.getDocument({
          data: new Uint8Array(pdfBytes),
          disableAutoFetch: true,
          disableStream: true,
          isEvalSupported: false,
        })

        loadingTaskRef.current = loadingTask
        const pdf = await loadingTask.promise
        loadingTaskRef.current = null

        if (!active) {
          await pdf.destroy()
          return
        }

        pdfRef.current = pdf
        setPageCount(pdf.numPages)
        setStatus(`${pdf.numPages} faqe`)
      } catch (loadError) {
        if (loadError?.name === 'AbortError' || !active) return

        const detail = import.meta.env.DEV ? ` (${loadError.message})` : ''
        setError(`PDF-ja nuk mund të ngarkohet. Përdor butonin Hap.${detail}`)
        setStatus('')
      }
    }

    loadPdf()

    return () => {
      active = false
      abortController.abort()
      cleanupPdf()
    }
  }, [url])

  useEffect(() => {
    let active = true

    async function renderPage() {
      const pdf = pdfRef.current
      const canvas = canvasRef.current
      const container = containerRef.current

      if (!pdf || !canvas || !container || !renderWidth) return

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel()
        renderTaskRef.current = null
      }

      try {
        setError('')
        setStatus(`Faqja ${pageNumber} nga ${pageCount}`)

        const page = await pdf.getPage(pageNumber)
        if (!active) return

        const baseViewport = page.getViewport({ scale: 1 })
        const cssWidth = Math.max(260, Math.min(renderWidth * zoom, 1400))
        const viewport = page.getViewport({
          scale: cssWidth / baseViewport.width,
        })
        const pixelRatio = getSafePixelRatio(viewport.width, viewport.height)
        const context = canvas.getContext('2d', { alpha: false })

        if (!context) {
          throw new Error('Shfaqja në canvas nuk është e disponueshme.')
        }

        canvas.width = Math.floor(viewport.width * pixelRatio)
        canvas.height = Math.floor(viewport.height * pixelRatio)
        canvas.style.width = `${Math.floor(viewport.width)}px`
        canvas.style.height = `${Math.floor(viewport.height)}px`
        canvas.setAttribute('aria-label', `${title} faqja ${pageNumber}`)

        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, viewport.width, viewport.height)

        const renderTask = page.render({
          canvasContext: context,
          viewport,
        })

        renderTaskRef.current = renderTask
        await renderTask.promise

        if (active) {
          setStatus(`Faqja ${pageNumber} nga ${pageCount}`)
        }

        page.cleanup()
      } catch (renderError) {
        if (
          renderError?.name === 'RenderingCancelledException' ||
          !active
        ) {
          return
        }

        const detail = import.meta.env.DEV ? ` (${renderError.message})` : ''
        setError(`PDF-ja nuk mund të shfaqet. Përdor butonin Hap.${detail}`)
        setStatus('')
      } finally {
        if (active) renderTaskRef.current = null
      }
    }

    renderPage()

    return () => {
      active = false

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel()
        renderTaskRef.current = null
      }
    }
  }, [pageCount, pageNumber, renderWidth, title, zoom])

  function goToPreviousPage() {
    setPageNumber((currentPage) => Math.max(1, currentPage - 1))
    scrollPdfViewportToTop()
  }

  function goToNextPage() {
    setPageNumber((currentPage) => Math.min(pageCount, currentPage + 1))
    scrollPdfViewportToTop()
  }

  function zoomOut() {
    setZoom((currentZoom) =>
      Math.max(minZoom, Number((currentZoom - zoomStep).toFixed(2))),
    )
  }

  function zoomIn() {
    setZoom((currentZoom) =>
      Math.min(maxZoom, Number((currentZoom + zoomStep).toFixed(2))),
    )
  }

  function resetZoom() {
    setZoom(1)
  }

  function getPdfScrollContainer() {
    return containerRef.current?.closest('.pdf-viewer')
  }

  function startPan(event) {
    if (event.button !== undefined && event.button !== 0) return

    const scrollContainer = getPdfScrollContainer()
    if (!scrollContainer) return

    panStateRef.current = {
      pointerId: event.pointerId,
      scrollLeft: scrollContainer.scrollLeft,
      scrollTop: scrollContainer.scrollTop,
      startX: event.clientX,
      startY: event.clientY,
    }

    event.currentTarget.setPointerCapture?.(event.pointerId)
    event.preventDefault()
  }

  function panPdf(event) {
    const panState = panStateRef.current
    const scrollContainer = getPdfScrollContainer()

    if (!panState || !scrollContainer || panState.pointerId !== event.pointerId) {
      return
    }

    scrollContainer.scrollLeft =
      panState.scrollLeft - (event.clientX - panState.startX)
    scrollContainer.scrollTop = panState.scrollTop - (event.clientY - panState.startY)
    event.preventDefault()
  }

  function stopPan(event) {
    if (panStateRef.current?.pointerId !== event.pointerId) return

    event.currentTarget.releasePointerCapture?.(event.pointerId)
    panStateRef.current = null
  }

  function scrollPdfViewportToTop() {
    window.requestAnimationFrame(() => {
      containerRef.current?.closest('.pdf-viewer')?.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    })
  }

  return (
    <div className="pdf-canvas-viewer" ref={containerRef}>
      <div className="pdf-render-status" aria-live="polite">
        {error || status}
      </div>

      {pageCount > 1 && (
        <div className="pdf-page-controls" aria-label="Kontrollat e PDF-së">
          <button
            disabled={pageNumber <= 1}
            onClick={goToPreviousPage}
            type="button"
          >
            Para
          </button>
          <span>
            {pageNumber} / {pageCount}
          </span>
          <button
            disabled={pageNumber >= pageCount}
            onClick={goToNextPage}
            type="button"
          >
            Pas
          </button>
        </div>
      )}

      {pageCount > 0 && (
        <div className="pdf-zoom-controls" aria-label="Zmadhimi i PDF-së">
          <button disabled={zoom <= minZoom} onClick={zoomOut} type="button">
            -
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button disabled={zoom >= maxZoom} onClick={zoomIn} type="button">
            +
          </button>
          <button disabled={zoom === 1} onClick={resetZoom} type="button">
            Fit
          </button>
        </div>
      )}

      <div
        className="pdf-canvas-pages"
        onLostPointerCapture={stopPan}
        onPointerCancel={stopPan}
        onPointerDown={startPan}
        onPointerMove={panPdf}
        onPointerUp={stopPan}
      >
        <canvas className="pdf-canvas-page" ref={canvasRef} />
      </div>
    </div>
  )
}

function getSafePixelRatio(width, height) {
  const deviceRatio = window.devicePixelRatio || 1
  const preferredRatio = Math.min(
    Math.max(deviceRatio, minCanvasPixelRatio),
    maxCanvasPixelRatio,
  )
  const preferredPixels = width * height * preferredRatio * preferredRatio

  if (preferredPixels <= maxCanvasPixels) return preferredRatio

  return Math.max(1, Math.sqrt(maxCanvasPixels / (width * height)))
}

export default PdfCanvasViewer
