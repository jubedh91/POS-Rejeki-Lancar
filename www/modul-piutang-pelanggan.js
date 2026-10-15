// ============================================================================
// MODUL 7: MANAJEMEN PIUTANG PELANGGAN (BUKU KASBON)
// (FIX: UI KLASIK, NATIVE DATE PICKER, & PENGHAPUSAN KALENDER MANUAL)
// ============================================================================

(function() {
    // 1. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- === 1. HALAMAN DAFTAR UTAMA PIUTANG === -->
        <div id="view-piutang-main" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-20">
            <div class="px-4 py-3 bg-emerald-600 border-b flex items-center justify-between shadow-sm z-20 text-white">
                <div class="flex items-center space-x-3">
                    <button onclick="switchView('debts')" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold tracking-wide">Piutang Pelanggan</h2>
                </div>
            </div>

            <!-- Baris Sortir, Pencarian, & Filter Tanggal Native -->
            <div class="p-3 bg-white flex items-center space-x-2 relative z-20 border-b shadow-xs">
                <div class="relative">
                    <button onclick="document.getElementById('dropdown-piutang-main-sort').classList.toggle('hidden')" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                    <div id="dropdown-piutang-main-sort" class="absolute left-0 top-10 w-52 bg-white rounded-md shadow-2xl border border-gray-100 py-1 hidden z-50 text-xs font-bold text-gray-900">
                        <button onclick="applyPiutangMainSort('due')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block border-b border-gray-50">Jatuh Tempo Terdekat</button>
                        <button onclick="applyPiutangMainSort('name')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block border-b border-gray-50">Nama Pelanggan</button>
                        <button onclick="applyPiutangMainSort('latest')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Transaksi Terbaru</button>
                    </div>
                </div>

                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" id="piutang-main-search" oninput="renderPiutangMainList()" placeholder="Nama Pelanggan" class="w-full pl-10 pr-3 py-2 border border-emerald-600 rounded-full text-xs text-gray-900 focus:outline-none">
                </div>

                <!-- NATIVE DATE FILTER -->
                <input type="date" id="piutang-main-due-filter" onchange="renderPiutangMainList()" class="w-10 h-10 border border-emerald-600 rounded-full text-transparent bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer flex-shrink-0" style="background-image: url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 448 512\\'><path fill=\\'%23059669\\' d=\\'M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h352v256c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z\\'/></svg>'); background-repeat: no-repeat; background-position: center; background-size: 16px;">
            </div>

            <!-- Konten Daftar Piutang -->
            <div class="flex-1 overflow-y-auto px-4 pb-24 space-y-4 bg-gray-50 pt-4" onclick="document.getElementById('dropdown-piutang-main-sort').classList.add('hidden')">
                
                <div class="bg-gradient-to-r from-red-600 to-rose-500 rounded-2xl p-5 shadow-md flex items-center justify-between text-white">
                    <div>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-red-100 block">Total Sisa Piutang</span>
                        <span class="text-xl font-extrabold block mt-0.5" id="piutang-main-total-sisa">Rp 0</span>
                    </div>
                    <div class="text-right border-l border-red-400/50 pl-4">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-red-100 block">Total Transaksi</span>
                        <span class="text-xl font-extrabold block mt-0.5" id="piutang-main-total-trx">0</span>
                    </div>
                </div>

                <div class="flex items-center space-x-6 pt-1 text-xs font-bold text-gray-800">
                    <label class="flex items-center space-x-2.5 cursor-pointer">
                        <input type="checkbox" id="chk-piutang-belum-lunas" checked onchange="renderPiutangMainList()" class="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                        <span>Belum Lunas</span>
                    </label>
                    <label class="flex items-center space-x-2.5 cursor-pointer">
                        <input type="checkbox" id="chk-piutang-lunas" onchange="renderPiutangMainList()" class="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                        <span>Lunas</span>
                    </label>
                </div>

                <div id="container-piutang-main-rows" class="space-y-3"></div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="openTambahPiutangManualView()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    BUAT PIUTANG BARU
                </button>
            </div>
        </div>

        <!-- === 2. HALAMAN TAMBAH PIUTANG MANUAL === -->
        <div id="view-tambah-piutang-manual" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-30">
            <div class="px-4 py-3 bg-emerald-600 text-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeTambahPiutangManualView()" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold tracking-wide">Buat Piutang Manual</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 pb-28 space-y-5 bg-gray-50">
                <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">Nominal Piutang</label>
                    <div class="flex items-center justify-center border-b-2 border-emerald-600 pb-2 mb-4">
                        <span class="text-2xl font-extrabold text-emerald-700 mr-2">Rp</span>
                        <input type="number" id="input-manual-piutang-nominal" placeholder="0" class="w-40 text-3xl font-black text-gray-900 text-center focus:outline-none bg-transparent" pattern="[0-9]*" inputmode="numeric">
                    </div>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Pilih Pelanggan<span class="text-red-500">*</span></label>
                        <select id="select-manual-piutang-cust" class="w-full border border-gray-300 rounded-full p-3.5 px-4 text-xs font-bold text-gray-900 bg-white focus:outline-none focus:border-emerald-600 shadow-sm appearance-none"></select>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Tanggal Jatuh Tempo</label>
                        <!-- NATIVE DATE INPUT -->
                        <input type="date" id="input-manual-piutang-due" class="w-full border border-gray-300 rounded-full p-3.5 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm bg-white">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Keterangan / Alasan</label>
                        <textarea id="input-manual-piutang-notes" rows="2" placeholder="Catatan opsional" class="w-full border border-gray-300 rounded-2xl p-3.5 text-xs font-medium text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm"></textarea>
                    </div>

                    <div class="pt-2 pl-1">
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="chk-manual-piutang-cashdrawer" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                            <span class="text-xs font-bold text-gray-900">Potong Saldo Cashdrawer Hari Ini</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="saveManualPiutangBaru()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN PIUTANG
                </button>
            </div>
        </div>

        <!-- === 3. HALAMAN KREDIT/PIUTANG PER PELANGGAN === -->
        <div id="view-kredit-piutang" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-30">
            <div class="px-4 py-3 bg-emerald-600 border-b flex items-center justify-between shadow-sm z-20 text-white">
                <div class="flex items-center space-x-3">
                    <button onclick="closeKreditPiutangView()" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold tracking-wide">Rincian Piutang</h2>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-4 pb-24 space-y-4 bg-gray-50" onclick="document.getElementById('dropdown-kp-sort').classList.add('hidden')">
                <div class="bg-white rounded-2xl p-5 space-y-3 shadow-sm border border-gray-100">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm" id="kp-cust-avatar">PL</div>
                        <span class="font-extrabold text-sm text-gray-900" id="kp-cust-name">-</span>
                    </div>
                    <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3 text-xs">
                        <div>
                            <span class="text-gray-500 font-semibold block">Total Sisa Piutang</span>
                            <span class="font-black text-red-600 text-base mt-0.5 block" id="kp-cust-debt-amount">Rp 0</span>
                        </div>
                        <div class="text-right">
                            <span class="text-gray-500 font-semibold block">Total Transaksi</span>
                            <span class="font-black text-gray-900 text-base mt-0.5 block" id="kp-cust-debt-count">0</span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center space-x-2 relative z-20">
                    <div class="relative">
                        <button onclick="event.stopPropagation(); document.getElementById('dropdown-kp-sort').classList.toggle('hidden')" type="button" class="text-emerald-700 text-xl px-2 py-1">
                            <i class="fa-solid fa-arrow-up-wide-short"></i>
                        </button>
                        <div id="dropdown-kp-sort" class="absolute left-0 top-10 w-48 bg-white rounded-md shadow-2xl border border-gray-100 py-1 hidden z-50 text-xs font-bold text-gray-900">
                            <button onclick="applyKpTransactionSort('latest')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block border-b border-gray-50">Transaksi Terbaru</button>
                            <button onclick="applyKpTransactionSort('due')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Jatuh Tempo</button>
                        </div>
                    </div>

                    <!-- NATIVE DATE FILTER -->
                    <input type="date" id="kp-date-filter-native" onchange="renderCustomerPiutangTransactions()" class="flex-1 border border-emerald-600 rounded-full p-2.5 px-4 text-xs font-bold text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                </div>

                <div class="flex justify-between items-center pt-2">
                    <label class="flex items-center space-x-3 text-xs font-bold text-gray-900 cursor-pointer">
                        <input type="checkbox" id="chk-kp-select-all" onchange="toggleSelectAllKpTransactions(this.checked)" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                        <span>Pilih Semua</span>
                    </label>
                    <select id="select-kp-status-filter" onchange="renderCustomerPiutangTransactions()" class="border border-emerald-600 rounded-full px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 focus:outline-none appearance-none">
                        <option value="unpaid">Belum Lunas</option>
                        <option value="paid">Lunas</option>
                    </select>
                </div>

                <div id="container-cust-piutang-rows" class="space-y-3 pt-1"></div>
            </div>

            <!-- Bar Hijau Bawah Saat Ada Piutang yang Dicentang -->
            <div id="bar-kp-checked-lunasi" class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-30 hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <button onclick="openPembayaranPiutangView('checked')" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-full shadow-lg flex justify-between items-center text-xs transition active:scale-95 uppercase tracking-wider">
                    <span>Bayar Tagihan</span>
                    <span id="label-kp-checked-total" class="font-black bg-white/20 px-3 py-1 rounded-md">Rp 0</span>
                </button>
            </div>
        </div>

        <!-- === 4. HALAMAN DETAIL ITEM PIUTANG & HISTORY PEMBAYARAN === -->
        <div id="view-detail-piutang-item" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="px-4 py-3 bg-emerald-600 border-b flex items-center space-x-3 shadow-sm z-10 text-white">
                <button onclick="closeDetailPiutangItemView()" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold tracking-wide">Detail Riwayat Piutang</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 pb-28 space-y-4 bg-gray-50 text-xs">
                <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                    <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                        <span class="font-extrabold text-sm text-gray-900" id="det-piutang-cust-name">-</span>
                        <span id="det-piutang-status-badge" class="px-3 py-1 rounded-full text-[10px] font-bold text-white bg-red-600">Belum lunas</span>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-gray-500 font-semibold block">Tgl Transaksi</span>
                            <span class="font-bold text-gray-900 block mt-1" id="det-piutang-trx-date">-</span>
                        </div>
                        <div class="text-right">
                            <span class="text-gray-500 font-semibold block">Jatuh Tempo</span>
                            <span class="font-bold text-gray-900 block mt-1" id="det-piutang-due-date">-</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
                        <div>
                            <span class="text-gray-500 font-semibold block">Total Piutang Awal</span>
                            <span class="font-black text-gray-900 text-sm block mt-1" id="det-piutang-total">Rp 0</span>
                        </div>
                        <div class="text-right">
                            <span class="text-gray-500 font-semibold block">Sisa Belum Dibayar</span>
                            <span class="font-black text-red-600 text-sm block mt-1" id="det-piutang-unpaid">Rp 0</span>
                        </div>
                    </div>
                </div>

                <div class="text-center font-extrabold text-gray-400 uppercase tracking-widest text-[10px] pt-4 pb-1">
                    Histori Cicilan Pembayaran
                </div>

                <div id="container-det-piutang-history" class="space-y-3"></div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10" id="footer-det-piutang-bayar">
                <button onclick="openPembayaranPiutangView('single')" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    BAYAR CICILAN
                </button>
            </div>
        </div>

        <!-- === 5. HALAMAN PEMBAYARAN KASIR PIUTANG === -->
        <div id="view-pembayaran-piutang" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-50">
            <div class="px-4 py-3 bg-emerald-600 border-b flex items-center space-x-3 shadow-sm z-10 text-white">
                <button onclick="closePembayaranPiutangView()" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold tracking-wide">Penerimaan Pembayaran</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 pb-28 space-y-5 bg-gray-50">
                <div class="bg-red-50 border border-red-100 rounded-2xl p-4 flex justify-between items-center text-xs">
                    <span class="font-bold text-gray-700" id="pay-piutang-cust-name">-</span>
                    <div class="text-right">
                        <span class="text-red-400 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">Total Tagihan</span>
                        <span class="text-base font-black text-red-700 block" id="pay-piutang-unpaid-disp">Rp 0</span>
                    </div>
                </div>

                <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-5">
                    <div>
                        <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">Nominal Pembayaran</label>
                        <div class="flex items-center justify-center border-b-2 border-emerald-600 pb-2 mb-2">
                            <span class="text-2xl font-extrabold text-emerald-700 mr-2">Rp</span>
                            <input type="number" id="input-pay-piutang-nominal" value="0" class="w-40 text-3xl font-black text-gray-900 text-center focus:outline-none bg-transparent" pattern="[0-9]*" inputmode="numeric">
                        </div>
                        <label class="flex items-center justify-center space-x-2 cursor-pointer mt-3">
                            <input type="checkbox" id="chk-pay-piutang-lunasi" onchange="toggleLunasiFullPiutang(this.checked)" class="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                            <span class="text-[11px] font-bold text-emerald-700 uppercase">Lunasi Penuh Tagihan Ini</span>
                        </label>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Waktu Pembayaran Aktual</label>
                        <!-- NATIVE DATETIME LOCAL -->
                        <input type="datetime-local" id="input-pay-piutang-date" class="w-full bg-white border border-gray-300 rounded-full p-3.5 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Masuk ke Kas / Metode Bayar</label>
                        <div class="relative">
                            <select id="select-pay-piutang-method" class="w-full bg-white border border-gray-300 rounded-full p-3.5 px-4 text-xs font-bold text-gray-900 appearance-none focus:outline-none focus:border-emerald-600 shadow-sm">
                                <option value="Cash">Cash (Tunai)</option>
                                <option value="Transfer Bank">Transfer Bank</option>
                                <option value="QRIS">QRIS</option>
                            </select>
                            <i class="fa-solid fa-chevron-down text-gray-500 text-xs absolute right-4 top-4 pointer-events-none"></i>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Keterangan Tambahan</label>
                        <textarea id="input-pay-piutang-notes" rows="2" placeholder="Cth: Cicilan ke-1" class="w-full bg-white border border-gray-300 rounded-2xl p-3.5 text-xs font-medium text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm"></textarea>
                    </div>

                    <div class="pt-1 pl-1">
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="chk-pay-piutang-cashdrawer" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                            <span class="text-xs font-bold text-gray-900">Catat Pendapatan di Cashdrawer Hari Ini</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="submitPembayaranPiutang()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    KONFIRMASI PEMBAYARAN
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
    let piutangMainSortBy = 'latest'; 
    let activeKpCustomer = null;
    let kpReturnView = 'view-piutang-main';
    let kpSortBy = 'latest';
    let activePiutangItem = null;
    let paymentTargetMode = 'single'; 
    let currentPayTargetAmount = 0;

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
        if (isNaN(d.getTime())) return dateStr;
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }

    // --- ALUR MENU UTAMA PIUTANG ---
    window.openPiutangMainView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-piutang-main').classList.remove('hidden');
        document.getElementById('piutang-main-due-filter').value = '';
        window.renderPiutangMainList();
    };

    window.togglePiutangMainSortMenu = () => {
        document.getElementById('dropdown-piutang-main-sort').classList.toggle('hidden');
    };
    window.applyPiutangMainSort = (mode) => {
        piutangMainSortBy = mode;
        document.getElementById('dropdown-piutang-main-sort').classList.add('hidden');
        window.renderPiutangMainList();
    };

    window.renderPiutangMainList = function() {
        const container = document.getElementById('container-piutang-main-rows');
        if (!container) return;
        container.innerHTML = '';

        const keyword = (document.getElementById('piutang-main-search')?.value || '').toLowerCase();
        const showUnpaid = document.getElementById('chk-piutang-belum-lunas')?.checked !== false;
        const showPaid = document.getElementById('chk-piutang-lunas')?.checked === true;
        const dueFilter = document.getElementById('piutang-main-due-filter')?.value;

        let custSummaries = [];
        let grandTotalSisa = 0;
        let grandTotalTrx = 0;

        (window.customersList || []).forEach(c => {
            const list = c.piutangList || [];
            if (list.length === 0) return;

            const matchingItems = list.filter(item => {
                const isUnpaid = (Number(item.unpaidAmount) || 0) > 0;
                if (isUnpaid && !showUnpaid) return false;
                if (!isUnpaid && !showPaid) return false;
                if (dueFilter && item.dueDate !== dueFilter) return false; // Cocokkan format YYYY-MM-DD
                return true;
            });

            if (matchingItems.length === 0) return;
            if (keyword && !c.name.toLowerCase().includes(keyword)) return;

            const totalPiutangCust = matchingItems.reduce((acc, x) => acc + (Number(x.totalAmount) || 0), 0);
            const sisaPiutangCust = matchingItems.reduce((acc, x) => acc + (Number(x.unpaidAmount) || 0), 0);
            const nearestDue = matchingItems[0].dueDate || '-';
            const latestTrx = matchingItems[matchingItems.length - 1].trxDate || '';

            grandTotalSisa += sisaPiutangCust;
            grandTotalTrx += matchingItems.length; // Hitung total nota bukan orangnya

            custSummaries.push({ cust: c, nearestDue, latestTrx, totalPiutangCust, sisaPiutangCust, isUnpaid: sisaPiutangCust > 0 });
        });

        custSummaries.sort((a, b) => {
            if (piutangMainSortBy === 'name') return a.cust.name.localeCompare(b.cust.name);
            if (piutangMainSortBy === 'latest') return b.latestTrx.localeCompare(a.latestTrx);
            return a.nearestDue.localeCompare(b.nearestDue);
        });

        document.getElementById('piutang-main-total-sisa').innerText = `Rp ${grandTotalSisa.toLocaleString('id-ID')}`;
        document.getElementById('piutang-main-total-trx').innerText = grandTotalTrx;

        if (custSummaries.length === 0) {
            container.innerHTML = `<div class="py-12 text-center text-xs text-gray-400 font-bold bg-white rounded-xl">Tidak ada data piutang yang sesuai filter.</div>`;
            return;
        }

        custSummaries.forEach((row, idx) => {
            const statusDot = row.isUnpaid ? 'bg-red-600' : 'bg-emerald-500';
            const statusLabel = row.isUnpaid ? 'Belum Lunas' : 'Lunas';
            const initials = row.cust.avatarCode || row.cust.name.substring(0, 2).toUpperCase();

            container.innerHTML += `
                <div onclick="openCustomerKreditPiutangFromMain('${row.cust.id}')" class="p-4 bg-white rounded-xl shadow-xs border border-gray-100 flex items-center justify-between hover:border-emerald-500 cursor-pointer transition text-xs">
                    <div class="flex items-center space-x-3.5 flex-1 min-w-0 pr-3">
                        <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs flex-shrink-0">${initials}</div>
                        <div class="min-w-0">
                            <h4 class="font-extrabold text-gray-900 text-sm truncate">${row.cust.name}</h4>
                            <p class="text-[10px] text-gray-500 font-semibold mt-0.5">Jatuh Tempo : ${formatShortIndoDate(row.nearestDue)}</p>
                        </div>
                    </div>
                    <div class="text-right space-y-1 flex-shrink-0">
                        <span class="inline-flex items-center font-bold text-gray-700 text-[10px] bg-gray-50 px-2 py-0.5 rounded">
                            <span class="w-2 h-2 rounded-full ${statusDot} mr-1.5"></span>${statusLabel}
                        </span>
                        <p class="font-black text-red-600 text-sm">Rp ${row.sisaPiutangCust.toLocaleString('id-ID')}</p>
                    </div>
                </div>
            `;
        });
    };

    // --- ALUR BUAT PIUTANG MANUAL (NATIVE DATE) ---
    window.openTambahPiutangManualView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-tambah-piutang-manual').classList.remove('hidden');

        document.getElementById('input-manual-piutang-nominal').value = '';
        document.getElementById('input-manual-piutang-notes').value = '';
        document.getElementById('chk-manual-piutang-cashdrawer').checked = true;
        
        // NATIVE DATE
        document.getElementById('input-manual-piutang-due').value = getNativeDateOnly();

        const sel = document.getElementById('select-manual-piutang-cust');
        sel.innerHTML = `<option value="">-- Pilih Pelanggan --</option>`;
        (window.customersList || []).sort((a,b) => a.name.localeCompare(b.name)).forEach(c => {
            sel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
        });
        
        // Jika dibuka dari profil pelanggan, auto select
        if (activeKpCustomer && kpReturnView === 'view-customer-profile') {
            sel.value = activeKpCustomer.id;
        }
    };

    window.closeTambahPiutangManualView = () => {
        document.getElementById('view-tambah-piutang-manual').classList.add('hidden');
        if (kpReturnView === 'view-customer-profile') {
            document.getElementById('view-kredit-piutang').classList.remove('hidden');
            window.renderCustomerPiutangTransactions();
        } else {
            document.getElementById('view-piutang-main').classList.remove('hidden');
            window.renderPiutangMainList();
        }
    };

    window.saveManualPiutangBaru = () => {
        const custId = document.getElementById('select-manual-piutang-cust').value;
        const nominal = Number(document.getElementById('input-manual-piutang-nominal').value) || 0;
        const dueStr = document.getElementById('input-manual-piutang-due').value; // Format YYYY-MM-DD
        const notes = document.getElementById('input-manual-piutang-notes').value.trim();

        if (!custId) return alert("Pilih Pelanggan terlebih dahulu!");
        if (nominal <= 0) return alert("Masukkan nominal piutang lebih dari Rp 0!");

        const c = window.customersList.find(x => x.id === custId);
        if (!c) return;

        const nowStr = window.getFormattedCurrentDateTime();
        
        if (!Array.isArray(c.piutangList)) c.piutangList = [];
        c.piutangList.push({
            id: 'piu_' + Date.now(),
            trxDate: nowStr,
            shortDate: nowStr.split(' ')[0],
            dueDate: dueStr,
            totalAmount: nominal,
            unpaidAmount: nominal,
            status: "Belum lunas",
            notes: notes,
            receiptNo: 'M' + Date.now().toString().slice(-6),
            history: []
        });

        alert("Data piutang baru berhasil dicatat!");
        window.closeTambahPiutangManualView();
    };

    // --- ALUR RINCIAN PIUTANG PER PELANGGAN ---
    window.openCustomerKreditPiutangFromMain = (custId) => {
        const c = (window.customersList || []).find(x => x.id === custId);
        if (!c) return;
        activeKpCustomer = c;
        kpReturnView = 'view-piutang-main';
        openKreditPiutangScreen();
    };

    function openKreditPiutangScreen() {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-kredit-piutang').classList.remove('hidden');
        document.getElementById('chk-kp-select-all').checked = false;
        document.getElementById('kp-date-filter-native').value = '';
        window.renderCustomerPiutangTransactions();
    }

    window.closeKreditPiutangView = () => {
        document.getElementById('view-kredit-piutang').classList.add('hidden');
        document.getElementById(kpReturnView).classList.remove('hidden');
        if (kpReturnView === 'view-piutang-main') {
            window.renderPiutangMainList();
        }
    };

    window.applyKpTransactionSort = (mode) => {
        kpSortBy = mode;
        document.getElementById('dropdown-kp-sort').classList.add('hidden');
        window.renderCustomerPiutangTransactions();
    };

    window.renderCustomerPiutangTransactions = function() {
        if (!activeKpCustomer) return;
        const list = activeKpCustomer.piutangList || [];
        const statusFilter = document.getElementById('select-kp-status-filter')?.value || 'unpaid';
        const dateFilter = document.getElementById('kp-date-filter-native')?.value;

        let totalSisa = 0;
        let unpaidTrxCount = 0;
        list.forEach(item => {
            const rem = Number(item.unpaidAmount) || 0;
            if (rem > 0) {
                totalSisa += rem;
                unpaidTrxCount++;
            }
        });

        document.getElementById('kp-cust-name').innerText = activeKpCustomer.name;
        document.getElementById('kp-cust-avatar').innerText = activeKpCustomer.avatarCode || 'PL';
        document.getElementById('kp-cust-debt-amount').innerText = `Rp ${totalSisa.toLocaleString('id-ID')}`;
        document.getElementById('kp-cust-debt-count').innerText = unpaidTrxCount;

        let filtered = list.filter(item => {
            const isUnpaid = (Number(item.unpaidAmount) || 0) > 0;
            if (statusFilter === 'unpaid' && !isUnpaid) return false;
            if (statusFilter === 'paid' && isUnpaid) return false;
            if (dateFilter && item.dueDate !== dateFilter) return false; 
            return true;
        });

        filtered.sort((a, b) => {
            if (kpSortBy === 'due') return (a.dueDate || '').localeCompare(b.dueDate || '');
            return (b.trxDate || '').localeCompare(a.trxDate || '');
        });

        const container = document.getElementById('container-cust-piutang-rows');
        container.innerHTML = '';

        if (filtered.length === 0) {
            container.innerHTML = `<div class="p-8 text-center text-xs font-bold text-gray-400 bg-white rounded-xl border border-gray-100">Tidak ada transaksi tagihan.</div>`;
        }

        filtered.forEach(item => {
            const isUnpaid = (Number(item.unpaidAmount) || 0) > 0;
            const amountColor = item.unpaidAmount >= 1000000 ? 'text-red-600' : 'text-gray-900';

            container.innerHTML += `
                <div class="p-4 bg-white rounded-xl border border-gray-100 shadow-xs flex items-center justify-between text-xs hover:border-emerald-500 transition">
                    <div class="flex items-center space-x-3.5 flex-1">
                        <input type="checkbox" name="chk_kp_trx_item" value="${item.id}" data-amount="${item.unpaidAmount}" onchange="updateKpCheckedBottomBar()" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer flex-shrink-0">
                        <div onclick="openDetailPiutangItemView('${item.id}')" class="space-y-1 flex-1 cursor-pointer min-w-0">
                            <span class="text-emerald-700 font-black block text-xs truncate">${item.notes || 'Transaksi POS'}</span>
                            <span class="text-gray-500 font-semibold block text-[10px]"><i class="fa-regular fa-calendar mr-1"></i>Tgl: ${formatShortIndoDate(item.trxDate.split(' ')[0])}</span>
                            <span class="text-gray-500 font-semibold block text-[10px]"><i class="fa-regular fa-clock mr-1"></i>Jatuh Tempo: ${formatShortIndoDate(item.dueDate)}</span>
                        </div>
                    </div>
                    <div onclick="openDetailPiutangItemView('${item.id}')" class="text-right space-y-1 cursor-pointer flex-shrink-0 pl-2 border-l border-gray-100">
                        <span class="inline-flex items-center text-gray-700 font-bold text-[10px] bg-gray-50 px-2 py-0.5 rounded">
                            <span class="w-2 h-2 rounded-full ${isUnpaid ? 'bg-red-600' : 'bg-emerald-500'} mr-1.5"></span>${isUnpaid ? 'Belum lunas' : 'Lunas'}
                        </span>
                        <p class="font-black ${amountColor} text-sm pt-1">Rp ${Number(item.unpaidAmount || item.totalAmount).toLocaleString('id-ID')}</p>
                    </div>
                </div>
            `;
        });

        window.updateKpCheckedBottomBar();
    };

    window.toggleSelectAllKpTransactions = (checked) => {
        document.querySelectorAll('input[name="chk_kp_trx_item"]').forEach(chk => chk.checked = checked);
        window.updateKpCheckedBottomBar();
    };

    window.updateKpCheckedBottomBar = () => {
        const checkedBoxes = document.querySelectorAll('input[name="chk_kp_trx_item"]:checked');
        const bottomBar = document.getElementById('bar-kp-checked-lunasi');
        const totalLbl = document.getElementById('label-kp-checked-total');

        if (checkedBoxes.length > 0) {
            let sum = 0;
            checkedBoxes.forEach(c => sum += Number(c.getAttribute('data-amount')) || 0);
            totalLbl.innerText = `Rp ${sum.toLocaleString('id-ID')}`;
            bottomBar.classList.remove('hidden');
        } else {
            bottomBar.classList.add('hidden');
        }
    };

    // --- ALUR PEMBAYARAN KASIR PIUTANG (NATIVE DATETIME) ---
    window.openPembayaranPiutangView = (mode = 'single') => {
        paymentTargetMode = mode;
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-pembayaran-piutang').classList.remove('hidden');

        if (mode === 'single' && activePiutangItem) {
            currentPayTargetAmount = Number(activePiutangItem.unpaidAmount) || 0;
        } else if (mode === 'checked') {
            let sum = 0;
            document.querySelectorAll('input[name="chk_kp_trx_item"]:checked').forEach(c => {
                sum += Number(c.getAttribute('data-amount')) || 0;
            });
            currentPayTargetAmount = sum;
        } else {
            currentPayTargetAmount = (activeKpCustomer?.piutangList || []).reduce((s, x) => s + (Number(x.unpaidAmount) || 0), 0);
        }

        document.getElementById('pay-piutang-cust-name').innerText = activeKpCustomer ? activeKpCustomer.name : '-';
        document.getElementById('pay-piutang-unpaid-disp').innerText = `Rp ${currentPayTargetAmount.toLocaleString('id-ID')}`;
        document.getElementById('input-pay-piutang-nominal').value = '';
        document.getElementById('chk-pay-piutang-lunasi').checked = false;
        
        // NATIVE DATETIME LOCAL
        document.getElementById('input-pay-piutang-date').value = getNativeDatetimeLocal();
        
        document.getElementById('select-pay-piutang-method').value = 'Cash';
        document.getElementById('input-pay-piutang-notes').value = '';
    };

    window.closePembayaranPiutangView = () => {
        document.getElementById('view-pembayaran-piutang').classList.add('hidden');
        if (paymentTargetMode === 'single') {
            document.getElementById('view-detail-piutang-item').classList.remove('hidden');
        } else {
            document.getElementById('view-kredit-piutang').classList.remove('hidden');
        }
    };

    window.toggleLunasiFullPiutang = (checked) => {
        document.getElementById('input-pay-piutang-nominal').value = checked ? currentPayTargetAmount : '';
    };

    window.submitPembayaranPiutang = () => {
        const payNominal = Number(document.getElementById('input-pay-piutang-nominal').value) || 0;
        const payDateRaw = document.getElementById('input-pay-piutang-date').value; // YYYY-MM-DDTHH:MM
        const payMethod = document.getElementById('select-pay-piutang-method').value;
        const payNotes = document.getElementById('input-pay-piutang-notes').value.trim();

        if (payNominal <= 0) return alert("Masukkan nominal pembayaran lebih dari Rp 0!");
        
        // Bersihkan format datetime T agar enak dibaca (opsional)
        const displayDate = payDateRaw ? payDateRaw.replace('T', ' ') : window.getFormattedCurrentDateTime();

        if (paymentTargetMode === 'single' && activePiutangItem) {
            const newRem = Math.max(0, (Number(activePiutangItem.unpaidAmount) || 0) - payNominal);
            activePiutangItem.unpaidAmount = newRem;
            activePiutangItem.status = newRem <= 0 ? 'Lunas' : 'Belum lunas';
            activePiutangItem.history.push({
                id: 'h_' + Date.now(),
                date: displayDate,
                paid: payNominal,
                remaining: newRem,
                receiptNo: 'P' + Date.now().toString().slice(-6),
                by: window.activeKasir || 'Adm',
                method: payMethod,
                notes: payNotes
            });
            alert("Pembayaran cicilan berhasil dicatat!");
            document.getElementById('view-pembayaran-piutang').classList.add('hidden');
            document.getElementById('view-detail-piutang-item').classList.remove('hidden');
            renderDetailPiutangItemContent();
        } else {
            // Bulk payment
            let remainingPayment = payNominal;
            const checkedIds = Array.from(document.querySelectorAll('input[name="chk_kp_trx_item"]:checked')).map(c => c.value);

            (activeKpCustomer?.piutangList || []).forEach(item => {
                if (paymentTargetMode === 'checked' && !checkedIds.includes(item.id)) return;
                if (remainingPayment <= 0 || item.unpaidAmount <= 0) return;

                const deduct = Math.min(item.unpaidAmount, remainingPayment);
                remainingPayment -= deduct;
                item.unpaidAmount -= deduct;
                item.status = item.unpaidAmount <= 0 ? 'Lunas' : 'Belum lunas';
                item.history.push({
                    id: 'h_' + Date.now(),
                    date: displayDate,
                    paid: deduct,
                    remaining: item.unpaidAmount,
                    receiptNo: 'P' + Date.now().toString().slice(-6),
                    by: window.activeKasir || 'Adm',
                    method: payMethod,
                    notes: payNotes
                });
            });

            alert("Pembayaran tagihan berhasil dicatat!");
            document.getElementById('view-pembayaran-piutang').classList.add('hidden');
            document.getElementById('view-kredit-piutang').classList.remove('hidden');
            window.renderCustomerPiutangTransactions();
        }
    };

    // --- ALUR DETAIL PIUTANG & HISTORY CICILAN ---
    window.openDetailPiutangItemView = (itemId) => {
        const item = (activeKpCustomer?.piutangList || []).find(x => x.id === itemId);
        if (!item) return;
        activePiutangItem = item;

        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-detail-piutang-item').classList.remove('hidden');

        renderDetailPiutangItemContent();
    };

    window.closeDetailPiutangItemView = () => {
        document.getElementById('view-detail-piutang-item').classList.add('hidden');
        document.getElementById('view-kredit-piutang').classList.remove('hidden');
        window.renderCustomerPiutangTransactions();
    };

    function renderDetailPiutangItemContent() {
        if (!activePiutangItem) return;
        const isUnpaid = (Number(activePiutangItem.unpaidAmount) || 0) > 0;

        document.getElementById('det-piutang-cust-name').innerText = activeKpCustomer ? activeKpCustomer.name : '-';
        
        const badge = document.getElementById('det-piutang-status-badge');
        badge.className = `px-3 py-1 rounded-md text-[10px] font-bold text-white ${isUnpaid ? 'bg-red-600' : 'bg-emerald-600'}`;
        badge.innerText = isUnpaid ? 'Belum lunas' : 'Lunas';

        document.getElementById('det-piutang-trx-date').innerText = formatShortIndoDate(activePiutangItem.trxDate.split(' ')[0]);
        document.getElementById('det-piutang-due-date').innerText = formatShortIndoDate(activePiutangItem.dueDate);
        document.getElementById('det-piutang-total').innerText = `Rp ${Number(activePiutangItem.totalAmount || 0).toLocaleString('id-ID')}`;
        document.getElementById('det-piutang-unpaid').innerText = `Rp ${Number(activePiutangItem.unpaidAmount || 0).toLocaleString('id-ID')}`;

        const footerBtn = document.getElementById('footer-det-piutang-bayar');
        if (isUnpaid) footerBtn.classList.remove('hidden');
        else footerBtn.classList.add('hidden');

        const histContainer = document.getElementById('container-det-piutang-history');
        histContainer.innerHTML = '';

        if (!activePiutangItem.history || activePiutangItem.history.length === 0) {
            histContainer.innerHTML = `<div class="text-center text-[10px] font-semibold text-gray-400 py-4 border border-dashed border-gray-300 rounded-xl">Belum ada cicilan</div>`;
            return;
        }

        activePiutangItem.history.forEach((h, hIdx) => {
            histContainer.innerHTML += `
                <div class="border border-emerald-100 rounded-xl overflow-hidden bg-white shadow-xs">
                    <div class="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-4 py-2 border-b border-emerald-100 flex justify-between items-center">
                        <span>Tgl Pembayaran : ${h.date}</span>
                        <span>Kasir: ${h.by}</span>
                    </div>
                    <div class="p-4 space-y-2.5">
                        <div class="grid grid-cols-3 gap-6 text-[11px]">
                            <div>
                                <span class="text-gray-500 font-semibold block">Metode</span>
                                <span class="font-extrabold text-gray-900 block mt-0.5">${h.method || 'Cash'}</span>
                            </div>
                            <div>
                                <span class="text-gray-500 font-semibold block">Cicilan Masuk</span>
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
