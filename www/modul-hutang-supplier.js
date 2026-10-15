// ============================================================================
// MODUL 8: MANAJEMEN HUTANG SUPPLIER (BUKU KASBON)
// (FIX: UI KLASIK, NATIVE DATE PICKER, & PENGHAPUSAN KALENDER MANUAL)
// ============================================================================

(function() {
    // 1. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- === 1. HALAMAN DAFTAR UTAMA HUTANG === -->
        <div id="view-hutang-main" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-20">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-20">
                <div class="flex items-center space-x-3">
                    <button onclick="switchView('debts')" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700 tracking-wide">Hutang ke Supplier</h2>
                </div>
            </div>

            <!-- Baris Sortir, Pencarian, & Filter Tanggal Native -->
            <div class="p-3 bg-white flex items-center space-x-2 relative z-20 border-b shadow-xs">
                <div class="relative">
                    <button onclick="document.getElementById('dropdown-hutang-main-sort').classList.toggle('hidden')" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                    <div id="dropdown-hutang-main-sort" class="absolute left-0 top-10 w-52 bg-white rounded-md shadow-2xl border border-gray-100 py-1 hidden z-50 text-xs font-bold text-gray-900">
                        <button onclick="applyHutangMainSort('due')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block border-b border-gray-50">Jatuh Tempo Terdekat</button>
                        <button onclick="applyHutangMainSort('name')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block border-b border-gray-50">Nama Supplier</button>
                        <button onclick="applyHutangMainSort('latest')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Transaksi Terbaru</button>
                    </div>
                </div>

                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" id="hutang-main-search" oninput="renderHutangMainList()" placeholder="Nama Supplier" class="w-full pl-10 pr-3 py-2 border border-emerald-600 rounded-full text-xs text-gray-900 focus:outline-none">
                </div>

                <!-- NATIVE DATE FILTER -->
                <input type="date" id="hutang-main-due-filter" onchange="renderHutangMainList()" class="w-10 h-10 border border-emerald-600 rounded-full text-transparent bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer flex-shrink-0" style="background-image: url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 448 512\\'><path fill=\\'%23059669\\' d=\\'M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h352v256c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z\\'/></svg>'); background-repeat: no-repeat; background-position: center; background-size: 16px;">
            </div>

            <!-- Konten Daftar Hutang -->
            <div class="flex-1 overflow-y-auto px-4 pb-24 space-y-4 bg-gray-50 pt-4" onclick="document.getElementById('dropdown-hutang-main-sort').classList.add('hidden')">
                
                <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                    <div>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Total Sisa Hutang</span>
                        <span class="text-xl font-extrabold block mt-0.5 text-red-600" id="hutang-main-total-sisa">Rp 0</span>
                    </div>
                    <div class="text-right border-l border-gray-100 pl-4">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Tagihan</span>
                        <span class="text-xl font-extrabold block mt-0.5 text-gray-900" id="hutang-main-total-trx">0</span>
                    </div>
                </div>

                <div class="flex items-center space-x-6 pt-1 text-xs font-bold text-gray-800">
                    <label class="flex items-center space-x-2.5 cursor-pointer">
                        <input type="checkbox" id="chk-hutang-belum-lunas" checked onchange="renderHutangMainList()" class="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                        <span>Belum Lunas</span>
                    </label>
                    <label class="flex items-center space-x-2.5 cursor-pointer">
                        <input type="checkbox" id="chk-hutang-lunas" onchange="renderHutangMainList()" class="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                        <span>Lunas</span>
                    </label>
                </div>

                <div id="container-hutang-main-rows" class="space-y-3"></div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="openTambahHutangManualView()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    CATAT HUTANG BARU
                </button>
            </div>
        </div>

        <!-- === 2. HALAMAN TAMBAH HUTANG MANUAL === -->
        <div id="view-tambah-hutang-manual" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-30">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeTambahHutangManualView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold tracking-wide text-emerald-700">Catat Hutang Manual</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 pb-28 space-y-5 bg-gray-50">
                <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">Nominal Tagihan / Hutang</label>
                    <div class="flex items-center justify-center border-b-2 border-emerald-600 pb-2 mb-4">
                        <span class="text-2xl font-extrabold text-emerald-700 mr-2">Rp</span>
                        <input type="number" id="input-manual-hutang-nominal" placeholder="0" class="w-40 text-3xl font-black text-gray-900 text-center focus:outline-none bg-transparent" pattern="[0-9]*" inputmode="numeric">
                    </div>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Pilih Supplier<span class="text-red-500">*</span></label>
                        <div class="relative">
                            <select id="select-manual-hutang-sup" class="w-full border border-gray-300 rounded-full p-3.5 px-4 text-xs font-bold text-gray-900 bg-white focus:outline-none focus:border-emerald-600 shadow-sm appearance-none"></select>
                            <i class="fa-solid fa-chevron-down absolute right-4 top-4 text-gray-500 pointer-events-none"></i>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Tanggal Jatuh Tempo</label>
                        <!-- NATIVE DATE INPUT -->
                        <input type="date" id="input-manual-hutang-due" class="w-full border border-gray-300 rounded-full p-3.5 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm bg-white">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Keterangan / Alasan</label>
                        <textarea id="input-manual-hutang-notes" rows="2" placeholder="Catatan opsional" class="w-full border border-gray-300 rounded-2xl p-3.5 text-xs font-medium text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm"></textarea>
                    </div>

                    <div class="pt-2 pl-1">
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="chk-manual-hutang-cashdrawer" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                            <span class="text-xs font-bold text-gray-900">Catat sebagai hutang Cashdrawer</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="saveManualHutangBaru()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN HUTANG
                </button>
            </div>
        </div>

        <!-- === 3. HALAMAN KREDIT/HUTANG PER SUPPLIER === -->
        <div id="view-supplier-hutang" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-30">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-20">
                <div class="flex items-center space-x-3">
                    <button onclick="closeSupplierHutangView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold tracking-wide text-emerald-700">Rincian Hutang</h2>
                </div>
            </div>

            
            <div class="flex-1 overflow-y-auto p-4 pb-24 space-y-4 bg-gray-50" onclick="document.getElementById('dropdown-sup-hutang-sort').classList.add('hidden')">
                <div class="bg-white rounded-2xl p-5 space-y-3 shadow-sm border border-gray-100">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm" id="sup-hutang-avatar">SP</div>
                        <span class="font-extrabold text-sm text-gray-900" id="sup-hutang-title-name">-</span>
                    </div>
                    <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3 text-xs">
                        <div>
                            <span class="text-gray-500 font-semibold block">Total Sisa Hutang</span>
                            <span class="font-black text-red-600 text-base mt-0.5 block" id="sup-hutang-amount-disp">Rp 0</span>
                        </div>
                        <div class="text-right">
                            <span class="text-gray-500 font-semibold block">Total Tagihan</span>
                            <span class="font-black text-gray-900 text-base mt-0.5 block" id="sup-hutang-count-disp">0</span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center space-x-2 relative z-20">
                    <div class="relative">
                        <button onclick="event.stopPropagation(); document.getElementById('dropdown-sup-hutang-sort').classList.toggle('hidden')" type="button" class="text-emerald-700 text-xl px-2 py-1">
                            <i class="fa-solid fa-arrow-up-wide-short"></i>
                        </button>
                        <div id="dropdown-sup-hutang-sort" class="absolute left-0 top-10 w-48 bg-white rounded-md shadow-2xl border border-gray-100 py-1 hidden z-50 text-xs font-bold text-gray-900">
                            <button onclick="applySupHutangTransactionSort('latest')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block border-b border-gray-50">Transaksi Terbaru</button>
                            <button onclick="applySupHutangTransactionSort('due')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Jatuh Tempo</button>
                        </div>
                    </div>

                    <!-- NATIVE DATE FILTER -->
                    <input type="date" id="sup-hutang-date-filter-native" onchange="renderSupplierHutangTransactions()" class="flex-1 border border-emerald-600 rounded-full p-2.5 px-4 text-xs font-bold text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                </div>

                <div class="flex justify-between items-center pt-2">
                    <label class="flex items-center space-x-3 text-xs font-bold text-gray-900 cursor-pointer">
                        <input type="checkbox" id="chk-sup-hutang-select-all" onchange="toggleSelectAllSupHutangTransactions(this.checked)" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                        <span>Pilih Semua</span>
                    </label>
                    <select id="select-sup-hutang-status-filter" onchange="renderSupplierHutangTransactions()" class="border border-emerald-600 rounded-full px-4 py-2 text-xs font-bold text-emerald-700 bg-white focus:outline-none appearance-none">
                        <option value="unpaid">Belum Lunas</option>
                        <option value="paid">Lunas</option>
                    </select>
                </div>

                <div id="container-sup-debt-rows" class="space-y-3 pt-1"></div>
            </div>

            <div id="bar-sup-hutang-checked-lunasi" class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-30 hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <button onclick="openLunasiSekaligusHutangView('checked')" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-full shadow-lg flex justify-between items-center text-xs transition active:scale-95 uppercase tracking-wider">
                    <span>Bayar Tagihan</span>
                    <span id="label-sup-hutang-checked-total" class="font-black bg-white/20 px-3 py-1 rounded-md">Rp 0</span>
                </button>
            </div>
        </div>

        <!-- === 4. HALAMAN DETAIL ITEM HUTANG SUPPLIER & HISTORY === -->
        <div id="view-detail-hutang-item" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeDetailHutangItemView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold tracking-wide text-emerald-700">Detail Tagihan</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 pb-28 space-y-4 bg-gray-50 text-xs">
                <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                    <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                        <span class="font-extrabold text-sm text-gray-900" id="det-hutang-sup-name">-</span>
                        <span id="det-hutang-status-badge" class="px-3 py-1 rounded-full text-[10px] font-bold text-white bg-red-600">Belum lunas</span>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-gray-500 font-semibold block">Tgl Transaksi</span>
                            <span class="font-bold text-gray-900 block mt-1" id="det-hutang-trx-date">-</span>
                        </div>
                        <div class="text-right">
                            <span class="text-gray-500 font-semibold block">Jatuh Tempo</span>
                            <span class="font-bold text-gray-900 block mt-1" id="det-hutang-due-date">-</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
                        <div>
                            <span class="text-gray-500 font-semibold block">Total Tagihan Awal</span>
                            <span class="font-black text-gray-900 text-sm block mt-1" id="det-hutang-total">Rp 0</span>
                        </div>
                        <div class="text-right">
                            <span class="text-gray-500 font-semibold block">Sisa Belum Dibayar</span>
                            <span class="font-black text-red-600 text-sm block mt-1" id="det-hutang-unpaid">Rp 0</span>
                        </div>
                    </div>
                </div>

                <div class="text-center font-extrabold text-gray-400 uppercase tracking-widest text-[10px] pt-4 pb-1">
                    Histori Cicilan Pembayaran Ke Supplier
                </div>

                <div id="container-det-hutang-history" class="space-y-3"></div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10" id="footer-det-hutang-bayar">
                <button onclick="openLunasiSekaligusHutangView('single')" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    BAYAR KE SUPPLIER
                </button>
            </div>
        </div>

        <!-- === 5. HALAMAN PEMBAYARAN KASIR HUTANG (LUNASI SEKALIGUS) === -->
        <div id="view-lunasi-sekaligus-hutang" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-50">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeLunasiSekaligusHutangView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold tracking-wide text-emerald-700" id="header-pay-hutang-title">Pembayaran Hutang</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 pb-28 space-y-5 bg-gray-50">
                <div class="bg-red-50 border border-red-100 rounded-2xl p-4 flex justify-between items-center text-xs">
                    <span class="font-bold text-gray-700" id="pay-hutang-sup-name">-</span>
                    <div class="text-right">
                        <span class="text-red-400 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">Total Dibayar</span>
                        <span class="text-base font-black text-red-700 block" id="pay-hutang-unpaid-disp">Rp 0</span>
                    </div>
                </div>

                <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-5">
                    <div>
                        <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">Nominal Dikeluarkan</label>
                        <div class="flex items-center justify-center border-b-2 border-emerald-600 pb-2 mb-2">
                            <span class="text-2xl font-extrabold text-emerald-700 mr-2">Rp</span>
                            <input type="number" id="input-pay-hutang-nominal" value="0" class="w-40 text-3xl font-black text-gray-900 text-center focus:outline-none bg-transparent" pattern="[0-9]*" inputmode="numeric">
                        </div>
                        <label class="flex items-center justify-center space-x-2 cursor-pointer mt-3">
                            <input type="checkbox" id="chk-pay-hutang-lunasi" onchange="toggleLunasiFullSingleHutang(this.checked)" class="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                            <span class="text-[11px] font-bold text-emerald-700 uppercase">Lunasi Penuh Tagihan Ini</span>
                        </label>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Waktu Pembayaran Aktual</label>
                        <!-- NATIVE DATETIME LOCAL -->
                        <input type="datetime-local" id="input-pay-hutang-date" class="w-full bg-white border border-gray-300 rounded-full p-3.5 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Metode Bayar / Kas Keluar</label>
                        <div class="relative">
                            <select id="select-pay-hutang-method" class="w-full bg-white border border-gray-300 rounded-full p-3.5 px-4 text-xs font-bold text-gray-900 appearance-none focus:outline-none focus:border-emerald-600 shadow-sm">
                                <option value="Cash">Cash (Tunai)</option>
                                <option value="Transfer Bank">Transfer Bank</option>
                                <option value="Saldo E-Wallet">Saldo E-Wallet</option>
                            </select>
                            <i class="fa-solid fa-chevron-down text-gray-500 text-xs absolute right-4 top-4 pointer-events-none"></i>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Keterangan Tambahan</label>
                        <textarea id="input-pay-hutang-notes" rows="2" placeholder="Catatan pengeluaran" class="w-full bg-white border border-gray-300 rounded-2xl p-3.5 text-xs font-medium text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm"></textarea>
                    </div>

                    <div class="pt-1 pl-1">
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="chk-pay-hutang-cashdrawer" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                            <span class="text-xs font-bold text-gray-900">Potong dari Cashdrawer Hari Ini</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="submitPembayaranHutangSupplier()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    KONFIRMASI BAYAR
                </button>
            </div>
        </div>
    `;

    // Pasang ke DOM
    const wsContainer = document.getElementById('workspace-container');
    if (wsContainer) wsContainer.insertAdjacentHTML('beforeend', viewsHTML);

    // ========================================================================
    // 3. LOGIKA STATE & SCRIPT NATIVE DATE
    // ========================================================================
    let hutangMainSortBy = 'latest'; 
    let activeHutangSupplier = null;
    let supHutangReturnView = 'view-hutang-main';
    let supHutangSortBy = 'latest';
    let activeHutangItem = null;
    let hutangPayMode = 'single'; 
    let currentHutangPayTargetAmount = 0;

    // Format YYYY-MM-DD untuk input type="date"
    function getNativeDateOnly(d = new Date()) {
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().split('T')[0];
    }

    // Format YYYY-MM-DDTHH:MM untuk input type="datetime-local"
    function getNativeDatetimeLocal(d = new Date()) {
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().slice(0, 16);
    }

    function formatShortIndoDate(dateStr) {
        if (!dateStr) return '-';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr.split(' ')[0] || dateStr;
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }

    // --- ALUR MENU UTAMA HUTANG ---
    window.openHutangMainView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-hutang-main').classList.remove('hidden');
        document.getElementById('hutang-main-due-filter').value = '';
        window.renderHutangMainList();
    };

    window.toggleHutangMainSortMenu = () => {
        document.getElementById('dropdown-hutang-main-sort').classList.toggle('hidden');
    };
    window.applyHutangMainSort = (mode) => {
        hutangMainSortBy = mode;
        document.getElementById('dropdown-hutang-main-sort').classList.add('hidden');
        window.renderHutangMainList();
    };

    window.renderHutangMainList = function() {
        const container = document.getElementById('container-hutang-main-rows');
        if (!container) return;
        container.innerHTML = '';

        const keyword = (document.getElementById('hutang-main-search')?.value || '').toLowerCase();
        const showUnpaid = document.getElementById('chk-hutang-belum-lunas')?.checked !== false;
        const showPaid = document.getElementById('chk-hutang-lunas')?.checked === true;
        const dueFilter = document.getElementById('hutang-main-due-filter')?.value;

        let supSummaries = [];
        let grandTotalSisa = 0;
        let grandTotalTrx = 0;

        (window.suppliersList || []).forEach(s => {
            const list = s.debts || [];
            if (list.length === 0) return;

            const matchingItems = list.filter(item => {
                const isUnpaid = (Number(item.amount) || 0) > 0;
                if (isUnpaid && !showUnpaid) return false;
                if (!isUnpaid && !showPaid) return false;
                if (dueFilter && item.dueDate !== dueFilter) return false;
                return true;
            });

            if (matchingItems.length === 0) return;
            if (keyword && !s.name.toLowerCase().includes(keyword)) return;

            const totalSisaSup = matchingItems.reduce((acc, x) => acc + (Number(x.amount) || 0), 0);
            const nearestDue = matchingItems[0].dueDate || '-';
            const latestTrx = matchingItems[matchingItems.length - 1].trxDate || '';

            grandTotalSisa += totalSisaSup;
            grandTotalTrx += matchingItems.length;

            supSummaries.push({ sup: s, nearestDue, latestTrx, totalSisaSup, isUnpaid: totalSisaSup > 0 });
        });

        supSummaries.sort((a, b) => {
            if (hutangMainSortBy === 'name') return a.sup.name.localeCompare(b.sup.name);
            if (hutangMainSortBy === 'latest') return b.latestTrx.localeCompare(a.latestTrx);
            return a.nearestDue.localeCompare(b.nearestDue);
        });

        document.getElementById('hutang-main-total-sisa').innerText = `Rp ${grandTotalSisa.toLocaleString('id-ID')}`;
        document.getElementById('hutang-main-total-trx').innerText = grandTotalTrx;

        if (supSummaries.length === 0) {
            container.innerHTML = `<div class="py-12 text-center text-xs text-gray-400 font-bold bg-white rounded-xl border border-gray-100 shadow-xs">Tidak ada tagihan supplier yang sesuai filter.</div>`;
            return;
        }

        supSummaries.forEach((row, idx) => {
            const statusDot = row.isUnpaid ? 'bg-red-600' : 'bg-emerald-500';
            const statusLabel = row.isUnpaid ? 'Belum Lunas' : 'Lunas';
            const initials = row.sup.avatarCode || row.sup.name.substring(0, 2).toUpperCase();

            container.innerHTML += `
                <div onclick="openSupplierHutangFromMain('${row.sup.id}')" class="p-4 bg-white rounded-xl shadow-xs border border-gray-100 flex items-center justify-between hover:border-emerald-500 cursor-pointer transition text-xs">
                    <div class="flex items-center space-x-3.5 flex-1 min-w-0 pr-3">
                        <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs flex-shrink-0">${initials}</div>
                        <div class="min-w-0">
                            <h4 class="font-extrabold text-gray-900 text-sm truncate">${row.sup.name}</h4>
                            <p class="text-[10px] text-gray-500 font-semibold mt-0.5">Jatuh Tempo : ${formatShortIndoDate(row.nearestDue)}</p>
                        </div>
                    </div>
                    <div class="text-right space-y-1 flex-shrink-0">
                        <span class="inline-flex items-center font-bold text-gray-700 text-[10px] bg-gray-50 px-2 py-0.5 rounded">
                            <span class="w-2 h-2 rounded-full ${statusDot} mr-1.5"></span>${statusLabel}
                        </span>
                        <p class="font-black text-red-600 text-sm">Rp ${row.totalSisaSup.toLocaleString('id-ID')}</p>
                    </div>
                </div>
            `;
        });
    };

    // --- ALUR CATAT HUTANG MANUAL (NATIVE DATE) ---
    window.openTambahHutangManualView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-tambah-hutang-manual').classList.remove('hidden');

        document.getElementById('input-manual-hutang-nominal').value = '';
        document.getElementById('input-manual-hutang-notes').value = '';
        document.getElementById('chk-manual-hutang-cashdrawer').checked = true;
        
        // NATIVE DATE
        document.getElementById('input-manual-hutang-due').value = getNativeDateOnly();

        const sel = document.getElementById('select-manual-hutang-sup');
        sel.innerHTML = `<option value="">-- Pilih Supplier --</option>`;
        (window.suppliersList || []).sort((a,b) => a.name.localeCompare(b.name)).forEach(c => {
            sel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
        });
        
        // Jika dibuka dari detail supplier, auto select
        if (activeHutangSupplier && supHutangReturnView === 'view-supplier-detail') {
            sel.value = activeHutangSupplier.id;
        }
    };

    window.closeTambahHutangManualView = () => {
        document.getElementById('view-tambah-hutang-manual').classList.add('hidden');
        if (supHutangReturnView === 'view-supplier-detail') {
            document.getElementById('view-supplier-hutang').classList.remove('hidden');
            window.renderSupplierHutangTransactions();
        } else {
            document.getElementById('view-hutang-main').classList.remove('hidden');
            window.renderHutangMainList();
        }
    };

    window.saveManualHutangBaru = () => {
        const supId = document.getElementById('select-manual-hutang-sup').value;
        const nominal = Number(document.getElementById('input-manual-hutang-nominal').value) || 0;
        const dueStr = document.getElementById('input-manual-hutang-due').value; // Format YYYY-MM-DD
        const notes = document.getElementById('input-manual-hutang-notes').value.trim();

        if (!supId) return alert("Pilih Supplier terlebih dahulu!");
        if (nominal <= 0) return alert("Masukkan tagihan lebih dari Rp 0!");

        const s = window.suppliersList.find(x => x.id === supId);
        if (!s) return;

        const nowStr = window.getFormattedCurrentDateTime();
        
        if (!Array.isArray(s.debts)) s.debts = [];
        s.debts.push({
            id: 'hut_' + Date.now(),
            trxDate: nowStr,
            date: nowStr.split(' ')[0],
            dueDate: dueStr,
            totalAmount: nominal,
            amount: nominal,
            status: "Belum lunas",
            notes: notes,
            receiptNo: 'S' + Date.now().toString().slice(-6),
            history: []
        });

        s.debtCount = s.debts.length;
        s.debtAmount = s.debts.reduce((sum, x) => sum + (Number(x.amount) || 0), 0);

        alert("Catatan Hutang baru ke Supplier berhasil disimpan!");
        window.closeTambahHutangManualView();
    };

    // --- ALUR RINCIAN HUTANG PER SUPPLIER ---
    window.openSupplierHutangFromMain = (supId) => {
        const s = (window.suppliersList || []).find(x => x.id === supId);
        if (!s) return;
        activeHutangSupplier = s;
        supHutangReturnView = 'view-hutang-main';
        openSupplierHutangScreen();
    };

    window.openSupplierHutangView = () => {
        const profName = document.getElementById('prof-sup-name')?.innerText;
        const found = (window.suppliersList || []).find(s => s.name === profName) || window.suppliersList[0];
        activeHutangSupplier = found;
        supHutangReturnView = 'view-supplier-detail';
        openSupplierHutangScreen();
    };

    function openSupplierHutangScreen() {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-supplier-hutang').classList.remove('hidden');
        document.getElementById('chk-sup-hutang-select-all').checked = false;
        document.getElementById('sup-hutang-date-filter-native').value = '';
        window.renderSupplierHutangTransactions();
    }

    window.closeSupplierHutangView = () => {
        document.getElementById('view-supplier-hutang').classList.add('hidden');
        document.getElementById(supHutangReturnView).classList.remove('hidden');
        if (supHutangReturnView === 'view-hutang-main') {
            window.renderHutangMainList();
        }
    };

    window.applySupHutangTransactionSort = (mode) => {
        supHutangSortBy = mode;
        document.getElementById('dropdown-sup-hutang-sort').classList.add('hidden');
        window.renderSupplierHutangTransactions();
    };

    window.renderSupplierHutangTransactions = function() {
        if (!activeHutangSupplier) return;
        const list = activeHutangSupplier.debts || [];
        const statusFilter = document.getElementById('select-sup-hutang-status-filter')?.value || 'unpaid';
        const dateFilter = document.getElementById('sup-hutang-date-filter-native')?.value;

        let totalSisa = 0;
        let unpaidTrxCount = 0;
        list.forEach(item => {
            const rem = Number(item.amount) || 0;
            if (rem > 0) {
                totalSisa += rem;
                unpaidTrxCount++;
            }
        });

        activeHutangSupplier.debtAmount = totalSisa;
        document.getElementById('sup-hutang-title-name').innerText = activeHutangSupplier.name;
        document.getElementById('sup-hutang-avatar').innerText = activeHutangSupplier.avatarCode || 'SP';
        document.getElementById('sup-hutang-amount-disp').innerText = `Rp ${totalSisa.toLocaleString('id-ID')}`;
        document.getElementById('sup-hutang-count-disp').innerText = unpaidTrxCount;

        let filtered = list.filter(item => {
            const isUnpaid = (Number(item.amount) || 0) > 0;
            if (statusFilter === 'unpaid' && !isUnpaid) return false;
            if (statusFilter === 'paid' && isUnpaid) return false;
            if (dateFilter && item.dueDate !== dateFilter) return false;
            return true;
        });

        filtered.sort((a, b) => {
            if (supHutangSortBy === 'due') return (a.dueDate || '').localeCompare(b.dueDate || '');
            return (b.trxDate || '').localeCompare(a.trxDate || '');
        });

        const container = document.getElementById('container-sup-debt-rows');
        container.innerHTML = '';

        if (filtered.length === 0) {
            container.innerHTML = `<div class="p-8 text-center text-xs font-bold text-gray-400 bg-white rounded-xl border border-gray-100">Tidak ada tagihan supplier.</div>`;
        }

        
        filtered.forEach(item => {
            const isUnpaid = (Number(item.amount) || 0) > 0;
            const amountColor = item.amount >= 1000000 ? 'text-red-700' : 'text-gray-900';

            container.innerHTML += `
                <div class="p-4 bg-white rounded-xl border border-gray-100 shadow-xs flex items-center justify-between text-xs hover:border-emerald-500 transition">
                    <div class="flex items-center space-x-3.5 flex-1">
                        <input type="checkbox" name="chk_sup_hutang_item" value="${item.id}" data-amount="${item.amount}" onchange="updateSupHutangCheckedBottomBar()" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer flex-shrink-0">
                        <div onclick="openDetailHutangItemView('${item.id}')" class="space-y-1 flex-1 cursor-pointer min-w-0">
                            <span class="text-emerald-700 font-black block text-xs truncate">${item.notes || 'Pembelian Stok'}</span>
                            <span class="text-gray-500 font-semibold block text-[10px]"><i class="fa-regular fa-calendar mr-1"></i>Tgl: ${formatShortIndoDate(item.trxDate ? item.trxDate.split(' ')[0] : item.date)}</span>
                            <span class="text-gray-500 font-semibold block text-[10px]"><i class="fa-regular fa-clock mr-1"></i>Jatuh Tempo: ${formatShortIndoDate(item.dueDate)}</span>
                        </div>
                    </div>
                    <div onclick="openDetailHutangItemView('${item.id}')" class="text-right space-y-1 cursor-pointer flex-shrink-0 pl-2 border-l border-gray-100">
                        <span class="inline-flex items-center text-gray-700 font-bold text-[10px] bg-gray-50 px-2 py-0.5 rounded">
                            <span class="w-2 h-2 rounded-full ${isUnpaid ? 'bg-red-600' : 'bg-emerald-500'} mr-1.5"></span>${isUnpaid ? 'Belum lunas' : 'Lunas'}
                        </span>
                        <p class="font-black ${amountColor} text-sm pt-1">Rp ${Number(item.amount || item.totalAmount).toLocaleString('id-ID')}</p>
                    </div>
                </div>
            `;
        });

        window.updateSupHutangCheckedBottomBar();
    };

    window.toggleSelectAllSupHutangTransactions = (checked) => {
        document.querySelectorAll('input[name="chk_sup_hutang_item"]').forEach(chk => chk.checked = checked);
        window.updateSupHutangCheckedBottomBar();
    };

    window.updateSupHutangCheckedBottomBar = () => {
        const checkedBoxes = document.querySelectorAll('input[name="chk_sup_hutang_item"]:checked');
        const bottomBar = document.getElementById('bar-sup-hutang-checked-lunasi');
        const totalLbl = document.getElementById('label-sup-hutang-checked-total');

        if (checkedBoxes.length > 0) {
            let sum = 0;
            checkedBoxes.forEach(c => sum += Number(c.getAttribute('data-amount')) || 0);
            totalLbl.innerText = `Rp ${sum.toLocaleString('id-ID')}`;
            bottomBar.classList.remove('hidden');
        } else {
            bottomBar.classList.add('hidden');
        }
    };

    // --- ALUR PEMBAYARAN HUTANG (NATIVE DATETIME) ---
    window.openLunasiSekaligusHutangView = (mode = 'single') => {
        hutangPayMode = mode;
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-lunasi-sekaligus-hutang').classList.remove('hidden');

        if (mode === 'single' && activeHutangItem) {
            currentHutangPayTargetAmount = Number(activeHutangItem.amount) || 0;
        } else if (mode === 'checked') {
            let sum = 0;
            document.querySelectorAll('input[name="chk_sup_hutang_item"]:checked').forEach(c => {
                sum += Number(c.getAttribute('data-amount')) || 0;
            });
            currentHutangPayTargetAmount = sum;
        } else {
            currentHutangPayTargetAmount = (activeHutangSupplier?.debts || []).reduce((s, x) => s + (Number(x.amount) || 0), 0);
        }

        document.getElementById('pay-hutang-sup-name').innerText = activeHutangSupplier ? activeHutangSupplier.name : '-';
        document.getElementById('pay-hutang-unpaid-disp').innerText = `Rp ${currentHutangPayTargetAmount.toLocaleString('id-ID')}`;
        document.getElementById('input-pay-hutang-nominal').value = '';
        document.getElementById('chk-pay-hutang-lunasi').checked = false;
        
        // NATIVE DATETIME LOCAL
        document.getElementById('input-pay-hutang-date').value = getNativeDatetimeLocal();
        
        document.getElementById('select-pay-hutang-method').value = 'Cash';
        document.getElementById('input-pay-hutang-notes').value = '';
    };

    window.closeLunasiSekaligusHutangView = () => {
        document.getElementById('view-lunasi-sekaligus-hutang').classList.add('hidden');
        if (hutangPayMode === 'single') {
            document.getElementById('view-detail-hutang-item').classList.remove('hidden');
        } else {
            document.getElementById('view-supplier-hutang').classList.remove('hidden');
        }
    };

    window.toggleLunasiFullSingleHutang = (checked) => {
        document.getElementById('input-pay-hutang-nominal').value = checked ? currentHutangPayTargetAmount : '';
    };

    window.submitPembayaranHutangSupplier = () => {
        const payNominal = Number(document.getElementById('input-pay-hutang-nominal').value) || 0;
        const payDateRaw = document.getElementById('input-pay-hutang-date').value; // YYYY-MM-DDTHH:MM
        const payMethod = document.getElementById('select-pay-hutang-method').value;
        const payNotes = document.getElementById('input-pay-hutang-notes').value.trim();

        if (payNominal <= 0) return alert("Masukkan nominal pengeluaran lebih dari Rp 0!");
        
        const displayDate = payDateRaw ? payDateRaw.replace('T', ' ') : window.getFormattedCurrentDateTime();

        if (hutangPayMode === 'single' && activeHutangItem) {
            const newRem = Math.max(0, (Number(activeHutangItem.amount) || 0) - payNominal);
            activeHutangItem.amount = newRem;
            activeHutangItem.status = newRem <= 0 ? 'Lunas' : 'Belum lunas';
            if(!activeHutangItem.history) activeHutangItem.history = [];
            activeHutangItem.history.push({
                id: 'h_' + Date.now(),
                date: displayDate,
                paid: payNominal,
                remaining: newRem,
                receiptNo: 'S' + Date.now().toString().slice(-6),
                by: window.activeKasir || 'Adm',
                method: payMethod,
                notes: payNotes
            });
            alert("Pembayaran cicilan ke supplier berhasil dicatat!");
            document.getElementById('view-lunasi-sekaligus-hutang').classList.add('hidden');
            document.getElementById('view-detail-hutang-item').classList.remove('hidden');
            renderDetailHutangItemContent();
        } else {
            // Bulk payment
            let remainingPayment = payNominal;
            const checkedIds = Array.from(document.querySelectorAll('input[name="chk_sup_hutang_item"]:checked')).map(c => c.value);

            (activeHutangSupplier?.debts || []).forEach(item => {
                if (hutangPayMode === 'checked' && !checkedIds.includes(item.id)) return;
                if (remainingPayment <= 0 || item.amount <= 0) return;

                const deduct = Math.min(item.amount, remainingPayment);
                remainingPayment -= deduct;
                item.amount -= deduct;
                item.status = item.amount <= 0 ? 'Lunas' : 'Belum lunas';
                if(!item.history) item.history = [];
                item.history.push({
                    id: 'h_' + Date.now(),
                    date: displayDate,
                    paid: deduct,
                    remaining: item.amount,
                    receiptNo: 'S' + Date.now().toString().slice(-6),
                    by: window.activeKasir || 'Adm',
                    method: payMethod,
                    notes: payNotes
                });
            });

            alert("Pembayaran tagihan ke supplier berhasil dicatat!");
            document.getElementById('view-lunasi-sekaligus-hutang').classList.add('hidden');
            document.getElementById('view-supplier-hutang').classList.remove('hidden');
            window.renderSupplierHutangTransactions();
        }
    };

    // --- ALUR DETAIL HUTANG & HISTORY CICILAN ---
    window.openDetailHutangItemView = (itemId) => {
        const item = (activeHutangSupplier?.debts || []).find(x => x.id === itemId);
        if (!item) return;
        activeHutangItem = item;

        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-detail-hutang-item').classList.remove('hidden');

        renderDetailHutangItemContent();
    };

    window.closeDetailHutangItemView = () => {
        document.getElementById('view-detail-hutang-item').classList.add('hidden');
        document.getElementById('view-supplier-hutang').classList.remove('hidden');
        window.renderSupplierHutangTransactions();
    };

    function renderDetailHutangItemContent() {
        if (!activeHutangItem) return;
        const isUnpaid = (Number(activeHutangItem.amount) || 0) > 0;

        document.getElementById('det-hutang-sup-name').innerText = activeHutangSupplier ? activeHutangSupplier.name : '-';
        
        const badge = document.getElementById('det-hutang-status-badge');
        badge.className = `px-3 py-1 rounded-md text-[10px] font-bold text-white ${isUnpaid ? 'bg-red-600' : 'bg-emerald-600'}`;
        badge.innerText = isUnpaid ? 'Belum lunas' : 'Lunas';

        document.getElementById('det-hutang-trx-date').innerText = formatShortIndoDate(activeHutangItem.trxDate ? activeHutangItem.trxDate.split(' ')[0] : activeHutangItem.date);
        document.getElementById('det-hutang-due-date').innerText = formatShortIndoDate(activeHutangItem.dueDate);
        document.getElementById('det-hutang-total').innerText = `Rp ${Number(activeHutangItem.totalAmount || 0).toLocaleString('id-ID')}`;
        document.getElementById('det-hutang-unpaid').innerText = `Rp ${Number(activeHutangItem.amount || 0).toLocaleString('id-ID')}`;

        const footerBtn = document.getElementById('footer-det-hutang-bayar');
        if (isUnpaid) footerBtn.classList.remove('hidden');
        else footerBtn.classList.add('hidden');

        const histContainer = document.getElementById('container-det-hutang-history');
        histContainer.innerHTML = '';

        if (!activeHutangItem.history || activeHutangItem.history.length === 0) {
            histContainer.innerHTML = `<div class="text-center text-[10px] font-semibold text-gray-400 py-4 border border-dashed border-gray-300 rounded-xl">Belum ada cicilan ke supplier</div>`;
            return;
        }

        activeHutangItem.history.forEach((h, hIdx) => {
            histContainer.innerHTML += `
                <div class="border border-emerald-100 rounded-xl overflow-hidden bg-white shadow-xs">
                    <div class="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-4 py-2 border-b border-emerald-100 flex justify-between items-center">
                        <span>Tgl Pengeluaran : ${h.date}</span>
                        <span>Kasir: ${h.by}</span>
                    </div>
                    <div class="p-4 space-y-2.5">
                        <div class="grid grid-cols-3 gap-6 text-[11px]">
                            <div>
                                <span class="text-gray-500 font-semibold block">Kas / Bank</span>
                                <span class="font-extrabold text-gray-900 block mt-0.5">${h.method || 'Cash'}</span>
                            </div>
                            <div>
                                <span class="text-gray-500 font-semibold block">Dibayar</span>
                                <span class="font-extrabold text-emerald-600 block mt-0.5">Rp ${Number(h.paid || 0).toLocaleString('id-ID')}</span>
                            </div>
                            <div class="text-right">
                                <span class="text-gray-500 font-semibold block">Sisa Tagihan</span>
                                <span class="font-extrabold text-red-600 block mt-0.5">Rp ${Number(h.remaining || 0).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                        ${h.notes ? `<div class="bg-gray-50 p-2 rounded text-[10px] text-gray-600 border border-gray-100 italic">"${h.notes}"</div>` : ''}
                    </div>
                </div>
            `;
        });
    }
})();
