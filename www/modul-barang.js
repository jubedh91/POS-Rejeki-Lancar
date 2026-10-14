// ============================================================================
// MODUL 2: MANAJEMEN BARANG, FILTER, SCANNER KAMERA (MODE A/B), & KATEGORI
// (DIROMBAK KE DESAIN KASIR PINTAR KLASIK)
// ============================================================================

(function() {
    // 1. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- === VIEW DAFTAR BARANG ATAU JASA (DESAIN KLASIK) === -->
        <div id="view-products" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <!-- Header Solid Hijau Klasik -->
            <div class="px-4 py-3 bg-emerald-600 text-white flex items-center justify-between shadow-sm z-20">
                <div class="flex items-center space-x-4">
                    <button onclick="handleBackFromProductsView()" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 id="products-header-title" class="text-base font-bold tracking-wide">Barang</h2>
                </div>
                <!-- Menu Titik Tiga Kanan Atas -->
                <div class="relative">
                    <button onclick="toggleProductMenu()" class="text-white text-xl p-1 focus:outline-none"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                    <div id="product-dropdown-menu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-2xl border border-gray-100 py-1 hidden z-50">
                        <button onclick="openImportCSVModal(); toggleProductMenu();" class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 transition block">Import Excel (csv)</button>
                        <button onclick="exportProductsCSV(); toggleProductMenu();" class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 transition block">Export Excel (csv)</button>
                        <button onclick="openProductSubView('settings'); toggleProductMenu();" class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 transition block">Pengaturan</button>
                        <button onclick="openProductSubView('summary'); toggleProductMenu();" class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 transition block">Rincian</button>
                    </div>
                </div>
            </div>

            <!-- Bilah Kontrol Corong Notifikasi, Filter Sortir, Pencarian, & Barcode Kamera -->
            <div class="p-3 bg-white border-b flex items-center space-x-2 relative z-10">
                <!-- Ikon Corong: Popup Notifikasi Stok -->
                <button onclick="openFilterStockModal()" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-filter"></i></button>
                <!-- Ikon Panah Naik & Garis: Popup Filter Urutan -->
                <button onclick="openSortStockModal()" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                <!-- Kotak Cari Barang -->
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" id="inventory-search-box" oninput="filterInventory(this.value)" placeholder="Cari nama atau kode barang" class="w-full pl-10 pr-4 py-2 border border-emerald-600 rounded-full focus:outline-none focus:border-emerald-700 text-xs bg-white text-gray-900">
                </div>
                <!-- Ikon Barcode: Langsung Mengarah ke Kamera Scan Barcode -->
                <button onclick="openScannerView('inventory')" class="text-emerald-700 text-xl px-2"><i class="fa-solid fa-barcode"></i></button>
            </div>

            <!-- Pill Bar Kategori Horizontal -->
            <div id="inventory-category-bar" class="flex space-x-2 py-2.5 px-3 bg-white border-b overflow-x-auto no-scrollbar text-[11px] whitespace-nowrap z-10"></div>

            <!-- Daftar List Vertikal Barang Klasik -->
            <div class="flex-1 overflow-y-auto bg-gray-50 pb-20" id="inventory-card-list"></div>

            <!-- Tombol Tambah Barang Bawah (Nempel) -->
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10" id="container-btn-add-product">
                <button onclick="if(window.openAddProductView) window.openAddProductView()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    TAMBAH BARANG
                </button>
            </div>
        </div>

        <!-- === SUB-LAYAR PENGATURAN BARANG === -->
        <div id="view-products-settings" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-gray-50 hidden relative">
            <div class="px-4 py-3 bg-emerald-600 text-white flex items-center space-x-4 shadow-sm z-10">
                <button onclick="closeProductSubView()" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold tracking-wide">Pengaturan</h2>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <div onclick="openProductSubView('stock-limit')" class="bg-white border border-gray-200 cursor-pointer flex justify-between items-center p-4 rounded-xl shadow-xs transition hover:shadow-md">
                    <div>
                        <h4 class="font-bold text-sm text-gray-900">Notifikasi batas stok</h4>
                        <p class="text-emerald-600 font-extrabold text-base mt-1" id="disp-settings-min-stock">20</p>
                    </div>
                    <i class="fa-solid fa-chevron-right text-gray-400"></i>
                </div>

                <div onclick="openProductSubView('db-necessity')" class="bg-white border border-gray-200 cursor-pointer flex justify-between items-center p-4 rounded-xl shadow-xs transition hover:shadow-md">
                    <div>
                        <h4 class="font-bold text-sm text-gray-900">Kebutuhan Penyimpanan Data Barang</h4>
                        <p class="text-[11px] text-gray-500 mt-1 font-semibold">Mengatur data apa saja yang disimpan sesuai kebutuhan usaha</p>
                    </div>
                    <i class="fa-solid fa-chevron-right text-gray-400"></i>
                </div>

                <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-4">
                    <div class="border-b border-gray-100 pb-3">
                        <h4 class="font-bold text-sm text-gray-900">Tampilkan Data</h4>
                        <p class="text-[11px] text-gray-500 mt-0.5 font-semibold">Pilih data yang dapat ditampilkan pada daftar barang</p>
                    </div>
                    <div class="space-y-4 text-xs font-bold text-gray-700">
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="chk-disp-harga-dasar" class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                            <span>Harga Dasar</span>
                        </label>
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="chk-disp-diskon" class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                            <span>Diskon</span>
                        </label>
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="chk-disp-tipe-harga" class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                            <span>Keterangan Tipe Harga</span>
                        </label>
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="chk-disp-letak-rak" class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                            <span>Letak Rak</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="saveDisplaySettings()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN
                </button>
            </div>
        </div>

        <!-- === SUB-LAYAR STOCK LIMIT NOTIFICATION === -->
        <div id="view-stock-limit" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-gray-50 hidden relative">
            <div class="px-4 py-3 bg-emerald-600 text-white flex items-center space-x-4 shadow-sm z-10">
                <button onclick="openProductSubView('settings')" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold tracking-wide">Stock Limit Notification</h2>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <p class="text-[11px] text-gray-500 font-semibold leading-relaxed">Notifikasi yang dimunculkan jika jumlah barang kurang dari batas minimum stok</p>
                <div class="bg-white border border-gray-200 shadow-xs rounded-xl p-4">
                    <label class="block text-[11px] font-bold text-gray-500 mb-1.5">Batas minimum stok barang</label>
                    <input type="number" id="input-subview-min-stock" class="w-full bg-transparent text-emerald-700 font-extrabold text-lg focus:outline-none border-b-2 border-emerald-600 pb-1" pattern="[0-9]*" inputmode="numeric">
                </div>
            </div>
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="saveStockLimitNotification()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN
                </button>
            </div>
        </div>

        <!-- === SUB-LAYAR DATABASE NECESSITY === -->
        <div id="view-db-necessity" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-gray-50 hidden relative">
            <div class="px-4 py-3 bg-emerald-600 text-white flex items-center space-x-4 shadow-sm z-10">
                <button onclick="openProductSubView('settings')" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold tracking-wide">Database Necessity</h2>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-5">
                <p class="text-[11px] text-gray-500 font-semibold">Sesuaikan dengan kebutuhan penyimpanan database usaha anda</p>
                <div class="bg-white border border-gray-200 shadow-xs rounded-xl p-4 space-y-4 text-xs font-bold text-gray-700">
                    <label class="flex items-center space-x-3 cursor-pointer"><input type="checkbox" id="chk-nec-harga-dasar" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300"><span>Harga dasar</span></label>
                    <label class="flex items-center space-x-3 cursor-pointer"><input type="checkbox" id="chk-nec-satuan" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300"><span>Satuan (gram,pcs)</span></label>
                    <label class="flex items-center space-x-3 cursor-pointer"><input type="checkbox" id="chk-nec-diskon" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300"><span>Diskon (%)</span></label>
                    <label class="flex items-center space-x-3 cursor-pointer"><input type="checkbox" id="chk-nec-letak-rak" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300"><span>Letak rak</span></label>
                    <label class="flex items-center space-x-3 cursor-pointer"><input type="checkbox" id="chk-nec-keterangan" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300"><span>Keterangan</span></label>
                </div>
                <div class="pt-2">
                    <p class="text-[10px] text-gray-400 font-semibold leading-relaxed">*Apabila stok dicentang maka saat transaksi jumlah barang akan berkurang sesuai jumlah transaksi barang</p>
                </div>
            </div>
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="saveDbNecessity()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN
                </button>
            </div>
        </div>

        <!-- === SUB-LAYAR RINCIAN DATABASE === -->
        <div id="view-db-summary" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-gray-50 hidden relative">
            <div class="px-4 py-3 bg-emerald-600 text-white flex items-center space-x-4 shadow-sm z-10">
                <button onclick="closeProductSubView()" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold tracking-wide">Database</h2>
            </div>
            <div class="p-4 space-y-4">
                <div class="bg-white border border-gray-200 shadow-xs rounded-xl p-5 border-b pb-4">
                    <h4 class="text-[11px] font-semibold text-gray-500 mb-1">Jumlah Barang</h4>
                    <p class="text-xl font-extrabold text-emerald-600" id="db-summary-item-count">0 Item</p>
                </div>
                <div class="bg-white border border-gray-200 shadow-xs rounded-xl p-5 border-b pb-4">
                    <h4 class="text-[11px] font-semibold text-gray-500 mb-1">Total Kuantitas Fisik</h4>
                    <p class="text-lg font-extrabold text-gray-900" id="db-summary-qty-count">0 Pcs</p>
                </div>
                <div id="db-summary-asset-container" class="bg-white border border-gray-200 shadow-xs rounded-xl p-5 border-b pb-4">
                    <h4 class="text-[11px] font-semibold text-gray-500 mb-1">Estimasi Total Modal</h4>
                    <p class="text-lg font-extrabold text-orange-500" id="db-summary-asset-count">Rp 0</p>
                    <span class="inline-block bg-orange-100 text-orange-700 text-[9px] px-2 py-0.5 rounded uppercase tracking-wider font-bold mt-2">Khusus Akses Owner</span>
                </div>
            </div>
        </div>

        <!-- === HALAMAN MANAJEMEN KATEGORI BARANG (KLASIK) === -->
        <div id="view-kategori" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-gray-50 hidden relative">
            <div class="px-4 py-3 bg-emerald-600 text-white border-b flex items-center space-x-4 shadow-sm z-20">
                <button onclick="closeCategoryView()" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold tracking-wide">Kategori Barang</h2>
            </div>

            <!-- Edit Kategori Warning Banner -->
            <div class="bg-emerald-50/50 p-3 mx-4 mt-3 rounded-lg border border-emerald-100 flex space-x-3 items-start z-10 relative">
                <i class="fa-solid fa-pen-to-square text-amber-500 text-lg"></i>
                <p class="text-[10px] font-semibold text-gray-600 leading-relaxed"><b>Edit</b> kategori hanya dapat dilakukan di backoffice. Klik <a href="#" class="text-emerald-600 font-bold hover:underline">di sini</a> untuk atur kategori.</p>
            </div>

            <div class="px-4 py-3 bg-transparent flex items-center space-x-2 relative z-10 mt-1">
                <div class="relative">
                    <button onclick="toggleCategorySortDropdown()" class="text-emerald-700 text-xl px-1 py-1 focus:outline-none"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                    <div id="dropdown-sort-kategori" class="absolute left-0 top-9 w-32 bg-white rounded-md shadow-xl border border-gray-100 overflow-hidden hidden z-50 text-xs font-bold text-gray-900">
                        <button onclick="applyCategorySortOrder('asc')" id="btn-cat-sort-az" class="w-full text-left px-4 py-3 bg-emerald-50 hover:bg-emerald-100 transition block">A-Z</button>
                        <button onclick="applyCategorySortOrder('desc')" id="btn-cat-sort-za" class="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 transition block">Z-A</button>
                    </div>
                </div>
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" id="category-search-box" oninput="filterCategoryList(this.value)" placeholder="Cari Kategori" class="w-full pl-10 pr-4 py-2 border border-emerald-600 rounded-full focus:outline-none focus:border-emerald-700 text-xs bg-white">
                </div>
            </div>

            <div class="flex-1 overflow-y-auto px-4 pb-24 space-y-0 divide-y divide-gray-200" id="list-kategori-rows" onclick="hideCategorySortDropdown()"></div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10 text-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]" id="container-btn-add-kategori">
                <button onclick="openAddCategoryModal()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-md transition active:scale-95 text-xs uppercase tracking-wider flex items-center justify-center">
                    TAMBAH KATEGORI
                </button>
            </div>
        </div>
    `;

    // 2. SUNTIKKAN HTML MODALS & SCANNER KE DALAM #modals-container
    const modalsHTML = `
        <div id="filter-stock-modal" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl p-6 text-center">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-5">NOTIFIKASI</h3>
                <div class="space-y-3 font-semibold text-sm">
                    <button onclick="applyStockFilter('empty')" id="notif-btn-empty" class="w-full flex items-center justify-between p-3.5 rounded-full border border-gray-300 hover:bg-gray-50 transition text-gray-900">
                        <div class="flex items-center space-x-3"><span class="w-3.5 h-3.5 rounded-full bg-red-600"></span><span>Stok Habis : <span id="notif-count-empty">0</span> Barang</span></div><i class="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                    <button onclick="applyStockFilter('low')" id="notif-btn-low" class="w-full flex items-center justify-between p-3.5 rounded-full border border-gray-300 hover:bg-gray-50 transition text-gray-900">
                        <div class="flex items-center space-x-3"><span class="w-3.5 h-3.5 rounded-full bg-yellow-400"></span><span>Stok Menipis : <span id="notif-count-low">0</span> Barang</span></div><i class="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                    <button onclick="applyStockFilter('all')" id="notif-btn-all" class="w-full flex items-center justify-between p-3.5 rounded-full border border-emerald-500 bg-emerald-100/50 hover:bg-emerald-100 transition text-gray-900">
                        <div class="flex items-center space-x-3"><span class="w-3.5 h-3.5 rounded-full bg-gray-300"></span><span>Semua Stok : <span id="notif-count-all">0</span> Barang</span></div><i class="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                </div>
                <button onclick="closeFilterStockModal()" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs mt-5 transition uppercase">TUTUP</button>
            </div>
        </div>

        <div id="sort-stock-modal" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-4 text-center">FILTER</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-[11px] font-semibold text-gray-600 mb-1.5">Urutan</label>
                        <div class="relative">
                            <select id="filter-sort-direction" class="w-full border border-gray-300 rounded-full px-4 py-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600 bg-white appearance-none">
                                <option value="desc">Urutan Turun</option>
                                <option value="asc">Urutan Naik</option>
                            </select>
                            <i class="fa-solid fa-chevron-down text-gray-800 text-xs absolute right-4 top-3.5 pointer-events-none"></i>
                        </div>
                    </div>
                    <div>
                        <label class="block text-[11px] font-semibold text-gray-600 mb-2">Sortir Berdasarkan</label>
                        <div class="space-y-3.5 text-xs text-gray-900 font-bold pl-2">
                            <label class="flex items-center space-x-3 cursor-pointer"><input type="radio" name="sort_criteria" value="name" class="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300"><span>Nama Barang</span></label>
                            <label class="flex items-center space-x-3 cursor-pointer"><input type="radio" name="sort_criteria" value="sku" checked class="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300"><span>Kode</span></label>
                            <label class="flex items-center space-x-3 cursor-pointer"><input type="radio" name="sort_criteria" value="price" class="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300"><span>Harga jual</span></label>
                            <label class="flex items-center space-x-3 cursor-pointer"><input type="radio" name="sort_criteria" value="stock" class="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300"><span>Stok</span></label>
                            <label class="flex items-center space-x-3 cursor-pointer"><input type="radio" name="sort_criteria" value="latest" class="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300"><span>Produk Terbaru</span></label>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 mt-6">
                    <button onclick="closeSortStockModal()" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="applyAdvancedFilterSort()" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">TERAPKAN</button>
                </div>
            </div>
        </div>

        <div id="view-scanner" class="fixed inset-0 bg-black z-[90] hidden flex flex-col">
            <div class="px-4 py-3 bg-black/80 text-white flex items-center justify-between z-30 relative">
                <div class="flex items-center space-x-4">
                    <button onclick="closeScannerView()" class="text-xl font-bold hover:text-emerald-400 p-1"><i class="fa-solid fa-arrow-left"></i></button>
                    <h2 class="text-base font-bold tracking-wide" id="scanner-header-title">Scan Barcode / QR Code</h2>
                </div>
                <div class="relative">
                    <button onclick="toggleScannerMenu()" class="text-xl px-2 py-1 focus:outline-none"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                    <div id="scanner-dropdown-menu" class="absolute right-0 mt-2 w-52 bg-neutral-800 text-white rounded-md shadow-2xl py-1 hidden z-50 text-sm">
                        <button onclick="toggleScannerFlash()" id="scanner-menu-flash" class="w-full text-left px-4 py-3 hover:bg-neutral-700 transition">Flash [OFF]</button>
                        <button onclick="toggleScannerAutoFocus()" id="scanner-menu-autofocus" class="w-full text-left px-4 py-3 hover:bg-neutral-700 transition">Auto Focus [ON]</button>
                        <button onclick="showScannerFormatsModal()" class="w-full text-left px-4 py-3 hover:bg-neutral-700 transition">Formats</button>
                        <button onclick="selectScannerCameraDevice()" class="w-full text-left px-4 py-3 hover:bg-neutral-700 transition">Select a Camera</button>
                        <button onclick="switchScannerMode()" id="scanner-menu-mode" class="w-full text-left px-4 py-3 hover:bg-neutral-700 transition">Beralih Mode B</button>
                    </div>
                </div>
            </div>
            <div class="px-4 pt-4 pb-2 z-20 flex justify-center">
                <div class="relative bg-emerald-100 text-emerald-900 text-[10px] font-bold px-4 py-3 rounded-xl shadow-lg max-w-[280px] w-full text-left leading-relaxed">
                    <span id="scanner-bubble-text">Apabila terdapat kesulitan silahkan Scan di atas garis merah atau mencoba Scan Mode A</span>
                    <div class="absolute -top-1.5 right-6 w-3 h-3 bg-emerald-100 transform rotate-45"></div>
                </div>
            </div>
            <div class="flex-1 relative flex items-center justify-center overflow-hidden">
                <video id="camera-stream-video" autoplay playsinline muted class="absolute inset-0 w-full h-full object-cover"></video>
                <div id="scanner-box-mode-a" class="relative w-72 h-72 z-10 pointer-events-none hidden">
                    <div class="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-lime-400"></div>
                    <div class="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-lime-400"></div>
                    <div class="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-lime-400"></div>
                    <div class="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-lime-400"></div>
                    <div class="absolute left-1 right-1 h-[1px] bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.8)] laser-line"></div>
                </div>
                <div id="scanner-box-mode-b" class="relative w-72 h-48 z-10 pointer-events-none bg-black/40 shadow-[0_0_0_4000px_rgba(0,0,0,0.5)]">
                    <div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-lime-400"></div>
                    <div class="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-lime-400"></div>
                    <div class="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-lime-400"></div>
                    <div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-lime-400"></div>
                    <div class="absolute top-1/2 left-0 right-0 h-px bg-red-500 opacity-80"></div>
                </div>
                <button onclick="toggleScannerManualInputBar()" class="absolute bottom-6 right-6 z-20 w-10 h-10 rounded-full bg-emerald-600/90 text-white flex items-center justify-center text-lg font-bold shadow-lg border border-emerald-300" title="Bantuan / Ketik Manual"><i class="fa-solid fa-question"></i></button>
            </div>
            <div id="scanner-manual-bar" class="p-3 bg-black/90 text-center z-20 hidden">
                <div class="flex space-x-2 max-w-sm mx-auto">
                    <input type="text" id="scanner-manual-code" placeholder="Ketik kode barcode manual jika kemasan rusak..." class="flex-1 bg-neutral-800 text-white text-xs px-4 py-3 rounded-full border border-neutral-600 focus:outline-none focus:border-emerald-500">
                    <button onclick="submitManualBarcode()" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-full">Pakai</button>
                </div>
            </div>
        </div>

        <div id="modal-add-category" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl p-6 text-center">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-5" id="modal-category-form-title">TAMBAH KATEGORI</h3>
                <div class="text-left mb-6">
                    <label class="block text-[11px] font-semibold text-gray-600 mb-1.5">Nama Kategori</label>
                    <input type="text" id="input-new-cat-name" placeholder="Nama Kategori" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="closeAddCategoryModal()" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase shadow-xs transition">BATAL</button>
                    <button onclick="saveCategoryModalForm()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">SIMPAN</button>
                </div>
            </div>
        </div>

        <div id="modal-import-csv" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-3 text-center">IMPORT EXCEL (CSV)</h3>
                <p class="text-[10px] text-gray-500 text-center mb-5 font-semibold">Format kolom CSV: Kode SKU, Kategori, Nama Barang, Harga Modal, Harga Jual, Stok</p>
                <input type="file" id="input-import-csv-file" accept=".csv" class="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 mb-6 cursor-pointer">
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="closeImportCSVModal()" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="processImportCSVFile()" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">IMPORT</button>
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
    // 3. LOGIKA JAVASCRIPT DAFTAR BARANG, FILTER, SCANNER, & KATEGORI
    // ========================================================================
    let activeCategoryFilter = 'Semua item';
    let activeStockNotifFilter = 'all'; // 'all', 'empty', 'low'
    let categorySortAsc = true;
    let editingCategoryOldName = null;
    let openedProductsFromCategoryView = false;

    // Data bawaan visual untuk demo kategori 
    const defaultCategoryStats = {
        "atk": { sisa: 8011, modal: "16.047.305,06" },
        "bahan makanan": { sisa: 5424, modal: "14.732.103,89" },
        "baskom": { sisa: 2229, modal: "2.214.468,62" },
        "cup gelas": { sisa: 9409, modal: "57.130.559,4" },
        "diskon": { sisa: 151, modal: "5.635.000" },
        "foam": { sisa: 96950, modal: "30.575.843,5" },
        "hari ultah": { sisa: 7665, modal: "9.289.974,02" },
        "jet roll": { sisa: 0, modal: "0" },
        "kardus": { sisa: 95899, modal: "45.564.561,86" }
    };

    let cameraStream = null;
    let scannerTargetMode = 'inventory';
    let currentScannerVisualMode = 'B';
    let scannerFlashOn = false;
    let scannerAutoFocusOn = true;
    let availableVideoDevices = [];
    let currentVideoDeviceIndex = 0;
    let barcodeDetectInterval = null;

    // --- TOMBOL KEMBALI DARI DAFTAR BARANG ---
    window.handleBackFromProductsView = () => {
        if (openedProductsFromCategoryView) {
            openedProductsFromCategoryView = false;
            window.filterInventoryByCategory('Semua item');
            window.switchView('kategori');
        } else {
            window.switchView('manajemen-hub');
        }
    };

    // --- MENU TITIK TIGA BARANG ---
    window.toggleProductMenu = () => {
        const menu = document.getElementById('product-dropdown-menu');
        if (menu) menu.classList.toggle('hidden');
    };

    // --- RENDER KARTU DAFTAR BARANG (KLASIK UI) ---
    window.renderInventoryCards = function(list) {
        const container = document.getElementById('inventory-card-list');
        if (!container) return;
        container.innerHTML = '';

        const sourceList = Array.isArray(list) ? list : (window.products || []);
        if (sourceList.length === 0) {
            container.innerHTML = `<div class="p-10 text-center text-gray-400 text-xs font-semibold">Tidak ada barang yang ditemukan.</div>`;
            return;
        }

        const minStock = Number(localStorage.getItem('toko_min_stock')) || 20;
        const showHargaDasar = localStorage.getItem('disp_harga_dasar') !== 'false';
        const showDiskon = localStorage.getItem('disp_diskon') === 'true';
        const showTipeHarga = localStorage.getItem('disp_tipe_harga') === 'true';
        const showLetakRak = localStorage.getItem('disp_letak_rak') === 'true';
        const isOwner = (window.activeKasir || 'Owner').toLowerCase().includes('owner') || (window.activeKasir || '').toLowerCase().includes('admin');

        sourceList.forEach(p => {
            const initials = p.name ? p.name.trim().substring(0, 2) : 'RL';
            const stk = Number(p.stock) || 0;
            let stockColor = 'text-emerald-600'; // Sesuai SS 1000926449 warna sisa
            if (stk <= 0) stockColor = 'text-red-500';
            else if (stk <= minStock) stockColor = 'text-amber-500';

            const badgeHargaBeli = (showHargaDasar && isOwner)
                ? `<span class="inline-block bg-gray-100 text-gray-500 text-[9px] px-2 py-0.5 rounded font-bold mt-1.5 shadow-sm border border-gray-200">Hrg Beli Terakhir Rp ${Number(p.buyPrice || 0).toLocaleString('id-ID')}</span>`
                : '';

            const badgeDiskon = (showDiskon && Number(p.discountVal) > 0)
                ? `<span class="inline-block bg-red-50 text-red-600 text-[9px] px-2 py-0.5 rounded font-bold mt-1.5 ml-1 border border-red-100 shadow-sm">Diskon ${p.discountType === 'pct' ? p.discountVal + '%' : 'Rp ' + Number(p.discountVal).toLocaleString('id-ID')}</span>`
                : '';

            container.innerHTML += `
                <div onclick="if(window.openProductDetailView) window.openProductDetailView('${p.id}')" class="px-4 py-3 bg-white flex items-start space-x-3 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-extrabold text-lg flex-shrink-0 shadow-inner overflow-hidden border border-gray-200">
                        ${p.image ? `<img src="${p.image}" class="w-full h-full object-cover">` : initials}
                    </div>
                    <div class="flex-1 min-w-0 pr-2 pt-0.5">
                        <h4 class="font-extrabold text-[13px] text-gray-600 truncate">${p.name}</h4>
                        <p class="text-[10px] text-gray-500 font-semibold mt-0.5">sisa <span class="${stockColor}">${stk}</span> <span class="mx-1">•</span> Rp ${Number(p.price || 0).toLocaleString('id-ID')}</p>
                        <div class="flex flex-wrap">${badgeHargaBeli}${badgeDiskon}</div>
                    </div>
                </div>
            `;
        });
    };

    // --- PENCARIAN & BAR KATEGORI (KLASIK UI) ---
    window.filterInventory = (keyword) => {
        const k = (keyword || '').toLowerCase();
        const baseList = activeCategoryFilter === 'Semua item'
            ? (window.products || [])
            : (window.products || []).filter(p => (p.category || 'Umum').toLowerCase() === activeCategoryFilter.toLowerCase());

        const filtered = baseList.filter(p =>
            (p.name || '').toLowerCase().includes(k) ||
            (p.sku || '').toLowerCase().includes(k)
        );
        window.renderInventoryCards(filtered);
    };

    window.renderInventoryCategories = function() {
        const bar = document.getElementById('inventory-category-bar');
        if (!bar) return;

        let categories = ["Semua item"];
        (window.masterCategories || []).forEach(c => {
            if (c !== 'Umum' && !categories.some(x => x.toLowerCase() === c.toLowerCase())) {
                categories.push(c);
            }
        });
        (window.products || []).forEach(p => {
            const c = p.category && p.category.trim() !== '' ? p.category.trim() : "Umum";
            if (!categories.some(x => x.toLowerCase() === c.toLowerCase())) {
                categories.push(c);
            }
        });

        bar.innerHTML = '';
        categories.forEach(cat => {
            const isSelected = activeCategoryFilter.toLowerCase() === cat.toLowerCase();
            const pillClass = isSelected
                ? 'bg-emerald-50 text-emerald-600 border-emerald-600 font-bold rounded-full px-4 py-1.5 border transition'
                : 'bg-white text-emerald-600 border-emerald-600 font-semibold rounded-full px-4 py-1.5 border hover:bg-emerald-50 transition';

            bar.innerHTML += `
                <button id="inv-cat-pill-${cat.replace(/\s+/g, '-')}" onclick="filterInventoryByCategory('${cat}')" class="text-[11px] ${pillClass}">
                    ${cat}
                </button>
            `;
        });
    };

    window.filterInventoryByCategory = (cat) => {
        activeCategoryFilter = cat;
        const headerTitle = document.getElementById('products-header-title');

        if (cat === 'Semua item') {
            if (headerTitle) headerTitle.innerText = 'Barang';
            window.renderInventoryCategories();
            window.renderInventoryCards(window.products);
        } else {
            if (headerTitle) headerTitle.innerText = `Barang (${cat})`;
            window.renderInventoryCategories();
            const filtered = (window.products || []).filter(p => (p.category || 'Umum').toLowerCase() === cat.toLowerCase());
            window.renderInventoryCards(filtered);
        }
    };

    // --- POPUP NOTIFIKASI STOK (IKON CORONG) ---
    window.openFilterStockModal = () => {
        const minStock = Number(localStorage.getItem('toko_min_stock')) || 20;
        const prods = window.products || [];
        const emptyCount = prods.filter(p => (Number(p.stock) || 0) <= 0).length;
        const lowCount = prods.filter(p => (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) <= minStock).length;

        document.getElementById('notif-count-empty').innerText = emptyCount;
        document.getElementById('notif-count-low').innerText = lowCount;
        document.getElementById('notif-count-all').innerText = prods.length;

        ['empty', 'low', 'all'].forEach(t => {
            const btn = document.getElementById(`notif-btn-${t}`);
            if (!btn) return;
            if (activeStockNotifFilter === t) {
                btn.className = "w-full flex items-center justify-between p-3.5 rounded-full border border-emerald-500 bg-emerald-100/50 hover:bg-emerald-100 transition text-gray-900";
            } else {
                btn.className = "w-full flex items-center justify-between p-3.5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition text-gray-900";
            }
        });

        document.getElementById('filter-stock-modal').classList.remove('hidden');
    };

    window.closeFilterStockModal = () => {
        document.getElementById('filter-stock-modal').classList.add('hidden');
    };

    window.applyStockFilter = (type) => {
        activeStockNotifFilter = type;
        window.closeFilterStockModal();
        const minStock = Number(localStorage.getItem('toko_min_stock')) || 20;
        const prods = window.products || [];

        if (type === 'all') {
            window.renderInventoryCards(prods);
        } else if (type === 'low') {
            window.renderInventoryCards(prods.filter(p => (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) <= minStock));
        } else if (type === 'empty') {
            window.renderInventoryCards(prods.filter(p => (Number(p.stock) || 0) <= 0));
        }
    };

    // --- POPUP FILTER & URUTAN BARANG ---
    window.openSortStockModal = () => {
        document.getElementById('sort-stock-modal').classList.remove('hidden');
    };

    window.closeSortStockModal = () => {
        document.getElementById('sort-stock-modal').classList.add('hidden');
    };

    window.applyAdvancedFilterSort = () => {
        window.closeSortStockModal();
        const direction = document.getElementById('filter-sort-direction').value;
        const criteriaEl = document.querySelector('input[name="sort_criteria"]:checked');
        const criteria = criteriaEl ? criteriaEl.value : 'sku';

        let sorted = [...(window.products || [])];
        if (activeCategoryFilter !== 'Semua item') {
            sorted = sorted.filter(p => (p.category || 'Umum').toLowerCase() === activeCategoryFilter.toLowerCase());
        }

        sorted.sort((a, b) => {
            let res = 0;
            if (criteria === 'name') {
                res = (a.name || '').localeCompare(b.name || '');
            } else if (criteria === 'sku') {
                res = (a.sku || '').localeCompare(b.sku || '', undefined, { numeric: true });
            } else if (criteria === 'price') {
                res = (Number(a.price) || 0) - (Number(b.price) || 0);
            } else if (criteria === 'stock') {
                res = (Number(a.stock) || 0) - (Number(b.stock) || 0);
            } else if (criteria === 'latest') {
                const tA = a.createdAt && a.createdAt.seconds ? a.createdAt.seconds : 0;
                const tB = b.createdAt && b.createdAt.seconds ? b.createdAt.seconds : 0;
                res = tA - tB;
            }
            return direction === 'desc' ? -res : res;
        });

        window.renderInventoryCards(sorted);
    };

    // --- PENGATURAN BARANG, BATAS STOK, DATABASE NECESSITY & RINCIAN ---
    window.openProductSubView = (type) => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));

        if (type === 'settings') {
            document.getElementById('disp-settings-min-stock').innerText = localStorage.getItem('toko_min_stock') || "20";
            document.getElementById('chk-disp-harga-dasar').checked = localStorage.getItem('disp_harga_dasar') !== 'false';
            document.getElementById('chk-disp-diskon').checked = localStorage.getItem('disp_diskon') === 'true';
            document.getElementById('chk-disp-tipe-harga').checked = localStorage.getItem('disp_tipe_harga') === 'true';
            document.getElementById('chk-disp-letak-rak').checked = localStorage.getItem('disp_letak_rak') === 'true';
            document.getElementById('view-products-settings').classList.remove('hidden');
        } else if (type === 'stock-limit') {
            document.getElementById('input-subview-min-stock').value = localStorage.getItem('toko_min_stock') || "20";
            document.getElementById('view-stock-limit').classList.remove('hidden');
        } else if (type === 'db-necessity') {
            document.getElementById('view-db-necessity').classList.remove('hidden');
        } else if (type === 'summary') {
            renderDatabaseSummary();
            document.getElementById('view-db-summary').classList.remove('hidden');
        }
    };

    window.closeProductSubView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-products').classList.remove('hidden');
    };

    window.saveStockLimitNotification = () => {
        const val = document.getElementById('input-subview-min-stock').value || "20";
        localStorage.setItem('toko_min_stock', val);
        window.openProductSubView('settings');
        window.renderInventoryCards(window.products);
    };

    window.saveDisplaySettings = () => {
        localStorage.setItem('disp_harga_dasar', document.getElementById('chk-disp-harga-dasar').checked);
        localStorage.setItem('disp_diskon', document.getElementById('chk-disp-diskon').checked);
        localStorage.setItem('disp_tipe_harga', document.getElementById('chk-disp-tipe-harga').checked);
        localStorage.setItem('disp_letak_rak', document.getElementById('chk-disp-letak-rak').checked);
        alert("Pengaturan tampilan berhasil disimpan!");
        window.closeProductSubView();
        window.renderInventoryCards(window.products);
    };

    window.saveDbNecessity = () => {
        alert("Kebutuhan penyimpanan database berhasil diperbarui!");
        window.openProductSubView('settings');
    };

    function renderDatabaseSummary() {
        let totalQty = 0, totalAsset = 0;
        const prods = window.products || [];
        prods.forEach(p => {
            totalQty += Number(p.stock) || 0;
            totalAsset += (Number(p.buyPrice) || 0) * (Number(p.stock) || 0);
        });

        document.getElementById('db-summary-item-count').innerText = `${prods.length.toLocaleString('id-ID')} Item`;
        document.getElementById('db-summary-qty-count').innerText = `${totalQty.toLocaleString('id-ID')} Pcs`;

        const isOwner = (window.activeKasir || 'Owner').toLowerCase().includes('owner') || (window.activeKasir || '').toLowerCase().includes('admin');
        const assetContainer = document.getElementById('db-summary-asset-container');
        if (isOwner) {
            assetContainer.classList.remove('hidden');
            document.getElementById('db-summary-asset-count').innerText = `Rp ${totalAsset.toLocaleString('id-ID')}`;
        } else {
            assetContainer.classList.add('hidden');
        }
    }

    // --- EXPORT & IMPORT EXCEL (CSV) ---
    window.exportProductsCSV = function() {
        const prods = window.products || [];
        if (prods.length === 0) return alert('Data barang masih kosong!');
        let csvContent = "Kode SKU,Kategori,Nama Barang,Harga Modal,Harga Jual,Stok Saat Ini\n";
        prods.forEach(p => {
            csvContent += `${p.sku || '-'},${p.category || 'Umum'},${(p.name || '-').replace(/,/g, ' ')},${p.buyPrice || 0},${p.price || 0},${p.stock || 0}\n`;
        });
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", `Katalog_Barang_${new Date().toISOString().split('T')[0]}.csv`);
        link.click();
    };

    window.openImportCSVModal = () => {
        document.getElementById('input-import-csv-file').value = '';
        document.getElementById('modal-import-csv').classList.remove('hidden');
    };
    window.closeImportCSVModal = () => document.getElementById('modal-import-csv').classList.add('hidden');

    window.processImportCSVFile = () => {
        const fileInput = document.getElementById('input-import-csv-file');
        const file = fileInput.files[0];
        if (!file) return alert("Pilih file CSV terlebih dahulu!");

        const reader = new FileReader();
        reader.onload = async (e) => {
            const lines = e.target.result.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            if (lines.length <= 1) return alert("File CSV kosong atau tidak valid!");

            let importedCount = 0;
            for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(',');
                if (cols.length >= 5) {
                    const sku = (cols[0] || '').trim();
                    const category = (cols[1] || 'Umum').trim();
                    const name = (cols[2] || '').trim();
                    const buyPrice = Number(cols[3]) || 0;
                    const price = Number(cols[4]) || 0;
                    const stock = Number(cols[5]) || 0;

                    if (name && price > 0 && window.fb && window.db) {
                        await window.fb.addDoc(window.fb.collection(window.db, "products"), {
                            name, sku, category, buyPrice, price, stock,
                            type: 'Default', showTransaction: true, useStock: true,
                            createdAt: window.fb.serverTimestamp()
                        });
                        importedCount++;
                    }
                }
            }
            alert(`Berhasil mengimpor ${importedCount} barang!`);
            window.closeImportCSVModal();
            if (window.loadInitialData) window.loadInitialData();
        };
        reader.readAsText(file);
    };

    // --- SCANNER BARCODE / QR CODE KAMERA ANDROID (MODE A & MODE B) ---
    window.openScannerView = async (target, preferredMode) => {
        scannerTargetMode = target || 'inventory';
        if (preferredMode) currentScannerVisualMode = preferredMode;
        updateScannerModeUI();

        document.getElementById('scanner-dropdown-menu').classList.add('hidden');
        document.getElementById('view-scanner').classList.remove('hidden');

        await startScannerCameraStream();
    };

    async function startScannerCameraStream(deviceId = null) {
        const video = document.getElementById('camera-stream-video');
        if (cameraStream) {
            cameraStream.getTracks().forEach(t => t.stop());
            cameraStream = null;
        }
        if (barcodeDetectInterval) {
            clearInterval(barcodeDetectInterval);
            barcodeDetectInterval = null;
        }

        try {
            const constraints = {
                video: deviceId
                    ? { deviceId: { exact: deviceId } }
                    : { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }
            };
            cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = cameraStream;

            const devices = await navigator.mediaDevices.enumerateDevices();
            availableVideoDevices = devices.filter(d => d.kind === 'videoinput');

            if ('BarcodeDetector' in window) {
                const detector = new window.BarcodeDetector({
                    formats: ['ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e', 'qr_code']
                });
                barcodeDetectInterval = setInterval(async () => {
                    if (video.readyState === video.HAVE_ENOUGH_DATA) {
                        try {
                            const barcodes = await detector.detect(video);
                            if (barcodes.length > 0 && barcodes[0].rawValue) {
                                handleScannedResult(barcodes[0].rawValue);
                            }
                        } catch (err) {}
                    }
                }, 350);
            }
        } catch (err) {
            console.warn("Kamera tidak dapat diakses langsung:", err);
            document.getElementById('scanner-manual-bar').classList.remove('hidden');
        }
    }

    function updateScannerModeUI() {
        const boxA = document.getElementById('scanner-box-mode-a');
        const boxB = document.getElementById('scanner-box-mode-b');
        const bubbleText = document.getElementById('scanner-bubble-text');
        const menuModeBtn = document.getElementById('scanner-menu-mode');
        const headerTitle = document.getElementById('scanner-header-title');

        if (currentScannerVisualMode === 'A') {
            boxA.classList.remove('hidden');
            boxB.classList.add('hidden');
            headerTitle.innerText = "Scan Barcode / QR Code";
            bubbleText.innerText = "Apabila terdapat kesulitan silahkan Scan di atas garis merah atau mencoba Scan Mode B";
            menuModeBtn.innerText = "Beralih Mode B";
        } else {
            boxA.classList.add('hidden');
            boxB.classList.remove('hidden');
            headerTitle.innerText = "Scan Barcode / QRcode";
            bubbleText.innerText = "Apabila terdapat kesulitan silahkan Scan di atas garis merah atau mencoba Scan Mode A";
            menuModeBtn.innerText = "Beralih Mode A";
        }
    }

    window.toggleScannerMenu = () => {
        document.getElementById('scanner-dropdown-menu').classList.toggle('hidden');
    };

    window.switchScannerMode = () => {
        currentScannerVisualMode = currentScannerVisualMode === 'A' ? 'B' : 'A';
        updateScannerModeUI();
        document.getElementById('scanner-dropdown-menu').classList.add('hidden');
    };

    window.toggleScannerFlash = async () => {
        document.getElementById('scanner-dropdown-menu').classList.add('hidden');
        if (!cameraStream) return;
        const track = cameraStream.getVideoTracks()[0];
        if (!track) return;
        try {
            scannerFlashOn = !scannerFlashOn;
            await track.applyConstraints({ advanced: [{ torch: scannerFlashOn }] });
            document.getElementById('scanner-menu-flash').innerText = `Flash [${scannerFlashOn ? 'ON' : 'OFF'}]`;
        } catch (e) {
            alert("Lampu Flash / Torch tidak didukung pada lensa kamera ini.");
        }
    };

    window.toggleScannerAutoFocus = () => {
        document.getElementById('scanner-dropdown-menu').classList.add('hidden');
        scannerAutoFocusOn = !scannerAutoFocusOn;
        document.getElementById('scanner-menu-autofocus').innerText = `Auto Focus [${scannerAutoFocusOn ? 'ON' : 'OFF'}]`;
    };

    window.showScannerFormatsModal = () => {
        document.getElementById('scanner-dropdown-menu').classList.add('hidden');
        alert("Format Barcode Aktif:\n• EAN-13 & EAN-8\n• UPC-A & UPC-E\n• CODE-128 & CODE-39\n• QR Code 2D");
    };

    window.selectScannerCameraDevice = () => {
        document.getElementById('scanner-dropdown-menu').classList.add('hidden');
        if (availableVideoDevices.length <= 1) {
            return alert("Hanya 1 kamera aktif yang terdeteksi pada perangkat ini.");
        }
        currentVideoDeviceIndex = (currentVideoDeviceIndex + 1) % availableVideoDevices.length;
        const nextDevice = availableVideoDevices[currentVideoDeviceIndex];
        startScannerCameraStream(nextDevice.deviceId);
    };

    window.toggleScannerManualInputBar = () => {
        document.getElementById('scanner-manual-bar').classList.toggle('hidden');
    };

    window.closeScannerView = () => {
        if (barcodeDetectInterval) {
            clearInterval(barcodeDetectInterval);
            barcodeDetectInterval = null;
        }
        if (cameraStream) {
            cameraStream.getTracks().forEach(t => t.stop());
            cameraStream = null;
        }
        document.getElementById('view-scanner').classList.add('hidden');
    };

    window.submitManualBarcode = () => {
        const code = document.getElementById('scanner-manual-code').value.trim();
        if (!code) return;
        document.getElementById('scanner-manual-code').value = '';
        handleScannedResult(code);
    };

    function handleScannedResult(code) {
        window.closeScannerView();
        if (scannerTargetMode === 'inventory') {
            const box = document.getElementById('inventory-search-box');
            if (box) box.value = code;
            window.filterInventory(code);
        } else if (scannerTargetMode === 'add-product') {
            const skuInput = document.getElementById('add-sku');
            if (skuInput) skuInput.value = code;
        } else if (scannerTargetMode === 'edit-product') {
            const editSku = document.getElementById('edit-full-sku');
            if (editSku) editSku.value = code;
        } else if (scannerTargetMode === 'multisatuan-smallest') {
            const msSmall = document.getElementById('input-ms-smallest-barcode');
            if (msSmall) msSmall.value = code;
            const modalEditSmall = document.getElementById('modal-edit-smallest-barcode');
            if (modalEditSmall) modalEditSmall.value = code;
        } else if (scannerTargetMode === 'multisatuan-other') {
            const msOther = document.getElementById('modal-ms-barcode');
            if (msOther) msOther.value = code;
        } else if (scannerTargetMode === 'customer-code') {
            const custCode = document.getElementById('edit-cust-code');
            if (custCode) custCode.value = code;
        } else if (scannerTargetMode.startsWith('variant-sku-')) {
            const idx = scannerTargetMode.replace('variant-sku-', '');
            const varInput = document.getElementById(`var-sku-${idx}`);
            if (varInput) varInput.value = code;
        } else if (scannerTargetMode === 'pos') {
            const prods = window.products || [];
            const found = prods.find(p => (p.sku && p.sku.toLowerCase() === code.toLowerCase()) || (p.name && p.name.toLowerCase() === code.toLowerCase()));
            if (found && window.addToCart) {
                window.addToCart(found.id);
            } else {
                const posSearch = document.getElementById('search-box');
                if (posSearch) posSearch.value = code;
                if (window.filterProducts) window.filterProducts(code);
            }
        } else if (scannerTargetMode === 'pembelian') {
            const prods = window.products || [];
            const found = prods.find(p => (p.sku && p.sku.toLowerCase() === code.toLowerCase()) || (p.name && p.name.toLowerCase() === code.toLowerCase()));
            if (found && window.pembelianOpenMultiSatuanModal) {
                window.pembelianOpenMultiSatuanModal(found.id);
            } else {
                const bSearch = document.getElementById('input-search-pembelian');
                if (bSearch) bSearch.value = code;
                if (window.renderPembelianProductList) window.renderPembelianProductList(code);
            }
        }
    }

    // ========================================================================
    // 4. MANAJEMEN KATEGORI BARANG (KLASIK UI)
    // ========================================================================
    window.closeCategoryView = () => {
        window.hideCategorySortDropdown();
        document.getElementById('view-kategori').classList.add('hidden');
        if (window.returnToAddProductFromCategory) {
            window.returnToAddProductFromCategory = false;
            document.getElementById('view-add-product').classList.remove('hidden');
        } else {
            window.switchView('manajemen-hub');
        }
    };

    window.toggleCategorySortDropdown = () => {
        const dd = document.getElementById('dropdown-sort-kategori');
        if (dd) dd.classList.toggle('hidden');
    };

    window.hideCategorySortDropdown = () => {
        const dd = document.getElementById('dropdown-sort-kategori');
        if (dd) dd.classList.add('hidden');
    };

    window.applyCategorySortOrder = (order) => {
        categorySortAsc = (order === 'asc');
        const btnAZ = document.getElementById('btn-cat-sort-az');
        const btnZA = document.getElementById('btn-cat-sort-za');
        if (btnAZ && btnZA) {
            if (categorySortAsc) {
                btnAZ.className = "w-full text-left px-4 py-3 bg-emerald-50 hover:bg-emerald-100 transition block";
                btnZA.className = "w-full text-left px-4 py-3 bg-white hover:bg-gray-50 transition block";
            } else {
                btnZA.className = "w-full text-left px-4 py-3 bg-emerald-50 hover:bg-emerald-100 transition block";
                btnAZ.className = "w-full text-left px-4 py-3 bg-white hover:bg-gray-50 transition block";
            }
        }
        window.hideCategorySortDropdown();
        const searchVal = document.getElementById('category-search-box')?.value || '';
        window.renderKategoriListView(searchVal);
    };

    window.renderKategoriListView = function(filterKeyword = '') {
        const container = document.getElementById('list-kategori-rows');
        if (!container) return;
        container.innerHTML = '';

        let list = [...(window.masterCategories || [])].filter(c => c !== 'Umum');
        if (filterKeyword) {
            list = list.filter(c => c.toLowerCase().includes(filterKeyword.toLowerCase()));
        }
        list.sort((a, b) => categorySortAsc ? a.localeCompare(b) : b.localeCompare(a));

        const isOwner = (window.activeKasir || 'Owner').toLowerCase().includes('owner') || (window.activeKasir || '').toLowerCase().includes('admin');
        const prods = window.products || [];

        if (list.length === 0) {
            container.innerHTML = `<div class="p-8 text-center text-gray-400 text-xs font-semibold">Kategori tidak ditemukan.</div>`;
            return;
        }

        list.forEach(cat => {
            let sisaQty = 0, totalModal = 0, matchedCount = 0;
            prods.forEach(p => {
                if ((p.category || '').toLowerCase() === cat.toLowerCase()) {
                    matchedCount++;
                    const stk = Number(p.stock) || 0;
                    const bp = Number(p.buyPrice) || 0;
                    sisaQty += stk;
                    totalModal += (stk * bp);
                }
            });

            let dispSisa = sisaQty.toLocaleString('id-ID');
            let dispModal = totalModal.toLocaleString('id-ID', {minimumFractionDigits:0, maximumFractionDigits:2});
            if (matchedCount === 0 && defaultCategoryStats[cat.toLowerCase()]) {
                dispSisa = defaultCategoryStats[cat.toLowerCase()].sisa.toLocaleString('id-ID');
                dispModal = defaultCategoryStats[cat.toLowerCase()].modal;
            }

            const actionButtons = isOwner ? `
                <button onclick="event.stopPropagation(); deleteCategoryItem('${cat}')" class="text-red-500 hover:text-red-700 p-2 text-xl transition" title="Hapus Kategori">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            ` : '';

            container.innerHTML += `
                <div onclick="selectCategoryFilterFromKategoriView('${cat}')" class="px-5 py-4 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="flex-1 min-w-0 pr-3">
                        <h4 class="font-extrabold text-sm text-gray-800 truncate mb-1">${cat}</h4>
                        <div class="flex justify-between items-center text-[10px] text-gray-600 font-bold">
                            <span>sisa : ${dispSisa}</span>
                            ${isOwner ? `<span>Modal : Rp ${dispModal}</span>` : ''}
                        </div>
                    </div>
                    ${actionButtons}
                </div>
            `;
        });
    };

    window.filterCategoryList = (k) => window.renderKategoriListView(k);

    window.selectCategoryFilterFromKategoriView = (cat) => {
        window.hideCategorySortDropdown();
        if (window.returnToAddProductFromCategory) {
            window.returnToAddProductFromCategory = false;
            document.getElementById('view-kategori').classList.add('hidden');
            document.getElementById('view-add-product').classList.remove('hidden');
            if (window.selectCategoryForAddProduct) window.selectCategoryForAddProduct(cat);
        } else {
            openedProductsFromCategoryView = true;
            window.switchView('products');
            window.filterInventoryByCategory(cat);
            setTimeout(() => {
                const pillEl = document.getElementById(`inv-cat-pill-${cat.replace(/\s+/g, '-')}`);
                if (pillEl) pillEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }, 100);
        }
    };

    window.openAddCategoryModal = () => {
        window.hideCategorySortDropdown();
        editingCategoryOldName = null;
        document.getElementById('modal-category-form-title').innerText = "TAMBAH KATEGORI";
        document.getElementById('input-new-cat-name').value = '';
        document.getElementById('modal-add-category').classList.remove('hidden');
        setTimeout(() => document.getElementById('input-new-cat-name').focus(), 100);
    };

    window.closeAddCategoryModal = () => {
        document.getElementById('modal-add-category').classList.add('hidden');
    };

    window.saveCategoryModalForm = async () => {
        const name = document.getElementById('input-new-cat-name').value.trim();
        if (!name) return alert("Nama kategori wajib diisi!");

        if (window.masterCategories.some(c => c.toLowerCase() === name.toLowerCase())) {
            return alert("Kategori ini sudah terdaftar!");
        }
        window.masterCategories.push(name);
        
        localStorage.setItem('pos_categories', JSON.stringify(window.masterCategories));
        window.closeAddCategoryModal();
        const searchVal = document.getElementById('category-search-box')?.value || '';
        window.renderKategoriListView(searchVal);
        window.renderInventoryCategories();
    };

    window.deleteCategoryItem = (cat) => {
        window.hideCategorySortDropdown();
        if (confirm(`Yakin ingin menghapus kategori '${cat}'?`)) {
            window.masterCategories = (window.masterCategories || []).filter(c => c !== cat);
            localStorage.setItem('pos_categories', JSON.stringify(window.masterCategories));
            const searchVal = document.getElementById('category-search-box')?.value || '';
            window.renderKategoriListView(searchVal);
            window.renderInventoryCategories();
        }
    };
})();
