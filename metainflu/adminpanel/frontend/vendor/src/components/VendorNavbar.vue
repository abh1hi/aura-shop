<template>
  <header class="sticky top-0 z-30" style="backdrop-filter: blur(6px);">
    <div class="flex items-center justify-between h-14 px-4">
      <h1 class="text-[17px] font-semibold" style="color:var(--text)">{{ pageTitle }}</h1>
      <div class="flex items-center gap-2">
        <button class="p-2 ios-rounded" @click="openSearch" title="Search" style="background:transparent">
          <MagnifyingGlassIcon class="h-5 w-5" />
        </button>
        <button class="relative p-2 ios-rounded" @click="toggleNotifications" :aria-label="`Notifications (${unreadCount})`">
          <BellIcon class="h-5 w-5" />
          <span v-if="unreadCount" class="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full" style="background:var(--primary);color:white;font-size:10px">{{ unreadCount }}</span>
        </button>
        <button class="flex items-center gap-2 pl-2 pr-2 py-1 ios-rounded" @click="toggleUserMenu" style="background:transparent">
          <img :src="currentUser.avatar" alt="" class="h-7 w-7 rounded-full" />
          <ChevronDownIcon class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Notifications Dropdown -->
    <div v-if="showNotifications" class="absolute right-3 mt-2 w-80 bg-[color:var(--surface)] border border-[color:var(--separator)] rounded-[14px] shadow-card p-2">
      <div class="flex items-center justify-between px-2 py-1">
        <span class="text-sm font-semibold">Notifications</span>
        <button v-if="unreadCount" class="text-[13px] text-[color:var(--primary)]" @click="markAllRead">Mark all</button>
      </div>
      <div class="max-h-64 overflow-y-auto">
        <div v-for="n in recentNotifications" :key="n.id" class="flex items-start gap-3 px-2 py-2 rounded-[12px] hover:bg-black/3 cursor-pointer" @click="markAsRead(n.id)">
          <div class="h-6 w-6 rounded-full flex items-center justify-center" :class="getNotificationIconClass(n.type)">
            <component :is="getNotificationIcon(n.type)" class="h-3.5 w-3.5" />
          </div>
          <div class="flex-1">
            <p class="text-[13px] text-[color:var(--text)]">{{ n.message }}</p>
            <p class="text-[11px] text-[color:var(--text-tertiary)] mt-0.5">{{ formatTime(n.timestamp) }}</p>
          </div>
        </div>
      </div>
      <div class="px-2 pb-1 pt-1"><router-link to="/notifications" class="text-[13px] text-[color:var(--primary)]">View all</router-link></div>
    </div>

    <!-- Search Overlay -->
    <div v-if="showSearch" class="fixed inset-0 bg-black/30 z-40 flex items-start justify-center pt-24" @click="closeSearch">
      <div class="w-full max-w-xl bg-[color:var(--surface)] border border-[color:var(--separator)] rounded-[14px] shadow-card mx-4" @click.stop>
        <div class="flex items-center px-3 py-2 border-b border-[color:var(--separator)]">
          <MagnifyingGlassIcon class="h-5 w-5 text-[color:var(--text-tertiary)] mr-2" />
          <input ref="searchInput" v-model="searchQuery" @keyup.enter="performSearch" @keyup.esc="closeSearch" class="flex-1 bg-transparent outline-none text-[15px]" placeholder="Search products, orders, customers" />
          <button class="text-[13px] text-[color:var(--text-tertiary)]" @click="closeSearch">Cancel</button>
        </div>
        <div v-if="searchResults.length" class="max-h-64 overflow-y-auto">
          <div v-for="r in searchResults" :key="r.id" class="flex items-center gap-3 px-3 py-2 hover:bg-black/3">
            <component :is="getSearchResultIcon(r.type)" class="h-4 w-4 text-[color:var(--text-tertiary)]" />
            <div class="text-[13px]">
              <div class="text-[color:var(--text)] font-medium">{{ r.title }}</div>
              <div class="text-[color:var(--text-tertiary)]">{{ r.subtitle }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, nextTick, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MagnifyingGlassIcon, BellIcon, ChevronDownIcon, ClipboardDocumentListIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

export default {
  name: 'VendorNavbar',
  components: { MagnifyingGlassIcon, BellIcon, ChevronDownIcon, ClipboardDocumentListIcon, CheckCircleIcon, ExclamationTriangleIcon },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const pageTitle = computed(() => route.meta?.title || route.name || '');
    const showNotifications = ref(false);
    const showUserMenu = ref(false);
    const showSearch = ref(false);
    const searchQuery = ref('');
    const searchInput = ref(null);

    const currentUser = ref({ name: 'Vendor', avatar: '/images/vendor-avatar.jpg' });
    const unreadCount = ref(2);
    const recentNotifications = ref([
      { id: 1, type: 'order', message: 'New order received', timestamp: new Date(), read: false },
      { id: 2, type: 'payment', message: 'Payout processed: ₹12,500', timestamp: new Date(Date.now()-3600000), read: true }
    ]);
    const searchResults = ref([]);

    const toggleNotifications = () => { showNotifications.value = !showNotifications.value; showUserMenu.value = false; };
    const toggleUserMenu = () => { showUserMenu.value = !showUserMenu.value; showNotifications.value = false; };

    const openSearch = async () => { showSearch.value = true; await nextTick(); searchInput.value?.focus(); };
    const closeSearch = () => { showSearch.value = false; searchQuery.value=''; searchResults.value=[]; };

    const getNotificationIcon = (t) => t==='order'? 'ClipboardDocumentListIcon' : (t==='payment'? 'CheckCircleIcon' : 'ExclamationTriangleIcon');
    const getNotificationIconClass = (t) => t==='order'? 'bg-blue-100 text-blue-600' : (t==='payment'? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600');

    const formatTime = (ts) => {
      const diff = Date.now()-ts.getTime();
      const m = Math.floor(diff/60000); if (m<1) return 'Just now'; if (m<60) return m+'m ago'; const h=Math.floor(m/60); if (h<24) return h+'h ago'; const d=Math.floor(h/24); return d+'d ago';
    };

    const getSearchResultIcon = (t) => t==='product'? 'ClipboardDocumentListIcon' : 'MagnifyingGlassIcon';
    const performSearch = () => { if(!searchQuery.value.trim()) return; searchResults.value=[{id:1,type:'product',title:'iPhone Case',subtitle:'Accessories > Cases'}]; };

    watch(searchQuery, q => { if (q.length>2) performSearch(); else searchResults.value=[]; });

    onMounted(() => { document.addEventListener('click', (e)=>{ const t=e.target; if (!t.closest) return; if(!t.closest('[aria-label="Notifications"]') && !t.closest('.notifications')) showNotifications.value=false; if(!t.closest('.user-menu')) showUserMenu.value=false; }); });

    const markAllRead = () => { unreadCount.value=0; recentNotifications.value = recentNotifications.value.map(n=>({...n,read:true})); };
    const markAsRead = (id) => { const n=recentNotifications.value.find(x=>x.id===id); if(n && !n.read){ n.read=true; unreadCount.value=Math.max(0, unreadCount.value-1);} };

    return { pageTitle, showNotifications, showUserMenu, showSearch, searchQuery, searchInput, currentUser, unreadCount, recentNotifications, toggleNotifications, toggleUserMenu, openSearch, closeSearch, getNotificationIcon, getNotificationIconClass, formatTime, getSearchResultIcon, performSearch, markAllRead, markAsRead };
  }
};
</script>
