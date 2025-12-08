import React, { useState, useRef, useEffect } from 'react';
import { Trash2, ChevronUp, ChevronDown, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Link2, Type, Palette } from 'lucide-react';

const TextBlock = ({ block, updateBlock, deleteBlock, moveBlock, isFirst, isLast, onFocus, onBlur }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [fontSize, setFontSize] = useState(block.textStyles?.fontSize || 20);
  const [fontFamily, setFontFamily] = useState(block.textStyles?.fontFamily || 'Helvetica');
  const [isBold, setIsBold] = useState(block.textStyles?.isBold || false);
  const [isItalic, setIsItalic] = useState(block.textStyles?.isItalic || false);
  const [isUnderline, setIsUnderline] = useState(block.textStyles?.isUnderline || false);
  const [textAlign, setTextAlign] = useState(block.textStyles?.textAlign || 'left');
  const [textColor, setTextColor] = useState(block.textStyles?.textColor || '#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const textareaRef = useRef(null);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = (e) => {
    // Only blur if clicking outside the toolbar
    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
      setIsFocused(false);
      onBlur?.();
    }
  };

  const toggleBold = () => setIsBold(!isBold);
  const toggleItalic = () => setIsItalic(!isItalic);
  const toggleUnderline = () => setIsUnderline(!isUnderline);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '25px';
      textarea.style.height = `${Math.max(25, textarea.scrollHeight)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [block.content, fontSize, fontFamily]);

  useEffect(() => {
    // Save textStyles to block whenever they change
    const textStyles = {
      fontSize,
      fontFamily,
      isBold,
      isItalic,
      isUnderline,
      textAlign,
      textColor,
    };
    updateBlock(block.id, block.content, textStyles);
  }, [fontSize, fontFamily, isBold, isItalic, isUnderline, textAlign, textColor]);

  const handleContentChange = (e) => {
    updateBlock(block.id, e.target.value);
    adjustHeight();
  };

  const getTextStyle = () => ({
    fontSize: `${fontSize}px`,
    fontFamily,
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    textDecoration: isUnderline ? 'underline' : 'none',
    textAlign,
    color: textColor,
  });

  return (
    <div className="group relative" onBlur={handleBlur}>
      {/* Toolbar - shows below when isFirst, otherwise above */}
      {isFocused && (
        <div className={`absolute left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-xl p-3 flex items-center gap-1 z-10 border border-gray-700/50 ${isFirst ? 'top-full mt-2' : '-top-14'}`}>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="px-3 py-2 bg-gray-800 text-white text-sm rounded-xl hover:bg-gray-700 border-none outline-none cursor-pointer transition-colors appearance-none pr-8 relative"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.5rem center',
            }}
          >
            <option value="Paragraph" className="bg-gray-800 text-white py-2">Paragraph</option>
            <option value="Helvetica" className="bg-gray-800 text-white py-2">Helvetica</option>
            <option value="Arial" className="bg-gray-800 text-white py-2">Arial</option>
            <option value="Times New Roman" className="bg-gray-800 text-white py-2">Times New Roman</option>
            <option value="Georgia" className="bg-gray-800 text-white py-2">Georgia</option>
            <option value="Courier New" className="bg-gray-800 text-white py-2">Courier New</option>
            <option value="Verdana" className="bg-gray-800 text-white py-2">Verdana</option>
          </select>

          <div className="w-px h-6 bg-gray-700 mx-1" />

          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            min="8"
            max="72"
            className="w-14 px-2 py-2 bg-gray-800 text-white text-sm rounded-xl hover:bg-gray-700 border-none outline-none transition-colors text-center"
          />

          <div className="w-px h-6 bg-gray-700 mx-1" />

          <button
            onClick={toggleBold}
            className={`p-2 rounded-xl transition-all ${isBold ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
            onMouseDown={(e) => e.preventDefault()}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={toggleItalic}
            className={`p-2 rounded-xl transition-all ${isItalic ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
            onMouseDown={(e) => e.preventDefault()}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={toggleUnderline}
            className={`p-2 rounded-xl transition-all ${isUnderline ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
            onMouseDown={(e) => e.preventDefault()}
          >
            <Underline className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-700 mx-1" />

          <button
            onClick={() => setTextAlign('left')}
            className={`p-2 rounded-xl transition-all ${textAlign === 'left' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
            onMouseDown={(e) => e.preventDefault()}
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTextAlign('center')}
            className={`p-2 rounded-xl transition-all ${textAlign === 'center' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
            onMouseDown={(e) => e.preventDefault()}
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTextAlign('right')}
            className={`p-2 rounded-xl transition-all ${textAlign === 'right' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
            onMouseDown={(e) => e.preventDefault()}
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-700 mx-1" />

          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 hover:bg-gray-700 rounded-xl transition-colors flex items-center gap-2"
              onMouseDown={(e) => e.preventDefault()}
            >
              <Palette className="w-4 h-4 text-gray-400" />
              <div
                className="w-5 h-5 rounded-lg border-2 border-gray-600"
                style={{ backgroundColor: textColor }}
              />
            </button>

            {showColorPicker && (
              <div className="absolute top-full mt-2 left-0 bg-white rounded-2xl shadow-2xl p-4 z-20 border border-gray-100">
                <div className="flex flex-col gap-3">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-10 rounded-xl cursor-pointer"
                  />
                  <div className="grid grid-cols-5 gap-1.5">
                    {['#000000', '#374151', '#DC2626', '#EA580C', '#D97706', '#CA8A04', '#65A30D', '#16A34A', '#0891B2', '#0284C7', '#2563EB', '#4F46E5', '#7C3AED', '#C026D3', '#DB2777'].map(color => (
                      <button
                        key={color}
                        onClick={() => setTextColor(color)}
                        className="w-7 h-7 rounded-lg border-2 border-gray-200 hover:scale-110 hover:border-gray-400 transition-all"
                        style={{ backgroundColor: color }}
                        onMouseDown={(e) => e.preventDefault()}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-700 mx-1" />

          <button className="p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded-xl transition-all" onMouseDown={(e) => e.preventDefault()}>
            <Link2 className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded-xl transition-all" onMouseDown={(e) => e.preventDefault()}>
            <Type className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Text Input */}
      <div className={`p-4 transition-all ${isFocused ? 'bg-gray-50 ring-2 ring-blue-500/30' : 'hover:bg-gray-50'}`}>
        <textarea
          ref={textareaRef}
          value={block.content || ''}
          onChange={handleContentChange}
          onFocus={handleFocus}
          placeholder="Enter your text here..."
          className="w-full min-h-[25px] border-none outline-none resize-none bg-transparent text-gray-900 overflow-hidden"
          style={getTextStyle()}
        />
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
        {!isFirst && (
          <button
            onClick={() => moveBlock(block.id, 'up')}
            className="p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white hover:scale-105 transition-all"
          >
            <ChevronUp className="w-4 h-4 text-gray-700" />
          </button>
        )}
        {!isLast && (
          <button
            onClick={() => moveBlock(block.id, 'down')}
            className="p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white hover:scale-105 transition-all"
          >
            <ChevronDown className="w-4 h-4 text-gray-700" />
          </button>
        )}
        <button
          onClick={() => deleteBlock(block.id)}
          className="p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-red-50 hover:scale-105 transition-all"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default TextBlock;