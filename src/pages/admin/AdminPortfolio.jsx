/**
 * AdminPortfolio.jsx - minimal functional version
 *
 * @format
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Star, Loader2, X, Plus, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { portfolioAPI } from '../../utils/api';
const CATS = ['weddings', 'portraits', 'events', 'commercial', 'family'];
export default function AdminPortfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [form, setForm] = useState({
    title: '',
    category: 'weddings',
    description: '',
    tags: '',
    is_featured: false,
  });
  useEffect(() => {
    portfolioAPI
      .getAll()
      .then((r) => setItems(r.data.items || []))
      .finally(() => setLoading(false));
  }, []);
  const doUpload = async () => {
    const files = selectedFiles;
    if (!files?.length || !form.title.trim()) {
      toast.error('Select images and add a title');
      return;
    }

    const fd = new FormData();
    // Ensure files are appended as individual parts, not a nested array
    for (let i = 0; i < files.length; i++) {
      fd.append('files', files[i]);
    }
    Object.entries(form).forEach(([k, v]) => fd.append(k, v.toString()));

    setUploading(true);
    try {
      const r = await portfolioAPI.upload(fd);
      setItems((p) => [r.data, ...p]);
      setShowModal(false);
      setForm({
        title: '',
        category: 'weddings',
        description: '',
        tags: '',
        is_featured: false,
      });
      setSelectedFiles([]); // Clear selected files
      if (fileRef.current) fileRef.current.value = ''; // Clear file input value
      toast.success('Uploaded!');
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };
  const doDelete = async (id) => {
    if (!confirm('Delete this image?')) return;
    try {
      await portfolioAPI.delete(id);
      setItems((p) => p.filter((i) => i.id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Failed');
    }
  };
  const IS = {
    background: 'var(--bg)',
    border: 'none',
    borderBottom: '1px solid var(--border-2)',
    color: 'var(--fg)',
    fontFamily: 'Montserrat,sans-serif',
    fontSize: '0.85rem',
    padding: '9px 0',
    width: '100%',
    outline: 'none',
    marginBottom: '16px',
  };
  return (
    <div style={{ padding: '36px 32px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '28px',
        }}
      >
        <div>
          <span
            className='section-label'
            style={{ display: 'block', marginBottom: '8px' }}
          >
            Management
          </span>
          <h1
            style={{
              fontFamily: 'Cormorant,serif',
              fontSize: '2.5rem',
              fontWeight: 300,
              color: 'var(--fg)',
              margin: 0,
            }}
          >
            Portfolio
          </h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className='btn-primary'
          style={{ padding: '10px 20px' }}
        >
          <span
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Plus size={12} />
            Upload Image
          </span>
        </button>
      </div>
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))',
            gap: '4px',
          }}
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className='skeleton' style={{ aspectRatio: '1' }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px',
            color: 'var(--fg-4)',
            fontFamily: 'Montserrat,sans-serif',
            fontSize: '0.8rem',
          }}
        >
          No images yet. Upload your first photo.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))',
            gap: '4px',
          }}
        >
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                }}
                className='img-zoom'
              >
                <img
                  src={
                    item.cover_image_url || item.thumbnail_url || item.image_url
                  }
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.7s',
                  }}
                />
                {item.is_featured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '6px',
                      left: '6px',
                      background: 'var(--gold)',
                      padding: '3px 5px',
                      fontSize: '8px',
                      color: '#0C0B09',
                    }}
                  >
                    <Star size={8} />
                  </div>
                )}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(12,11,9,0)',
                    transition: 'background 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '10px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(12,11,9,0.75)';
                    e.currentTarget.querySelector('.del').style.opacity = '1';
                    e.currentTarget.querySelector('.info').style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(12,11,9,0)';
                    e.currentTarget.querySelector('.del').style.opacity = '0';
                    e.currentTarget.querySelector('.info').style.opacity = '0';
                  }}
                >
                  <button
                    className='del'
                    onClick={() => doDelete(item.id)}
                    style={{
                      alignSelf: 'flex-end',
                      background: 'rgba(192,80,80,0.2)',
                      border: '1px solid rgba(192,80,80,0.35)',
                      color: '#c05050',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      opacity: 0,
                      transition: 'opacity 0.3s',
                    }}
                  >
                    <Trash2 size={11} />
                  </button>
                  <div
                    className='info'
                    style={{ opacity: 0, transition: 'opacity 0.3s' }}
                  >
                    <div
                      style={{
                        fontFamily: 'Montserrat,sans-serif',
                        fontSize: '0.55rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--gold)',
                      }}
                    >
                      {item.category}
                    </div>
                    <div
                      style={{
                        fontFamily: 'Cormorant,serif',
                        fontSize: '0.95rem',
                        color: '#fff',
                      }}
                    >
                      {item.title}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(12,11,9,0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              style={{
                background: 'var(--bg-2)',
                border: '1px solid var(--border)',
                padding: '32px',
                width: '100%',
                maxWidth: '480px',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--fg-3)',
                }}
              >
                <X size={16} />
              </button>
              <h2
                style={{
                  fontFamily: 'Cormorant,serif',
                  fontSize: '1.6rem',
                  fontWeight: 300,
                  color: 'var(--fg)',
                  marginBottom: '22px',
                }}
              >
                Upload Image
              </h2>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  border: '1px dashed var(--border-2)',
                  padding: '32px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  marginBottom: '20px',
                  transition: 'border-color 0.25s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = 'var(--gold)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = 'var(--border-2)')
                }
              >
                <Upload
                  size={22}
                  style={{
                    color: 'var(--gold)',
                    margin: '0 auto 8px',
                    display: 'block',
                  }}
                />
                <div
                  style={{
                    fontFamily: 'Montserrat,sans-serif',
                    fontSize: '0.72rem',
                    color: 'var(--fg-3)',
                  }}
                >
                  Click to select images
                </div>
                <div
                  style={{
                    fontFamily: 'Montserrat,sans-serif',
                    fontSize: '0.62rem',
                    color: 'var(--fg-4)',
                    marginTop: '3px',
                  }}
                >
                  JPG, PNG, WEBP — max 20MB
                </div>
                <input
                  ref={fileRef}
                  type='file'
                  accept='image/*'
                  multiple
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>

              {selectedFiles.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      fontFamily: 'Montserrat,sans-serif',
                      fontSize: '0.58rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--fg-4)',
                      marginBottom: '8px',
                    }}
                  >
                    Selected Files ({selectedFiles.length})
                  </div>
                  <div
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}
                  >
                    {selectedFiles.map((file, i) => (
                      <div
                        key={i}
                        style={{
                          background: 'var(--bg-3)',
                          border: '1px solid var(--border)',
                          padding: '5px 10px',
                          borderRadius: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'Montserrat,sans-serif',
                            fontSize: '0.7rem',
                            color: 'var(--fg-2)',
                            maxWidth: '120px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {file.name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFiles((prev) =>
                              prev.filter((_, idx) => idx !== i),
                            );
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            color: 'var(--fg-4)',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                style={{
                  fontFamily: 'Montserrat,sans-serif',
                  fontSize: '0.58rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--fg-4)',
                  marginBottom: '6px',
                }}
              >
                Title *
              </div>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder='Project Title'
                style={IS}
              />
              <div
                style={{
                  fontFamily: 'Montserrat,sans-serif',
                  fontSize: '0.58rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--fg-4)',
                  marginBottom: '6px',
                }}
              >
                Category
              </div>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ ...IS, background: 'var(--bg-3)' }}
              >
                {CATS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div
                style={{
                  fontFamily: 'Montserrat,sans-serif',
                  fontSize: '0.58rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--fg-4)',
                  marginBottom: '6px',
                }}
              >
                Tags (comma-separated)
              </div>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder='wedding, roker, outdoor'
                style={IS}
              />
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  marginBottom: '20px',
                }}
                onClick={() =>
                  setForm((f) => ({ ...f, is_featured: !f.is_featured }))
                }
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    border: `1px solid ${form.is_featured ? 'var(--gold)' : 'var(--border-2)'}`,
                    background: form.is_featured
                      ? 'var(--gold)'
                      : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.25s',
                  }}
                >
                  {form.is_featured && (
                    <Check size={10} style={{ color: '#0C0B09' }} />
                  )}
                </div>
                <span
                  style={{
                    fontFamily: 'Montserrat,sans-serif',
                    fontSize: '0.75rem',
                    color: 'var(--fg-2)',
                  }}
                >
                  Feature on homepage
                </span>
              </label>
              <button
                onClick={doUpload}
                disabled={uploading}
                className='btn-primary'
                style={{
                  width: '100%',
                  padding: '13px',
                  justifyContent: 'center',
                  opacity: uploading ? 0.7 : 1,
                }}
              >
                <span
                  style={{
                    fontSize: '0.6rem',
                    letterSpacing: '0.2em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {uploading ? (
                    <Loader2
                      size={12}
                      style={{ animation: 'spin 1s linear infinite' }}
                    />
                  ) : (
                    <Upload size={12} />
                  )}
                  {uploading ? 'Uploading...' : 'Upload Images'}
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
