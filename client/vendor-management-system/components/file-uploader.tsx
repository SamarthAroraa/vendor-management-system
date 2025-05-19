"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"

interface FileUploaderProps {
  onFilesUploaded: (files: File[]) => void
}

export default function FileUploader({ onFilesUploaded }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(
        (file) => file.name.endsWith(".xlsx") || file.name.endsWith(".xls"),
      )

      if (files.length > 0) {
        setSelectedFiles((prev) => [...prev, ...files])
        onFilesUploaded(files)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).filter(
        (file) => file.name.endsWith(".xlsx") || file.name.endsWith(".xls"),
      )

      if (files.length > 0) {
        setSelectedFiles((prev) => [...prev, ...files])
        onFilesUploaded(files)
      }
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const removeFile = (fileName: string) => {
    const updatedFiles = selectedFiles.filter((file) => file.name !== fileName)
    setSelectedFiles(updatedFiles)
  }

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? "border-primary bg-primary/5" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input ref={inputRef} type="file" multiple accept=".xlsx,.xls" onChange={handleChange} className="hidden" />

        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm font-medium">
          Drag and drop Excel files, or{" "}
          <span className="text-primary cursor-pointer hover:underline" onClick={handleButtonClick}>
            browse
          </span>
        </p>
        <p className="mt-1 text-xs text-gray-500">Only .xlsx and .xls files are supported</p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Uploaded Files:</p>
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                <span className="text-sm truncate max-w-[80%]">{file.name}</span>
                <button onClick={() => removeFile(file.name)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

