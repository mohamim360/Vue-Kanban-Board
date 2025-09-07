<template>
  <div v-if="editor" class="tiptap-editor">
    <!-- Menu Bar -->
    <div v-if="editor" class="menu-bar border-b p-2 flex flex-wrap gap-1">
      <!-- Text Formatting -->
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Bold"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.636A4.5 4.5 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z"/>
        </svg>
      </button>
      
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Italic"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z"/>
        </svg>
      </button>
      
      <button
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Strikethrough"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M17.154 14c.23.516.346 1.09.346 1.72 0 1.342-.524 2.392-1.571 3.147C14.88 19.622 13.433 20 11.586 20c-1.64 0-3.263-.381-4.87-1.144V16.6c1.52.877 3.075 1.316 4.666 1.316 2.551 0 3.83-.732 3.839-2.197a2.21 2.21 0 0 0-.648-1.603l-.12-.117H3v-2h18v2h-3.846zm-4.078-3H7.629a4.086 4.086 0 0 1-.481-.522C6.716 9.92 6.5 9.246 6.5 8.452c0-1.236.466-2.287 1.397-3.153C8.83 4.433 10.271 4 12.212 4c1.471 0 2.879.328 4.222.984v2.152c-1.2-.687-2.515-1.03-3.946-1.03-2.48 0-3.719.782-3.719 2.346 0 .42.218.786.654 1.099.436.313.974.562 1.613.75.62.18 1.297.414 2.03.699z"/>
        </svg>
      </button>

      <!-- Headings -->
      <button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Heading 1"
      >
        H1
      </button>
      
      <button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Heading 2"
      >
        H2
      </button>

      <!-- Lists -->
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Bullet List"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"/>
        </svg>
      </button>
      
      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Numbered List"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1H3zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2v-.5zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"/>
        </svg>
      </button>

      <!-- Blockquote & Code -->
      <button
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Blockquote"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
        </svg>
      </button>
      
      <button
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Code Block"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M24 12l-5.657 5.657-1.414-1.414L21.172 12l-4.243-4.243 1.414-1.414L24 12zM2.828 12l4.243 4.243-1.414 1.414L0 12l5.657-5.657L7.07 7.757 2.828 12z"/>
        </svg>
      </button>

      <!-- Horizontal Rule -->
      <button
        @click="editor.chain().focus().setHorizontalRule().run()"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Horizontal Rule"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M2 11h2v2H2v-2zm4 0h12v2H6v-2zm14 0h2v2h-2v-2z"/>
        </svg>
      </button>

      <!-- Link -->
      <button
        @click="setLink"
        :class="{ 'is-active': editor.isActive('link') }"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Add Link"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M13.06 8.11l1.415 1.415a7 7 0 0 1 0 9.9l-.354.353a7 7 0 0 1-9.9-9.9l1.415 1.415a5 5 0 1 0 7.071 7.071l.354-.354a5 5 0 0 0 0-7.07l-1.415-1.415 1.415-1.414zm6.718 6.011l-1.414-1.414a5 5 0 1 0-7.071-7.071l-.354.354a5 5 0 0 0 0 7.07l1.415 1.415-1.415 1.414-1.414-1.414a7 7 0 0 1 0-9.9l.354-.353a7 7 0 0 1 9.9 9.9z"/>
        </svg>
      </button>

      <!-- Image Upload -->
      <button
        @click="addImage"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Add Image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M4.828 21l-.02.02-.021-.02H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H4.828zM20 15V5H4v14L14 9l6 6zm0 2.828l-6-6L6.828 19H20v-1.172zM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
        </svg>
      </button>

      <!-- File Upload -->
      <button
        @click="addFile"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Add File"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M12 12h5v5h-5v-5zm-7 0h5v5H5v-5zm0-7h5v5H5V5zm7 0h5v5h-5V5z"/>
          <path d="M3 21h18a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1zm1-2V5h16v14H4z"/>
        </svg>
      </button>

      <!-- Undo/Redo -->
      <button
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Undo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M8 7v4L2 6l6-5v4h5a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H8z"/>
        </svg>
      </button>
      
      <button
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Redo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M16 7h-5a6 6 0 1 0 0 12h9v2h-9a8 8 0 1 1 0-16h5V1l6 5-6 5V7z"/>
        </svg>
      </button>
    </div>

    <!-- Editor Content -->
    <editor-content :editor="editor" class="editor-content p-4 min-h-[150px]" />
  </div>
</template>

<script>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { markRaw } from 'vue'

export default {
  components: {
    EditorContent,
  },

  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const editor = useEditor({
      content: props.modelValue,
      extensions: [
        StarterKit,
        Underline,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-blue-500 underline',
          },
        }),
        Image.configure({
          HTMLAttributes: {
            class: 'rounded-lg max-w-full',
          },
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Placeholder.configure({
          placeholder: 'Write something...',
        }),
      ],
      onUpdate: () => {
        emit('update:modelValue', editor.value.getHTML())
      },
      editorProps: {
        attributes: {
          class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none dark:prose-invert max-w-none',
        },
      },
    })

    return { editor }
  },

  methods: {
    setLink() {
      const previousUrl = this.editor.getAttributes('link').href
      const url = window.prompt('URL', previousUrl)

      // cancelled
      if (url === null) {
        return
      }

      // empty
      if (url === '') {
        this.editor.chain().focus().extendMarkRange('link').unsetLink().run()
        return
      }

      // update link
      this.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    },
    
    addImage() {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      
      input.onchange = (event) => {
        const file = event.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            // For a real app, you would upload the image to a server first
            // and then use the returned URL. Here we're using a data URL for simplicity.
            this.editor.chain().focus().setImage({ src: e.target.result }).run()
          }
          reader.readAsDataURL(file)
        }
      }
      
      input.click()
    },
    
    addFile() {
      const input = document.createElement('input')
      input.type = 'file'
      
      input.onchange = (event) => {
        const file = event.target.files[0]
        if (file) {
          // For a real app, you would upload the file to a server first
          // and then use the returned URL. Here we're using a fake URL for demonstration.
          const fileName = file.name
          const fileSize = this.formatFileSize(file.size)
          
          // Create a download link
          const reader = new FileReader()
          reader.onload = (e) => {
            // In a real app, you would use a server URL instead of a data URL
            const fileUrl = e.target.result
            
            this.editor.chain().focus().setContent(`
              <a href="${fileUrl}" download="${fileName}" class="file-link flex items-center p-2 border rounded bg-gray-50 dark:bg-gray-700 my-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                </svg>
                <div>
                  <div class="font-medium">${fileName}</div>
                  <div class="text-xs text-gray-500">${fileSize}</div>
                </div>
              </a>
            `).run()
          }
          reader.readAsDataURL(file)
        }
      }
      
      input.click()
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
  },

  watch: {
    modelValue(value) {
      // HTML
      const isSame = this.editor.getHTML() === value

      // JSON
      // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

      if (isSame) {
        return
      }

      this.editor.commands.setContent(value, false)
    },
  },

  mounted() {
    // Make editor reactive
    this.editor = markRaw(this.editor)
  },

  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>

<style>
.tiptap-editor {
  @apply border rounded-lg overflow-hidden bg-white dark:bg-gray-700;
}

.tiptap-editor .menu-bar {
  @apply bg-gray-50 dark:bg-gray-600 border-b border-gray-200 dark:border-gray-500;
}

.tiptap-editor .menu-bar button {
  @apply text-gray-600 dark:text-gray-200;
}

.tiptap-editor .menu-bar button.is-active {
  @apply bg-gray-200 dark:bg-gray-500 text-gray-800 dark:text-white;
}

.tiptap-editor .menu-bar button:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.tiptap-editor .editor-content {
  @apply min-h-[150px] max-h-[300px] overflow-y-auto;
}

.tiptap-editor .ProseMirror {
  @apply outline-none p-4;
}

.tiptap-editor .ProseMirror:focus {
  @apply outline-none;
}

.tiptap-editor .file-link {
  @apply no-underline text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors;
}

/* Basic editor styles */
.tiptap-editor .ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  ul, ol {
    padding: 0 1rem;
  }

  h1, h2, h3, h4, h5, h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(97, 97, 97, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(13, 13, 13, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(13, 13, 13, 0.1);
    margin: 2rem 0;
  }
}
</style>