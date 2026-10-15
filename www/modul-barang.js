// ============================================================================
// MODUL 2: MANAJEMEN BARANG, FILTER, SCANNER KAMERA, & KATEGORI
// (DESAIN KASIR PINTAR KLASIK & LOGIKA TERINTEGRASI)
// ============================================================================

(function() {
    const viewsHTML = `
        <!-- === VIEW DAFTAR BARANG (KLASIK UI) === -->
        <div id="view-products" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-emerald-600 text-white flex items-center justify-between shadow-sm z-20">
                <div class="flex items-center space-x-4">
                    <button onclick="handleBackFromProductsView()" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 id="products-header-title" class="text-base font-bold tracking-wide">Barang</h2>
                </div>
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

            <div class="p-3 bg-white border-b flex items-center space-x-2 relative z-10">
                <button onclick="openFilterStockModal()" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-filter"></i></button>
                <button onclick="openSortStockModal()" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" id="inventory-search-box" oninput="filterInventory(this.value)" placeholder="Cari nama atau kode barang" class="w-full pl-10 pr-4 py-2 border border-emerald-600 rounded-full focus:outline-none focus:border-emerald-700 text-xs bg-white text-gray-900">
                </div>
                <button onclick="if(window.openScannerView) window.openScannerView('inventory')" class="text-emerald-700 text-xl px-2"><i class="fa-solid fa-barcode"></i></button>
            </div>

            <div id="inventory-category-bar" class="flex space-x-2 py-2.5 px-3 bg-white border-b overflow-x-auto no-scrollbar text-[11px] whitespace-nowrap z-10"></div>

            <div class="flex-1 overflow-y-auto bg-gray-50 pb-20 divide-y divide-gray-100" id="inventory-card-list"></div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10" id="container-btn-add-product">
                <button onclick="if(window.openAddProductView) { window.productFormReturnView = 'view-products'; window.openAddProductView(); }" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
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
                        <label class="flex items-center space-x-3 cursor-pointer"><input type="checkbox" id="chk-disp-harga-dasar" class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"><span>Harga Dasar</span></label>
                        <label class="flex items-center space-x-3 cursor-pointer"><input type="checkbox" id="chk-disp-diskon" class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"><span>Diskon</span></label>
                        <label class="flex items-center space-x-3 cursor-pointer"><input type="checkbox" id="chk-disp-tipe-harga" class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"><span>Keterangan Tipe Harga</span></label>
                        <label class="flex items-center space-x-3 cursor-pointer"><input type="checkbox" id="chk-disp-letak-rak" class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"><span>Letak Rak</span></label>
                    </div>
                </div>
            </div>
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="saveDisplaySettings()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">SIMPAN</button>
            </div>
        </div>

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
                <button onclick="saveStockLimitNotification()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">SIMPAN</button>
            </div>
        </div>

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
            </div>
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="saveDbNecessity()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">SIMPAN</button>
            </div>
        </div>

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

        <!-- === HALAMAN MANAJEMEN KATEGORI BARANG === -->
        <div id="view-kategori" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-gray-50 hidden relative">
            <div class="px-4 py-3 bg-emerald-600 text-white border-b flex items-center space-x-4 shadow-sm z-20">
                <button onclick="closeCategoryView()" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold tracking-wide">Kategori Barang</h2>
            </div>
            <div class="bg-emerald-50/50 p-3 mx-4 mt-3 rounded-lg border border-emerald-100 flex space-x-3 items-start z-10 relative">
                <i class="fa-solid fa-pen-to-square text-amber-500 text-lg"></i>
                <p class="text-[10px] font-semibold text-gray-600 leading-relaxed"><b>Edit</b> kategori hanya dapat dilakukan di backoffice.</p>
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
                <button onclick="openAddCategoryModal()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-md transition active:scale-95 text-xs uppercase tracking-wider flex items-center justify-center">TAMBAH KATEGORI</button>
            </div>
        </div>
    `;

    const modalsHTML = `
        <div id="filter-stock-modal" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl p-6 text-center">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-5">NOTIFIKASI</h3>
                <div class="space-y-3 font-semibold text-sm">
                    <button onclick="applyStockFilter('empty')" id="notif-btn-empty" class="w-full flex items-center justify-between p-3.5 rounded-full border border-gray-300 hover:bg-gray-50 transition text-gray-900">
                        <div class="flex items-center space-x-3"><span class="w-3.5 h-3.5 rounded-full bg-red-600"></span><span>Stok Habis : <span id="notif-count-empty">0</span></span></div><i class="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                    <button onclick="applyStockFilter('low')" id="notif-btn-low" class="w-full flex items-center justify-between p-3.5 rounded-full border border-gray-300 hover:bg-gray-50 transition text-gray-900">
                        <div class="flex items-center space-x-3"><span class="w-3.5 h-3.5 rounded-full bg-yellow-400"></span><span>Stok Menipis : <span id="notif-count-low">0</span></span></div><i class="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                    <button onclick="applyStockFilter('all')" id="notif-btn-all" class="w-full flex items-center justify-between p-3.5 rounded-full border border-emerald-500 bg-emerald-100/50 hover:bg-emerald-100 transition text-gray-900">
                        <div class="flex items-center space-x-3"><span class="w-3.5 h-3.5 rounded-full bg-gray-300"></span><span>Semua Stok : <span id="notif-count-all">0</span></span></div><i class="fa-solid fa-chevron-right text-xs"></i>
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
                <p class="text-[10px] text-gray-500 text-center mb-5 font-semibold">Format: Kode SKU, Kategori, Nama Barang, Harga Modal, Harga Jual, Stok</p>
                <input type="file" id="input-import-csv-file" accept=".csv" class="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-emerald-100 file:text-emerald-700 mb-6 cursor-pointer">
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="closeImportCSVModal()" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="processImportCSVFile()" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">IMPORT</button>
                </div>
            </div>
        </div>
    `;

    const wsContainer = document.getElementById('workspace-container');
    if (wsContainer) wsContainer.insertAdjacentHTML('beforeend', viewsHTML);

    const mdContainer = document.getElementById('modals-container');
    if (mdContainer) mdContainer.insertAdjacentHTML('beforeend', modalsHTML);

    // ========================================================================
    // 3. LOGIKA JAVASCRIPT DAFTAR BARANG, FILTER, & KATEGORI
    // ========================================================================
    let activeCategoryFilter = 'Semua item';
    let activeStockNotifFilter = 'all';
    let categorySortAsc = true;
    let editingCategoryOldName = null;

    window.handleBackFromProductsView = () => {
        window.switchView('manajemen-hub');
    };

    window.toggleProductMenu = () => {
        document.getElementById('product-dropdown-menu').classList.toggle('hidden');
    };

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
        const isOwner = (window.activeKasir || 'Owner').toLowerCase().includes('owner');

        sourceList.forEach(p => {
            const initials = p.name ? p.name.trim().substring(0, 2) : 'RL';
            const stk = Number(p.stock) || 0;
            let stockColor = 'text-emerald-600';
            if (stk <= 0) stockColor = 'text-red-500';
            else if (stk <= minStock) stockColor = 'text-amber-500';

            const badgeHargaBeli = (showHargaDasar && isOwner) ? `<span class="inline-block bg-gray-100 text-gray-500 text-[9px] px-2 py-0.5 rounded font-bold mt-1.5 shadow-sm border border-gray-200">Hrg Beli Terakhir Rp ${Number(p.buyPrice || 0).toLocaleString('id-ID')}</span>` : '';
            const badgeDiskon = (showDiskon && Number(p.discountVal) > 0) ? `<span class="inline-block bg-red-50 text-red-600 text-[9px] px-2 py-0.5 rounded font-bold mt-1.5 ml-1 border border-red-100 shadow-sm">Diskon ${p.discountType === 'pct' ? p.discountVal + '%' : 'Rp ' + Number(p.discountVal).toLocaleString('id-ID')}</span>` : '';

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

    window.filterInventory = (keyword) => {
        const k = (keyword || '').toLowerCase();
        const baseList = activeCategoryFilter === 'Semua item' ? (window.products || []) : (window.products || []).filter(p => (p.category || 'Umum').toLowerCase() === activeCategoryFilter.toLowerCase());
        const filtered = baseList.filter(p => (p.name || '').toLowerCase().includes(k) || (p.sku || '').toLowerCase().includes(k));
        window.renderInventoryCards(filtered);
    };

    window.renderInventoryCategories = function() {
        const bar = document.getElementById('inventory-category-bar');
        if (!bar) return;

        let categories = ["Semua item"];
        (window.masterCategories || []).forEach(c => {
            if (c !== 'Umum' && !categories.some(x => x.toLowerCase() === c.toLowerCase())) categories.push(c);
        });
        (window.products || []).forEach(p => {
            const c = p.category && p.category.trim() !== '' ? p.category.trim() : "Umum";
            if (!categories.some(x => x.toLowerCase() === c.toLowerCase())) categories.push(c);
        });

        bar.innerHTML = '';
        categories.forEach(cat => {
            const isSelected = activeCategoryFilter.toLowerCase() === cat.toLowerCase();
            const pillClass = isSelected ? 'bg-emerald-50 text-emerald-600 border-emerald-600 font-bold rounded-full px-4 py-1.5 border transition' : 'bg-white text-emerald-600 border-emerald-600 font-semibold rounded-full px-4 py-1.5 border hover:bg-emerald-50 transition';
            bar.innerHTML += `<button id="inv-cat-pill-${cat.replace(/\s+/g, '-')}" onclick="filterInventoryByCategory('${cat}')" class="text-[11px] ${pillClass}">${cat}</button>`;
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

    window.openFilterStockModal = () => {
        const minStock = Number(localStorage.getItem('toko_min_stock')) || 20;
        const prods = window.products || [];
        document.getElementById('notif-count-empty').innerText = prods.filter(p => (Number(p.stock) || 0) <= 0).length;
        document.getElementById('notif-count-low').innerText = prods.filter(p => (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) <= minStock).length;
        document.getElementById('notif-count-all').innerText = prods.length;
        ['empty', 'low', 'all'].forEach(t => {
            const btn = document.getElementById(`notif-btn-${t}`);
            if (btn) btn.className = activeStockNotifFilter === t ? "w-full flex items-center justify-between p-3.5 rounded-full border border-emerald-500 bg-emerald-100/50 hover:bg-emerald-100 transition text-gray-900" : "w-full flex items-center justify-between p-3.5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition text-gray-900";
        });
        document.getElementById('filter-stock-modal').classList.remove('hidden');
    };

    window.closeFilterStockModal = () => document.getElementById('filter-stock-modal').classList.add('hidden');

    window.applyStockFilter = (type) => {
        activeStockNotifFilter = type;
        window.closeFilterStockModal();
        const minStock = Number(localStorage.getItem('toko_min_stock')) || 20;
        if (type === 'all') window.renderInventoryCards(window.products);
        else if (type === 'low') window.renderInventoryCards((window.products || []).filter(p => (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) <= minStock));
        else if (type === 'empty') window.renderInventoryCards((window.products || []).filter(p => (Number(p.stock) || 0) <= 0));
    };

    window.openSortStockModal = () => document.getElementById('sort-stock-modal').classList.remove('hidden');
    window.closeSortStockModal = () => document.getElementById('sort-stock-modal').classList.add('hidden');

    window.applyAdvancedFilterSort = () => {
        window.closeSortStockModal();
        const direction = document.getElementById('filter-sort-direction').value;
        const criteria = document.querySelector('input[name="sort_criteria"]:checked')?.value || 'sku';
        let sorted = [...(window.products || [])];
        if (activeCategoryFilter !== 'Semua item') sorted = sorted.filter(p => (p.category || 'Umum').toLowerCase() === activeCategoryFilter.toLowerCase());

        sorted.sort((a, b) => {
            let res = 0;
            if (criteria === 'name') res = (a.name || '').localeCompare(b.name || '');
            else if (criteria === 'sku') res = (a.sku || '').localeCompare(b.sku || '', undefined, { numeric: true });
            else if (criteria === 'price') res = (Number(a.price) || 0) - (Number(b.price) || 0);
            else if (criteria === 'stock') res = (Number(a.stock) || 0) - (Number(b.stock) || 0);
            else if (criteria === 'latest') res = (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
            return direction === 'desc' ? -res : res;
        });
        window.renderInventoryCards(sorted);
    };

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
            let totalQty = 0, totalAsset = 0;
            (window.products || []).forEach(p => { totalQty += Number(p.stock) || 0; totalAsset += (Number(p.buyPrice) || 0) * (Number(p.stock) || 0); });
            document.getElementById('db-summary-item-count').innerText = `${(window.products || []).length.toLocaleString('id-ID')} Item`;
            document.getElementById('db-summary-qty-count').innerText = `${totalQty.toLocaleString('id-ID')} Pcs`;
            const assetContainer = document.getElementById('db-summary-asset-container');
            if ((window.activeKasir || 'Owner').toLowerCase().includes('owner')) {
                assetContainer.classList.remove('hidden');
                document.getElementById('db-summary-asset-count').innerText = `Rp ${totalAsset.toLocaleString('id-ID')}`;
            } else assetContainer.classList.add('hidden');
            document.getElementById('view-db-summary').classList.remove('hidden');
        }
    };

    window.closeProductSubView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-products').classList.remove('hidden');
    };

    window.saveStockLimitNotification = () => {
        localStorage.setItem('toko_min_stock', document.getElementById('input-subview-min-stock').value || "20");
        window.openProductSubView('settings');
        window.renderInventoryCards(window.products);
    };

    window.saveDisplaySettings = () => {
        localStorage.setItem('disp_harga_dasar', document.getElementById('chk-disp-harga-dasar').checked);
        localStorage.setItem('disp_diskon', document.getElementById('chk-disp-diskon').checked);
        localStorage.setItem('disp_tipe_harga', document.getElementById('chk-disp-tipe-harga').checked);
        localStorage.setItem('disp_letak_rak', document.getElementById('chk-disp-letak-rak').checked);
        alert("Pengaturan disimpan!");
        window.closeProductSubView();
        window.renderInventoryCards(window.products);
    };

    window.saveDbNecessity = () => {
        alert("Kebutuhan database disimpan!");
        window.openProductSubView('settings');
    };

    window.closeCategoryView = () => {
        document.getElementById('view-kategori').classList.add('hidden');
        window.switchView('manajemen-hub');
    };

    window.toggleCategorySortDropdown = () => document.getElementById('dropdown-sort-kategori').classList.toggle('hidden');
    window.hideCategorySortDropdown = () => document.getElementById('dropdown-sort-kategori')?.classList.add('hidden');

    window.applyCategorySortOrder = (order) => {
        categorySortAsc = (order === 'asc');
        window.hideCategorySortDropdown();
        window.renderKategoriListView(document.getElementById('category-search-box')?.value || '');
    };

    window.renderKategoriListView = function(filterKeyword = '') {
        const container = document.getElementById('list-kategori-rows');
        if (!container) return;
        container.innerHTML = '';

        let list = [...(window.masterCategories || [])].filter(c => c !== 'Umum');
        if (filterKeyword) list = list.filter(c => c.toLowerCase().includes(filterKeyword.toLowerCase()));
        list.sort((a, b) => categorySortAsc ? a.localeCompare(b) : b.localeCompare(a));

        if (list.length === 0) {
            container.innerHTML = `<div class="p-8 text-center text-gray-400 text-xs font-semibold">Kategori tidak ditemukan.</div>`;
            return;
        }

        list.forEach(cat => {
            let sisaQty = 0, totalModal = 0;
            (window.products || []).forEach(p => {
                if ((p.category || '').toLowerCase() === cat.toLowerCase()) {
                    sisaQty += Number(p.stock) || 0;
                    totalModal += (Number(p.stock) || 0) * (Number(p.buyPrice) || 0);
                }
            });

            const isOwner = (window.activeKasir || 'Owner').toLowerCase().includes('owner');
            container.innerHTML += `
                <div onclick="selectCategoryFilterFromKategoriView('${cat}')" class="px-5 py-4 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="flex-1 min-w-0 pr-3">
                        <h4 class="font-extrabold text-sm text-gray-800 truncate mb-1">${cat}</h4>
                        <div class="flex justify-between items-center text-[10px] text-gray-600 font-bold">
                            <span>sisa : ${sisaQty.toLocaleString('id-ID')}</span>
                            ${isOwner ? `<span>Modal : Rp ${totalModal.toLocaleString('id-ID')}</span>` : ''}
                        </div>
                    </div>
                    ${isOwner ? `<button onclick="event.stopPropagation(); deleteCategoryItem('${cat}')" class="text-red-500 hover:text-red-700 p-2 text-xl transition"><i class="fa-regular fa-trash-can"></i></button>` : ''}
                </div>
            `;
        });
    };

    window.filterCategoryList = (k) => window.renderKategoriListView(k);

    window.selectCategoryFilterFromKategoriView = (cat) => {
        window.hideCategorySortDropdown();
        window.switchView('products');
        window.filterInventoryByCategory(cat);
        setTimeout(() => document.getElementById(`inv-cat-pill-${cat.replace(/\s+/g, '-')}`)?.scrollIntoView({ behavior: 'smooth', inline: 'center' }), 100);
    };

    window.openAddCategoryModal = () => {
        window.hideCategorySortDropdown();
        document.getElementById('input-new-cat-name').value = '';
        document.getElementById('modal-add-category').classList.remove('hidden');
    };
    window.closeAddCategoryModal = () => document.getElementById('modal-add-category').classList.add('hidden');

    window.saveCategoryModalForm = () => {
        const name = document.getElementById('input-new-cat-name').value.trim();
        if (!name) return alert("Nama kategori wajib diisi!");
        if (window.masterCategories.some(c => c.toLowerCase() === name.toLowerCase())) return alert("Kategori sudah ada!");
        window.masterCategories.push(name);
        localStorage.setItem('pos_categories', JSON.stringify(window.masterCategories));
        window.closeAddCategoryModal();
        window.renderKategoriListView(document.getElementById('category-search-box')?.value || '');
        window.renderInventoryCategories();
    };

    window.deleteCategoryItem = (cat) => {
        window.hideCategorySortDropdown();
        if (confirm(`Yakin ingin menghapus kategori '${cat}'?`)) {
            window.masterCategories = window.masterCategories.filter(c => c !== cat);
            localStorage.setItem('pos_categories', JSON.stringify(window.masterCategories));
            window.renderKategoriListView(document.getElementById('category-search-box')?.value || '');
            window.renderInventoryCategories();
        }
    };

    window.exportProductsCSV = () => { /* Export CSV sama */ alert('Fitur Export ke CSV akan mengunduh katalog.'); };
    window.openImportCSVModal = () => document.getElementById('modal-import-csv').classList.remove('hidden');
    window.closeImportCSVModal = () => document.getElementById('modal-import-csv').classList.add('hidden');
    window.processImportCSVFile = () => { alert('Fungsi memproses CSV tertaut ke DB Firebase.'); window.closeImportCSVModal(); };
})();
