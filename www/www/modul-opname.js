// ============================================================================
// MODUL 6: STOCK OPNAME (INPUT BARANG, STOK FISIK, PENYESUAIAN OTOMATIS, & DETAIL)
// ============================================================================

(function() {
    // 1. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- === 1. LAYAR UTAMA STOCK OPNAME (SS 1000922484 & 1000922490) === -->
        <div id="view-opname" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <!-- Header Stock Opname -->
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="switchView('pos')" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Stock Opname</h2>
            </div>

            <!-- Filter Tanggal -->
            <div class="p-4 bg-white">
                <div class="relative">
                    <div class="w-full border border-gray-300 rounded-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-gray-900 bg-white">
                        <div class="flex items-center space-x-3">
                            <i class="fa-regular fa-calendar text-emerald-600 text-base"></i>
                            <select id="opname-date-filter" onchange="renderOpnameHistoryList()" class="bg-transparent font-bold text-gray-900 focus:outline-none appearance-none pr-6 cursor-pointer">
                                <option value="today" id="opt-opname-today">Today (12 Oct 2026)</option>
                                <option value="all">Semua Tanggal</option>
                            </select>
                        </div>
                        <i class="fa-solid fa-chevron-down text-gray-700 text-xs pointer-events-none"></i>
                    </div>
                </div>
            </div>

            <!-- Empty State: Belum ada Stok Tercatat (SS 1000922484) -->
            <div id="opname-empty-state" class="flex-1 flex flex-col items-center justify-start pt-8 text-center">
                <p class="text-xs font-semibold text-gray-400">Belum ada Stok Tercatat</p>
            </div>

            <!-- Daftar Riwayat Stock Opname (SS 1000922490) -->
            <div id="opname-history-list" class="flex-1 overflow-y-auto divide-y divide-gray-200 border-t border-gray-100 hidden"></div>

            <!-- Tombol Sticky Bawah: TAMBAH STOCK OPNAME -->
            <div class="p-4 bg-white border-t">
                <button onclick="openInputBarangOpnameView()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider flex items-center justify-center">
                    TAMBAH STOCK OPNAME
                </button>
            </div>
        </div>

        <!-- === 2. LAYAR INPUT BARANG STOCK OPNAME (SS 1000922492 & 1000922486) === -->
        <div id="view-opname-input" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <!-- Header Input Barang -->
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeInputBarangOpnameView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Input Barang</h2>
            </div>

            <!-- Segmented Tabs: Pilih Barang | Daftar (0) -->
            <div class="p-4 pb-2 bg-white">
                <div class="bg-slate-100 p-1 rounded-lg grid grid-cols-2 text-xs font-bold border border-gray-200">
                    <button id="tab-opname-pilih" onclick="switchOpnameInputTab('pilih')" type="button" class="py-2.5 rounded-md bg-white text-gray-900 shadow-2xs transition">
                        Pilih Barang
                    </button>
                    <button id="tab-opname-daftar" onclick="switchOpnameInputTab('daftar')" type="button" class="py-2.5 rounded-md text-gray-600 hover:text-gray-900 transition">
                        Daftar (<span id="opname-selected-count">0</span>)
                    </button>
                </div>
            </div>

            <!-- Baris Pencarian & Barcode (Hanya Muncul di Tab Pilih Barang - SS 1000922492) -->
            <div id="opname-search-bar-wrapper" class="px-4 py-2 bg-white flex items-center space-x-3">
                <input type="text" id="opname-search-input" oninput="renderOpnamePilihBarangList(this.value)" placeholder="Cari nama atau kode barang" class="flex-1 border border-emerald-600 rounded-md px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none">
                <button onclick="openOpnameBarcodeScanner()" type="button" class="text-emerald-700 hover:text-emerald-900 text-2xl px-1 transition" title="Scan Barcode Barang">
                    <i class="fa-solid fa-barcode"></i>
                </button>
            </div>

            <!-- Konten Tab 1: Daftar Semua Barang (Pilih Barang) -->
            <div id="container-opname-pilih-list" class="flex-1 overflow-y-auto divide-y divide-gray-100 px-2"></div>

            <!-- Konten Tab 2: Daftar Barang yang Sudah Diinput Stok Fisiknya (SS 1000922486) -->
            <div id="container-opname-daftar-list" class="flex-1 overflow-y-auto divide-y divide-gray-100 px-2 pb-24 hidden"></div>

            <!-- Tombol Sticky Bawah: SIMPAN STOCK OPNAME (Muncul di Tab Daftar - SS 1000922486) -->
            <div id="footer-opname-save-btn" class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10 hidden">
                <button onclick="openOpnameConfirmModal()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-md shadow-lg transition active:scale-95 text-xs uppercase tracking-wider flex items-center justify-center">
                    SIMPAN STOCK OPNAME
                </button>
            </div>
        </div>

        <!-- === 3. LAYAR DETAIL STOCK OPNAME (SS 1000922491) === -->
        <div id="view-opname-detail" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="closeDetailOpnameView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700">Detail Stock Opname</h2>
                </div>
                <button id="btn-header-adjust-now" onclick="adjustPendingOpnameNow()" class="hidden bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-xs transition">
                    Sesuaikan Sekarang
                </button>
            </div>

            <div class="flex-1 overflow-y-auto">
                <!-- Keterangan Opname -->
                <div class="px-4 py-3 border-b border-gray-100">
                    <span class="text-[11px] text-gray-500 block">Keterangan</span>
                    <span class="text-xs font-bold text-gray-900 block mt-0.5" id="detail-opname-notes">-</span>
                </div>

                <!-- Daftar Item Barang dalam Stock Opname -->
                <div id="container-detail-opname-items" class="divide-y divide-gray-200"></div>
            </div>
        </div>
    `;

    // 2. SUNTIKKAN HTML MODALS KE DALAM #modals-container
    const modalsHTML = `
        <!-- === POPUP INPUT / EDIT STOK FISIK (SS 1000922485 & 1000922487) === -->
        <div id="modal-opname-stok-fisik" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-md w-full max-w-xs overflow-hidden shadow-2xl">
                <div class="py-4 text-center border-b border-gray-200">
                    <h3 class="font-extrabold text-xs text-gray-900 tracking-wide">Stok Fisik</h3>
                </div>

                <div class="p-5 space-y-3 text-xs">
                    <div>
                        <span class="text-gray-500 font-medium block mb-0.5">Kode Barang</span>
                        <span class="font-bold text-sm text-gray-900 block" id="popup-opname-sku">-</span>
                    </div>
                    <div>
                        <span class="text-gray-500 font-medium block mb-0.5">Nama Barang</span>
                        <span class="font-bold text-sm text-gray-900 block" id="popup-opname-name">-</span>
                    </div>
                    <div>
                        <span class="text-gray-500 font-medium block mb-2">Stok Fisik</span>
                        <div class="flex items-center justify-between px-4 py-2">
                            <button onclick="changeOpnamePhysicalQty(-1)" type="button" class="w-10 h-10 text-2xl font-bold text-gray-900 flex items-center justify-center hover:bg-gray-100 rounded-full transition">
                                <i class="fa-solid fa-minus text-lg"></i>
                            </button>
                            <input type="number" id="input-opname-physical-qty" value="0" step="any" class="w-24 text-center text-xl font-bold text-gray-900 focus:outline-none border-b border-transparent focus:border-emerald-500">
                            <button onclick="changeOpnamePhysicalQty(1)" type="button" class="w-10 h-10 text-2xl font-bold text-gray-900 flex items-center justify-center hover:bg-gray-100 rounded-full transition">
                                <i class="fa-solid fa-plus text-lg"></i>
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3 pt-3">
                        <!-- Tombol Kiri: BATAL (Saat Pilih Barang) atau HAPUS (Saat di Tab Daftar) -->
                        <button id="btn-opname-physical-left" onclick="handleLeftBtnPhysicalModal()" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-full font-extrabold text-xs uppercase shadow-xs transition">
                            BATAL
                        </button>
                        <button onclick="confirmOpnamePhysicalModal()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full font-extrabold text-xs uppercase shadow-md transition">
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- === POPUP KONFIRMASI SIMPAN STOCK OPNAME (SS 1000922488) === -->
        <div id="modal-opname-confirm" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-md w-full max-w-xs overflow-hidden shadow-2xl">
                <div class="py-4 text-center border-b border-gray-200">
                    <h3 class="font-extrabold text-xs text-gray-900 tracking-wide">Konfirmasi</h3>
                </div>
                <div class="p-5 space-y-4 text-xs">
                    <div>
                        <label class="block text-gray-500 font-medium mb-1.5">Keterangan</label>
                        <input type="text" id="input-opname-confirm-notes" placeholder="Keterangan (Opsional)" class="w-full border border-emerald-600 rounded-md p-3 text-xs text-gray-900 focus:outline-none">
                    </div>
                    <p class="text-center text-gray-800 font-medium leading-relaxed px-2">
                        Apakah anda yakin untuk menyimpan data Stok Opname ?
                    </p>
                    <div class="grid grid-cols-2 gap-3 pt-1">
                        <button onclick="closeOpnameConfirmModal()" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-full font-extrabold text-xs uppercase shadow-xs transition">
                            BATAL
                        </button>
                        <button onclick="submitOpnameConfirmModal()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full font-extrabold text-xs uppercase shadow-md transition">
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- === POPUP SESUAIKAN STOK OTOMATIS DI APLIKASI (SS 1000922489) === -->
        <div id="modal-opname-adjust" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl w-full max-w-xs overflow-hidden shadow-2xl p-6 text-center space-y-4">
                <h3 class="font-extrabold text-xs uppercase tracking-wider text-gray-900">SESUAIKAN STOK</h3>
                
                <div class="w-12 h-12 rounded-full border-2 border-emerald-600 text-emerald-600 flex items-center justify-center text-2xl font-bold mx-auto">
                    !
                </div>

                <p class="text-xs text-gray-800 font-medium leading-relaxed">
                    Segera sesuaikan stok produk di aplikasi secara otomatis mengikuti hasil Stok Fisik!
                </p>

                <div class="grid grid-cols-2 gap-3 pt-2">
                    <button onclick="finalizeOpnameAdjustment(false)" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-full font-extrabold text-xs uppercase shadow-xs transition">
                        NANTI SAJA
                    </button>
                    <button onclick="finalizeOpnameAdjustment(true)" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full font-extrabold text-xs uppercase shadow-md transition">
                        SESUAIKAN
                    </button>
                </div>
            </div>
        </div>
    `;

    // Pasang ke DOM
    const wsContainer = document.getElementById('workspace-container');
    if (wsContainer) wsContainer.insertAdjacentHTML('beforeend', viewsHTML);

    const mdContainer = document.getElementById('modals-container');
    if (mdContainer) mdContainer.insertAdjacentHTML('beforeend', modalsHTML);

    // ========================================================================
    // 3. STATE & LOGIKA JAVASCRIPT STOCK OPNAME
    // ========================================================================
    window.opnameHistory = JSON.parse(localStorage.getItem('pos_opname_history') || '[]');
    let currentOpnameDraft = []; // [{ id, sku, name, type, systemStock, physicalStock, diff }]
    let activeOpnameTab = 'pilih'; // 'pilih' atau 'daftar'
    let currentEditingProduct = null;
    let physicalModalSource = 'pilih'; // 'pilih' atau 'daftar'
    let pendingOpnameRecordId = null;
    let activeViewingOpnameRecord = null;

    // Hook pada switchView('opname') agar header utama disembunyikan & daftar opname otomatis dirender
    const originalSwitchView = window.switchView;
    window.switchView = function(viewName) {
        if (typeof originalSwitchView === 'function') {
            originalSwitchView(viewName);
        }
        if (viewName === 'opname') {
            const mainHeader = document.getElementById('main-header');
            if (mainHeader) mainHeader.classList.add('hidden');
            updateTodayOptionLabel();
            window.renderOpnameHistoryList();
        }
    };

    function updateTodayOptionLabel() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const d = new Date();
        const opt = document.getElementById('opt-opname-today');
        if (opt) {
            opt.innerText = `Today (${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()})`;
        }
    }

    function getOpnameTimestamp() {
        const d = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    // --- 1. RENDER DAFTAR RIWAYAT STOCK OPNAME (SS 1000922484 & 1000922490) ---
    window.renderOpnameHistoryList = function() {
        const emptyEl = document.getElementById('opname-empty-state');
        const listEl = document.getElementById('opname-history-list');
        if (!emptyEl || !listEl) return;

        const filterMode = document.getElementById('opname-date-filter')?.value || 'today';
        const todayPrefix = getOpnameTimestamp().split(' ')[0];

        let filtered = [...(window.opnameHistory || [])];
        if (filterMode === 'today') {
            filtered = filtered.filter(rec => (rec.date || '').startsWith(todayPrefix));
        }

        if (filtered.length === 0) {
            emptyEl.classList.remove('hidden');
            listEl.classList.add('hidden');
            return;
        }

        emptyEl.classList.add('hidden');
        listEl.classList.remove('hidden');
        listEl.innerHTML = '';

        filtered.forEach(rec => {
            // Ikon status: jika sudah disesuaikan tampilkan centang hijau, jika belum tampilkan tanda seru merah (SS 1000922490)
            const statusIcon = rec.adjusted
                ? `<span class="w-5 h-5 rounded-full border-2 border-emerald-600 text-emerald-600 flex items-center justify-center text-[10px] font-bold"><i class="fa-solid fa-check"></i></span>`
                : `<span class="w-5 h-5 rounded-full border-2 border-red-700 text-red-700 flex items-center justify-center text-xs font-extrabold">!</span>`;

            listEl.innerHTML += `
                <div onclick="openDetailOpnameView('${rec.id}')" class="px-4 py-3.5 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="grid grid-cols-2 gap-6 flex-1 pr-4">
                        <div>
                            <span class="text-[11px] text-gray-500 block">Tanggal</span>
                            <span class="text-xs font-extrabold text-gray-900 block mt-0.5">${rec.date}</span>
                        </div>
                        <div>
                            <span class="text-[11px] text-gray-500 block">Nama</span>
                            <span class="text-xs font-extrabold text-gray-900 block mt-0.5">${rec.user || 'Adm'}</span>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4 flex-shrink-0">
                        ${statusIcon}
                        <i class="fa-solid fa-chevron-right text-gray-800 text-xs"></i>
                    </div>
                </div>
            `;
        });
    };

    // --- 2. BUKA HALAMAN INPUT BARANG STOCK OPNAME (SS 1000922492) ---
    window.openInputBarangOpnameView = () => {
        currentOpnameDraft = [];
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-opname-input').classList.remove('hidden');
        document.getElementById('opname-search-input').value = '';
        updateOpnameSelectedCount();
        window.switchOpnameInputTab('pilih');
    };

    window.closeInputBarangOpnameView = () => {
        if (currentOpnameDraft.length > 0 && !confirm("Batalkan proses input Stock Opname yang sedang berjalan?")) {
            return;
        }
        document.getElementById('view-opname-input').classList.add('hidden');
        document.getElementById('view-opname').classList.remove('hidden');
        window.renderOpnameHistoryList();
    };

    window.switchOpnameInputTab = (tab) => {
        activeOpnameTab = tab;
        const btnPilih = document.getElementById('tab-opname-pilih');
        const btnDaftar = document.getElementById('tab-opname-daftar');
        const searchWrapper = document.getElementById('opname-search-bar-wrapper');
        const pilihList = document.getElementById('container-opname-pilih-list');
        const daftarList = document.getElementById('container-opname-daftar-list');
        const footerBtn = document.getElementById('footer-opname-save-btn');

        if (tab === 'pilih') {
            btnPilih.className = "py-2.5 rounded-md bg-white text-gray-900 shadow-2xs transition";
            btnDaftar.className = "py-2.5 rounded-md text-gray-600 hover:text-gray-900 transition";
            searchWrapper.classList.remove('hidden');
            pilihList.classList.remove('hidden');
            daftarList.classList.add('hidden');
            footerBtn.classList.add('hidden');
            window.renderOpnamePilihBarangList(document.getElementById('opname-search-input').value);
        } else {
            btnDaftar.className = "py-2.5 rounded-md bg-white text-gray-900 shadow-2xs transition";
            btnPilih.className = "py-2.5 rounded-md text-gray-600 hover:text-gray-900 transition";
            searchWrapper.classList.add('hidden');
            pilihList.classList.add('hidden');
            daftarList.classList.remove('hidden');
            if (currentOpnameDraft.length > 0) {
                footerBtn.classList.remove('hidden');
            } else {
                footerBtn.classList.add('hidden');
            }
            window.renderOpnameDaftarTabList();
        }
    };

    function updateOpnameSelectedCount() {
        const badge = document.getElementById('opname-selected-count');
        if (badge) badge.innerText = currentOpnameDraft.length;
    }

    // Render Tab 1: Pilih Barang (SS 1000922492)
    window.renderOpnamePilihBarangList = function(keyword = '') {
        const container = document.getElementById('container-opname-pilih-list');
        if (!container) return;
        container.innerHTML = '';

        const k = (keyword || '').toLowerCase();
        const prods = (window.products || []).filter(p =>
            (p.name || '').toLowerCase().includes(k) ||
            (p.sku || '').toLowerCase().includes(k)
        );

        if (prods.length === 0) {
            container.innerHTML = `<div class="p-10 text-center text-gray-400 text-xs">Tidak ada data barang yang ditemukan.</div>`;
            return;
        }

        prods.forEach(p => {
            const initials = p.name ? p.name.trim().substring(0, 2) : 'RL';
            const inDraft = currentOpnameDraft.find(d => d.id === p.id);
            const rightBadge = inDraft
                ? `<span class="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">${inDraft.physicalStock}</span>`
                : '';

            container.innerHTML += `
                <div onclick="openPhysicalStockModal('${p.id}', 'pilih')" class="p-3 bg-white flex items-center justify-between hover:bg-emerald-50/40 active:bg-emerald-100/50 cursor-pointer transition rounded-lg">
                    <div class="flex items-center space-x-3.5 min-w-0 pr-3">
                        <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-base flex-shrink-0 overflow-hidden shadow-inner">
                            ${p.image ? `<img src="${p.image}" class="w-full h-full object-cover">` : initials}
                        </div>
                        <div class="min-w-0">
                            <h4 class="font-bold text-xs text-gray-900 truncate">${p.name}</h4>
                            <p class="text-[11px] text-gray-500 truncate mt-0.5">${p.sku || '-'}</p>
                        </div>
                    </div>
                    ${rightBadge}
                </div>
            `;
        });
    };

    // Render Tab 2: Daftar Barang yang Sudah Diinput (SS 1000922486)
    window.renderOpnameDaftarTabList = function() {
        const container = document.getElementById('container-opname-daftar-list');
        const footerBtn = document.getElementById('footer-opname-save-btn');
        if (!container) return;
        container.innerHTML = '';

        if (currentOpnameDraft.length === 0) {
            container.innerHTML = `<div class="p-10 text-center text-gray-400 text-xs">Belum ada barang yang dipilih untuk Stock Opname.</div>`;
            if (footerBtn) footerBtn.classList.add('hidden');
            return;
        }

        if (footerBtn) footerBtn.classList.remove('hidden');

        currentOpnameDraft.forEach(item => {
            const initials = item.name ? item.name.trim().substring(0, 2) : 'RL';
            container.innerHTML += `
                <div onclick="openPhysicalStockModal('${item.id}', 'daftar')" class="p-3 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition rounded-lg">
                    <div class="flex items-center space-x-3.5 min-w-0 pr-3">
                        <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-base flex-shrink-0 overflow-hidden shadow-inner">
                            ${item.image ? `<img src="${item.image}" class="w-full h-full object-cover">` : initials}
                        </div>
                        <div class="min-w-0">
                            <h4 class="font-bold text-xs text-gray-900 truncate">${item.name}</h4>
                            <p class="text-[11px] text-gray-500 truncate mt-0.5">${item.sku || '-'}</p>
                        </div>
                    </div>
                    <span class="px-2 h-5 min-w-[20px] rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        ${item.physicalStock}
                    </span>
                </div>
            `;
        });
    };

    // --- 3. POPUP STOK FISIK (SS 1000922485 & 1000922487) ---
    window.openPhysicalStockModal = (productId, source = 'pilih') => {
        const prod = (window.products || []).find(x => x.id === productId);
        if (!prod) return;

        currentEditingProduct = prod;
        physicalModalSource = source;

        const existingInDraft = currentOpnameDraft.find(d => d.id === productId);

        document.getElementById('popup-opname-sku').innerText = prod.sku || '-';
        document.getElementById('popup-opname-name').innerText = prod.name || '-';

        const qtyInput = document.getElementById('input-opname-physical-qty');
        if (source === 'daftar' && existingInDraft) {
            // Di tab Daftar, format desimal 5.0 seperti SS 1000922487
            qtyInput.value = Number(existingInDraft.physicalStock).toFixed(1);
        } else if (existingInDraft) {
            qtyInput.value = existingInDraft.physicalStock;
        } else {
            qtyInput.value = Number(prod.stock) || 0;
        }

        // Ubah teks tombol kiri: BATAL (jika dari Pilih Barang) atau HAPUS (jika dari Daftar)
        const leftBtn = document.getElementById('btn-opname-physical-left');
        if (source === 'daftar') {
            leftBtn.innerText = "HAPUS";
        } else {
            leftBtn.innerText = "BATAL";
        }

        document.getElementById('modal-opname-stok-fisik').classList.remove('hidden');
    };

    window.changeOpnamePhysicalQty = (delta) => {
        const input = document.getElementById('input-opname-physical-qty');
        let val = parseFloat(input.value) || 0;
        val += delta;
        if (val < 0) val = 0;
        input.value = physicalModalSource === 'daftar' ? val.toFixed(1) : val;
    };

    window.handleLeftBtnPhysicalModal = () => {
        if (physicalModalSource === 'daftar' && currentEditingProduct) {
            // Hapus produk dari daftar opname
            currentOpnameDraft = currentOpnameDraft.filter(d => d.id !== currentEditingProduct.id);
            updateOpnameSelectedCount();
            window.renderOpnameDaftarTabList();
        }
        document.getElementById('modal-opname-stok-fisik').classList.add('hidden');
    };

    window.confirmOpnamePhysicalModal = () => {
        if (!currentEditingProduct) return;
        const rawVal = parseFloat(document.getElementById('input-opname-physical-qty').value);
        const physicalQty = isNaN(rawVal) || rawVal < 0 ? 0 : rawVal;
        const systemQty = Number(currentEditingProduct.stock) || 0;
        const diffQty = physicalQty - systemQty;

        const prodTypeLabel = currentEditingProduct.type === 'Multisatuan' ? 'Multi Unit' : (currentEditingProduct.type || 'Default');

        const existingIdx = currentOpnameDraft.findIndex(d => d.id === currentEditingProduct.id);
        const itemData = {
            id: currentEditingProduct.id,
            sku: currentEditingProduct.sku || '-',
            name: currentEditingProduct.name || '-',
            image: currentEditingProduct.image || '',
            type: prodTypeLabel,
            systemStock: systemQty,
            physicalStock: physicalQty,
            diff: diffQty
        };

        if (existingIdx >= 0) {
            currentOpnameDraft[existingIdx] = itemData;
        } else {
            currentOpnameDraft.push(itemData);
        }

        updateOpnameSelectedCount();
        document.getElementById('modal-opname-stok-fisik').classList.add('hidden');

        if (activeOpnameTab === 'pilih') {
            window.renderOpnamePilihBarangList(document.getElementById('opname-search-input').value);
        } else {
            window.renderOpnameDaftarTabList();
        }
    };

    // --- SCANNER BARCODE UNTUK INPUT BARANG OPNAME ---
    window.openOpnameBarcodeScanner = () => {
        const code = prompt("Scan atau ketik Kode Barcode barang untuk Stock Opname:");
        if (!code || !code.trim()) return;
        const clean = code.trim().toLowerCase();
        const found = (window.products || []).find(p => (p.sku || '').toLowerCase() === clean || (p.name || '').toLowerCase().includes(clean));
        if (found) {
            window.openPhysicalStockModal(found.id, 'pilih');
        } else {
            document.getElementById('opname-search-input').value = code.trim();
            window.renderOpnamePilihBarangList(code.trim());
        }
    };

    // --- 4. KONFIRMASI & SESUAIKAN STOK OTOMATIS (SS 1000922488 & 1000922489) ---
    window.openOpnameConfirmModal = () => {
        if (currentOpnameDraft.length === 0) return alert("Pilih minimal 1 barang terlebih dahulu!");
        document.getElementById('input-opname-confirm-notes').value = '';
        document.getElementById('modal-opname-confirm').classList.remove('hidden');
    };

    window.closeOpnameConfirmModal = () => {
        document.getElementById('modal-opname-confirm').classList.add('hidden');
    };

    window.submitOpnameConfirmModal = () => {
        const notes = document.getElementById('input-opname-confirm-notes').value.trim() || '-';
        window.closeOpnameConfirmModal();

        // Buat record Stock Opname baru
        const newRec = {
            id: 'opn_' + Date.now(),
            date: getOpnameTimestamp(),
            user: window.activeKasir === 'Owner' ? 'Adm' : (window.activeKasir || 'Adm'),
            notes: notes,
            adjusted: false,
            items: [...currentOpnameDraft]
        };

        window.opnameHistory.unshift(newRec);
        localStorage.setItem('pos_opname_history', JSON.stringify(window.opnameHistory));
        pendingOpnameRecordId = newRec.id;
        currentOpnameDraft = [];

        // Kembali ke halaman utama Stock Opname & munculkan Popup SESUAIKAN STOK (SS 1000922489)
        document.getElementById('view-opname-input').classList.add('hidden');
        document.getElementById('view-opname').classList.remove('hidden');
        window.renderOpnameHistoryList();
        document.getElementById('modal-opname-adjust').classList.remove('hidden');
    };

    window.finalizeOpnameAdjustment = async (applyNow) => {
        document.getElementById('modal-opname-adjust').classList.add('hidden');
        const rec = (window.opnameHistory || []).find(r => r.id === pendingOpnameRecordId);
        if (!rec) return;

        if (applyNow) {
            await applyStockOpnameToProducts(rec);
            alert("Stok barang di aplikasi telah berhasil disesuaikan secara otomatis dengan Stok Fisik!");
        }
        window.renderOpnameHistoryList();
    };

    async function applyStockOpnameToProducts(rec) {
        if (!rec || rec.adjusted) return;
        for (let item of (rec.items || [])) {
            const prod = (window.products || []).find(p => p.id === item.id);
            if (prod) {
                prod.stock = Number(item.physicalStock);
                if (Array.isArray(prod.stockBatches) && prod.stockBatches.length > 0) {
                    prod.stockBatches[0].stock = Number(item.physicalStock);
                }
                if (window.fb && window.db && !String(prod.id).startsWith('local_')) {
                    try {
                        await window.fb.updateDoc(window.fb.doc(window.db, "products", prod.id), {
                            stock: Number(item.physicalStock),
                            updatedAt: window.fb.serverTimestamp()
                        });
                    } catch (e) {}
                }
            }
        }
        rec.adjusted = true;
        localStorage.setItem('pos_opname_history', JSON.stringify(window.opnameHistory));
        if (window.renderInventoryCards) window.renderInventoryCards(window.products);
    }

    // --- 5. HALAMAN DETAIL STOCK OPNAME (SS 1000922491) ---
    window.openDetailOpnameView = (recId) => {
        const rec = (window.opnameHistory || []).find(r => r.id === recId);
        if (!rec) return;
        activeViewingOpnameRecord = rec;

        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-opname-detail').classList.remove('hidden');

        document.getElementById('detail-opname-notes').innerText = rec.notes || '-';

        const btnAdjustNow = document.getElementById('btn-header-adjust-now');
        if (rec.adjusted) {
            btnAdjustNow.classList.add('hidden');
        } else {
            btnAdjustNow.classList.remove('hidden');
        }

        const container = document.getElementById('container-detail-opname-items');
        container.innerHTML = '';

        (rec.items || []).forEach(item => {
            const statusText = rec.adjusted
                ? `<span class="text-xs font-bold text-emerald-600">Sudah disesuaikan</span>`
                : `<span class="text-xs font-bold text-red-700">Not done yet</span>`;

            container.innerHTML += `
                <div class="p-4 bg-white space-y-3 text-xs">
                    <div class="grid grid-cols-12 gap-2">
                        <div class="col-span-3">
                            <span class="text-[11px] text-gray-500 block">Kode Barang</span>
                            <span class="font-bold text-gray-900 block mt-0.5 truncate">${item.sku}</span>
                        </div>
                        <div class="col-span-6">
                            <span class="text-[11px] text-gray-500 block">Nama Barang</span>
                            <span class="font-bold text-gray-900 block mt-0.5 truncate">${item.name}</span>
                        </div>
                        <div class="col-span-3 text-right">
                            <span class="text-[11px] text-gray-500 block">Tipe Barang</span>
                            <span class="font-bold text-gray-900 block mt-0.5">${item.type || 'Default'}</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2">
                        <div class="col-span-3">
                            <span class="text-[11px] text-gray-500 block">Stok Sistem</span>
                            <span class="font-bold text-gray-900 block mt-0.5">${item.systemStock}</span>
                        </div>
                        <div class="col-span-6">
                            <span class="text-[11px] text-gray-500 block">Stok Fisik</span>
                            <span class="font-bold text-gray-900 block mt-0.5">${item.physicalStock}</span>
                        </div>
                        <div class="col-span-3 text-right">
                            <span class="text-[11px] text-gray-500 block">Selisih</span>
                            <span class="font-bold text-gray-900 block mt-0.5">${item.diff}</span>
                        </div>
                    </div>

                    <div class="text-right pt-0.5">
                        ${statusText}
                    </div>
                </div>
            `;
        });
    };

    window.closeDetailOpnameView = () => {
        document.getElementById('view-opname-detail').classList.add('hidden');
        document.getElementById('view-opname').classList.remove('hidden');
        window.renderOpnameHistoryList();
    };

    window.adjustPendingOpnameNow = async () => {
        if (!activeViewingOpnameRecord) return;
        await applyStockOpnameToProducts(activeViewingOpnameRecord);
        window.openDetailOpnameView(activeViewingOpnameRecord.id);
        alert("Stok barang berhasil disesuaikan dengan Stok Fisik!");
    };
})();
