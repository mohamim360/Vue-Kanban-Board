<div class="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <label for="search" class="block text-sm font-medium mb-1">Search</label>
            <div class="relative">
              <input
                id="search"
                v-model="searchQuery"
                type="text"
                placeholder="Search tasks..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Filter by User -->
          <div>
            <label for="userFilter" class="block text-sm font-medium mb-1">Assigned To</label>
            <select
              id="userFilter"
              v-model="userFilter"
              class="w-full md:w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Users</option>
              <option v-for="user in demoUsers" :key="user.id" :value="user.id">{{ user.name }}</option>
            </select>
          </div>

          <!-- Filter by Tag -->
          <div>
            <label for="tagFilter" class="block text-sm font-medium mb-1">Tag</label>
            <select
              id="tagFilter"
              v-model="tagFilter"
              class="w-full md:w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tags</option>
              <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
            </select>
          </div>

          <!-- Sort By -->
          <div>
            <label for="sortBy" class="block text-sm font-medium mb-1">Sort By</label>
            <select
              id="sortBy"
              v-model="sortBy"
              class="w-full md:w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
              <option value="createdAt">Creation Date</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

         <div
              v-if="filteredAndSortedCards(column).length === 0"
              class="text-gray-400 dark:text-gray-500 text-sm italic py-8 text-center border-2 border-dashed rounded-lg"
              :class="{
                'border-blue-100 dark:border-blue-700/40': column === 'todo',
                'border-yellow-100 dark:border-yellow-700/40':
                  column === 'inprogress',
                'border-green-100 dark:border-green-700/40': column === 'done',
              }"
            >
              No tasks found
            </div>


          <!-- Attachments -->
                  <div v-if="card.attachments && card.attachments.length" class="mb-3">
                    <div class="flex flex-wrap gap-2">
                      <div
                        v-for="(attachment, idx) in card.attachments"
                        :key="idx"
                        class="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                      >
                        <span v-if="attachment.type === 'image'">🖼</span>
                        <span v-else-if="attachment.type === 'pdf'">📄</span>
                        <span v-else>📎</span>
                        
                        <a 
                          :href="attachment.url" 
                          target="_blank" 
                          class="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[100px]"
                          :title="attachment.name"
                        >
                          {{ attachment.name }}
                        </a>
                        
                        <button 
                          @click.stop="removeAttachment(card.id, idx)"
                          class="text-red-500 hover:text-red-700"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  </div>

