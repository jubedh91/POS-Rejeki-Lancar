// ============================================================================
// MODUL 12: MANAJEMEN STOK LENGKAP (AKSI STOK, LOG BARANG, EDIT SISA STOK)
// ============================================================================

(function() {
    // 1. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- === 1. HALAMAN UTAMA MANAJEMEN STOK === -->
        <div id="view-manajemen-stok" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-20">
                <button onclick="switchView('manajemen-hub')" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Manajemen stok</h2>
            </div>

            <!-- Baris Filter Corong, Urutan, Pencarian, & Barcode -->
            <div class="p-3 bg-white border-b flex items-center space-x-2 relative z-20">
                <!-- Ikon Corong: Notifikasi Stok -->
                <button onclick="document.getElementById('modal-mstock-notif').classList.remove('hidden')" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-filter"></i></button>
                
                <!-- Ikon Panah Naik: Filter Urutan -->
                <div class="relative">
                    <button onclick="document.getElementById('dropdown-mstock-sort').classList.toggle('hidden')" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                    <div id="dropdown-mstock-sort" class="absolute left-0 top-10 w-44 bg-emerald-50 rounded-md shadow-2xl py-1 hidden z-50 text-xs text-gray-900 border border-emerald-100">
                        <button onclick="applyMStockSort('name')" class="w-full text-left px-4 py-2.5 font-bold transition block">Barang</button>
                        <button onclick="applyMStockSort('sku')" class="w-full text-left px-4 py-2.5 hover:bg-emerald-100 transition block">Kode</button>
                        <button onclick="applyMStockSort('price')" class="w-full text-left px-4 py-2.5 hover:bg-emerald-100 transition block">Harga jual</button>
                        <button onclick="applyMStockSort('stock')" class="w-full text-left px-4 py-2.5 hover:bg-emerald-100 transition block">Stok</button>
                        <button onclick="applyMStockSort('latest')" class="w-full text-left px-4 py-2.5 hover:bg-emerald-100 transition block">Produk Terbaru</button>
                    </div>
                </div>

                <!-- Kotak Pencarian -->
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" id="input-search-mstock" oninput="renderManajemenStokList(this.value)" placeholder="Cari nama atau kode barang" class="w-full pl-10 pr-4 py-2 border border-emerald-600 rounded-full text-xs text-gray-900 focus:outline-none">
                </div>

                <!-- Ikon Barcode -->
                <button onclick="if(window.openScannerView) window.openScannerView('inventory')" class="text-emerald-700 text-2xl px-1"><i class="fa-solid fa-barcode"></i></button>
            </div>

            <!-- Daftar Item Stok -->
            <div class="flex-1 overflow-y-auto divide-y divide-gray-100 pb-20" id="container-mstock-rows" onclick="document.getElementById('dropdown-mstock-sort').classList.add('hidden')"></div>
        </div>

        <!-- === 2. HALAMAN LOG BARANG (RIWAYAT MASUK KELUAR) === -->
        <div id="view-log-barang" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="closeLogBarangView()" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-gray-900">Log Barang</h2>
                </div>
                <!-- Ikon Download Excel -->
                <button onclick="alert('Mengunduh data Log Barang ke format Excel...')" class="text-emerald-600 hover:text-emerald-800 text-xl p-1"><i class="fa-regular fa-file-excel"></i></button>
            </div>

            <div class="flex-1 overflow-y-auto pb-20">
                <!-- Info Barang Terpilih -->
                <div class="p-4 bg-gray-50 border-b border-gray-100">
                    <h4 class="font-extrabold text-xs text-gray-900" id="log-b-name">Alta Wrap 30x30 box</h4>
                    <p class="text-[11px] text-gray-500 font-semibold mt-0.5" id="log-b-sku">alta30x30box</p>
                </div>

                <div class="p-4">
                    <!-- Filter Rentang Tanggal -->
                    <div class="border border-emerald-600 rounded-full p-2.5 px-4 flex items-center space-x-3 cursor-pointer hover:bg-emerald-50 mb-4">
                        <i class="fa-regular fa-calendar text-emerald-700 text-base"></i>
                        <span class="text-xs font-bold text-gray-900" id="log-b-date-range">12 Sep 2026 - 13 Okt 2026</span>
                    </div>

                    <!-- Daftar Riwayat Log -->
                    <div id="container-log-barang-history" class="divide-y divide-gray-200"></div>
                </div>
            </div>
        </div>

        <!-- === 3. HALAMAN DETAIL LOG BARANG === -->
        <div id="view-detail-log-barang" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeDetailLogBarangView()" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <div>
                    <h2 class="text-base font-bold text-emerald-700">Log Barang</h2>
                    <p class="text-[10px] text-gray-500 font-semibold" id="det-log-b-header-date">2026/10/13</p>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-medium text-gray-900">
                <!-- Info Barang -->
                <div>
                    <h4 class="font-extrabold text-sm text-gray-900" id="det-log-b-name">Alta Wrap 30x30 box</h4>
                    <p class="text-[11px] text-gray-500 font-semibold mt-0.5" id="det-log-b-sku">alta30x30box</p>
                </div>

                <!-- Box Angka Masuk / Keluar / Stok -->
                <div class="border-2 border-emerald-600 rounded-xl flex divide-x divide-gray-300 py-3 text-center">
                    <div class="flex-1">
                        <span class="text-[11px] text-gray-600 font-bold block mb-1">Masuk</span>
                        <span class="font-extrabold text-base" id="det-log-b-masuk">0</span>
                    </div>
                    <div class="flex-1">
                        <span class="text-[11px] text-gray-600 font-bold block mb-1">out</span>
                        <span class="font-extrabold text-base" id="det-log-b-out">2</span>
                    </div>
                    <div class="flex-1">
                        <span class="text-[11px] text-gray-600 font-bold block mb-1">Stok</span>
                        <span class="font-extrabold text-base" id="det-log-b-stok">57</span>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <span class="text-gray-500 font-semibold block mb-0.5 flex items-center space-x-1">
                            <span>Harga Dasar</span>
                            <button onclick="document.getElementById('modal-log-b-info-harga').classList.remove('hidden')" class="w-4 h-4 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center text-[10px] font-bold">?</button>
                        </span>
                        <span class="font-extrabold" id="det-log-b-harga-dasar">-</span>
                    </div>
                    <div>
                        <span class="text-gray-500 font-semibold block mb-0.5">Harga Jual</span>
                        <span class="font-extrabold" id="det-log-b-harga-jual">Rp 16.000</span>
                    </div>
                </div>

                <div>
                    <span class="text-gray-500 font-semibold block mb-0.5">Mode</span>
                    <span id="det-log-b-mode">transaksi</span>
                </div>
                <div>
                    <span class="text-gray-500 font-semibold block mb-0.5">Email Owner/Staff</span>
                    <span id="det-log-b-staff">rlalifia@gmail.com</span>
                </div>
                <div>
                    <span class="text-gray-500 font-semibold block mb-0.5">Keterangan</span>
                    <span id="det-log-b-keterangan" class="leading-relaxed">(apps) kurang stok transaksi baru 151374420261013141649</span>
                </div>

                <div class="pt-2">
                    <div onclick="if(window.openDigitalReceiptView) window.openDigitalReceiptView(0);" class="bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 p-3.5 px-4 rounded-xl flex justify-between items-center cursor-pointer transition">
                        <span class="font-bold text-emerald-800">Lihat Rincian Struk</span>
                        <i class="fa-solid fa-chevron-right text-emerald-700 text-sm"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- === 4. HALAMAN EDIT / LIHAT STOK (DETAIL SISA STOK) === -->
        <div id="view-edit-sisa-stok" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-20">
                <div class="flex items-center space-x-3">
                    <button onclick="closeEditSisaStokView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700">Detail sisa stok</h2>
                </div>
                <div class="relative">
                    <button onclick="document.getElementById('dropdown-edit-stok-menu').classList.toggle('hidden')" class="text-emerald-700 text-xl p-1 focus:outline-none"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                    <div id="dropdown-edit-stok-menu" class="absolute right-0 top-10 w-44 bg-white rounded-md shadow-2xl py-1 hidden z-50 border border-gray-100">
                        <button onclick="this.parentNode.classList.add('hidden'); alert('Fitur perbaikan (Fix) sinkronisasi data stok berjalan.');" class="w-full text-left px-4 py-3 text-xs font-semibold text-gray-700 hover:bg-emerald-50 transition">Fix Data Stok</button>
                    </div>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-4 pb-20" onclick="document.getElementById('dropdown-edit-stok-menu').classList.add('hidden')">
                <!-- Info Barang Utama -->
                <div>
                    <h4 class="font-extrabold text-sm text-gray-900" id="edit-s-name">Alta Wrap 30x30 box</h4>
                    <p class="text-[11px] text-gray-500 font-semibold my-0.5" id="edit-s-sku">alta30x30box</p>
                    <p class="text-xs text-gray-600 font-medium">Sisa Stok: <span class="font-bold text-gray-900" id="edit-s-stock">57</span></p>
                    <p class="text-xs text-gray-600 font-medium">Harga jual : <span id="edit-s-price">Rp 16.000</span></p>
                </div>

                <!-- Box Harga Beli Terakhir -->
                <div class="bg-emerald-50/50 border border-emerald-600 rounded-xl p-4">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-extrabold text-sm text-gray-900">Harga Beli Terakhir</h4>
                            <p class="text-[10px] text-gray-500 font-semibold mt-1">*Harga ini diambil dari pembelian terakhir</p>
                            <button onclick="if(window.switchView) window.switchView('pembelian'); else alert('Ke Menu Pembelian');" class="mt-3 text-xs font-bold text-emerald-700 border border-emerald-600 rounded px-3 py-1.5 hover:bg-emerald-100 transition">
                                Beli Barang
                            </button>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="font-extrabold text-xs text-gray-900" id="edit-s-buyprice">Rp 11.000,66</span>
                            <button onclick="alert('Harga Beli Terakhir diperbarui setiap kali Anda melakukan Pembelian Barang dari Supplier.')" class="w-5 h-5 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center text-[10px] font-bold">?</button>
                        </div>
                    </div>
                </div>

                <!-- Box Hijau Proyeksi -->
                <div class="bg-emerald-500 text-white rounded-xl p-4 shadow-md space-y-3 relative overflow-hidden">
                    <div>
                        <span class="text-[10px] font-semibold text-emerald-100 block mb-0.5">Sisa modal</span>
                        <span class="text-sm font-extrabold" id="edit-s-sisamodal">Rp 627.037,62</span>
                    </div>
                    <div class="grid grid-cols-2">
                        <div>
                            <span class="text-[10px] font-semibold text-emerald-100 block mb-0.5">Proyeksi Omzet</span>
                            <span class="text-xs font-extrabold" id="edit-s-omzet">Rp 912.000</span>
                        </div>
                        <div>
                            <span class="text-[10px] font-semibold text-emerald-100 block mb-0.5">Proyeksi Keuntungan</span>
                            <span class="text-xs font-extrabold" id="edit-s-profit">Rp 284.962,38</span>
                        </div>
                    </div>
                    <!-- Siluet Gelombang Bawah -->
                    <svg class="absolute bottom-0 left-0 w-full h-8 opacity-20" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0,20 C30,0 70,0 100,20 L0,20 Z" fill="white"></path></svg>
                </div>

                <!-- Daftar Batch Stok (Tanggal Masuk) -->
                <div id="container-edit-sisa-stok-batches" class="space-y-4 pt-2"></div>
            </div>
        </div>
    `;

    // 2. SUNTIKKAN HTML MODALS KE DALAM #modals-container
    const modalsHTML = `
        <!-- === MODAL NOTIFIKASI FILTER STOK (SS 1000924777) === -->
        <div id="modal-mstock-notif" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl p-6 text-center">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-5">NOTIFIKASI</h3>
                <div class="space-y-3 font-semibold text-sm">
                    <button onclick="applyMStockFilter('empty')" class="w-full flex items-center justify-between p-3.5 rounded-full border border-gray-300 hover:bg-gray-50 transition text-gray-900">
                        <div class="flex items-center space-x-3">
                            <span class="w-3.5 h-3.5 rounded-full bg-red-600"></span>
                            <span>Stok Habis : <span id="mstock-notif-empty">0</span> Barang</span>
                        </div>
                        <i class="fa-solid fa-chevron-right text-gray-900"></i>
                    </button>
                    <button onclick="applyMStockFilter('low')" class="w-full flex items-center justify-between p-3.5 rounded-full border border-gray-300 hover:bg-gray-50 transition text-gray-900">
                        <div class="flex items-center space-x-3">
                            <span class="w-3.5 h-3.5 rounded-full bg-yellow-400"></span>
                            <span>Stok Menipis : <span id="mstock-notif-low">0</span> Barang</span>
                        </div>
                        <i class="fa-solid fa-chevron-right text-gray-900"></i>
                    </button>
                    <button onclick="applyMStockFilter('all')" class="w-full flex items-center justify-between p-3.5 rounded-full border border-emerald-500 bg-emerald-100/50 transition text-gray-900">
                        <div class="flex items-center space-x-3">
                            <span class="w-3.5 h-3.5 rounded-full bg-gray-300"></span>
                            <span>Semua Stok : <span id="mstock-notif-all">0</span> Barang</span>
                        </div>
                        <i class="fa-solid fa-chevron-right text-gray-900"></i>
                    </button>
                </div>
                <button onclick="document.getElementById('modal-mstock-notif').classList.add('hidden')" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs mt-5 transition">
                    TUTUP
                </button>
            </div>
        </div>

        <!-- === MODAL AKSI PILIHAN BARANG (SS 1000924785) === -->
        <div id="modal-mstock-aksi" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-4 text-center">AKSI</h3>
                
                <!-- Info Singkat Barang -->
                <div class="flex items-center justify-between mb-5 border-b border-gray-100 pb-4">
                    <div class="flex items-center space-x-3 min-w-0 pr-2">
                        <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs flex-shrink-0 overflow-hidden" id="aksi-b-img">AW</div>
                        <div class="min-w-0">
                            <h4 class="font-bold text-xs text-gray-900 truncate" id="aksi-b-name">Alta Wrap 30x30</h4>
                            <p class="text-[10px] text-gray-500 truncate" id="aksi-b-sku">alta30</p>
                        </div>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <p class="text-[11px] text-gray-500" id="aksi-b-price">Rp 16.000</p>
                        <p class="text-xs font-bold text-emerald-600" id="aksi-b-stock">57 pak</p>
                    </div>
                </div>

                <!-- 3 Pilihan Menu Aksi -->
                <div class="space-y-3 font-extrabold text-xs text-gray-900">
                    <button onclick="mstockOpenAksiTambahKurang()" class="w-full flex items-center justify-between p-3.5 rounded-full border border-gray-300 hover:bg-gray-50 transition">
                        <span>Tambah / Kurang Stok</span><i class="fa-solid fa-chevron-right"></i>
                    </button>
                    <button onclick="mstockOpenAksiEditSisa()" class="w-full flex items-center justify-between p-3.5 rounded-full border border-gray-300 hover:bg-gray-50 transition">
                        <span>Edit / Lihat Stok</span><i class="fa-solid fa-chevron-right"></i>
                    </button>
                    <button onclick="mstockOpenAksiLogBarang()" class="w-full flex items-center justify-between p-3.5 rounded-full border border-gray-300 hover:bg-gray-50 transition">
                        <span>Log Barang</span><i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>

                <button onclick="document.getElementById('modal-mstock-aksi').classList.add('hidden')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md mt-5 transition">
                    OK
                </button>
            </div>
        </div>

        <!-- === MODAL TAMBAH / KURANG STOK CEPAT (SS 1000924786) === -->
        <div id="modal-mstock-tambah-kurang" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">MANAGEMEN STOK</h3>
                
                <div class="flex justify-between items-center mb-4">
                    <span class="text-xs font-bold text-gray-900">Stok saat ini</span>
                    <span class="text-base font-extrabold text-gray-900" id="tk-stok-saat-ini">57</span>
                </div>

                <div class="flex items-center space-x-6 mb-4">
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="rad_tk_stok" value="add" checked class="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300">
                        <span class="text-xs font-bold text-gray-900">Tambah</span>
                    </label>
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="rad_tk_stok" value="min" class="w-5 h-5 text-gray-400 focus:ring-emerald-500 border-gray-300">
                        <span class="text-xs text-gray-700">Kurangi</span>
                    </label>
                </div>

                <div class="space-y-3 text-xs">
                    <div>
                        <span class="block text-gray-600 mb-1">Klik untuk menambahkan tanggal</span>
                        <input type="text" id="tk-input-date" class="w-full border border-emerald-600 rounded-full p-3 px-4 font-bold text-emerald-700 focus:outline-none">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <span class="block text-gray-600 mb-1">Harga Beli Terakhir</span>
                            <input type="number" id="tk-input-buyprice" class="w-full border border-emerald-600 rounded-full p-3 px-4 font-bold text-gray-900 focus:outline-none">
                        </div>
                        <div>
                            <span class="block text-gray-600 mb-1">Jumlah</span>
                            <input type="number" id="tk-input-qty" placeholder="Jumlah" class="w-full border border-emerald-600 rounded-full p-3 px-4 font-bold text-gray-900 focus:outline-none">
                        </div>
                    </div>
                    <div>
                        <span class="block text-gray-600 mb-1">Keterangan</span>
                        <input type="text" id="tk-input-notes" placeholder="Keterangan" class="w-full border border-emerald-600 rounded-full p-3 px-4 font-bold text-gray-900 focus:outline-none">
                    </div>
                </div>

                <p class="text-[10px] text-gray-500 mt-3 leading-relaxed">
                    *Disarankan tambah stok lewat <span onclick="if(window.switchView) window.switchView('pembelian');" class="text-emerald-600 font-bold cursor-pointer">Pembelian</span> agar tercatat di pengeluaran.
                </p>

                <div class="grid grid-cols-2 gap-3 pt-4">
                    <button onclick="document.getElementById('modal-mstock-tambah-kurang').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="mstockSaveTambahKurang()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">SIMPAN</button>
                </div>
            </div>
        </div>

        <!-- === MODAL INFO METODE AKUNTANSI LOG BARANG (SS 1000924791) === -->
        <div id="modal-log-b-info-harga" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-xl w-full max-w-xs overflow-hidden shadow-2xl p-6 text-center space-y-4">
                <h3 class="font-extrabold text-xs uppercase tracking-wider text-gray-900 border-b pb-3">LOG BARANG</h3>
                <div class="w-12 h-12 rounded-full border-2 border-emerald-600 text-emerald-600 flex items-center justify-center text-2xl font-bold mx-auto mt-2">!</div>
                <p class="text-[11px] text-gray-800 font-medium leading-relaxed">Jika metode akuntansi toko menggunakan fifo,lifo, dan average maka harga dasarnya tertulis " - "</p>
                <div class="pt-2">
                    <button onclick="this.closest('#modal-log-b-info-harga').classList.add('hidden')" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md">OK</button>
                </div>
            </div>
        </div>

        <!-- === MODAL EDIT STOK PER BATCH (SS 1000924795) === -->
        <div id="modal-edit-stok-batch" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">EDIT STOK</h3>
                <div class="space-y-3 text-xs">
                    <button type="button" class="w-full border border-emerald-600 rounded-full py-3 text-emerald-700 font-bold" id="ebatch-btn-date">2026/09/01 13:53:45</button>
                    
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <span class="block text-gray-600 mb-1 font-semibold">Harga Dasar</span>
                            <input type="number" id="ebatch-input-price" class="w-full border border-gray-300 rounded-full p-3 px-4 font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                        </div>
                        <div>
                            <span class="block text-gray-600 mb-1 font-semibold">Jumlah</span>
                            <input type="number" id="ebatch-input-qty" class="w-full border border-gray-300 rounded-full p-3 px-4 font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                        </div>
                    </div>
                    <div>
                        <span class="block text-gray-600 mb-1 font-semibold">Keterangan</span>
                        <input type="text" id="ebatch-input-notes" placeholder="Keterangan" class="w-full border border-gray-300 rounded-full p-3 px-4 font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                    </div>
                </div>

                <p class="text-[10px] text-gray-500 mt-3 leading-relaxed">
                    *Disarankan tambah stok lewat <span onclick="if(window.switchView) window.switchView('pembelian');" class="text-emerald-600 font-bold cursor-pointer">Pembelian</span> agar tercatat di pengeluaran.
                </p>

                <div class="grid grid-cols-2 gap-3 pt-4">
                    <button onclick="document.getElementById('modal-edit-stok-batch').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="saveEditStokBatch()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">SIMPAN</button>
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
    // 3. LOGIKA STATE & DATA
    // ========================================================================
    let mstockSortMode = 'sku'; // 'name', 'sku', 'price', 'stock', 'latest'
    let mstockNotifMode = 'all'; // 'all', 'low', 'empty'
    let activeMStockProduct = null;
    let activeLogBatchItem = null;
    let activeEditingBatchIdx = -1;

    // Pastikan dummy log ada untuk Alta Wrap 30x30 agar mirip SS 1000924788
    function ensureProductHasLogsAndBatches() {
        const p = (window.products || []).find(x => x.name.toLowerCase().includes('alta wrap 30'));
        if (p && !p.logs) {
            p.logs = [
                { date: "2026-10-13 14:16:50", day: "13", my: "Okt 2026", in: 0, out: 2, st: 57, buyPrice: 11000.66, mode: "transaksi", staff: "rlalifia@gmail.com", notes: "(apps) kurang stok transaksi baru 151374420261013141649" },
                { date: "2026-10-12 11:52:02", day: "12", my: "Okt 2026", in: 0, out: 2, st: 59, buyPrice: 11000.66, mode: "transaksi", staff: "Adm", notes: "-" },
                { date: "2026-10-10 09:48:58", day: "10", my: "Okt 2026", in: 0, out: 1, st: 61, buyPrice: 11000.66, mode: "transaksi", staff: "Adm", notes: "-" },
                { date: "2026-10-10 09:29:48", day: "10", my: "Okt 2026", in: 0, out: 1, st: 62, buyPrice: 11000.66, mode: "transaksi", staff: "Adm", notes: "-" },
                { date: "2026-10-03 13:47:17", day: "03", my: "Okt 2026", in: 0, out: 1, st: 63, buyPrice: 11000.66, mode: "transaksi", staff: "Adm", notes: "-" },
                { date: "2026-10-02 07:02:14", day: "02", my: "Okt 2026", in: 0, out: 1, st: 64, buyPrice: 11000.66, mode: "transaksi", staff: "Adm", notes: "-" },
                { date: "2026-10-01 08:26:08", day: "01", my: "Okt 2026", in: 0, out: 1, st: 65, buyPrice: 11000.66, mode: "transaksi", staff: "Adm", notes: "-" },
                { date: "2026-09-30 12:14:47", day: "30", my: "Sep 2026", in: 0, out: 1, st: 66, buyPrice: 11000.66, mode: "transaksi", staff: "Adm", notes: "-" },
                { date: "2026-09-29 14:26:57", day: "29", my: "Sep 2026", in: 48, out: 0, st: 67, buyPrice: 11000.66, mode: "pembelian", staff: "Adm", notes: "Pembelian dari supplier" }
            ];
            p.stockBatches = [
                { dateStr: "01 Sep 2026", fullDate: "2026/09/01 13:53:45", stock: 9, buyPrice: 11000.66 },
                { dateStr: "29 Sep 2026", fullDate: "2026/09/29 14:26:57", stock: 48, buyPrice: 11000.66 }
            ];
            p.buyPrice = 11000.66;
            p.stock = 57;
        }
    }

    // ========================================================================
    // 4. LOGIKA HALAMAN UTAMA MANAJEMEN STOK (SS 1000924776 - 1000924778)
    // ========================================================================
    window.openManajemenStokMenuView = () => {
        ensureProductHasLogsAndBatches();
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-manajemen-stok').classList.remove('hidden');
        
        // Update angka notif stok
        const minStock = Number(localStorage.getItem('toko_min_stock')) || 20;
        const prods = window.products || [];
        const eCount = prods.filter(p => (Number(p.stock) || 0) <= 0).length;
        const lCount = prods.filter(p => (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) <= minStock).length;
        document.getElementById('mstock-notif-empty').innerText = eCount;
        document.getElementById('mstock-notif-low').innerText = lCount;
        document.getElementById('mstock-notif-all').innerText = prods.length;

        window.renderManajemenStokList('');
    };

    window.applyMStockFilter = (mode) => {
        mstockNotifMode = mode;
        document.getElementById('modal-mstock-notif').classList.add('hidden');
        window.renderManajemenStokList(document.getElementById('input-search-mstock').value);
    };

    window.applyMStockSort = (mode) => {
        mstockSortMode = mode;
        document.getElementById('dropdown-mstock-sort').classList.add('hidden');
        window.renderManajemenStokList(document.getElementById('input-search-mstock').value);
    };

    window.renderManajemenStokList = function(keyword = '') {
        const container = document.getElementById('container-mstock-rows');
        if (!container) return;
        container.innerHTML = '';

        const k = (keyword || '').toLowerCase();
        const minStock = Number(localStorage.getItem('toko_min_stock')) || 20;

        let list = (window.products || []).filter(p => {
            const stk = Number(p.stock) || 0;
            if (mstockNotifMode === 'empty' && stk > 0) return false;
            if (mstockNotifMode === 'low' && (stk <= 0 || stk > minStock)) return false;
            return (p.name || '').toLowerCase().includes(k) || (p.sku || '').toLowerCase().includes(k);
        });

        list.sort((a, b) => {
            if (mstockSortMode === 'name') return (a.name || '').localeCompare(b.name || '');
            if (mstockSortMode === 'sku') return (a.sku || '').localeCompare(b.sku || '', undefined, { numeric: true });
            if (mstockSortMode === 'price') return (Number(a.price) || 0) - (Number(b.price) || 0);
            if (mstockSortMode === 'stock') return (Number(a.stock) || 0) - (Number(b.stock) || 0);
            return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0); // latest
        });

        list.forEach(p => {
            const stk = Number(p.stock) || 0;
            const sColor = stk <= 0 ? 'text-red-500' : (stk <= minStock ? 'text-amber-400' : 'text-emerald-500');
            const initials = p.name ? p.name.trim().substring(0, 2) : 'RL';
            const bpFormat = p.buyPrice ? Number(p.buyPrice).toLocaleString('id-ID', {minimumFractionDigits: 0, maximumFractionDigits: 2}) : '0';

            container.innerHTML += `
                <div onclick="openMStockAksiModal('${p.id}')" class="p-3.5 bg-white flex items-center justify-between hover:bg-emerald-50/50 cursor-pointer transition">
                    <div class="flex items-center space-x-3.5 min-w-0 pr-2">
                        <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-gray-500 font-bold text-base flex-shrink-0 shadow-inner overflow-hidden">
                            ${p.image ? `<img src="${p.image}" class="w-full h-full object-cover">` : initials}
                        </div>
                        <div class="min-w-0">
                            <h4 class="font-bold text-sm text-gray-900 truncate">${p.name}</h4>
                            <p class="text-[11px] text-gray-500 truncate mt-0.5">${p.sku || '-'}</p>
                            <span class="inline-block bg-slate-100 text-gray-600 text-[10px] px-2.5 py-0.5 rounded mt-1.5 font-medium">Hrg Beli Terakhir Rp ${bpFormat}</span>
                        </div>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <p class="font-bold text-sm ${sColor}">${stk}</p>
                        <p class="text-xs font-medium text-gray-600 mt-1">Rp ${Number(p.price || 0).toLocaleString('id-ID')}</p>
                    </div>
                </div>
            `;
        });
    };

    // ========================================================================
    // 5. POPUP AKSI & TAMBAH/KURANG STOK CEPAT (SS 1000924785 - 1000924786)
    // ========================================================================
    window.openMStockAksiModal = (pid) => {
        const p = (window.products || []).find(x => x.id === pid);
        if (!p) return;
        activeMStockProduct = p;

        const initials = p.name ? p.name.trim().substring(0, 2) : 'RL';
        const imgBox = document.getElementById('aksi-b-img');
        if (p.image) {
            imgBox.innerHTML = `<img src="${p.image}" class="w-full h-full object-cover">`;
        } else {
            imgBox.innerHTML = initials;
        }

        document.getElementById('aksi-b-name').innerText = p.name;
        document.getElementById('aksi-b-sku').innerText = p.sku || '-';
        document.getElementById('aksi-b-price').innerText = `Rp ${Number(p.price || 0).toLocaleString('id-ID')}`;
        
        const stk = Number(p.stock) || 0;
        const sEl = document.getElementById('aksi-b-stock');
        sEl.innerText = `${stk} ${p.unit || 'pcs'}`;
        sEl.className = stk <= 0 ? 'text-xs font-bold text-red-500' : 'text-xs font-bold text-emerald-600';

        document.getElementById('modal-mstock-aksi').classList.remove('hidden');
    };

    window.mstockOpenAksiTambahKurang = () => {
        document.getElementById('modal-mstock-aksi').classList.add('hidden');
        document.getElementById('tk-stok-saat-ini').innerText = activeMStockProduct.stock || 0;
        document.getElementById('tk-input-date').value = window.getFormattedCurrentDateTime().replace(/\//g, '-');
        document.getElementById('tk-input-buyprice').value = activeMStockProduct.buyPrice || 0;
        document.getElementById('tk-input-qty').value = '';
        document.getElementById('tk-input-notes').value = '';
        document.querySelector('input[name="rad_tk_stok"][value="add"]').checked = true;
        document.getElementById('modal-mstock-tambah-kurang').classList.remove('hidden');
    };

    window.mstockSaveTambahKurang = () => {
        const isAdd = document.querySelector('input[name="rad_tk_stok"]:checked').value === 'add';
        const qty = parseInt(document.getElementById('tk-input-qty').value) || 0;
        if (qty <= 0) return alert("Jumlah stok tidak valid!");

        let current = Number(activeMStockProduct.stock) || 0;
        if (!isAdd && qty > current) return alert("Jumlah kurang melebihi stok yang ada!");

        activeMStockProduct.stock = isAdd ? (current + qty) : (current - qty);
        
        // Catat ke Log sederhana
        if (!activeMStockProduct.logs) activeMStockProduct.logs = [];
        activeMStockProduct.logs.unshift({
            date: document.getElementById('tk-input-date').value,
            day: new Date().getDate().toString().padStart(2,'0'),
            my: "Okt 2026",
            in: isAdd ? qty : 0,
            out: isAdd ? 0 : qty,
            st: activeMStockProduct.stock,
            buyPrice: document.getElementById('tk-input-buyprice').value,
            mode: "manual",
            staff: "Adm",
            notes: document.getElementById('tk-input-notes').value || "Penyesuaian Manual"
        });

        alert(`Stok berhasil di${isAdd ? 'tambah' : 'kurangi'}!`);
        document.getElementById('modal-mstock-tambah-kurang').classList.add('hidden');
        window.renderManajemenStokList(document.getElementById('input-search-mstock').value);
    };

    // ========================================================================
    // 6. LOG BARANG & DETAILNYA (SS 1000924787 - 1000924790)
    // ========================================================================
    window.mstockOpenAksiLogBarang = () => {
        document.getElementById('modal-mstock-aksi').classList.add('hidden');
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-log-barang').classList.remove('hidden');

        document.getElementById('log-b-name').innerText = activeMStockProduct.name;
        document.getElementById('log-b-sku').innerText = activeMStockProduct.sku || '-';
        renderLogBarangHistory();
    };

    window.closeLogBarangView = () => {
        document.getElementById('view-log-barang').classList.add('hidden');
        document.getElementById('view-manajemen-stok').classList.remove('hidden');
    };

    function renderLogBarangHistory() {
        const container = document.getElementById('container-log-barang-history');
        container.innerHTML = '';
        const logs = activeMStockProduct.logs || [];

        if (logs.length === 0) {
            container.innerHTML = `<div class="py-10 text-center text-xs text-gray-400">Belum ada riwayat log barang.</div>`;
            return;
        }

        logs.forEach((lg, idx) => {
            container.innerHTML += `
                <div onclick="openDetailLogBarang(${idx})" class="py-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition text-xs">
                    <div class="flex items-center space-x-3 w-1/3">
                        <span class="text-2xl font-extrabold text-gray-900">${lg.day}</span>
                        <div class="leading-tight">
                            <span class="block text-[9px] text-gray-500 font-semibold mb-0.5">${lg.date.split(' ')[1] || '00:00:00'}</span>
                            <span class="block text-[10px] font-bold text-gray-700">${lg.my}</span>
                        </div>
                    </div>
                    <div class="flex-1 grid grid-cols-3 text-center font-bold text-gray-900">
                        <div><span class="block text-[10px] text-gray-500 mb-0.5">Masuk</span>${lg.in}</div>
                        <div><span class="block text-[10px] text-gray-500 mb-0.5">Keluar</span>${lg.out}</div>
                        <div><span class="block text-[10px] text-gray-500 mb-0.5">Stok</span>${lg.st}</div>
                    </div>
                    <div class="w-6 text-right text-emerald-700 text-sm"><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            `;
        });
    }

    window.openDetailLogBarang = (idx) => {
        const lg = activeMStockProduct.logs[idx];
        if (!lg) return;
        activeLogBatchItem = lg;

        document.getElementById('view-log-barang').classList.add('hidden');
        document.getElementById('view-detail-log-barang').classList.remove('hidden');

        document.getElementById('det-log-b-header-date').innerText = lg.date.split(' ')[0].replace(/\-/g, '/');
        document.getElementById('det-log-b-name').innerText = activeMStockProduct.name;
        document.getElementById('det-log-b-sku').innerText = activeMStockProduct.sku || '-';
        
        document.getElementById('det-log-b-masuk').innerText = lg.in;
        document.getElementById('det-log-b-out').innerText = lg.out;
        document.getElementById('det-log-b-stok').innerText = lg.st;

        document.getElementById('det-log-b-harga-dasar').innerText = '-';
        document.getElementById('det-log-b-harga-jual').innerText = `Rp ${Number(activeMStockProduct.price || 0).toLocaleString('id-ID')}`;
        document.getElementById('det-log-b-mode').innerText = lg.mode || 'transaksi';
        document.getElementById('det-log-b-staff').innerText = lg.staff || 'rlalifia@gmail.com';
        document.getElementById('det-log-b-keterangan').innerText = lg.notes || '-';
    };

    window.closeDetailLogBarangView = () => {
        document.getElementById('view-detail-log-barang').classList.add('hidden');
        document.getElementById('view-log-barang').classList.remove('hidden');
    };

    // ========================================================================
    // 7. EDIT / LIHAT STOK PER BATCH & PROYEKSI (SS 1000924793 - 1000924795)
    // ========================================================================
    window.mstockOpenAksiEditSisa = () => {
        document.getElementById('modal-mstock-aksi').classList.add('hidden');
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-edit-sisa-stok').classList.remove('hidden');

        document.getElementById('edit-s-name').innerText = activeMStockProduct.name;
        document.getElementById('edit-s-sku').innerText = activeMStockProduct.sku || '-';
        document.getElementById('edit-s-stock').innerText = activeMStockProduct.stock || 0;
        document.getElementById('edit-s-price').innerText = `Rp ${Number(activeMStockProduct.price || 0).toLocaleString('id-ID')}`;
        
        const bp = Number(activeMStockProduct.buyPrice || 0);
        document.getElementById('edit-s-buyprice').innerText = `Rp ${bp.toLocaleString('id-ID', {minimumFractionDigits:0, maximumFractionDigits:2})}`;

        // Kalkulasi Proyeksi Omzet & Keuntungan
        const stk = Number(activeMStockProduct.stock) || 0;
        const prc = Number(activeMStockProduct.price) || 0;
        const modal = stk * bp;
        const omzet = stk * prc;
        const profit = omzet - modal;

        document.getElementById('edit-s-sisamodal').innerText = `Rp ${modal.toLocaleString('id-ID', {minimumFractionDigits:0, maximumFractionDigits:2})}`;
        document.getElementById('edit-s-omzet').innerText = `Rp ${omzet.toLocaleString('id-ID')}`;
        document.getElementById('edit-s-profit').innerText = `Rp ${profit.toLocaleString('id-ID', {minimumFractionDigits:0, maximumFractionDigits:2})}`;

        renderEditStokBatches();
    };

    window.closeEditSisaStokView = () => {
        document.getElementById('view-edit-sisa-stok').classList.add('hidden');
        document.getElementById('view-manajemen-stok').classList.remove('hidden');
        window.renderManajemenStokList(document.getElementById('input-search-mstock').value);
    };

    function renderEditStokBatches() {
        const container = document.getElementById('container-edit-sisa-stok-batches');
        container.innerHTML = '';
        const batches = activeMStockProduct.stockBatches || [];

        if (batches.length === 0) {
            container.innerHTML = `<div class="text-center text-xs text-gray-400 py-4">Data batch stok masuk tidak tersedia.</div>`;
            return;
        }

        batches.forEach((b, idx) => {
            const bPrice = Number(b.buyPrice || 0).toLocaleString('id-ID', {minimumFractionDigits:0, maximumFractionDigits:2});
            container.innerHTML += `
                <div class="flex justify-between items-end border-b border-gray-100 pb-3">
                    <div class="space-y-1 text-xs">
                        <span class="text-gray-500 font-semibold block mb-0.5">Tanggal Masuk</span>
                        <span class="font-extrabold text-gray-900 block">${b.dateStr}</span>
                        <span class="text-gray-500 font-semibold block pt-2 mb-0.5">Sisa stok</span>
                        <span class="font-extrabold text-gray-900 block">${b.stock}</span>
                    </div>
                    <div class="text-right space-y-1 text-xs">
                        <div class="flex justify-end space-x-3 text-lg mb-2">
                            <button onclick="openModalEditBatch(${idx})" class="text-emerald-600 hover:text-emerald-800"><i class="fa-solid fa-pen"></i></button>
                            <button onclick="alert('Hapus Batch')" class="text-red-500 hover:text-red-700"><i class="fa-regular fa-trash-can"></i></button>
                        </div>
                        <span class="text-gray-500 font-semibold block mb-0.5 pt-2">Harga Dasar</span>
                        <span class="font-extrabold text-gray-900 block">Rp ${bPrice}</span>
                    </div>
                </div>
            `;
        });
    }

    window.openModalEditBatch = (idx) => {
        activeEditingBatchIdx = idx;
        const b = activeMStockProduct.stockBatches[idx];
        document.getElementById('ebatch-btn-date').innerText = b.fullDate || '2026/09/01 13:53:45';
        document.getElementById('ebatch-input-price').value = b.buyPrice || 0;
        document.getElementById('ebatch-input-qty').value = b.stock || 0;
        document.getElementById('ebatch-input-notes').value = '';
        document.getElementById('modal-edit-stok-batch').classList.remove('hidden');
    };

    window.saveEditStokBatch = () => {
        const b = activeMStockProduct.stockBatches[activeEditingBatchIdx];
        const newQty = parseInt(document.getElementById('ebatch-input-qty').value) || 0;
        const newPrice = parseFloat(document.getElementById('ebatch-input-price').value) || 0;

        const selisih = newQty - b.stock;
        b.stock = newQty;
        b.buyPrice = newPrice;
        
        // Update stok total produk
        activeMStockProduct.stock = (Number(activeMStockProduct.stock) || 0) + selisih;
        
        document.getElementById('modal-edit-stok-batch').classList.add('hidden');
        window.mstockOpenAksiEditSisa(); // Refresh ulang layar Proyeksi
        alert("Batch stok berhasil diubah!");
    };
})();
