<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    :enter-from-class="enterFromClass"
    :enter-to-class="enterToClass"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed z-50 max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
      :class="[toastClasses, positionClasses]"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <component
              :is="iconComponent"
              class="h-6 w-6"
              :class="iconColor"
              aria-hidden="true"
            />
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ title }}
            </p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ message }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="close"
              class="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span class="sr-only">Close</span>
              <XMarkIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  },
  show: {
    type: Boolean,
    default: true
  },
  position: {
    type: String,
    default: 'bottom-right',
    validator: (value) => [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right',
      'center'
    ].includes(value)
  }
})

const emit = defineEmits(['close'])

const toastConfig = {
  success: {
    title: 'Success',
    icon: CheckCircleIcon,
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-400 dark:border-green-600',
    iconColor: 'text-green-400 dark:text-green-300'
  },
  error: {
    title: 'Error',
    icon: ExclamationCircleIcon,
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-400 dark:border-red-600',
    iconColor: 'text-red-400 dark:text-red-300'
  },
  warning: {
    title: 'Warning',
    icon: ExclamationTriangleIcon,
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-400 dark:border-yellow-600',
    iconColor: 'text-yellow-400 dark:text-yellow-300'
  },
  info: {
    title: 'Info',
    icon: InformationCircleIcon,
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-400 dark:border-blue-600',
    iconColor: 'text-blue-400 dark:text-blue-300'
  }
}

const positionConfig = {
  'top-left': {
    classes: 'top-4 left-4',
    enterFrom: 'translate-y-2 opacity-0 -translate-x-2',
    enterTo: 'translate-y-0 opacity-100 translate-x-0'
  },
  'top-center': {
    classes: 'top-4 left-1/2 transform -translate-x-1/2',
    enterFrom: 'translate-y-2 opacity-0',
    enterTo: 'translate-y-0 opacity-100'
  },
  'top-right': {
    classes: 'top-4 right-4',
    enterFrom: 'translate-y-2 opacity-0 translate-x-2',
    enterTo: 'translate-y-0 opacity-100 translate-x-0'
  },
  'bottom-left': {
    classes: 'bottom-4 left-4',
    enterFrom: 'translate-y-2 opacity-0 -translate-x-2',
    enterTo: 'translate-y-0 opacity-100 translate-x-0'
  },
  'bottom-center': {
    classes: 'bottom-4 left-1/2 transform -translate-x-1/2',
    enterFrom: 'translate-y-2 opacity-0',
    enterTo: 'translate-y-0 opacity-100'
  },
  'bottom-right': {
    classes: 'bottom-4 right-4',
    enterFrom: 'translate-y-2 opacity-0 translate-x-2',
    enterTo: 'translate-y-0 opacity-100 translate-x-0'
  },
  'center': {
    classes: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    enterFrom: 'scale-95 opacity-0',
    enterTo: 'scale-100 opacity-100'
  }
}

const toastType = computed(() => toastConfig[props.type] || toastConfig.success)
const positionType = computed(() => positionConfig[props.position] || positionConfig['bottom-right'])

const title = computed(() => toastType.value.title)
const iconComponent = computed(() => toastType.value.icon)
const iconColor = computed(() => toastType.value.iconColor)

const toastClasses = computed(() => {
  return `${toastType.value.bgColor} border ${toastType.value.borderColor}`
})

const positionClasses = computed(() => positionType.value.classes)
const enterFromClass = computed(() => positionType.value.enterFrom)
const enterToClass = computed(() => positionType.value.enterTo)

function close() {
  emit('close')
}

// Auto-close after duration
onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script>

<style scoped>
/* Custom animations for toast */
.transform {
  transition: all 0.3s ease;
}

.transition {
  transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.15s;
}
</style>