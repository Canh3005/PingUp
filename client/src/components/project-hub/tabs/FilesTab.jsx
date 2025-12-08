import React, { useState } from 'react';
import {
  Folder,
  File,
  Image,
  FileText,
  Music,
  Video,
  Code,
  Archive,
  Upload,
  Grid,
  List,
  Search,
  MoreHorizontal,
  Download,
  Trash2,
  Eye,
  Clock,
  ChevronRight,
  FolderPlus,
  X,
  ChevronLeft
} from 'lucide-react';

const FilesTab = ({ project }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Mock file data
  const files = {
    root: [
      { id: 1, name: 'Art Assets', type: 'folder', items: 24, modified: '2024-02-12' },
      { id: 2, name: 'Audio', type: 'folder', items: 18, modified: '2024-02-11' },
      { id: 3, name: 'Documentation', type: 'folder', items: 8, modified: '2024-02-10' },
      { id: 4, name: 'Builds', type: 'folder', items: 5, modified: '2024-02-09' },
      { id: 5, name: 'game_design_doc.pdf', type: 'pdf', size: '2.4 MB', modified: '2024-02-08', thumbnail: null },
      { id: 6, name: 'project_timeline.xlsx', type: 'spreadsheet', size: '156 KB', modified: '2024-02-07' },
    ],
    'Art Assets': [
      { id: 7, name: 'Characters', type: 'folder', items: 12, modified: '2024-02-12' },
      { id: 8, name: 'Environments', type: 'folder', items: 8, modified: '2024-02-11' },
      { id: 9, name: 'UI Elements', type: 'folder', items: 32, modified: '2024-02-10' },
      { id: 10, name: 'hero_ship_v3.png', type: 'image', size: '4.2 MB', modified: '2024-02-12', thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=200&h=200&fit=crop' },
      { id: 11, name: 'nebula_bg.jpg', type: 'image', size: '8.1 MB', modified: '2024-02-11', thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&h=200&fit=crop' },
      { id: 12, name: 'explosion_sprite.png', type: 'image', size: '1.8 MB', modified: '2024-02-10', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=200&fit=crop' },
    ],
    'Audio': [
      { id: 13, name: 'Music', type: 'folder', items: 6, modified: '2024-02-11' },
      { id: 14, name: 'SFX', type: 'folder', items: 42, modified: '2024-02-10' },
      { id: 15, name: 'main_theme.mp3', type: 'audio', size: '5.6 MB', modified: '2024-02-11' },
      { id: 16, name: 'ambient_space.wav', type: 'audio', size: '12.3 MB', modified: '2024-02-09' },
    ],
    'Builds': [
      { id: 17, name: 'alpha_v0.1.zip', type: 'archive', size: '245 MB', modified: '2024-02-05', version: 'v0.1.0' },
      { id: 18, name: 'alpha_v0.2.zip', type: 'archive', size: '312 MB', modified: '2024-02-08', version: 'v0.2.0' },
      { id: 19, name: 'beta_v0.3.zip', type: 'archive', size: '428 MB', modified: '2024-02-12', version: 'v0.3.0' },
    ]
  };

  const getCurrentFiles = () => {
    if (currentPath.length === 0) {
      return files.root;
    }
    const pathKey = currentPath[currentPath.length - 1];
    return files[pathKey] || [];
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'folder': return <Folder size={24} className="text-blue-500" />;
      case 'image': return <Image size={24} className="text-green-500" />;
      case 'pdf': return <FileText size={24} className="text-red-500" />;
      case 'audio': return <Music size={24} className="text-purple-500" />;
      case 'video': return <Video size={24} className="text-pink-500" />;
      case 'code': return <Code size={24} className="text-yellow-500" />;
      case 'archive': return <Archive size={24} className="text-orange-500" />;
      case 'spreadsheet': return <FileText size={24} className="text-emerald-500" />;
      default: return <File size={24} className="text-gray-500" />;
    }
  };

  const handleNavigate = (folder) => {
    if (folder.type === 'folder') {
      setCurrentPath([...currentPath, folder.name]);
    } else {
      setSelectedFile(folder);
    }
  };

  const handleBreadcrumbClick = (index) => {
    if (index === -1) {
      setCurrentPath([]);
    } else {
      setCurrentPath(currentPath.slice(0, index + 1));
    }
  };

  const FileCard = ({ file }) => (
    <div
      onClick={() => handleNavigate(file)}
      className="group bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer"
    >
      {/* Thumbnail or Icon */}
      <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
        {file.thumbnail ? (
          <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
        ) : file.type === 'folder' ? (
          <Folder size={48} className="text-blue-500" />
        ) : (
          <div className="scale-150">
            {getFileIcon(file.type)}
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {file.name}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {file.type === 'folder' ? `${file.items} items` : file.size}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="p-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Version badge for builds */}
      {file.version && (
        <span className="inline-block mt-2 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
          {file.version}
        </span>
      )}
    </div>
  );

  const FileRow = ({ file }) => (
    <div
      onClick={() => handleNavigate(file)}
      className="group flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {getFileIcon(file.type)}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
          {file.name}
        </p>
      </div>

      {/* Size/Items */}
      <div className="w-24 text-sm text-gray-500 text-right">
        {file.type === 'folder' ? `${file.items} items` : file.size}
      </div>

      {/* Modified */}
      <div className="w-32 text-sm text-gray-500 text-right">
        {new Date(file.modified).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {file.type !== 'folder' && (
          <>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
              <Download size={16} />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
              <Eye size={16} />
            </button>
          </>
        )}
        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm">
            <button
              onClick={() => handleBreadcrumbClick(-1)}
              className={`hover:text-blue-600 transition-colors ${currentPath.length === 0 ? 'font-medium text-gray-900' : 'text-gray-500'}`}
            >
              Files
            </button>
            {currentPath.map((path, index) => (
              <React.Fragment key={path}>
                <ChevronRight size={14} className="text-gray-400" />
                <button
                  onClick={() => handleBreadcrumbClick(index)}
                  className={`hover:text-blue-600 transition-colors ${index === currentPath.length - 1 ? 'font-medium text-gray-900' : 'text-gray-500'}`}
                >
                  {path}
                </button>
              </React.Fragment>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List size={18} />
            </button>
          </div>

          {/* New Folder */}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <FolderPlus size={18} />
            <span className="hidden sm:inline">New Folder</span>
          </button>

          {/* Upload */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload size={18} />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>
      </div>

      {/* Back button when in subfolder */}
      {currentPath.length > 0 && (
        <button
          onClick={() => setCurrentPath(currentPath.slice(0, -1))}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
        >
          <ChevronLeft size={18} />
          Back
        </button>
      )}

      {/* Files Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {getCurrentFiles().map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* List Header */}
          <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
            <div className="w-6"></div>
            <div className="flex-1">Name</div>
            <div className="w-24 text-right">Size</div>
            <div className="w-32 text-right">Modified</div>
            <div className="w-24"></div>
          </div>

          {/* List Items */}
          {getCurrentFiles().map((file) => (
            <FileRow key={file.id} file={file} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {getCurrentFiles().length === 0 && (
        <div className="text-center py-16">
          <Folder size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No files yet</h3>
          <p className="text-gray-500 mb-4">Upload files to get started</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload size={18} />
            Upload Files
          </button>
        </div>
      )}

      {/* File Preview Modal */}
      {selectedFile && selectedFile.type !== 'folder' && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {getFileIcon(selectedFile.type)}
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedFile.name}</h3>
                  <p className="text-sm text-gray-500">{selectedFile.size} • Modified {selectedFile.modified}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download size={20} />
                </button>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {selectedFile.type === 'image' && selectedFile.thumbnail && (
                <img
                  src={selectedFile.thumbnail.replace('w=200&h=200', 'w=800&h=600')}
                  alt={selectedFile.name}
                  className="w-full h-auto rounded-lg"
                />
              )}

              {selectedFile.type === 'audio' && (
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <Music size={64} className="mx-auto text-purple-500 mb-4" />
                  <p className="text-gray-600">Audio preview not available</p>
                  <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Play Audio
                  </button>
                </div>
              )}

              {(selectedFile.type === 'pdf' || selectedFile.type === 'spreadsheet') && (
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  {getFileIcon(selectedFile.type)}
                  <p className="text-gray-600 mt-4">Preview not available</p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Download to View
                  </button>
                </div>
              )}

              {/* Version History for Builds */}
              {selectedFile.version && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Version History</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <Clock size={18} className="text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedFile.version} (Current)</p>
                          <p className="text-sm text-gray-500">{selectedFile.modified}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{selectedFile.size}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Upload Files</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-900 font-medium mb-1">Drag and drop files here</p>
                <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Select Files
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Maximum file size: 100MB • Supported formats: Images, Audio, Video, Documents, Archives
              </p>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesTab;
