// ============================================================================
// MODUL 4: DETAIL BARANG, MANAJEMEN STOK CEPAT, DETAIL SISA STOK, & EDIT BARANG
// ============================================================================

(function() {
    // 1. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- === LAYAR INFORMASI DETAIL BARANG (SS 1000920103) === -->
        <div id="view-product-detail" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <!-- Header Detail Barang -->
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="closeProductDetailView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-gray-900">Barang</h2>
                </div>
                <div class="flex items-center space-x-5 text-sm font-bold">
                    <button onclick="handleDetailActionClick('man_stok')" class="text-emerald-600 hover:text-emerald-800 transition">Man. Stok</button>
                    <button onclick="handleDetailActionClick('hapus')" class="text-red-600 hover:text-red-800 transition">Hapus</button>
                </div>
            </div>

            <!-- Konten Detail Barang -->
            <div class="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
                <!-- Thumbnail Foto Barang -->
                <div id="detail-prod-image-container" class="pt-1">
                    <div class="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-3xl overflow-hidden shadow-xs border border-gray-100">
                        <i class="fa-regular fa-image"></i>
                    </div>
                </div>

                <!-- Nama Barang -->
                <h3 class="font-extrabold text-sm text-gray-900 pt-1" id="detail-prod-name">-</h3>

                <!-- 9 Baris Atribut Barang -->
                <div class="space-y-2 text-xs text-gray-700">
                    <div class="grid grid-cols-12 items-center">
                        <span class="col-span-4 text-gray-500 font-medium">Harga jual</span>
                        <span class="col-span-1 text-center text-gray-400">:</span>
                        <span class="col-span-7 font-bold text-gray-900" id="detail-prod-price">Rp 0</span>
                    </div>
                    <div class="grid grid-cols-12 items-center">
                        <span class="col-span-4 text-gray-500 font-medium">Diskon</span>
                        <span class="col-span-1 text-center text-gray-400">:</span>
                        <span class="col-span-7 font-bold text-gray-900" id="detail-prod-discount">Rp 0</span>
                    </div>
                    <div class="grid grid-cols-12 items-center">
                        <span class="col-span-4 text-gray-500 font-medium">Berat</span>
                        <span class="col-span-1 text-center text-gray-400">:</span>
                        <span class="col-span-7 font-bold text-gray-900" id="detail-prod-weight">0.0 gram</span>
                    </div>
                    <div class="grid grid-cols-12 items-center">
                        <span class="col-span-4 text-gray-500 font-medium">Kode</span>
                        <span class="col-span-1 text-center text-gray-400">:</span>
                        <span class="col-span-7 font-bold text-gray-900" id="detail-prod-sku">-</span>
                    </div>
                    <div class="grid grid-cols-12 items-center">
                        <span class="col-span-4 text-gray-500 font-medium">Stok</span>
                        <span class="col-span-1 text-center text-gray-400">:</span>
                        <span class="col-span-7 font-bold text-gray-900" id="detail-prod-stock">0 item</span>
                    </div>
                    <div class="grid grid-cols-12 items-center">
                        <span class="col-span-4 text-gray-500 font-medium">Stok Minimum</span>
                        <span class="col-span-1 text-center text-gray-400">:</span>
                        <span class="col-span-7 font-bold text-gray-900" id="detail-prod-min-stock">0.0</span>
                    </div>
                    <div class="grid grid-cols-12 items-center">
                        <span class="col-span-4 text-gray-500 font-medium">Kategori</span>
                        <span class="col-span-1 text-center text-gray-400">:</span>
                        <span class="col-span-7 font-bold text-gray-900" id="detail-prod-category">-</span>
                    </div>
                    <div class="grid grid-cols-12 items-center">
                        <span class="col-span-4 text-gray-500 font-medium">Letak rak</span>
                        <span class="col-span-1 text-center text-gray-400">:</span>
                        <span class="col-span-7 font-bold text-gray-900" id="detail-prod-rack"></span>
                    </div>
                    <div class="grid grid-cols-12 items-center">
                        <span class="col-span-4 text-gray-500 font-medium">Keterangan</span>
                        <span class="col-span-1 text-center text-gray-400">:</span>
                        <span class="col-span-7 font-bold text-gray-900" id="detail-prod-notes"></span>
                    </div>
                </div>

                <!-- 3 Kotak Navigasi: Detail sisa stok, Pelanggan, Supplier -->
                <div class="space-y-2.5 pt-2">
                    <div onclick="handleDetailActionClick('detail_sisa_stok')" class="bg-slate-50 hover:bg-slate-100 border border-slate-100 p-4 rounded-2xl flex justify-between items-center cursor-pointer transition">
                        <span class="font-bold text-xs text-gray-900">Detail sisa stok</span>
                        <i class="fa-solid fa-chevron-right text-gray-800 text-sm"></i>
                    </div>
                    <div onclick="handleDetailActionClick('pelanggan')" class="bg-slate-50 hover:bg-slate-100 border border-slate-100 p-4 rounded-2xl flex justify-between items-center cursor-pointer transition">
                        <span class="font-bold text-xs text-gray-900">Pelanggan</span>
                        <i class="fa-solid fa-chevron-right text-gray-800 text-sm"></i>
                    </div>
                    <div onclick="handleDetailActionClick('supplier')" class="bg-slate-50 hover:bg-slate-100 border border-slate-100 p-4 rounded-2xl flex justify-between items-center cursor-pointer transition">
                        <span class="font-bold text-xs text-gray-900">Supplier</span>
                        <i class="fa-solid fa-chevron-right text-gray-800 text-sm"></i>
                    </div>
                </div>

                <!-- Tabel Multisatuan (Muncul jika barang memiliki Multisatuan - SS 1000920103) -->
                <div id="detail-multisatuan-wrapper" class="pt-3 hidden">
                    <h4 class="font-bold text-xs text-center text-gray-800 mb-3">Multisatuan</h4>
                    <div class="border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
                        <div class="bg-emerald-100/80 px-4 py-2.5 grid grid-cols-3 text-xs font-semibold text-gray-700">
                            <span>Satuan</span>
                            <span class="text-center">Jumlah</span>
                            <span class="text-right">Harga Jual</span>
                        </div>
                        <div id="detail-multisatuan-table-rows" class="divide-y divide-gray-100 text-xs px-4 py-1 bg-white"></div>
                    </div>
                </div>

                <!-- Tabel Paket / Varian / Tipe Harga (Jika ada) -->
                <div id="detail-extra-type-wrapper" class="pt-2 space-y-3 hidden"></div>
            </div>

            <!-- Tombol Sticky Bawah: Edit Barang -->
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="handleDetailActionClick('edit_barang')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition active:scale-95 text-sm flex items-center justify-center">
                    Edit Barang
                </button>
            </div>
        </div>

        <!-- === HALAMAN DETAIL SISA STOK (SS 1000920105 & 1000920107) === -->
        <div id="view-detail-sisa-stok" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <!-- Header Detail Sisa Stok -->
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="closeDetailSisaStokView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-800">Detail sisa stok</h2>
                </div>
                <!-- Menu Titik Tiga: Fix Data Stok (SS 1000920107) -->
                <div class="relative">
                    <button onclick="toggleFixDataStokDropdown()" class="text-emerald-700 text-xl p-1 focus:outline-none"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                    <div id="dropdown-fix-data-stok" class="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 hidden z-50">
                        <button onclick="fixDataStokAction()" class="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 transition">Fix Data Stok</button>
                    </div>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <!-- Info Ringkas Produk -->
                <div class="space-y-0.5">
                    <h3 class="font-extrabold text-sm text-gray-900" id="stock-detail-prod-name">-</h3>
                    <p class="text-xs text-gray-500" id="stock-detail-prod-sku">-</p>
                    <p class="text-xs text-gray-600 pt-0.5">Sisa Stok: <span id="stock-detail-prod-stock" class="font-semibold">0</span></p>
                    <p class="text-xs text-gray-600">Harga jual : <span id="stock-detail-prod-price" class="font-semibold">Rp 0</span></p>
                </div>

                <!-- Kotak Harga Beli Terakhir & Tombol Beli Barang -->
                <div class="border border-emerald-600/60 rounded-xl p-4 bg-emerald-50/20 space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="font-extrabold text-xs text-gray-900">Harga Beli Terakhir</span>
                        <div class="flex items-center space-x-1.5">
                            <span class="font-extrabold text-xs text-gray-900" id="stock-detail-last-buy">Rp 0</span>
                            <button onclick="alert('Harga ini diambil otomatis dari transaksi pembelian atau input harga dasar terakhir.')" class="w-5 h-5 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center text-[11px] font-bold">?</button>
                        </div>
                    </div>
                    <p class="text-[11px] text-gray-500 font-medium">*Harga ini diambil dari pembelian terakhir</p>
                    <div class="pt-1">
                        <!-- Mengarahkan ke Halaman Pembelian (SS 1000920108) -->
                        <button onclick="switchView('pembelian')" class="border border-emerald-600 bg-white text-emerald-700 hover:bg-emerald-50 px-5 py-2 rounded-lg text-xs font-bold transition shadow-2xs">
                            Beli Barang
                        </button>
                    </div>
                </div>

                <!-- Kartu Hijau Analisis Finansial (Sisa Modal, Proyeksi Omzet, Proyeksi Keuntungan) -->
                <div class="bg-gradient-to-br from-emerald-600 to-teal-500 text-white rounded-2xl p-5 shadow-md space-y-4">
                    <div>
                        <span class="text-xs text-emerald-50 font-medium block">Sisa modal</span>
                        <span class="text-lg font-extrabold block mt-0.5" id="fin-card-sisa-modal">Rp 0</span>
                    </div>
                    <div class="grid grid-cols-2 gap-4 pt-1">
                        <div>
                            <span class="text-xs text-emerald-50 font-medium block">Proyeksi Omzet</span>
                            <span class="text-sm font-extrabold block mt-0.5" id="fin-card-proyeksi-omzet">Rp 0</span>
                        </div>
                        <div>
                            <span class="text-xs text-emerald-50 font-medium block">Proyeksi Keuntungan</span>
                            <span class="text-sm font-extrabold block mt-0.5" id="fin-card-proyeksi-untung">Rp 0</span>
                        </div>
                    </div>
                </div>

                <!-- Daftar Batch Sisa Stok Masuk (FIFO) -->
                <div id="container-stock-batches-list" class="divide-y divide-gray-100 pt-2"></div>
            </div>
        </div>

        <!-- === HALAMAN EDIT BARANG LENGKAP (SS 1000920227 & 1000920228) === -->
        <div id="view-edit-barang-full" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <!-- Header Edit Barang -->
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeEditBarangFullView()" class="text-gray-800 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-gray-900">Edit Barang</h2>
            </div>

            <!-- Formulir Edit Barang Lengkap -->
            <div class="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
                <!-- Foto Produk + Ikon Kamera, Galeri, & X (Hapus) -->
                <div class="flex flex-col items-center justify-center">
                    <div class="w-24 h-24 bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden relative shadow-inner mb-2">
                        <img id="edit-full-img-preview" src="" alt="Preview" class="w-full h-full object-cover hidden">
                        <div id="edit-full-img-placeholder" class="text-gray-300 text-4xl"><i class="fa-regular fa-images"></i></div>
                    </div>
                    <div class="flex items-center space-x-6 text-emerald-700 text-xl">
                        <button onclick="if(window.openLivePhotoCamera) window.openLivePhotoCamera('edit')" type="button" class="p-1.5 hover:text-emerald-900 transition" title="Ambil Foto Kamera">
                            <i class="fa-solid fa-camera"></i>
                        </button>
                        <button onclick="if(window.triggerGalleryPick) window.triggerGalleryPick('edit')" type="button" class="p-1.5 hover:text-emerald-900 transition" title="Pilih dari Galeri">
                            <i class="fa-regular fa-image"></i>
                        </button>
                        <button onclick="clearEditFullPhoto()" type="button" class="p-1.5 text-emerald-700 hover:text-red-600 transition" title="Hapus Gambar">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <input type="hidden" id="edit-full-image-base64" value="">
                </div>

                <!-- Nama* -->
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Nama<span class="text-red-500">*</span></label>
                    <input type="text" id="edit-full-name" class="w-full border border-gray-300 p-3 px-4 rounded-full text-sm text-gray-900 font-medium focus:outline-none focus:border-emerald-600">
                </div>

                <!-- Tipe Barang -->
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Tipe Barang</label>
                    <div class="relative">
                        <select id="edit-full-type" onchange="handleEditProductTypeChange(this.value)" class="w-full border border-gray-300 p-3 px-4 rounded-full text-sm focus:outline-none focus:border-emerald-600 appearance-none bg-white font-medium text-gray-900">
                            <option value="Default">Default</option>
                            <option value="Bahan Baku">Bahan Baku</option>
                            <option value="Paket">Paket</option>
                            <option value="Varian">Varian</option>
                            <option value="Multisatuan">Multisatuan</option>
                            <option value="Add On">Add On</option>
                        </select>
                        <span class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-700">
                            <i class="fa-solid fa-chevron-down text-sm"></i>
                        </span>
                    </div>
                </div>

                <!-- Kartu Data Satuan Multisatuan di Edit Barang (SS 1000920227) -->
                <div id="edit-full-ms-wrapper" class="hidden space-y-2">
                    <div id="edit-box-ms-trigger" onclick="if(window.tryOpenMultisatuanView) window.tryOpenMultisatuanView('edit')" class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center space-x-3 cursor-pointer">
                        <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl"><i class="fa-solid fa-cube"></i></div>
                        <div>
                            <h4 class="font-bold text-xs text-gray-900">Tambah Multisatuan</h4>
                            <p class="text-[11px] text-gray-500">(pcs / Lusin / Dus)</p>
                        </div>
                    </div>
                    <div id="edit-card-ms-details" class="border border-gray-300 rounded-2xl p-4 bg-white shadow-xs space-y-2">
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-bold text-xs text-gray-900">Data Satuan</span>
                            <div class="space-x-3 text-base">
                                <button onclick="if(window.tryOpenMultisatuanView) window.tryOpenMultisatuanView('edit')" type="button" class="text-emerald-600 hover:text-emerald-800"><i class="fa-solid fa-pen"></i></button>
                                <button onclick="clearEditMultisatuanData()" type="button" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash-can"></i></button>
                            </div>
                        </div>
                        <div class="space-y-2 text-xs">
                            <div>
                                <div class="grid grid-cols-3 text-gray-500 text-[11px] pb-1">
                                    <span>Satuan Terkecil</span><span class="text-center">Jumlah</span><span class="text-right">Harga</span>
                                </div>
                                <div id="edit-row-ms-smallest" class="grid grid-cols-3 font-semibold text-gray-900 py-1"></div>
                            </div>
                            <div class="pt-1">
                                <div class="grid grid-cols-3 text-gray-500 text-[11px] pb-1">
                                    <span>Tipe Satuan</span><span class="text-center">Jumlah</span><span class="text-right">Harga</span>
                                </div>
                                <div id="edit-list-ms-others" class="space-y-1.5"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Checkboxes: Tampilkan di Transaksi & Pakai stok -->
                <div class="space-y-3 pt-1">
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" id="edit-full-chk-trx" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                        <span class="text-xs font-semibold text-gray-800">Tampilkan di Transaksi</span>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" id="edit-full-chk-stock" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                        <span class="text-xs font-semibold text-gray-800">Pakai stok</span>
                    </label>
                </div>

                <!-- Stok* (Readonly dengan Tombol Bulat Hijau Pensil di Samping Kanan - SS 1000920227) -->
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Stok<span class="text-red-500">*</span></label>
                    <div class="flex items-center space-x-2.5">
                        <input type="number" id="edit-full-stock" readonly class="flex-1 border border-gray-300 bg-gray-50 p-3 px-4 rounded-full text-sm text-gray-500 font-medium focus:outline-none">
                        <button onclick="openQuickStockManagementModal()" type="button" class="w-11 h-11 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center text-base shadow-2xs transition flex-shrink-0" title="Manajemen Stok">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    </div>
                </div>

                <!-- Kode* -->
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Kode<span class="text-red-500">*</span></label>
                    <div class="flex items-center space-x-2">
                        <input type="text" id="edit-full-sku" class="flex-1 border border-gray-300 p-3 px-4 rounded-full text-sm text-gray-900 font-medium focus:outline-none focus:border-emerald-600">
                        <button onclick="if(window.openScannerView) window.openScannerView('edit-product')" type="button" class="text-emerald-700 hover:text-emerald-900 text-2xl px-1.5 transition" title="Scan Barcode">
                            <i class="fa-solid fa-barcode"></i>
                        </button>
                    </div>
                </div>

                <!-- Harga dasar* -->
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Harga dasar<span class="text-red-500">*</span></label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-semibold text-gray-700">Rp</span>
                        <input type="number" id="edit-full-buyprice" oninput="calculateEditMarginMarkup()" class="w-full border border-gray-300 pl-11 p-3 pr-4 rounded-full text-sm text-gray-900 font-medium focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                    </div>
                </div>

                <!-- Harga jual* + Indikator Markup & Margin dengan Ikon (i) (SS 1000920228) -->
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Harga jual<span class="text-red-500">*</span></label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-semibold text-gray-700">Rp</span>
                        <input type="number" id="edit-full-price" oninput="calculateEditMarginMarkup()" class="w-full border border-gray-300 pl-11 p-3 pr-4 rounded-full text-sm text-gray-900 font-medium focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                    </div>
                    <div class="mt-2.5 space-y-1.5 text-xs text-gray-500 italic">
                        <div class="flex items-center space-x-2">
                            <span>Markup Penjualan <strong id="edit-disp-markup" class="text-emerald-600">0%</strong></span>
                            <button onclick="if(window.openMarkupInfoModal) window.openMarkupInfoModal('edit')" type="button" class="w-5 h-5 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center text-[11px] font-bold not-italic">i</button>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span>Margin Keuntungan <strong id="edit-disp-margin" class="text-emerald-600">0%</strong></span>
                            <button onclick="if(window.openMarginInfoModal) window.openMarginInfoModal('edit')" type="button" class="w-5 h-5 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center text-[11px] font-bold not-italic">i</button>
                        </div>
                    </div>
                </div>

                <!-- Bagian Opsional Edit Barang -->
                <div id="edit-product-advanced-fields" class="space-y-4 pt-1">
                    <!-- Kategori -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Kategori</label>
                        <div class="flex items-center space-x-2">
                            <div onclick="if(window.openSelectCategoryModal) window.openSelectCategoryModal('edit')" class="flex-1 border border-gray-300 p-3 px-4 rounded-full text-sm bg-white cursor-pointer flex justify-between items-center">
                                <span id="disp-edit-selected-category" class="text-gray-900 font-medium truncate">Umum</span>
                                <i class="fa-solid fa-chevron-down text-xs text-gray-400"></i>
                            </div>
                            <input type="hidden" id="edit-full-category" value="Umum">
                            <button onclick="switchView('kategori')" type="button" class="w-11 h-11 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Batas Minimum Stok -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Batas Minimum Stok</label>
                        <input type="number" id="edit-full-min-stock" class="w-full border border-gray-300 p-3 px-4 rounded-full text-sm text-gray-900 font-medium focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                    </div>

                    <!-- Berat (gram) & Satuan (gram,pcs) -->
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 mb-1">Berat (gram)</label>
                            <input type="number" id="edit-full-weight" class="w-full border border-gray-300 p-3 px-4 rounded-full text-sm text-gray-900 font-medium focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 mb-1">Satuan (gram,pcs)</label>
                            <input type="text" id="edit-full-unit" class="w-full border border-gray-300 p-3 px-4 rounded-full text-sm text-gray-900 font-medium focus:outline-none focus:border-emerald-600">
                        </div>
                    </div>

                    <!-- Diskon -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Diskon</label>
                        <div class="flex items-center space-x-3">
                            <input type="number" id="edit-full-discount" class="flex-1 border border-gray-300 p-3 px-4 rounded-full text-sm text-gray-900 font-medium focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                            <div class="flex rounded-xl overflow-hidden border border-emerald-600 flex-shrink-0">
                                <button type="button" id="btn-edit-disc-pct" onclick="setEditDiscountType('pct')" class="px-4 py-3 text-xs font-bold bg-emerald-500 text-white transition">%</button>
                                <button type="button" id="btn-edit-disc-rp" onclick="setEditDiscountType('rp')" class="px-4 py-3 text-xs font-bold bg-emerald-800 text-white transition">Rp</button>
                            </div>
                        </div>
                    </div>

                    <!-- Letak rak -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Letak rak</label>
                        <input type="text" id="edit-full-rack" class="w-full border border-gray-300 p-3 px-4 rounded-full text-sm text-gray-900 font-medium focus:outline-none focus:border-emerald-600">
                    </div>

                    <!-- Keterangan -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Keterangan</label>
                        <input type="text" id="edit-full-notes" class="w-full border border-gray-300 p-3 px-4 rounded-full text-sm text-gray-900 font-medium focus:outline-none focus:border-emerald-600">
                    </div>

                    <!-- Tombol Tambah Tipe Harga -->
                    <div class="pt-1">
                        <button onclick="if(window.openTierPricingView) window.openTierPricingView(-1)" type="button" class="w-full border border-emerald-600 text-emerald-700 hover:bg-emerald-50 py-3 rounded-xl font-bold text-xs transition leading-relaxed">
                            Tambah Tipe Harga<br>
                            <span class="font-bold text-emerald-700">(Grosir / Retailer / Eceran / Gojek)</span>
                        </button>
                    </div>
                </div>

                <!-- Toggle Tampilkan Sedikit -->
                <div class="text-center pt-2">
                    <button onclick="toggleEditProductAdvancedFields()" type="button" class="text-xs font-bold text-gray-600 hover:text-gray-900 inline-flex items-center space-x-1.5">
                        <span id="label-edit-toggle-advanced">Tampilkan sedikit</span>
                        <i id="icon-edit-toggle-advanced" class="fa-solid fa-chevron-up text-[10px]"></i>
                    </button>
                </div>

                <!-- Catatan Metode Akuntansi FIFO (SS 1000920228) -->
                <p class="text-[11px] text-gray-500 leading-relaxed pt-2">
                    Anda menggunakan metode akutansi FIFO. Untuk merubah stok dan harga dasar (Metode FIFO, LIFO dan Average) hanya bisa di menu Database &gt; Managemen stok. Sementara itu untuk merubah metode akutansi di PengaturanAkun &gt; Toko
                </p>
            </div>

            <!-- Tombol Simpan Sticky di Bawah -->
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="saveEditBarangFull()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition active:scale-95 text-sm flex items-center justify-center">
                    Simpan
                </button>
            </div>
        </div>
    `;

    // 2. SUNTIKKAN HTML MODALS KE DALAM #modals-container
    const modalsHTML = `
        <!-- === POPUP MANAGEMEN STOK CEPAT (SS 1000920104) === -->
        <div id="modal-quick-stock-mgmt" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-sm uppercase tracking-wider text-gray-900 text-center mb-4 border-b pb-3">MANAGEMEN STOK</h3>
                
                <div class="flex justify-between items-center text-xs font-bold text-gray-900 pb-3">
                    <span>Stok saat ini</span>
                    <span id="quick-stock-current-val">0</span>
                </div>

                <!-- Radio Tambah / Kurangi -->
                <div class="grid grid-cols-2 gap-4 py-2 text-xs font-semibold text-gray-800">
                    <label class="flex items-center space-x-2.5 cursor-pointer">
                        <input type="radio" name="quick_stock_mode" value="add" checked class="w-5 h-5 text-emerald-600 focus:ring-emerald-500">
                        <span>Tambah</span>
                    </label>
                    <label class="flex items-center space-x-2.5 cursor-pointer">
                        <input type="radio" name="quick_stock_mode" value="reduce" class="w-5 h-5 text-emerald-600 focus:ring-emerald-500">
                        <span>Kurangi</span>
                    </label>
                </div>

                <!-- Tanggal & Jam -->
                <div class="space-y-1.5 pt-3">
                    <label class="block text-xs font-semibold text-gray-500">Klik untuk menambahkan tanggal</label>
                    <input type="text" id="quick-stock-datetime" class="w-full border border-emerald-600 p-3 px-4 rounded-full text-xs text-emerald-700 font-bold focus:outline-none">
                </div>

                <!-- Harga Beli Terakhir & Jumlah -->
                <div class="grid grid-cols-2 gap-3 pt-3">
                    <div>
                        <label class="block text-xs font-semibold text-gray-500 mb-1">Harga Beli Terakhir</label>
                        <input type="number" id="quick-stock-buyprice" class="w-full border border-emerald-600 p-3 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none" pattern="[0-9]*" inputmode="numeric">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-500 mb-1">Jumlah</label>
                        <input type="number" id="quick-stock-qty" placeholder="Jumlah" class="w-full border border-emerald-600 p-3 px-4 rounded-full text-xs font-semibold text-gray-900 focus:outline-none" pattern="[0-9]*" inputmode="numeric">
                    </div>
                </div>
                <p class="text-[11px] font-bold text-gray-900 pt-2">*Ubah harga dasar dapat dilakukan di Edit Barang</p>

                <!-- Keterangan -->
                <div class="pt-3">
                    <label class="block text-xs font-semibold text-gray-500 mb-1">Keterangan</label>
                    <input type="text" id="quick-stock-notes" placeholder="Keterangan" class="w-full border border-emerald-600 p-3 px-4 rounded-full text-xs focus:outline-none">
                </div>
                <p class="text-[11px] text-gray-600 pt-2.5 leading-relaxed">
                    *Disarankan tambah stok lewat <span onclick="closeQuickStockModal(); switchView('pembelian');" class="text-emerald-600 font-bold cursor-pointer hover:underline">Pembelian</span> agar tercatat di pengeluaran.
                </p>

                <div class="grid grid-cols-2 gap-3 mt-6">
                    <button onclick="closeQuickStockModal()" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-bold text-xs uppercase transition">BATAL</button>
                    <button onclick="submitQuickStockManagement()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-bold text-xs uppercase transition">SIMPAN</button>
                </div>
            </div>
        </div>

        <!-- === POPUP EDIT STOK BATCH (SS 1000920109) === -->
        <div id="modal-edit-stok-batch" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-sm uppercase tracking-wider text-gray-900 text-center mb-4 border-b pb-3">EDIT STOK</h3>
                
                <div class="pt-1">
                    <input type="text" id="edit-batch-datetime" class="w-full border border-emerald-600 p-3 px-4 rounded-full text-xs text-emerald-700 font-bold text-center focus:outline-none">
                </div>

                <div class="grid grid-cols-2 gap-3 pt-3.5">
                    <div>
                        <label class="block text-xs font-semibold text-gray-500 mb-1">Harga Dasar</label>
                        <input type="number" id="edit-batch-buyprice" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-500 mb-1">Jumlah</label>
                        <input type="number" id="edit-batch-qty" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                    </div>
                </div>

                <div class="pt-3.5">
                    <label class="block text-xs font-semibold text-gray-500 mb-1">Keterangan</label>
                    <input type="text" id="edit-batch-notes" placeholder="Keterangan" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs focus:outline-none focus:border-emerald-600">
                </div>
                <p class="text-[11px] text-gray-600 pt-2.5 leading-relaxed">
                    *Disarankan tambah stok lewat <span onclick="closeEditStokBatchModal(); switchView('pembelian');" class="text-emerald-600 font-bold cursor-pointer hover:underline">Pembelian</span> agar tercatat di pengeluaran.
                </p>

                <div class="grid grid-cols-2 gap-3 mt-6">
                    <button onclick="closeEditStokBatchModal()" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-bold text-xs uppercase transition">BATAL</button>
                    <button onclick="submitEditStokBatch()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-bold text-xs uppercase transition">SIMPAN</button>
                </div>
            </div>
        </div>

        <!-- === POPUP AKSES TERBATAS (KHUSUS OWNER / ADMIN) === -->
        <div id="modal-restricted-access" class="fixed inset-0 bg-black/60 z-[80] hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl p-6 text-center">
                <div class="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto mb-3">
                    <i class="fa-solid fa-lock"></i>
                </div>
                <h3 class="font-extrabold text-sm uppercase tracking-wider text-gray-900 mb-2">AKSES TERBATAS</h3>
                <p class="text-xs text-gray-600 leading-relaxed mb-5">Fitur ini hanya dapat diakses oleh <strong>Admin</strong> atau <strong>Owner</strong> saja.</p>
                <button onclick="document.getElementById('modal-restricted-access').classList.add('hidden')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full font-bold text-xs uppercase transition">
                    MENGERTI
                </button>
            </div>
        </div>
    `;

    // Pasang ke DOM
    const wsContainer = document.getElementById('workspace-container');
    if (wsContainer) wsContainer.insertAdjacentHTML('beforeend', viewsHTML);

    const mdContainer = document.getElementById('modals-container');
    if (mdContainer) mdContainer.insertAdjacentHTML('beforeend', modalsHTML);

    // ========================================================================
    // 3. STATE & LOGIKA JAVASCRIPT DETAIL BARANG, STOK FIFO, & EDIT BARANG
    // ========================================================================
    window.activeDetailProduct = null;
    let editingBatchIndex = 0;
    let editDiscountMode = 'rp';
    let editAdvancedVisible = true;

    function formatShortIndoDate(dateStr) {
        if (!dateStr) return '21 Okt 2026';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const d = new Date(dateStr.replace(/\//g, '-'));
        if (isNaN(d.getTime())) return dateStr.split(' ')[0];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }

    // --- 1. BUKA HALAMAN INFORMASI DETAIL BARANG (SS 1000920103) ---
    window.openProductDetailView = (productId) => {
        const p = (window.products || []).find(x => x.id === productId);
        if (!p) return;
        window.activeDetailProduct = p;

        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-product-detail').classList.remove('hidden');

        // Isi foto produk
        const imgBox = document.getElementById('detail-prod-image-container');
        if (p.image) {
            imgBox.innerHTML = `<img src="${p.image}" class="w-24 h-24 rounded-xl object-cover shadow-xs border border-gray-100">`;
        } else {
            const initials = p.name ? p.name.trim().substring(0, 2) : 'RL';
            imgBox.innerHTML = `<div class="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-2xl shadow-inner">${initials}</div>`;
        }

        // Isi 9 baris atribut
        document.getElementById('detail-prod-name').innerText = p.name || '-';
        document.getElementById('detail-prod-price').innerText = `Rp ${Number(p.price || 0).toLocaleString('id-ID')}`;

        const discVal = Number(p.discountVal) || 0;
        document.getElementById('detail-prod-discount').innerText = discVal > 0
            ? (p.discountType === 'pct' ? `${discVal}%` : `Rp ${discVal.toLocaleString('id-ID')}`)
            : 'Rp 0';

        document.getElementById('detail-prod-weight').innerText = `${Number(p.weight || 0).toFixed(1)} gram`;
        document.getElementById('detail-prod-sku').innerText = p.sku || '-';
        document.getElementById('detail-prod-stock').innerText = `${Number(p.stock) || 0} item`;
        document.getElementById('detail-prod-min-stock').innerText = `${Number(p.minStock || 0).toFixed(1)}`;
        document.getElementById('detail-prod-category').innerText = p.category || '-';
        document.getElementById('detail-prod-rack').innerText = p.rack || '';
        document.getElementById('detail-prod-notes').innerText = p.notes || '';

        // Tabel Multisatuan (Jika ada)
        const msWrapper = document.getElementById('detail-multisatuan-wrapper');
        const msRows = document.getElementById('detail-multisatuan-table-rows');
        if (p.multisatuanSmallest || (p.multisatuanOthers && p.multisatuanOthers.length > 0)) {
            msWrapper.classList.remove('hidden');
            msRows.innerHTML = '';
            const smallName = p.multisatuanSmallest ? p.multisatuanSmallest.name : (p.unit || 'pcs');
            const smallPrice = Number(p.price) || (p.multisatuanSmallest ? Number(p.multisatuanSmallest.price) : 0);

            msRows.innerHTML += `
                <div class="grid grid-cols-3 py-2.5 font-semibold text-gray-900">
                    <span>${smallName}</span>
                    <span class="text-center">1</span>
                    <span class="text-right">Rp ${smallPrice.toLocaleString('id-ID')}</span>
                </div>
            `;
            (p.multisatuanOthers || []).forEach(o => {
                msRows.innerHTML += `
                    <div class="grid grid-cols-3 py-2.5 font-semibold text-gray-900">
                        <span>${o.name}</span>
                        <span class="text-center">${o.qty}</span>
                        <span class="text-right">Rp ${Number(o.price || 0).toLocaleString('id-ID')}</span>
                    </div>
                `;
            });
        } else {
            msWrapper.classList.add('hidden');
        }
    };

    window.closeProductDetailView = () => {
        document.getElementById('view-product-detail').classList.add('hidden');
        document.getElementById('view-products').classList.remove('hidden');
        if (window.renderInventoryCards) window.renderInventoryCards(window.products);
    };

    // --- 2. PEMBATASAN HAK AKSES KASIR DI HALAMAN DETAIL BARANG ---
    window.handleDetailActionClick = (actionType) => {
        const isOwner = (window.activeKasir || 'Owner').toLowerCase().includes('owner') || (window.activeKasir || '').toLowerCase().includes('admin');

        // Jika yang login adalah Kasir, tampilkan popup Akses Terbatas untuk semua ketukan
        if (!isOwner) {
            document.getElementById('modal-restricted-access').classList.remove('hidden');
            return;
        }

        if (!window.activeDetailProduct) return;

        if (actionType === 'man_stok') {
            window.openQuickStockManagementModal();
        } else if (actionType === 'hapus') {
            deleteActiveDetailProduct();
        } else if (actionType === 'detail_sisa_stok') {
            window.openDetailSisaStokView();
        } else if (actionType === 'pelanggan') {
            if (window.openPelangganTerkaitView) window.openPelangganTerkaitView();
        } else if (actionType === 'supplier') {
            if (window.openSupplierTerkaitView) window.openSupplierTerkaitView();
        } else if (actionType === 'edit_barang') {
            window.openEditBarangFullView(window.activeDetailProduct.id);
        }
    };

    async function deleteActiveDetailProduct() {
        const p = window.activeDetailProduct;
        if (!p) return;
        if (!confirm(`Yakin ingin menghapus barang '${p.name}'?`)) return;

        try {
            if (window.fb && window.db && !String(p.id).startsWith('local_')) {
                await window.fb.deleteDoc(window.fb.doc(window.db, "products", p.id));
            }
            window.products = (window.products || []).filter(x => x.id !== p.id);
            alert("Barang berhasil dihapus!");
            window.closeProductDetailView();
            if (window.loadInitialData) window.loadInitialData();
        } catch (err) {
            alert("Gagal menghapus barang.");
        }
    }

    // --- 3. POPUP MANAGEMEN STOK CEPAT (SS 1000920104) ---
    window.openQuickStockManagementModal = () => {
        const p = window.activeDetailProduct;
        if (!p) return;

        document.getElementById('quick-stock-current-val').innerText = Number(p.stock) || 0;
        document.querySelector('input[name="quick_stock_mode"][value="add"]').checked = true;
        document.getElementById('quick-stock-datetime').value = window.getFormattedCurrentDateTime();
        document.getElementById('quick-stock-buyprice').value = Number(p.buyPrice || 0).toFixed(1);
        document.getElementById('quick-stock-qty').value = '';
        document.getElementById('quick-stock-notes').value = '';
        document.getElementById('modal-quick-stock-mgmt').classList.remove('hidden');
    };

    window.closeQuickStockModal = () => {
        document.getElementById('modal-quick-stock-mgmt').classList.add('hidden');
    };

    window.submitQuickStockManagement = async () => {
        const p = window.activeDetailProduct;
        if (!p) return;

        const mode = document.querySelector('input[name="quick_stock_mode"]:checked').value; // 'add' atau 'reduce'
        const dateTime = document.getElementById('quick-stock-datetime').value.trim() || window.getFormattedCurrentDateTime();
        const buyPrice = Number(document.getElementById('quick-stock-buyprice').value) || Number(p.buyPrice) || 0;
        const deltaQty = Number(document.getElementById('quick-stock-qty').value) || 0;
        const notes = document.getElementById('quick-stock-notes').value.trim();

        if (deltaQty <= 0) return alert("Masukkan jumlah stok yang valid (lebih dari 0)!");

        let currentStock = Number(p.stock) || 0;
        let newStock = mode === 'add' ? (currentStock + deltaQty) : (currentStock - deltaQty);
        if (newStock < 0) newStock = 0;

        // Kelola daftar batch FIFO
        let batches = Array.isArray(p.stockBatches) && p.stockBatches.length > 0
            ? [...p.stockBatches]
            : (currentStock > 0 ? [{ date: dateTime, stock: currentStock, buyPrice: Number(p.buyPrice) || buyPrice, notes: 'Stok Awal' }] : []);

        if (mode === 'add') {
            batches.push({ date: dateTime, stock: deltaQty, buyPrice: buyPrice, notes: notes });
        } else {
            let rem = deltaQty;
            for (let i = 0; i < batches.length && rem > 0; i++) {
                if (batches[i].stock <= rem) {
                    rem -= batches[i].stock;
                    batches[i].stock = 0;
                } else {
                    batches[i].stock -= rem;
                    rem = 0;
                }
            }
            batches = batches.filter(b => b.stock > 0);
        }

        try {
            p.stock = newStock;
            p.buyPrice = buyPrice;
            p.stockBatches = batches;

            if (window.fb && window.db && !String(p.id).startsWith('local_')) {
                await window.fb.updateDoc(window.fb.doc(window.db, "products", p.id), {
                    stock: newStock,
                    buyPrice: buyPrice,
                    stockBatches: batches,
                    updatedAt: window.fb.serverTimestamp()
                });
            }

            // Sinkronkan tampilan jika sedang di layar Edit Barang atau Detail Barang
            const editStkEl = document.getElementById('edit-full-stock');
            if (editStkEl) editStkEl.value = newStock;
            document.getElementById('detail-prod-stock').innerText = `${newStock} item`;

            window.closeQuickStockModal();
            if (window.renderInventoryCards) window.renderInventoryCards(window.products);
            alert("Stok barang berhasil diperbarui!");
        } catch (err) {
            alert("Gagal memperbarui stok barang.");
        }
    };

    // --- 4. HALAMAN DETAIL SISA STOK & FIX DATA STOK (SS 1000920105 & 1000920107) ---
    window.openDetailSisaStokView = () => {
        const p = window.activeDetailProduct;
        if (!p) return;

        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('dropdown-fix-data-stok').classList.add('hidden');
        document.getElementById('view-detail-sisa-stok').classList.remove('hidden');

        renderDetailSisaStokContent();
    };

    window.closeDetailSisaStokView = () => {
        document.getElementById('view-detail-sisa-stok').classList.add('hidden');
        document.getElementById('view-product-detail').classList.remove('hidden');
        if (window.activeDetailProduct) window.openProductDetailView(window.activeDetailProduct.id);
    };

    function renderDetailSisaStokContent() {
        const p = window.activeDetailProduct;
        if (!p) return;

        const stock = Number(p.stock) || 0;
        const buyPrice = Number(p.buyPrice) || 0;
        const sellPrice = Number(p.price) || 0;

        // Pastikan minimal ada 1 batch jika stok > 0
        if (!Array.isArray(p.stockBatches) || p.stockBatches.length === 0) {
            p.stockBatches = [{
                date: '2023/10/21 15:11:28',
                stock: stock,
                buyPrice: buyPrice,
                notes: ''
            }];
        }

        document.getElementById('stock-detail-prod-name').innerText = p.name || '-';
        document.getElementById('stock-detail-prod-sku').innerText = p.sku || '-';
        document.getElementById('stock-detail-prod-stock').innerText = stock;
        document.getElementById('stock-detail-prod-price').innerText = `Rp ${sellPrice.toLocaleString('id-ID')}`;
        document.getElementById('stock-detail-last-buy').innerText = `Rp ${buyPrice.toLocaleString('id-ID')}`;

        // Hitung Sisa Modal, Proyeksi Omzet, & Proyeksi Keuntungan
        let sisaModal = 0;
        p.stockBatches.forEach(b => {
            sisaModal += (Number(b.stock) || 0) * (Number(b.buyPrice) || 0);
        });
        if (sisaModal === 0 && stock > 0) sisaModal = stock * buyPrice;

        const proyeksiOmzet = stock * sellPrice;
        const proyeksiUntung = proyeksiOmzet - sisaModal;

        document.getElementById('fin-card-sisa-modal').innerText = `Rp ${Math.round(sisaModal).toLocaleString('id-ID')}`;
        document.getElementById('fin-card-proyeksi-omzet').innerText = `Rp ${Math.round(proyeksiOmzet).toLocaleString('id-ID')}`;
        document.getElementById('fin-card-proyeksi-untung').innerText = `Rp ${Math.round(proyeksiUntung).toLocaleString('id-ID')}`;

        // Render Daftar Batch Sisa Stok
        const batchContainer = document.getElementById('container-stock-batches-list');
        batchContainer.innerHTML = '';

        p.stockBatches.forEach((b, idx) => {
            batchContainer.innerHTML += `
                <div class="py-3 space-y-2">
                    <div class="flex justify-between items-start">
                        <div>
                            <span class="text-xs text-gray-500 block">Tanggal Masuk</span>
                            <span class="text-xs font-extrabold text-gray-900 block mt-0.5">${formatShortIndoDate(b.date)}</span>
                        </div>
                        <div class="flex items-center space-x-5 text-lg pt-1">
                            <button onclick="openEditStokBatchModal(${idx})" class="text-emerald-600 hover:text-emerald-800 transition" title="Edit Stok"><i class="fa-solid fa-pen"></i></button>
                            <button onclick="deleteBatchStokItem(${idx})" class="text-red-500 hover:text-red-700 transition" title="Hapus Batch"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </div>
                    <div class="flex justify-between items-end pt-1">
                        <div>
                            <span class="text-xs text-gray-500 block">Sisa stok</span>
                            <span class="text-xs font-extrabold text-gray-900 block mt-0.5">${Number(b.stock) || 0}</span>
                        </div>
                        <div class="text-right">
                            <span class="text-xs text-gray-500 block">Harga Dasar</span>
                            <span class="text-xs font-extrabold text-gray-900 block mt-0.5">Rp ${Number(b.buyPrice || 0).toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    window.toggleFixDataStokDropdown = () => {
        document.getElementById('dropdown-fix-data-stok').classList.toggle('hidden');
    };

    window.fixDataStokAction = async () => {
        document.getElementById('dropdown-fix-data-stok').classList.add('hidden');
        const p = window.activeDetailProduct;
        if (!p) return;

        // Sinkronkan jumlah total stok dari batch FIFO & muat ulang dari database
        if (Array.isArray(p.stockBatches) && p.stockBatches.length > 0) {
            const totalFromBatches = p.stockBatches.reduce((acc, b) => acc + (Number(b.stock) || 0), 0);
            p.stock = totalFromBatches;
            if (window.fb && window.db && !String(p.id).startsWith('local_')) {
                try {
                    await window.fb.updateDoc(window.fb.doc(window.db, "products", p.id), { stock: totalFromBatches });
                } catch (e) {}
            }
        }
        renderDetailSisaStokContent();
        alert("Fix Data Stok selesai! Data sisa stok berhasil disinkronkan.");
    };

    // --- 5. POPUP EDIT STOK BATCH (SS 1000920109) ---
    window.openEditStokBatchModal = (idx = 0) => {
        const p = window.activeDetailProduct;
        if (!p || !p.stockBatches || !p.stockBatches[idx]) return;
        editingBatchIndex = idx;
        const b = p.stockBatches[idx];

        document.getElementById('edit-batch-datetime').value = b.date || window.getFormattedCurrentDateTime();
        document.getElementById('edit-batch-buyprice').value = Number(b.buyPrice || p.buyPrice || 0).toFixed(2);
        document.getElementById('edit-batch-qty').value = Number(b.stock) || 0;
        document.getElementById('edit-batch-notes').value = b.notes || '';
        document.getElementById('modal-edit-stok-batch').classList.remove('hidden');
    };

    window.closeEditStokBatchModal = () => {
        document.getElementById('modal-edit-stok-batch').classList.add('hidden');
    };

    window.submitEditStokBatch = async () => {
        const p = window.activeDetailProduct;
        if (!p || !p.stockBatches) return;

        const newDate = document.getElementById('edit-batch-datetime').value.trim() || window.getFormattedCurrentDateTime();
        const newBuyPrice = Number(document.getElementById('edit-batch-buyprice').value) || 0;
        const newQty = Number(document.getElementById('edit-batch-qty').value) || 0;
        const newNotes = document.getElementById('edit-batch-notes').value.trim();

        p.stockBatches[editingBatchIndex] = {
            date: newDate,
            buyPrice: newBuyPrice,
            stock: newQty,
            notes: newNotes
        };

        const totalStock = p.stockBatches.reduce((sum, b) => sum + (Number(b.stock) || 0), 0);
        p.stock = totalStock;
        p.buyPrice = newBuyPrice;

        try {
            if (window.fb && window.db && !String(p.id).startsWith('local_')) {
                await window.fb.updateDoc(window.fb.doc(window.db, "products", p.id), {
                    stock: totalStock,
                    buyPrice: newBuyPrice,
                    stockBatches: p.stockBatches,
                    updatedAt: window.fb.serverTimestamp()
                });
            }
            window.closeEditStokBatchModal();
            renderDetailSisaStokContent();
            alert("Data stok berhasil diperbarui!");
        } catch (err) {
            alert("Gagal menyimpan perubahan stok.");
        }
    };

    window.deleteBatchStokItem = async (idx) => {
        const p = window.activeDetailProduct;
        if (!p || !p.stockBatches) return;
        if (!confirm("Hapus batch sisa stok ini?")) return;

        p.stockBatches.splice(idx, 1);
        const totalStock = p.stockBatches.reduce((sum, b) => sum + (Number(b.stock) || 0), 0);
        p.stock = totalStock;

        if (window.fb && window.db && !String(p.id).startsWith('local_')) {
            try {
                await window.fb.updateDoc(window.fb.doc(window.db, "products", p.id), {
                    stock: totalStock,
                    stockBatches: p.stockBatches
                });
            } catch (e) {}
        }
        renderDetailSisaStokContent();
    };

    // --- 6. HALAMAN EDIT BARANG LENGKAP (SS 1000920227 & 1000920228) ---
    window.openEditBarangFullView = (prodId) => {
        const p = (window.products || []).find(x => x.id === prodId) || window.activeDetailProduct;
        if (!p) return;
        window.activeDetailProduct = p;

        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-edit-barang-full').classList.remove('hidden');

        // Isi Foto
        const preview = document.getElementById('edit-full-img-preview');
        const placeholder = document.getElementById('edit-full-img-placeholder');
        document.getElementById('edit-full-image-base64').value = p.image || '';
        if (p.image) {
            preview.src = p.image;
            preview.classList.remove('hidden');
            placeholder.classList.add('hidden');
        } else {
            preview.src = '';
            preview.classList.add('hidden');
            placeholder.classList.remove('hidden');
        }

        // Isi Data Utama
        document.getElementById('edit-full-name').value = p.name || '';
        document.getElementById('edit-full-type').value = p.type || 'Default';
        document.getElementById('edit-full-chk-trx').checked = p.showTransaction !== false;
        document.getElementById('edit-full-chk-stock').checked = p.useStock !== false;
        document.getElementById('edit-full-stock').value = Number(p.stock) || 0;
        document.getElementById('edit-full-sku').value = p.sku || '';
        document.getElementById('edit-full-buyprice').value = Number(p.buyPrice) || 0;
        document.getElementById('edit-full-price').value = Number(p.price) || 0;
        document.getElementById('edit-full-category').value = p.category || 'Umum';
        document.getElementById('disp-edit-selected-category').innerText = p.category || 'Umum';
        document.getElementById('edit-full-min-stock').value = Number(p.minStock || 0).toFixed(1);
        document.getElementById('edit-full-weight').value = p.weight || '';
        document.getElementById('edit-full-unit').value = p.unit || 'pcs';
        document.getElementById('edit-full-discount').value = Number(p.discountVal || 0).toFixed(1);
        document.getElementById('edit-full-rack').value = p.rack || '';
        document.getElementById('edit-full-notes').value = p.notes || '';

        // Sinkronkan state Multisatuan & Tipe Harga
        window.multisatuanSmallest = p.multisatuanSmallest ? { ...p.multisatuanSmallest } : null;
        window.multisatuanOthers = Array.isArray(p.multisatuanOthers) ? [...p.multisatuanOthers] : [];
        window.savedPriceTiers = Array.isArray(p.priceTiers) ? [...p.priceTiers] : (p.priceTierConfig ? [p.priceTierConfig] : []);

        window.handleEditProductTypeChange(p.type || 'Default');
        window.setEditDiscountType(p.discountType || 'rp');
        window.calculateEditMarginMarkup();
    };

    window.closeEditBarangFullView = () => {
        document.getElementById('view-edit-barang-full').classList.add('hidden');
        document.getElementById('view-product-detail').classList.remove('hidden');
    };

    window.clearEditFullPhoto = () => {
        document.getElementById('edit-full-image-base64').value = '';
        const preview = document.getElementById('edit-full-img-preview');
        preview.src = '';
        preview.classList.add('hidden');
        document.getElementById('edit-full-img-placeholder').classList.remove('hidden');
    };

    window.handleEditProductTypeChange = (val) => {
        const msWrap = document.getElementById('edit-full-ms-wrapper');
        if (val === 'Multisatuan') {
            msWrap.classList.remove('hidden');
            window.renderEditMultisatuanCard();
        } else {
            msWrap.classList.add('hidden');
        }
    };

    window.renderEditMultisatuanCard = function() {
        const trigger = document.getElementById('edit-box-ms-trigger');
        const card = document.getElementById('edit-card-ms-details');
        if (!window.multisatuanSmallest) {
            trigger.classList.remove('hidden');
            card.classList.add('hidden');
            return;
        }
        trigger.classList.add('hidden');
        card.classList.remove('hidden');

        const sellPrice = Number(document.getElementById('edit-full-price').value) || window.multisatuanSmallest.price || 0;
        document.getElementById('edit-row-ms-smallest').innerHTML = `
            <span>${window.multisatuanSmallest.name}</span>
            <span class="text-center">1</span>
            <span class="text-right">Rp ${Number(sellPrice).toLocaleString('id-ID')}</span>
        `;

        const othersEl = document.getElementById('edit-list-ms-others');
        othersEl.innerHTML = '';
        (window.multisatuanOthers || []).forEach((item, idx) => {
            othersEl.innerHTML += `
                <div class="grid grid-cols-3 items-center py-0.5 text-gray-900 font-semibold">
                    <span>${item.name}</span>
                    <span class="text-center">${item.qty}</span>
                    <div class="flex items-center justify-end space-x-3">
                        <span>Rp ${Number(item.price).toLocaleString('id-ID')}</span>
                        <button onclick="removeEditOtherUnit(${idx})" type="button" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash-can text-sm"></i></button>
                    </div>
                </div>
            `;
        });
    };

    window.removeEditOtherUnit = (idx) => {
        window.multisatuanOthers.splice(idx, 1);
        window.renderEditMultisatuanCard();
    };

    window.clearEditMultisatuanData = () => {
        window.multisatuanSmallest = null;
        window.multisatuanOthers = [];
        window.renderEditMultisatuanCard();
    };

    window.calculateEditMarginMarkup = () => {
        const buy = Number(document.getElementById('edit-full-buyprice').value) || 0;
        const sell = Number(document.getElementById('edit-full-price').value) || 0;
        let markup = 0, margin = 0;
        if (buy > 0) markup = ((sell - buy) / buy) * 100;
        if (sell > 0) margin = ((sell - buy) / sell) * 100;

        document.getElementById('edit-disp-markup').innerText = `${Number(markup.toFixed(2))}%`;
        document.getElementById('edit-disp-margin').innerText = `${Number(margin.toFixed(2))}%`;
    };

    window.setEditDiscountType = (type) => {
        editDiscountMode = type;
        const btnPct = document.getElementById('btn-edit-disc-pct');
        const btnRp = document.getElementById('btn-edit-disc-rp');
        if (type === 'pct') {
            btnPct.className = "px-4 py-3 text-xs font-bold bg-emerald-800 text-white transition";
            btnRp.className = "px-4 py-3 text-xs font-bold bg-emerald-500 text-white transition";
        } else {
            btnRp.className = "px-4 py-3 text-xs font-bold bg-emerald-800 text-white transition";
            btnPct.className = "px-4 py-3 text-xs font-bold bg-emerald-500 text-white transition";
        }
    };

    window.toggleEditProductAdvancedFields = () => {
        editAdvancedVisible = !editAdvancedVisible;
        const adv = document.getElementById('edit-product-advanced-fields');
        const lbl = document.getElementById('label-edit-toggle-advanced');
        const icn = document.getElementById('icon-edit-toggle-advanced');
        if (editAdvancedVisible) {
            adv.classList.remove('hidden');
            lbl.innerText = "Tampilkan sedikit";
            icn.className = "fa-solid fa-chevron-up text-[10px]";
        } else {
            adv.classList.add('hidden');
            lbl.innerText = "Tampilkan lebih banyak";
            icn.className = "fa-solid fa-chevron-down text-[10px]";
        }
    };

    window.saveEditBarangFull = async () => {
        const p = window.activeDetailProduct;
        if (!p) return;

        const name = document.getElementById('edit-full-name').value.trim();
        const type = document.getElementById('edit-full-type').value;
        const showTransaction = document.getElementById('edit-full-chk-trx').checked;
        const useStock = document.getElementById('edit-full-chk-stock').checked;
        const stock = Number(document.getElementById('edit-full-stock').value) || 0;
        const sku = document.getElementById('edit-full-sku').value.trim();
        const buyPrice = Number(document.getElementById('edit-full-buyprice').value) || 0;
        const price = Number(document.getElementById('edit-full-price').value) || 0;
        const category = document.getElementById('edit-full-category').value.trim() || 'Umum';
        const minStock = Number(document.getElementById('edit-full-min-stock').value) || 0;
        const weight = Number(document.getElementById('edit-full-weight').value) || 0;
        const unit = document.getElementById('edit-full-unit').value.trim() || 'pcs';
        const discountVal = Number(document.getElementById('edit-full-discount').value) || 0;
        const rack = document.getElementById('edit-full-rack').value.trim();
        const notes = document.getElementById('edit-full-notes').value.trim();
        const image = document.getElementById('edit-full-image-base64').value;

        if (!name) return alert("Nama* barang wajib diisi!");
        if (!sku) return alert("Kode* barang wajib diisi!");

        const updatedFields = {
            name, type, showTransaction, useStock, stock, sku, buyPrice, price,
            category, minStock, weight, unit, discountVal,
            discountType: editDiscountMode,
            rack, notes, image,
            multisatuanSmallest: window.multisatuanSmallest || null,
            multisatuanOthers: window.multisatuanOthers || [],
            priceTiers: window.savedPriceTiers || []
        };

        try {
            Object.assign(p, updatedFields);
            if (window.fb && window.db && !String(p.id).startsWith('local_')) {
                await window.fb.updateDoc(window.fb.doc(window.db, "products", p.id), {
                    ...updatedFields,
                    updatedAt: window.fb.serverTimestamp()
                });
            }
            alert("Perubahan data barang berhasil disimpan!");
            window.closeEditBarangFullView();
            window.openProductDetailView(p.id);
            if (window.renderInventoryCards) window.renderInventoryCards(window.products);
        } catch (err) {
            console.error(err);
            alert("Gagal menyimpan perubahan barang.");
        }
    };
})();
