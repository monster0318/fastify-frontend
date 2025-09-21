import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Button, List, ListItem, ListItemText, IconButton, ListItemIcon } from '@mui/material';
import api from '@/lib/axios';
import type { Document } from '@/contexts/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const allowedTypes = {
  'application/pdf': [".pdf"],
  'application/vnd.ms-powerpoint': [".ppt"],
  'application/vnd.ms-excel': [".xls"],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [".xlsx"],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [".pptx"],
};

export default function FileDropzone() {
  const [ files, setFiles ] = useState<Document[]>([]);
  const [deletingIds, setDeletingIds] = useState<Record<string, boolean>>({});

  const fetchFiles = async () => {
    const res = await api.get('/files');
    if (res.status === 200) {
      setFiles(res.data.data);
    }
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: any) => {
    if (!acceptedFiles) return;
    const formData = new FormData();
    acceptedFiles.forEach(async (file: any) => {
      formData.append('files', file);
    });
    const res = await api.post('/files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (res.status === 200) {
      fetchFiles();
    }
  }, []);

  const handleDownload = async (doc: Document) => {
    try {
      const resp = await api.get(`/files/download/${doc.id}`, {
        responseType: 'blob',
        headers: {
          Accept: 'application/octet-stream',
        },
      });

      const disposition = resp.headers && (resp.headers['content-disposition'] || resp.headers['Content-Disposition']);
      let filename = doc.name || 'download';

      if (disposition) {
        const filenameMatch = /filename\*=UTF-8''([^;\n]+)/i.exec(disposition) || /filename="?([^";]+)"?/i.exec(disposition);
        if (filenameMatch && filenameMatch[1]) {
          filename = decodeURIComponent(filenameMatch[1]);
        }
      }

      const hasExt = /\.[a-zA-Z0-9]+$/.test(filename);
      if (!hasExt && (doc as any).mimeType) {
        const mimeToExt: Record<string, string> = {
          'application/pdf': '.pdf',
          'application/vnd.ms-powerpoint': '.ppt',
          'application/vnd.ms-excel': '.xls',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
        };
        const ext = mimeToExt[(doc as any).mimeType] || '';
        filename = filename + ext;
      }

      const blob = new Blob([resp.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Download failed', err);
    }
  }

  const handleDelete = async (doc: Document) => {
    if (!doc || !doc.id) return;
    const confirm = window.confirm(`Delete "${doc.name}"? This action cannot be undone.`);
    if (!confirm) return;

    try {
      setDeletingIds(prev => ({ ...prev, [doc.id]: true }));
      const res = await api.delete(`/files/${doc.id}`);
      if (res.status === 200 || res.status === 204) {
        await fetchFiles();
      } else {
        console.error('Delete failed', res);
      }
    } catch (err: any) {
      console.error('Delete failed', err);
    } finally {
      setDeletingIds(prev => {
        const next = { ...prev };
        delete next[doc.id];
        return next;
      });
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedTypes,
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024
  });

  return (
    <Box>
      <Box {...getRootProps()} sx={{ border: '2px dashed #888', p: 2, my:2, cursor:"pointer" }}>
        <input {...getInputProps()} />
        <Typography>
          {isDragActive ? "Drop your files here..." : "Drag & drop or click to upload (PDF, PPTX, XLSX, max 10MB)"}
        </Typography>
      </Box>

      <List>
        {files.map((doc: Document & { createdAt?: string }) => (
          <ListItem key={doc.id} secondaryAction={
            <ListItemIcon>
              <IconButton
                color='primary'
                onClick={() => handleDownload(doc)}
              >
                <CloudDownloadIcon />
              </IconButton>
              <IconButton
                color='error'
                loading={deletingIds[doc.id]}
                onClick={() => handleDelete(doc)}
                disabled={!!deletingIds[doc.id]}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemIcon>
          }>
            <ListItemText
              primary={doc.name}
              secondary={`${(doc.size/1024).toFixed(1)} KB • ${new Date(doc.createdAt || '').toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}