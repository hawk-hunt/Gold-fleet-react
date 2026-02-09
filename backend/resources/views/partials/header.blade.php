<header class="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
    <div class="flex items-center">
        <button @click="sidebarOpen = !sidebarOpen" class="text-gray-500 focus:outline-none lg:hidden">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <h1 class="text-2xl font-semibold text-gray-800 ml-4 lg:ml-0">Dashboard</h1>
    </div>

    <div class="flex items-center space-x-4" x-data="{
        notificationsOpen: false,
        profileOpen: false,
        notifications: [],
        unreadCount: 0,
        loading: false,
        async loadNotifications() {
            this.loading = true;
            try {
                const response = await fetch('/notifications', {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                const data = await response.json();
                this.notifications = data.notifications;
                this.unreadCount = data.unread_count;
            } catch (error) {
                console.error('Failed to load notifications:', error);
            } finally {
                this.loading = false;
            }
        },
        async markAsRead(notificationId) {
            try {
                await fetch(`/notifications/${notificationId}/read`, {
                    method: 'PATCH',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]').content
                    }
                });
                this.loadNotifications();
            } catch (error) {
                console.error('Failed to mark as read:', error);
            }
        },
        async markAllAsRead() {
            try {
                await fetch('/notifications/mark-all-read', {
                    method: 'PATCH',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]').content
                    }
                });
                this.loadNotifications();
            } catch (error) {
                console.error('Failed to mark all as read:', error);
            }
        },
        closeDropdowns() {
            this.notificationsOpen = false;
            this.profileOpen = false;
        },
        init() {
            this.loadNotifications();
            // Poll for new notifications every 30 seconds
            setInterval(() => this.loadNotifications(), 30000);
            // Close dropdowns on escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeDropdowns();
                }
            });
        }
    }" x-init="init()" @keydown.escape="closeDropdowns()">
        <!-- Notification Bell -->
        <div class="relative" x-data="{ open: false }">
            <button @click="notificationsOpen = !notificationsOpen; profileOpen = false"
                    class="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-md"
                    :class="{ 'text-yellow-600': unreadCount > 0 }"
                    title="Notifications">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                <span x-show="unreadCount > 0" x-text="unreadCount"
                      class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                </span>
            </button>

            <!-- Notification Dropdown -->
            <div x-show="notificationsOpen"
                 x-transition:enter="transition ease-out duration-100"
                 x-transition:enter-start="transform opacity-0 scale-95"
                 x-transition:enter-end="transform opacity-100 scale-100"
                 x-transition:leave="transition ease-in duration-75"
                 x-transition:leave-start="transform opacity-100 scale-100"
                 x-transition:leave-end="transform opacity-0 scale-95"
                 @click.away="notificationsOpen = false"
                 class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div class="py-1">
                    <div class="px-4 py-2 border-b border-gray-200">
                        <h3 class="text-sm font-medium text-gray-900">Notifications</h3>
                    </div>

                    <div x-show="loading" class="px-4 py-2 text-center text-gray-500">
                        Loading...
                    </div>

                    <div x-show="!loading && notifications.length === 0" class="px-4 py-8 text-center text-gray-500">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                        <p class="mt-2 text-sm">No new notifications</p>
                    </div>

                    <div x-show="!loading && notifications.length > 0">
                        <div class="max-h-64 overflow-y-auto">
                            <template x-for="notification in notifications" :key="notification.id">
                                <div @click="markAsRead(notification.id)"
                                     class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                     :class="{ 'bg-blue-50': !notification.read }">
                                    <div class="flex items-start space-x-3">
                                        <div class="flex-shrink-0">
                                            <div x-show="notification.type === 'success'" class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                                </svg>
                                            </div>
                                            <div x-show="notification.type === 'warning'" class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                                <svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                                </svg>
                                            </div>
                                            <div x-show="notification.type === 'error'" class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                                <svg class="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                                                </svg>
                                            </div>
                                            <div x-show="notification.type === 'info'" class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium text-gray-900" x-text="notification.title"></p>
                                            <p class="text-sm text-gray-500" x-text="notification.message"></p>
                                            <p class="text-xs text-gray-400 mt-1" x-text="notification.time_ago"></p>
                                        </div>
                                        <div x-show="!notification.read" class="flex-shrink-0">
                                            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <div class="px-4 py-2 border-t border-gray-200">
                            <button @click="markAllAsRead()"
                                    class="w-full text-left text-sm text-yellow-600 hover:text-yellow-800 font-medium">
                                Mark all as read
                            </button>
                            <a href="#" class="block w-full text-left text-sm text-gray-600 hover:text-gray-800 mt-1">
                                View all notifications
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- User Profile -->
        <div class="relative">
            <button @click="profileOpen = !profileOpen; notificationsOpen = false"
                    class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                <img class="w-8 h-8 rounded-full"
                     :src="`https://ui-avatars.com/api/?name=${encodeURIComponent('{{ auth()->user()->name }}')}&background=FBBF24&color=fff`"
                     alt="User avatar">
                <span class="text-sm font-medium text-gray-700 hidden md:block">{{ auth()->user()->name }}</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            <!-- Profile Dropdown -->
            <div x-show="profileOpen"
                 x-transition:enter="transition ease-out duration-100"
                 x-transition:enter-start="transform opacity-0 scale-95"
                 x-transition:enter-end="transform opacity-100 scale-100"
                 x-transition:leave="transition ease-in duration-75"
                 x-transition:leave-start="transform opacity-100 scale-100"
                 x-transition:leave-end="transform opacity-0 scale-95"
                 @click.away="profileOpen = false"
                 class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div class="py-1">
                    <a href="{{ route('profile.edit') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                    </a>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Change Password
                    </a>
                    @if(auth()->user()->role === 'super_admin' || auth()->user()->role === 'company_admin')
                    <div class="border-t border-gray-100"></div>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Company Settings
                    </a>
                    @endif
                    <div class="border-t border-gray-100"></div>
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Logout
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</header>