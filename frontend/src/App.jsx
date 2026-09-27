import { useEffect, useRef, useState } from 'react'
import { FileText, Upload, Sparkles, MessageSquareText, Tags, Trash2, Send, LoaderCircle, BookOpen, Files, BrainCircuit, Plus, CheckCircle2 } from 'lucide-react'
import api from './api'

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function App() {
  const [documents, setDocuments] = useState([])
  const [selected, setSelected] = useState([])
  const [tab, setTab] = useState('chat')
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [summaryLength, setSummaryLength] = useState('medium')
  const [summary, setSummary] = useState('')
  const [extraction, setExtraction] = useState(null)
  const fileRef = useRef(null)
  const chatEnd = useRef(null)

  async function loadDocuments() {
    try {
      const { data } = await api.get('/documents')
      setDocuments(data)
    } catch { setError('Cannot connect to the API. Start the FastAPI backend on port 8000.') }
  }
  useEffect(() => { loadDocuments() }, [])
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, busy])

  async function uploadFiles(files) {
    if (!files?.length) return
    setError(''); setUploading(true)
    try {
      for (const file of files) {
        const form = new FormData()
        form.append('file', file)
        const { data } = await api.post('/documents', form, { headers: { 'Content-Type': 'multipart/form-data' } })
        setSelected(prev => [...prev, data.id])
      }
      await loadDocuments()
    } catch (e) { setError(e.response?.data?.detail || e.message || 'Upload failed') }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = '' }
  }

  function toggleDocument(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function deleteDocument(doc) {
    if (!confirm(`Delete ${doc.filename}?`)) return
    try {
      await api.delete(`/documents/${doc.id}`)
      setSelected(prev => prev.filter(id => id !== doc.id))
      setMessages([]); setSummary(''); setExtraction(null)
      await loadDocuments()
    } catch (e) { setError(e.response?.data?.detail || 'Delete failed') }
  }

  async function sendQuestion(e) {
    e?.preventDefault()
    if (!question.trim() || !selected.length || busy) return
    const q = question.trim()
    setQuestion(''); setError('')
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setBusy(true)
    try {
      const { data } = await api.post('/chat', { document_ids: selected, question: q })
      setMessages(prev => [...prev, { role: 'assistant', text: data.answer, sources: data.sources || [] }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: e.response?.data?.detail || 'Could not get an answer.' }])
    } finally { setBusy(false) }
  }

  async function createSummary() {
    if (selected.length !== 1) { setError('Select exactly one document to summarize.'); return }
    setBusy(true); setError(''); setSummary('')
    try {
      const { data } = await api.post('/summary', { document_id: selected[0], length: summaryLength })
      setSummary(data.summary)
    } catch (e) { setError(e.response?.data?.detail || 'Summary failed') }
    finally { setBusy(false) }
  }

  async function extractTopics() {
    if (selected.length !== 1) { setError('Select exactly one document for keyword and topic extraction.'); return }
    setBusy(true); setError(''); setExtraction(null)
    try {
      const { data } = await api.post('/extract', { document_id: selected[0] })
      setExtraction(data)
    } catch (e) { setError(e.response?.data?.detail || 'Extraction failed') }
    finally { setBusy(false) }
  }

  const selectedDocs = documents.filter(d => selected.includes(d.id))

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><BrainCircuit size={23}/></div><div><strong>DocuMind</strong><span>DOCUMENT INTELLIGENCE</span></div></div>
      <button className="upload-btn" onClick={() => fileRef.current?.click()} disabled={uploading}>
        {uploading ? <LoaderCircle className="spin" size={18}/> : <Plus size={18}/>} {uploading ? 'Processing…' : 'Add documents'}
      </button>
      <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" multiple hidden onChange={e => uploadFiles([...e.target.files])}/>
      <div className="side-label"><span>YOUR LIBRARY</span><span className="count">{documents.length}</span></div>
      <div className="doc-list">
        {documents.map(doc => <div key={doc.id} className={cx('doc-row', selected.includes(doc.id) && 'doc-selected')}>
          <button className="doc-select" onClick={() => toggleDocument(doc.id)}>
            <FileText size={17}/><span className="doc-name">{doc.filename}<small>{doc.pages} page{doc.pages !== 1 ? 's' : ''} · {doc.chunks} chunks</small></span>
            {selected.includes(doc.id) && <CheckCircle2 size={16} className="check"/>}
          </button>
          <button className="icon-btn delete-btn" title="Delete document" onClick={() => deleteDocument(doc)}><Trash2 size={14}/></button>
        </div>)}
        {!documents.length && <div className="empty-library"><Files size={25}/><p>Your library is empty.</p><small>Upload a PDF, DOCX, or TXT file to get started.</small></div>}
      </div>
      <div className="sidebar-bottom"><div className="status-dot"/> Local workspace <span>·</span> Gemini AI</div>
    </aside>

    <main className="main">
      <header className="topbar"><div><div className="eyebrow">YOUR AI DOCUMENT WORKSPACE</div><h1>Understand your documents.</h1><p>Ask questions, uncover insights, and summarize in seconds.</p></div><div className='header-badges'><div className="top-badge"><Sparkles size={15}/> Powered by Gemini</div><div className='made-by'>Made with ♥ by <span>Vaibhav</span></div></div></header>
      {error && <div className="error-banner" role="alert">{error}<button onClick={() => setError('')}>×</button></div>}
      <section className="workspace">
        <div className="workspace-head">
          <div><h2>Workspace</h2><p>{selected.length ? `${selected.length} document${selected.length !== 1 ? 's' : ''} selected` : 'Select documents from your library to begin'}</p></div>
          <div className="selected-chips">{selectedDocs.map(d => <span key={d.id} className="chip">{d.filename}</span>)}</div>
        </div>
        <nav className="tabs">
          <button className={cx(tab === 'chat' && 'active')} onClick={() => setTab('chat')}><MessageSquareText size={16}/> Ask documents</button>
          <button className={cx(tab === 'summary' && 'active')} onClick={() => setTab('summary')}><BookOpen size={16}/> Summarize</button>
          <button className={cx(tab === 'topics' && 'active')} onClick={() => setTab('topics')}><Tags size={16}/> Keywords & topics</button>
        </nav>

        {tab === 'chat' && <div className="chat-panel">
          {!messages.length ? <div className="welcome">
            <div className="welcome-icon"><Sparkles size={25}/></div><h3>What would you like to know?</h3><p>Ask a question across your selected documents. DocuMind retrieves relevant passages and cites the source pages.</p>
            <div className="suggestions">{['Summarize the main ideas','What are the key findings?','Explain the methodology used'].map(q => <button key={q} onClick={() => setQuestion(q)}>{q}<span>↗</span></button>)}</div>
          </div> : <div className="messages">{messages.map((m,i) => <div key={i} className={cx('message',m.role)}><div className="avatar">{m.role === 'assistant' ? <BrainCircuit size={17}/> : 'You'}</div><div className="message-body"><div className="message-label">{m.role === 'assistant' ? 'DOCUMIND' : 'YOU'}</div><div className="message-text">{m.text}</div>{m.sources?.length > 0 && <div className="sources"><strong>Sources</strong>{m.sources.map((s,j) => <span key={j}><FileText size={13}/>{s.filename} · p. {s.page}</span>)}</div>}</div></div>)}{busy && <div className="message assistant"><div className="avatar"><BrainCircuit size={17}/></div><div className="message-body"><div className="message-label">DOCUMIND</div><div className="typing"><i/><i/><i/> Finding an answer…</div></div></div>}<div ref={chatEnd}/></div>}
          <form className="composer" onSubmit={sendQuestion}><textarea value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendQuestion()} }} placeholder={selected.length ? 'Ask anything about your selected documents…' : 'Select at least one document first…'} disabled={!selected.length || busy} rows={2}/><button className="send-btn" disabled={!question.trim() || !selected.length || busy} aria-label="Send question">{busy ? <LoaderCircle className="spin" size={18}/> : <Send size={18}/>}</button></form>
          <div className="disclaimer">AI-generated answers can be incorrect. Verify important details against the cited source pages.</div>
        </div>}

        {tab === 'summary' && <div className="tool-panel">
          <div className="tool-intro"><div className="tool-icon purple"><BookOpen size={21}/></div><h3>Document summary</h3><p>Get the key information at the level of detail you need.</p></div>
          <div className="length-options">{[['short','Short','Quick overview'],['medium','Medium','Key details'],['detailed','Detailed','In-depth breakdown']].map(([v,title,desc]) => <button key={v} className={cx('length-card',summaryLength===v&&'chosen')} onClick={() => setSummaryLength(v)}><span className="radio">{summaryLength===v&&<i/>}</span><strong>{title}</strong><small>{desc}</small></button>)}</div>
          <button className="primary-action" onClick={createSummary} disabled={busy || selected.length !== 1}>{busy ? <LoaderCircle className="spin" size={17}/> : <Sparkles size={17}/>} Generate {summaryLength} summary</button>
          {summary && <div className="result-card"><div className="result-heading"><h3><Sparkles size={17}/> Generated summary</h3><button className="subtle-btn" onClick={() => navigator.clipboard.writeText(summary)}>Copy</button></div><div className="result-text">{summary}</div></div>}
          {selected.length !== 1 && <p className="hint">Select exactly one document in the library to generate a summary.</p>}
        </div>}

        {tab === 'topics' && <div className="tool-panel">
          <div className="tool-intro"><div className="tool-icon orange"><Tags size={21}/></div><h3>Keywords & topics</h3><p>Identify the concepts and themes that matter most in your document.</p></div>
          <button className="primary-action" onClick={extractTopics} disabled={busy || selected.length !== 1}>{busy ? <LoaderCircle className="spin" size={17}/> : <Sparkles size={17}/>} Analyze document</button>
          {extraction && <div className="result-card"><h3 className="section-title">Key keywords</h3><div className="keyword-list">{(extraction.keywords||[]).map((k,i)=><span key={i} className="keyword">{k}</span>)}</div><h3 className="section-title topics-title">Main topics</h3><div className="topic-list">{(extraction.topics||[]).map((t,i)=><div className="topic-item" key={i}><span className="topic-number">{String(i+1).padStart(2,'0')}</span><div><strong>{typeof t==='string'?t:t.name}</strong>{t.description&&<p>{t.description}</p>}</div></div>)}</div></div>}
          {selected.length !== 1 && <p className="hint">Select exactly one document to extract keywords and topics.</p>}
        </div>}
      </section>
      <footer className="footer">DOCUMIND <span>·</span> GENERATIVE AI DOCUMENT INTELLIGENCE <span>·</span> VAIBHAV PANDEY</footer>
    </main>
  </div>
}
