// ============================================================================
// MODUL 3: FORM TAMBAH BARANG, KAMERA <80KB, PAKET, VARIAN, MULTISATUAN, & TIPE HARGA
// ============================================================================

(function() {
    // 1. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- === FORM LENGKAP TAMBAH BARANG (SS 1000919568 & 1000919569) === -->
        <div id="view-add-product" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <!-- Header Tambah Barang (Tanpa Tambah Instan) -->
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="closeAddProductView()" class="text-gray-800 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-gray-900">Tambah Barang</h2>
                </div>
            </div>

            <!-- Konten Formulir (Bisa Digulir ke Bawah) -->
            <div class="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
                <!-- Wadah Foto Produk & Ikon Kamera (<80KB) / Galeri (<100KB) -->
                <div class="flex flex-col items-center justify-center">
                    <div class="w-24 h-24 bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden relative shadow-inner mb-2" id="preview-box-container">
                        <img id="add-prod-img-preview" src="" alt="Preview" class="w-full h-full object-cover hidden">
                        <div id="add-prod-img-placeholder" class="text-gray-300 text-4xl"><i class="fa-regular fa-images"></i></div>
                    </div>
                    <div class="flex items-center space-x-6 text-emerald-700 text-xl">
                        <!-- Tombol Kamera Langsung (Auto Kompres < 80 KB) -->
                        <button onclick="openLivePhotoCamera('add')" type="button" class="p-1.5 hover:text-emerald-800 transition" title="Ambil Foto Kamera (<80KB)">
                            <i class="fa-solid fa-camera"></i>
                        </button>
                        <!-- Tombol Galeri (Batas Maksimal 100 KB) -->
                        <button onclick="triggerGalleryPick('add')" type="button" class="p-1.5 hover:text-emerald-800 transition" title="Pilih dari Galeri (Maks 100KB)">
                            <i class="fa-regular fa-image"></i>
                        </button>
                        <!-- Tombol Hapus Foto (Muncul saat ada foto) -->
                        <button id="btn-clear-add-photo" onclick="clearAddProductPhoto()" type="button" class="p-1.5 text-gray-400 hover:text-red-500 transition hidden" title="Hapus Gambar">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <input type="file" id="input-prod-gallery" accept="image/*" class="hidden" onchange="handleGalleryPick(event)">
                    <input type="hidden" id="add-prod-image-base64" value="">
                    <span id="add-prod-img-size-info" class="text-[10px] text-emerald-600 font-semibold mt-1 hidden"></span>
                </div>

                <!-- Nama* -->
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Nama<span class="text-red-500">*</span></label>
                    <input type="text" id="add-name" class="w-full border border-gray-300 p-3 rounded-full text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600">
                </div>

                <!-- Tipe Barang (Dropdown Tanpa IMEI - SS 1000919704) -->
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Tipe Barang</label>
                    <div class="relative">
                        <select id="add-type" onchange="handleProductTypeChange(this.value)" class="w-full border border-gray-300 p-3 px-4 rounded-full text-sm focus:outline-none focus:border-emerald-600 appearance-none bg-white font-medium text-gray-800">
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
                    <!-- Catatan Khusus Add On (SS 1000919904) -->
                    <p id="note-addon-info" class="text-[11px] text-gray-500 mt-1.5 hidden">*Barang Add On tidak terpengaruh metode akuntansi (fifo, lifo, dll)</p>
                </div>

                <!-- CONTAINER KHUSUS PAKET (SS 1000919691 & 1000919693) -->
                <div id="container-type-paket" class="hidden space-y-2">
                    <div id="box-paket-trigger" onclick="openPackageSelectView()" class="border border-emerald-600 rounded-xl p-3.5 text-center cursor-pointer hover:bg-emerald-50/50 transition">
                        <span class="text-xs font-bold text-emerald-700 block">Tambah Paket</span>
                        <span class="text-xs font-semibold text-emerald-600 block mt-0.5">(Klik di sini untuk menambahkan paket)</span>
                    </div>
                    <div id="card-paket-details" class="hidden border border-gray-300 rounded-2xl p-4 bg-white shadow-xs">
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-bold text-xs text-gray-800">Paket</span>
                            <div class="space-x-3 text-xs font-bold">
                                <button onclick="openPackageSelectView()" type="button" class="text-emerald-600 hover:underline">Edit</button>
                                <button onclick="clearPackageItems()" type="button" class="text-red-600 hover:underline">Hapus</button>
                            </div>
                        </div>
                        <div id="list-paket-selected-items" class="space-y-1.5 text-xs text-gray-600"></div>
                    </div>
                </div>

                <!-- CONTAINER KHUSUS VARIAN (SS 1000919694 & 1000919697) -->
                <div id="container-type-varian" class="hidden space-y-2">
                    <div id="box-varian-trigger" onclick="openVariantWizardStep1()" class="border border-emerald-600 rounded-xl p-3.5 text-center cursor-pointer hover:bg-emerald-50/50 transition">
                        <span class="text-xs font-bold text-emerald-700 block">Tambah / Edit Variasi</span>
                        <span class="text-xs font-semibold text-emerald-600 block mt-0.5">(Ukuran / Warna)</span>
                    </div>
                    <div id="card-varian-details" class="hidden border border-gray-300 rounded-2xl p-4 bg-white shadow-xs">
                        <div class="flex justify-end items-center space-x-4 text-xs font-bold mb-2">
                            <button onclick="openVariantWizardStep1()" type="button" class="text-emerald-600 hover:underline">Edit/Tambah</button>
                            <button onclick="clearVariantItems()" type="button" class="text-red-600 hover:underline">Hapus</button>
                        </div>
                        <div id="list-varian-selected-rows" class="divide-y divide-gray-200 text-xs"></div>
                    </div>
                </div>

                <!-- CONTAINER KHUSUS MULTISATUAN (SS 1000919896 & 1000919902) -->
                <div id="container-type-multisatuan" class="hidden space-y-2">
                    <div id="box-multisatuan-trigger" onclick="tryOpenMultisatuanView('add')" class="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-4 flex items-center space-x-3.5 cursor-pointer hover:bg-emerald-100/60 transition">
                        <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl flex-shrink-0 shadow-xs">
                            <i class="fa-solid fa-cube"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-xs text-gray-900">Tambah Multisatuan</h4>
                            <p class="text-[11px] text-gray-500 mt-0.5">(pcs / Lusin / Dus)</p>
                        </div>
                    </div>
                    <div id="card-multisatuan-details" class="hidden border border-gray-300 rounded-2xl p-4 bg-white shadow-xs">
                        <div class="flex justify-between items-center mb-3">
                            <span class="font-bold text-xs text-gray-900">Data Satuan</span>
                            <div class="space-x-3 text-base">
                                <button onclick="tryOpenMultisatuanView('add')" type="button" class="text-emerald-600 hover:text-emerald-800"><i class="fa-solid fa-pen"></i></button>
                                <button onclick="clearMultisatuanData()" type="button" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash-can"></i></button>
                            </div>
                        </div>
                        <div class="space-y-2 text-xs">
                            <div>
                                <div class="grid grid-cols-3 text-gray-500 text-[11px] pb-1">
                                    <span>Satuan Terkecil</span><span class="text-center">Jumlah</span><span class="text-right">Harga</span>
                                </div>
                                <div id="row-ms-smallest-summary" class="grid grid-cols-3 font-semibold text-gray-800 py-1"></div>
                            </div>
                            <div id="wrapper-ms-others-summary" class="pt-1">
                                <div class="grid grid-cols-3 text-gray-500 text-[11px] pb-1">
                                    <span>Tipe Satuan</span><span class="text-center">Jumlah</span><span class="text-right">Harga</span>
                                </div>
                                <div id="list-ms-others-summary" class="space-y-1.5"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Checkboxes: Tampilkan di Transaksi & Pakai Stok -->
                <div class="space-y-3 pt-1">
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" id="add-chk-transaksi" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                        <span class="text-xs font-semibold text-gray-800">Tampilkan di Transaksi</span>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" id="add-chk-pakai-stok" checked onchange="toggleAddStockInputState()" class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                        <span class="text-xs font-semibold text-gray-800">Pakai stok</span>
                    </label>
                </div>

                <!-- Stok* -->
                <div id="group-stock-input">
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Stok<span class="text-red-500">*</span></label>
                    <input type="number" id="add-stock" value="0" class="w-full border border-gray-300 p-3 px-4 rounded-full text-sm focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                </div>

                <!-- Kode* dengan Ikon 2 Panah Melingkar (Auto Urut) & Barcode Kamera -->
                <div id="group-sku-input">
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Kode<span class="text-red-500">*</span></label>
                    <div class="flex items-center space-x-2">
                        <input type="text" id="add-sku" class="flex-1 border border-gray-300 p-3 px-4 rounded-full text-sm focus:outline-none focus:border-emerald-600">
                        <button onclick="generateSequentialBarcode()" type="button" class="text-emerald-600 hover:text-emerald-800 text-2xl px-1.5 transition" title="Isi Barcode Urut Otomatis">
                            <i class="fa-solid fa-arrows-rotate"></i>
                        </button>
                        <button onclick="if(window.openScannerView) window.openScannerView('add-product')" type="button" class="text-emerald-700 hover:text-emerald-900 text-2xl px-1.5 transition" title="Scan Barcode Kamera">
                            <i class="fa-solid fa-barcode"></i>
                        </button>
                    </div>
                </div>

                <!-- Harga dasar* -->
                <div id="group-buyprice-input">
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Harga dasar<span class="text-red-500">*</span></label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-semibold text-gray-700">Rp</span>
                        <input type="number" id="add-buyprice" value="0" oninput="calculateMarginMarkup()" class="w-full border border-gray-300 pl-11 p-3 pr-4 rounded-full text-sm focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                    </div>
                </div>

                <!-- Harga jual* + Indikator Markup & Margin dengan Ikon (i) -->
                <div id="group-price-input">
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Harga jual<span class="text-red-500">*</span></label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-semibold text-gray-700">Rp</span>
                        <input type="number" id="add-price" value="0" oninput="calculateMarginMarkup()" class="w-full border border-gray-300 pl-11 p-3 pr-4 rounded-full text-sm focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                    </div>
                    <div id="group-profit-metrics" class="mt-2.5 space-y-1.5 text-xs text-gray-500 italic">
                        <div class="flex items-center space-x-2">
                            <span>Markup Penjualan <strong id="disp-markup-val" class="text-gray-700">0%</strong></span>
                            <button onclick="openMarkupInfoModal('add')" type="button" class="w-5 h-5 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center text-[11px] font-bold not-italic">i</button>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span>Margin Keuntungan <strong id="disp-margin-val" class="text-gray-700">0%</strong></span>
                            <button onclick="openMarginInfoModal('add')" type="button" class="w-5 h-5 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center text-[11px] font-bold not-italic">i</button>
                        </div>
                    </div>
                </div>

                <!-- Bagian Opsional Lanjutan (Bisa Disembunyikan/Ditampilkan dengan 'Tampilkan sedikit ^') -->
                <div id="add-product-advanced-fields" class="space-y-4 pt-1">
                    <!-- Kategori + Tombol '+' -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Kategori</label>
                        <div class="flex items-center space-x-2">
                            <div onclick="openSelectCategoryModal('add')" class="flex-1 border border-gray-300 p-3 px-4 rounded-full text-sm bg-white cursor-pointer flex justify-between items-center hover:border-emerald-500 transition">
                                <span id="disp-selected-category" class="text-gray-800 font-medium truncate"></span>
                                <i class="fa-solid fa-chevron-down text-xs text-gray-400"></i>
                            </div>
                            <input type="hidden" id="add-category" value="">
                            <button onclick="openCategoryManagementFromAddProduct()" type="button" class="w-11 h-11 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full flex items-center justify-center text-xl font-bold transition flex-shrink-0" title="Kelola Kategori Barang">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Batas Minimum Stok -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Batas Minimum Stok</label>
                        <input type="number" id="add-min-stock" value="0" class="w-full border border-gray-300 p-3 px-4 rounded-full text-sm focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                    </div>

                    <!-- Berat (gram) & Satuan (gram,pcs) -->
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 mb-1">Berat (gram)</label>
                            <input type="number" id="add-weight" class="w-full border border-gray-300 p-3 px-4 rounded-full text-sm focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 mb-1">Satuan (gram,pcs)</label>
                            <input type="text" id="add-unit" class="w-full border border-gray-300 p-3 px-4 rounded-full text-sm focus:outline-none focus:border-emerald-600">
                        </div>
                    </div>

                    <!-- Diskon + Toggle % / Rp -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Diskon</label>
                        <div class="flex items-center space-x-3">
                            <input type="number" id="add-discount-val" value="0" class="flex-1 border border-gray-300 p-3 px-4 rounded-full text-sm focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                            <div class="flex rounded-xl overflow-hidden border border-emerald-600 flex-shrink-0">
                                <button type="button" id="btn-disc-pct" onclick="setDiscountType('pct')" class="px-4 py-3 text-xs font-bold bg-emerald-700 text-white transition">%</button>
                                <button type="button" id="btn-disc-rp" onclick="setDiscountType('rp')" class="px-4 py-3 text-xs font-bold bg-emerald-500 text-white transition">Rp</button>
                            </div>
                        </div>
                        <p id="note-addon-discount-disabled" class="text-[11px] text-gray-500 mt-1 hidden">Diskon add on tidak tersedia</p>
                    </div>

                    <!-- Letak rak -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Letak rak</label>
                        <input type="text" id="add-rack" class="w-full border border-gray-300 p-3 px-4 rounded-full text-sm focus:outline-none focus:border-emerald-600">
                    </div>

                    <!-- Keterangan -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Keterangan</label>
                        <input type="text" id="add-notes" class="w-full border border-gray-300 p-3 px-4 rounded-full text-sm focus:outline-none focus:border-emerald-600">
                    </div>

                    <!-- DAFTAR TIPE HARGA TERPASANG (SS 1000920100) -->
                    <div id="wrapper-price-tiers-list" class="hidden space-y-3 pt-2">
                        <div class="text-center font-bold text-xs uppercase tracking-wider text-gray-500">DAFTAR TIPE HARGA</div>
                        <div id="container-saved-price-tiers" class="space-y-3"></div>
                    </div>

                    <!-- Tombol Tambah Tipe Harga -->
                    <div class="pt-1">
                        <button onclick="openTierPricingView(-1)" type="button" class="w-full border border-emerald-600 text-emerald-700 hover:bg-emerald-50 py-3 rounded-xl font-bold text-xs transition leading-relaxed">
                            Tambah Tipe Harga<br>
                            <span class="font-bold text-emerald-700">(Grosir / Retailer / Eceran / Gojek)</span>
                        </button>
                    </div>
                </div>

                <!-- Tombol Toggle Tampilkan Sedikit / Banyak -->
                <div class="text-center pt-2">
                    <button onclick="toggleAddProductAdvancedFields()" type="button" class="text-xs font-bold text-gray-600 hover:text-gray-900 inline-flex items-center space-x-1.5">
                        <span id="label-toggle-advanced">Tampilkan sedikit</span>
                        <i id="icon-toggle-advanced" class="fa-solid fa-chevron-up text-[10px]"></i>
                    </button>
                </div>
            </div>

            <!-- Tombol Simpan Sticky di Bawah -->
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="saveFullNewProduct()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition active:scale-95 text-sm flex items-center justify-center">
                    Simpan
                </button>
            </div>
        </div>

        <!-- === SUB-LAYAR PILIH BARANG PAKET (SS 1000919692) === -->
        <div id="view-paket-select" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <button onclick="closePackageSelectView()" class="text-emerald-700 text-2xl font-light p-1"><i class="fa-solid fa-xmark"></i></button>
                <h2 class="text-xs font-extrabold text-gray-900 tracking-wider uppercase">DAFTAR BARANG</h2>
                <button onclick="finishPackageSelection()" class="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-xs transition">
                    <i class="fa-solid fa-check"></i>
                </button>
            </div>
            <div class="p-3 bg-white border-b">
                <div class="relative flex items-center">
                    <span class="absolute left-3.5 text-gray-400"><i class="fa-solid fa-search text-xs"></i></span>
                    <input type="text" id="search-paket-input" oninput="renderPackageCatalog(this.value)" placeholder="Cari barang paket..." class="w-full pl-9 pr-9 py-2 border border-emerald-600 rounded-full text-xs focus:outline-none">
                    <button onclick="document.getElementById('search-paket-input').value=''; renderPackageCatalog('');" class="absolute right-3 text-gray-400 hover:text-gray-600"><i class="fa-solid fa-circle-xmark text-sm"></i></button>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-100" id="list-paket-catalog"></div>
        </div>

        <!-- === SUB-LAYAR VARIAN STEP 1: INPUT NAMA & OPSI VARIASI (SS 1000919695) === -->
        <div id="view-variant-step1" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="bg-white border-b flex items-center justify-between shadow-sm z-10 h-14">
                <button onclick="closeVariantStep1()" class="text-emerald-700 text-xl font-bold px-4 h-full flex items-center"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-xs font-extrabold text-gray-900 uppercase tracking-wider">TAMBAH / EDIT VARIASI</h2>
                <button onclick="proceedToVariantStep2()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 h-full flex items-center justify-center text-xl">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-6">
                <div id="container-variant-groups" class="space-y-6"></div>
                <button onclick="addNewVariantGroup()" type="button" class="flex items-center space-x-2 text-gray-600 hover:text-emerald-700 text-xs font-bold pt-2">
                    <i class="fa-solid fa-plus text-emerald-700 text-base"></i><span>Tambah Variasi</span>
                </button>
            </div>
        </div>

        <!-- === SUB-LAYAR VARIAN STEP 2: ISI BARCODE, STOK, HARGA DASAR & JUAL (SS 1000919696) === -->
        <div id="view-variant-step2" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="bg-white border-b flex items-center justify-between shadow-sm z-10 h-14">
                <button onclick="backToVariantStep1()" class="text-emerald-700 text-xl font-bold px-4 h-full flex items-center"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-xs font-extrabold text-gray-900 uppercase tracking-wider">TAMBAH / EDIT VARIASI</h2>
                <button onclick="finishVariantWizard()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 h-full flex items-center justify-center text-xl">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4" id="container-variant-price-cards"></div>
        </div>

        <!-- === SUB-LAYAR MULTISATUAN LENGKAP (SS 1000919897 & 1000919899) === -->
        <div id="view-multisatuan" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-4 shadow-sm z-10">
                <button onclick="closeMultisatuanView()" class="text-emerald-700 text-xl font-bold"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-gray-900">Multisatuan</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
                <!-- Kotak Abu-abu Informasi Format Satuan -->
                <div class="bg-gray-100 rounded-2xl p-4 text-xs text-gray-600 leading-relaxed space-y-2 shadow-xs">
                    <p>Tipe Satuan dibuat dengan format satuan terkecil hingga satuan terbesar. Usahakan untuk satuan pertama adalah satuan PCS, per Unit atau per Buah. Contoh: PCS = 1 Produk = Rp 1.000, sehingga untuk satuan berikutnya seperti lusin, 1 lusin = 12 PCS = Rp 12.000</p>
                    <p class="font-bold text-gray-800">Catatan: Harga satuan terkecil mengikuti harga jual pada data barang</p>
                </div>

                <!-- FASE A: INPUT SATUAN TERKECIL AWAL (SS 1000919897) -->
                <div id="section-ms-phase-input" class="space-y-4 pt-2">
                    <h4 class="font-bold text-xs text-gray-900">Masukkan nama Satuan terkecil</h4>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Nama Satuan<span class="text-red-500">*</span></label>
                        <input type="text" id="input-ms-smallest-name" oninput="toggleSmallestUnitButton(this.value)" placeholder="Cth: PCS, Lembar, Bungkus" class="w-full border border-emerald-600 p-3 px-4 rounded-full text-xs focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Barcode</label>
                        <div class="flex items-center space-x-2">
                            <input type="text" id="input-ms-smallest-barcode" class="flex-1 border border-emerald-600 p-3 px-4 rounded-full text-xs focus:outline-none">
                            <button onclick="if(window.openScannerView) window.openScannerView('multisatuan-smallest')" type="button" class="text-emerald-700 text-2xl px-2"><i class="fa-solid fa-barcode"></i></button>
                        </div>
                        <button onclick="useMasterBarcodeForSmallest()" type="button" class="text-emerald-600 text-xs font-bold mt-2 block hover:underline">Gunakan kode barang induk</button>
                    </div>

                    <div class="pt-4">
                        <button id="btn-submit-smallest-unit" disabled onclick="saveSmallestUnitPhase()" class="w-full bg-gray-200 text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-wider transition">
                            INPUT SATUAN TERKECIL
                        </button>
                    </div>
                </div>

                <!-- FASE B: KARTU SATUAN TERKECIL & TIPE SATUAN LAINNYA (SS 1000919899) -->
                <div id="section-ms-phase-list" class="hidden space-y-4">
                    <div class="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                        <div class="bg-emerald-100/80 text-emerald-900 text-xs font-bold px-4 py-1.5 inline-block rounded-br-xl">Satuan Terkecil</div>
                        <div class="p-4 pt-2 flex justify-between items-start">
                            <div>
                                <h4 class="font-bold text-sm text-gray-900" id="card-ms-smallest-name">pcs</h4>
                                <div class="grid grid-cols-2 gap-8 mt-2">
                                    <div>
                                        <p class="text-xs text-gray-400">Jumlah</p>
                                        <p class="text-sm font-bold text-gray-900">1</p>
                                    </div>
                                    <div>
                                        <p class="text-xs text-gray-400">Harga</p>
                                        <p class="text-sm font-bold text-gray-900" id="card-ms-smallest-price">Rp 0</p>
                                    </div>
                                </div>
                            </div>
                            <div class="text-right">
                                <span class="text-xs text-gray-500 block mb-2" id="card-ms-smallest-barcode">-</span>
                                <button onclick="openEditSmallestUnitModal()" type="button" class="text-emerald-600 hover:text-emerald-800 text-lg"><i class="fa-solid fa-pen"></i></button>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-3 pt-2">
                        <h4 class="font-bold text-xs text-gray-900">Tipe Satuan Lainnya</h4>
                        <div id="container-ms-other-cards" class="space-y-3"></div>
                        
                        <div class="flex justify-end pt-2">
                            <button onclick="openAddOtherUnitModal()" type="button" class="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-3 px-5 rounded-full shadow-md flex items-center space-x-2 transition">
                                <i class="fa-solid fa-plus"></i><span>Tambah Satuan</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="footer-ms-save-btn" class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10 hidden">
                <button onclick="finishMultisatuanView()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN
                </button>
            </div>
        </div>

        <!-- === SUB-LAYAR TAMBAH TIPE HARGA GROSIR/ECERAN (SS 1000920094 & 1000920099) === -->
        <div id="view-tier-pricing" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="closeTierPricingView()" class="text-gray-800 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-gray-900">Tambah Tipe Harga</h2>
                </div>
                <button onclick="saveTierPricingAndReturn()" class="w-10 h-10 bg-emerald-100 hover:bg-emerald-200 border border-emerald-500 text-emerald-700 rounded-xl flex items-center justify-center text-lg font-bold transition">
                    <i class="fa-solid fa-check"></i>
                </button>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-5">
                <div class="space-y-1.5">
                    <label class="block text-xs font-semibold text-gray-600">Nama Tipe Harga</label>
                    <div class="flex items-center space-x-2">
                        <input type="text" id="input-tier-name" class="flex-1 border border-emerald-600 p-3 px-4 rounded-full text-sm focus:outline-none">
                        <button onclick="openSelectCustomerTypeModal()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-4 rounded-full flex items-center space-x-2 transition flex-shrink-0">
                            <i class="fa-solid fa-pen text-[11px]"></i><span>Tipe Pelanggan</span>
                        </button>
                    </div>
                    <p class="text-[11px] text-gray-500">Cth : Grosir, eceran</p>
                    <div id="badge-tier-customer-status" class="hidden items-center space-x-2 text-xs text-gray-600 font-medium pt-1">
                        <i class="fa-solid fa-circle-check text-emerald-600 text-base"></i>
                        <span>Terhubung ke tipe pelanggan</span>
                    </div>
                </div>

                <div class="pt-4 border-t-8 border-gray-100 -mx-4 px-4 space-y-4">
                    <div class="flex justify-between items-center pt-2">
                        <h4 class="font-bold text-xs text-gray-900">Daftar Tipe Harga</h4>
                        <button onclick="openAddPriceStepModal()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-full flex items-center space-x-2 transition">
                            <i class="fa-solid fa-circle-plus text-sm"></i><span>Tipe Harga</span>
                        </button>
                    </div>

                    <div id="empty-state-tier-pricing" class="py-24 text-center text-xs font-semibold text-gray-500">
                        Belum Ada Tipe Harga
                    </div>

                    <div id="container-tier-pricing-rows" class="space-y-3 hidden"></div>
                </div>
            </div>
        </div>
    `;

    // 2. SUNTIKKAN HTML MODALS KE DALAM #modals-container
    const modalsHTML = `
        <!-- === LIVE CAMERA VIEWFINDER UNTUK FOTO PRODUK (<80KB) === -->
        <div id="view-live-camera" class="fixed inset-0 bg-black z-[95] hidden flex flex-col">
            <div class="px-4 py-3 bg-black/80 text-white flex items-center justify-between z-20">
                <button onclick="closeLivePhotoCamera()" class="text-xl font-bold p-1"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-sm font-bold tracking-wide">Ambil Foto Produk (Otomatis &lt; 80KB)</h2>
                <div></div>
            </div>
            <div class="flex-1 relative overflow-hidden flex items-center justify-center">
                <video id="live-camera-feed" autoplay playsinline muted class="w-full h-full object-cover"></video>
                <div class="w-64 h-64 border-2 border-dashed border-white/70 rounded-2xl pointer-events-none z-10"></div>
            </div>
            <div class="p-6 bg-black text-center flex items-center justify-center z-20">
                <button onclick="captureLivePhoto()" class="w-16 h-16 bg-white rounded-full border-4 border-emerald-600 shadow-xl flex items-center justify-center text-emerald-700 text-2xl active:scale-90 transition">
                    <i class="fa-solid fa-camera"></i>
                </button>
            </div>
        </div>

        <!-- === MODAL PLUGIN BAHAN BAKU (SS 1000919690) === -->
        <div id="modal-bahan-baku-info" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center">
                <h3 class="font-extrabold text-sm uppercase tracking-wider text-gray-900 mb-4 border-b pb-3">AKTIFKAN PLUGIN BAHAN BAKU</h3>
                <div class="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-6 mb-4 text-white shadow-inner">
                    <i class="fa-solid fa-boxes-packing text-5xl mb-2"></i>
                    <p class="text-xs font-bold">Manajemen Resep & Bahan Baku</p>
                </div>
                <h4 class="font-bold text-sm text-gray-900 mb-1">Tambah Barang Bahan Baku</h4>
                <p class="text-xs text-gray-600 leading-relaxed mb-6">Tandai barang ini sebagai bahan baku untuk digunakan dalam komposisi produk jadi.</p>
                <button onclick="activateBahanBakuMode()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-bold text-xs uppercase mb-3 transition">
                    GUNAKAN TIPE BAHAN BAKU
                </button>
                <button onclick="cancelBahanBakuMode()" class="w-full text-emerald-700 font-bold text-xs uppercase py-2">
                    TUTUP
                </button>
            </div>
        </div>

        <!-- === POPUP COUNTER KUANTITAS PAKET (SS 1000919692) === -->
        <div id="modal-paket-qty" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-lg w-full max-w-xs overflow-hidden shadow-2xl">
                <div class="p-4 flex items-center justify-between border-b">
                    <div class="flex items-center space-x-3 min-w-0 pr-2">
                        <div class="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0"></div>
                        <div class="min-w-0">
                            <h4 class="font-bold text-xs text-gray-900 truncate" id="popup-paket-name">-</h4>
                            <p class="text-[11px] text-gray-500" id="popup-paket-sku">-</p>
                        </div>
                    </div>
                    <span class="text-xs font-medium text-gray-700 flex-shrink-0" id="popup-paket-price">Rp 0</span>
                </div>

                <div class="flex items-center justify-between px-10 py-6">
                    <button onclick="updateTempPackageQty(-1)" type="button" class="text-2xl font-bold text-gray-800 w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full">
                        <i class="fa-solid fa-minus text-base"></i>
                    </button>
                    <input type="number" id="popup-paket-qty-input" value="1" min="1" class="w-16 text-center text-lg font-bold text-gray-900 focus:outline-none">
                    <button onclick="updateTempPackageQty(1)" type="button" class="text-2xl font-bold text-gray-800 w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full">
                        <i class="fa-solid fa-plus text-base"></i>
                    </button>
                </div>

                <div class="grid grid-cols-2 border-t divide-x">
                    <button onclick="closePackageQtyModal()" type="button" class="text-emerald-700 font-bold text-xs uppercase py-3.5 hover:bg-gray-50 transition">BATAL</button>
                    <button onclick="confirmPackageQty()" type="button" class="text-emerald-700 font-bold text-xs uppercase py-3.5 hover:bg-gray-50 transition">OK</button>
                </div>
            </div>
        </div>

        <!-- === POPUP TAMBAHKAN / EDIT TIPE SATUAN LAINNYA (SS 1000919898 & 1000919901) === -->
        <div id="modal-ms-other-unit" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-sm uppercase tracking-wider text-gray-900 text-center mb-4 border-b pb-3" id="modal-ms-other-title">TAMBAHKAN TIPE SATUAN</h3>
                <div class="space-y-3.5 text-xs">
                    <div>
                        <label class="block font-semibold text-gray-600 mb-1">Nama Satuan<span class="text-red-500">*</span></label>
                        <input type="text" id="modal-ms-name" oninput="updateOtherUnitSuffix(this.value)" placeholder="Nama Satuan" class="w-full border border-emerald-600 p-3 px-4 rounded-full focus:outline-none">
                    </div>
                    <div>
                        <label class="block font-semibold text-gray-600 mb-1">Barcode (Opsional)</label>
                        <div class="flex items-center space-x-2">
                            <input type="text" id="modal-ms-barcode" placeholder="Barcode" class="flex-1 border border-emerald-600 p-3 px-4 rounded-full focus:outline-none">
                            <button onclick="if(window.openScannerView) window.openScannerView('multisatuan-other')" type="button" class="text-emerald-700 text-2xl px-1"><i class="fa-solid fa-barcode"></i></button>
                        </div>
                    </div>
                    <div>
                        <label class="block font-semibold text-gray-600 mb-1">Jumlah<span class="text-red-500">*</span></label>
                        <div class="flex items-center space-x-3">
                            <input type="number" id="modal-ms-qty" value="0" class="w-2/3 border border-emerald-600 p-3 px-4 rounded-full focus:outline-none" pattern="[0-9]*" inputmode="numeric">
                            <span class="text-gray-600 font-semibold" id="modal-ms-qty-unit-label">pcs</span>
                        </div>
                    </div>
                    <div>
                        <label class="block font-semibold text-gray-600 mb-1">Harga<span class="text-red-500">*</span></label>
                        <div class="flex items-center space-x-3">
                            <div class="relative w-2/3">
                                <span class="absolute inset-y-0 left-0 flex items-center pl-4 font-semibold text-gray-700">Rp</span>
                                <input type="number" id="modal-ms-price" value="0" class="w-full border border-emerald-600 p-3 pl-10 pr-4 rounded-full focus:outline-none" pattern="[0-9]*" inputmode="numeric">
                            </div>
                            <span class="text-gray-600 font-semibold" id="modal-ms-price-suffix">/</span>
                        </div>
                    </div>
                    <div class="bg-gray-100 rounded-xl p-3 flex items-center space-x-2.5 text-[11px] text-gray-600 border border-gray-200">
                        <i class="fa-solid fa-circle-info text-gray-800 text-sm"></i>
                        <span>Nama Satuan, Barcode dan Jumlah harus unik</span>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 mt-6">
                    <button onclick="closeOtherUnitModal()" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3.5 rounded-full font-bold text-xs uppercase">BATAL</button>
                    <button onclick="saveOtherUnitModal()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-bold text-xs uppercase">SIMPAN</button>
                </div>
            </div>
        </div>

        <!-- === POPUP EDIT SATUAN TERKECIL (SS 1000919900) === -->
        <div id="modal-ms-edit-smallest" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-sm uppercase tracking-wider text-gray-900 text-center mb-4 border-b pb-3">EDIT SATUAN TERKECIL</h3>
                <div class="space-y-3.5 text-xs">
                    <div>
                        <label class="block font-semibold text-gray-600 mb-1">Nama Satuan Terkecil<span class="text-red-500">*</span></label>
                        <input type="text" id="modal-edit-smallest-name" class="w-full border border-gray-300 bg-gray-100 p-3 px-4 rounded-full text-gray-600 focus:outline-none">
                    </div>
                    <div>
                        <label class="block font-semibold text-gray-600 mb-1">Barcode</label>
                        <div class="flex items-center space-x-2">
                            <input type="text" id="modal-edit-smallest-barcode" class="flex-1 border border-emerald-600 p-3 px-4 rounded-full focus:outline-none">
                            <button onclick="if(window.openScannerView) window.openScannerView('multisatuan-smallest')" type="button" class="text-emerald-700 text-2xl px-1"><i class="fa-solid fa-barcode"></i></button>
                        </div>
                        <button onclick="document.getElementById('modal-edit-smallest-barcode').value = document.getElementById('add-sku').value.trim();" type="button" class="text-emerald-600 font-bold mt-1.5 block">Gunakan kode barang induk</button>
                    </div>
                    <div>
                        <label class="block font-semibold text-gray-600 mb-1">Harga<span class="text-red-500">*</span></label>
                        <input type="text" id="modal-edit-smallest-price" readonly class="w-full border border-gray-200 bg-gray-100 p-3 px-4 rounded-full text-gray-500 focus:outline-none">
                    </div>
                    <div class="bg-gray-100 rounded-xl p-3 flex items-center space-x-2.5 text-[11px] text-gray-600 border border-gray-200">
                        <i class="fa-solid fa-circle-info text-gray-800 text-sm"></i>
                        <span>Jumlah dan Harga dapat diubah di halaman edit barang utama</span>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 mt-6">
                    <button onclick="closeEditSmallestUnitModal()" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3.5 rounded-full font-bold text-xs uppercase">BATAL</button>
                    <button onclick="saveEditSmallestUnitModal()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-bold text-xs uppercase">SIMPAN</button>
                </div>
            </div>
        </div>

        <!-- === POPUP PERHITUNGAN MARKUP (SS 1000919943) === -->
        <div id="modal-markup-info" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center">
                <h3 class="font-extrabold text-sm uppercase tracking-wider text-gray-900 mb-4 border-b pb-3">PERHITUNGAN MARKUP</h3>
                <div class="w-14 h-14 rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-500 text-2xl font-bold mx-auto mb-3">!</div>
                <h4 class="font-semibold text-xs text-gray-800 mb-3">Keuntungan dihitung dari Modal</h4>
                <div class="bg-gray-100 rounded-2xl p-3.5 text-xs text-gray-700 leading-relaxed mb-6">
                    <p class="text-gray-500 mb-0.5">Rumus Perhitungan:</p>
                    <p class="font-semibold">(Harga Jual - Harga Beli) / Harga Beli</p>
                    <p id="formula-markup-text" class="font-bold text-gray-900 mt-0.5">(0 - 0) / 0 = <span class="text-emerald-600">0%</span></p>
                </div>
                <button onclick="closeMarkupInfoModal()" type="button" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-bold text-xs uppercase">OK, MENGERTI</button>
            </div>
        </div>

        <!-- === POPUP PERHITUNGAN MARGIN (SS 1000919944) === -->
        <div id="modal-margin-info" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center">
                <h3 class="font-extrabold text-sm uppercase tracking-wider text-gray-900 mb-4 border-b pb-3">PERHITUNGAN MARGIN</h3>
                <div class="w-14 h-14 rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-500 text-2xl font-bold mx-auto mb-3">!</div>
                <h4 class="font-semibold text-xs text-gray-800 mb-3">Keuntungan dihitung dari Harga Jual</h4>
                <div class="bg-gray-100 rounded-2xl p-3.5 text-xs text-gray-700 leading-relaxed mb-6">
                    <p class="text-gray-500 mb-0.5">Rumus Perhitungan:</p>
                    <p class="font-semibold">(Harga Jual - Harga Beli) / Harga Jual</p>
                    <p id="formula-margin-text" class="font-bold text-gray-900 mt-0.5">(0 - 0) / 0 = <span class="text-emerald-600">0%</span></p>
                </div>
                <button onclick="closeMarginInfoModal()" type="button" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-bold text-xs uppercase">OK, MENGERTI</button>
            </div>
        </div>

        <!-- === POPUP PILIH KATEGORI (SS 1000920066) === -->
        <div id="modal-select-category" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                <div class="p-4 pb-2 flex justify-between items-center">
                    <h3 class="font-bold text-sm text-gray-900">Pilih Kategori</h3>
                    <button onclick="closeSelectCategoryModal()" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-xmark text-lg"></i></button>
                </div>
                <div class="p-3 border-b">
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-700"><i class="fa-solid fa-search text-base"></i></span>
                        <input type="text" id="search-select-category-input" oninput="renderSelectCategoryOptions(this.value)" class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-xs focus:outline-none focus:border-emerald-600">
                    </div>
                </div>
                <div class="flex-1 overflow-y-auto divide-y divide-gray-200" id="list-select-category-items"></div>
            </div>
        </div>

        <!-- === POPUP PILIH TIPE PELANGGAN (SS 1000920095) === -->
        <div id="modal-select-customer-type" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-sm uppercase tracking-wider text-gray-900 text-center mb-4 border-b pb-3">PILIH TIPE PELANGGAN</h3>
                
                <div class="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center space-x-3 mb-4">
                    <div class="w-7 h-7 rounded-full border-2 border-emerald-600 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">i</div>
                    <p class="text-[11px] text-gray-800 leading-relaxed font-medium">Dengan memilih Tipe Pelanggan, maka Tipe Harga yang Anda atur hanya bisa digunakan oleh pelanggan dari tipe yang dipilih</p>
                </div>

                <div class="relative mb-4">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" id="search-customer-tier-input" oninput="renderCustomerTypeOptions(this.value)" placeholder="Cari tipe pelanggan" class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-xs focus:outline-none focus:border-emerald-600">
                </div>

                <div class="text-xs font-bold text-gray-900 py-2 border-b">Pilih Tipe Pelanggan</div>
                <div id="list-customer-type-options" class="divide-y divide-gray-100 max-h-48 overflow-y-auto"></div>

                <button onclick="closeSelectCustomerTypeModal()" type="button" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-bold text-xs uppercase mt-5">BATAL</button>
            </div>
        </div>

        <!-- === POPUP INPUT BARIS HARGA GROSIR BERTINGKAT (MIN QTY & HARGA) === -->
        <div id="modal-add-price-step" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-xs uppercase tracking-wider text-gray-900 text-center mb-4 border-b pb-3" id="modal-step-title">TAMBAH TIPE HARGA</h3>
                <div class="space-y-3.5 text-xs">
                    <div>
                        <label class="block font-semibold text-gray-600 mb-1">Jumlah Minimal Pembelian</label>
                        <input type="number" id="input-step-min-qty" value="1" min="1" class="w-full border border-emerald-600 p-3 px-4 rounded-full focus:outline-none" pattern="[0-9]*" inputmode="numeric">
                    </div>
                    <div>
                        <label class="block font-semibold text-gray-600 mb-1">Harga Jual Satuan (Rp)</label>
                        <input type="number" id="input-step-price" value="0" class="w-full border border-emerald-600 p-3 px-4 rounded-full focus:outline-none" pattern="[0-9]*" inputmode="numeric">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 mt-6">
                    <button onclick="closeAddPriceStepModal()" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-full font-bold text-xs uppercase">BATAL</button>
                    <button onclick="savePriceStepModal()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full font-bold text-xs uppercase">SIMPAN</button>
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
    // 3. STATE & LOGIKA JAVASCRIPT FORM TAMBAH BARANG LENGKAP
    // ========================================================================
    let photoTargetForm = 'add'; // 'add' atau 'edit'
    let categoryTargetForm = 'add'; // 'add' atau 'edit'
    let multisatuanTargetForm = 'add'; // 'add' atau 'edit'
    let livePhotoStream = null;
    let discountMode = 'pct'; // 'pct' atau 'rp'
    let advancedFieldsVisible = true;

    // State Paket
    window.currentPackageItems = [];
    let tempPackageItemSelection = null;

    // State Varian (Mendukung Multi-Grup: Varian-1, Varian-2, dst.)
    window.currentVariantGroups = [{ name: 'Varian-1', options: [] }];
    window.currentVariantConfig = [];

    // State Multisatuan
    window.multisatuanSmallest = null; // { name, barcode, price }
    window.multisatuanOthers = [];     // [{ name, barcode, qty, price }]
    let editingOtherUnitIndex = -1;

    // State Daftar Tipe Harga (Grosir / Eceran / Member)
    window.savedPriceTiers = []; // [{ name, customerType, steps: [{ minQty, price }] }]
    let editingTierIndex = -1;
    let tempTierSteps = [];
    let selectedCustomerType = '';
    let editingPriceStepIndex = -1;

    // --- BUKA & TUTUP FORM TAMBAH BARANG ---
    window.openAddProductView = () => {
        document.querySelectorAll('.view-panel').forEach(p => p.classList.add('hidden'));
        document.getElementById('view-add-product').classList.remove('hidden');

        // Reset seluruh field
        document.getElementById('add-name').value = '';
        document.getElementById('add-type').value = 'Default';
        document.getElementById('add-chk-transaksi').checked = true;
        document.getElementById('add-chk-pakai-stok').checked = true;
        document.getElementById('add-stock').value = '0';
        document.getElementById('add-stock').disabled = false;
        document.getElementById('add-sku').value = '';
        document.getElementById('add-buyprice').value = '0';
        document.getElementById('add-price').value = '0';
        document.getElementById('add-category').value = '';
        document.getElementById('disp-selected-category').innerText = '';
        document.getElementById('add-min-stock').value = '0';
        document.getElementById('add-weight').value = '';
        document.getElementById('add-unit').value = '';
        document.getElementById('add-discount-val').value = '0';
        document.getElementById('add-rack').value = '';
        document.getElementById('add-notes').value = '';
        window.clearAddProductPhoto();

        window.currentPackageItems = [];
        window.currentVariantGroups = [{ name: 'Varian-1', options: [] }];
        window.currentVariantConfig = [];
        window.multisatuanSmallest = null;
        window.multisatuanOthers = [];
        window.savedPriceTiers = [];

        window.renderPackageDetailsCard();
        window.renderVariantDetailsCard();
        window.renderMultisatuanDetailsCard();
        window.renderSavedPriceTiersCards();
        window.handleProductTypeChange('Default');
        window.setDiscountType('pct');
        window.calculateMarginMarkup();
        if (window.applyRolePermissions) window.applyRolePermissions();
    };

    window.closeAddProductView = () => {
        document.getElementById('view-add-product').classList.add('hidden');
        document.getElementById('view-products').classList.remove('hidden');
    };

    window.toggleAddStockInputState = () => {
        const useStk = document.getElementById('add-chk-pakai-stok').checked;
        const stkInput = document.getElementById('add-stock');
        stkInput.disabled = !useStk;
        stkInput.className = useStk
            ? "w-full border border-gray-300 p-3 px-4 rounded-full text-sm focus:outline-none focus:border-emerald-600 bg-white"
            : "w-full border border-gray-200 p-3 px-4 rounded-full text-sm bg-gray-100 text-gray-400";
    };

    window.toggleAddProductAdvancedFields = () => {
        advancedFieldsVisible = !advancedFieldsVisible;
        const adv = document.getElementById('add-product-advanced-fields');
        const lbl = document.getElementById('label-toggle-advanced');
        const icn = document.getElementById('icon-toggle-advanced');
        if (advancedFieldsVisible) {
            adv.classList.remove('hidden');
            lbl.innerText = "Tampilkan sedikit";
            icn.className = "fa-solid fa-chevron-up text-[10px]";
        } else {
            adv.classList.add('hidden');
            lbl.innerText = "Tampilkan lebih banyak";
            icn.className = "fa-solid fa-chevron-down text-[10px]";
        }
    };

    // --- KAMERA LANGSUNG (<80KB) & GALERI (MAKS 100KB) ---
    window.openLivePhotoCamera = async (target = 'add') => {
        photoTargetForm = target;
        document.getElementById('view-live-camera').classList.remove('hidden');
        const video = document.getElementById('live-camera-feed');
        try {
            livePhotoStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: "environment" }, width: { ideal: 1024 }, height: { ideal: 1024 } }
            });
            video.srcObject = livePhotoStream;
        } catch (err) {
            alert("Tidak dapat mengakses kamera perangkat secara langsung. Pastikan izin kamera telah diberikan.");
            window.closeLivePhotoCamera();
        }
    };

    window.closeLivePhotoCamera = () => {
        if (livePhotoStream) {
            livePhotoStream.getTracks().forEach(t => t.stop());
            livePhotoStream = null;
        }
        document.getElementById('view-live-camera').classList.add('hidden');
    };

    window.captureLivePhoto = () => {
        const video = document.getElementById('live-camera-feed');
        const canvas = document.createElement('canvas');
        const maxSide = 600;
        let w = video.videoWidth || 600;
        let h = video.videoHeight || 600;

        if (w > maxSide || h > maxSide) {
            if (w > h) { h = Math.round((h * maxSide) / w); w = maxSide; }
            else { w = Math.round((w * maxSide) / h); h = maxSide; }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, w, h);

        // Kompresi otomatis bertahap hingga dijamin di bawah 80 KB (81.920 bytes)
        let quality = 0.75;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        let byteSize = Math.round((dataUrl.length - 'data:image/jpeg;base64,'.length) * 0.75);

        while (byteSize > 78 * 1024 && quality > 0.15) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
            byteSize = Math.round((dataUrl.length - 'data:image/jpeg;base64,'.length) * 0.75);
        }

        applyCapturedOrPickedImage(dataUrl, byteSize);
        window.closeLivePhotoCamera();
    };

    window.triggerGalleryPick = (target = 'add') => {
        photoTargetForm = target;
        const input = document.getElementById('input-prod-gallery');
        input.value = '';
        input.click();
    };

    window.handleGalleryPick = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validasi Ketat: Jika melebihi 100 KB (102.400 bytes), tampilkan peringatan
        if (file.size > 100 * 1024) {
            alert(`Ukuran gambar (${(file.size / 1024).toFixed(1)} KB) melebihi batas!\nUkuran gambar harus maksimal 100 KB.`);
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            applyCapturedOrPickedImage(e.target.result, file.size);
        };
        reader.readAsDataURL(file);
    };

    function applyCapturedOrPickedImage(dataUrl, byteSize) {
        const sizeKB = (byteSize / 1024).toFixed(1);
        if (photoTargetForm === 'edit') {
            const editPreview = document.getElementById('edit-full-img-preview');
            const editPlaceholder = document.getElementById('edit-full-img-placeholder');
            const editBase64 = document.getElementById('edit-full-image-base64');
            if (editBase64) editBase64.value = dataUrl;
            if (editPreview) { editPreview.src = dataUrl; editPreview.classList.remove('hidden'); }
            if (editPlaceholder) editPlaceholder.classList.add('hidden');
        } else {
            document.getElementById('add-prod-image-base64').value = dataUrl;
            const preview = document.getElementById('add-prod-img-preview');
            preview.src = dataUrl;
            preview.classList.remove('hidden');
            document.getElementById('add-prod-img-placeholder').classList.add('hidden');
            document.getElementById('btn-clear-add-photo').classList.remove('hidden');
            const info = document.getElementById('add-prod-img-size-info');
            info.innerText = `Ukuran foto: ${sizeKB} KB`;
            info.classList.remove('hidden');
        }
    }

    window.clearAddProductPhoto = () => {
        document.getElementById('add-prod-image-base64').value = '';
        const preview = document.getElementById('add-prod-img-preview');
        preview.src = '';
        preview.classList.add('hidden');
        document.getElementById('add-prod-img-placeholder').classList.remove('hidden');
        document.getElementById('btn-clear-add-photo').classList.add('hidden');
        document.getElementById('add-prod-img-size-info').classList.add('hidden');
    };

    // --- GENERATOR KODE BARCODE URUT OTOMATIS (IKON 2 PANAH MELINGKAR) ---
    window.generateSequentialBarcode = () => {
        let maxNum = 0;
        (window.products || []).forEach(p => {
            const code = (p.sku || '').trim();
            if (/^\d+$/.test(code)) {
                const n = parseInt(code, 10);
                if (n > maxNum) maxNum = n;
            }
        });
        const nextCode = (maxNum + 1).toString().padStart(9, '0');
        document.getElementById('add-sku').value = nextCode;
    };

    // --- KALKULATOR & POPUP MARKUP / MARGIN ---
    window.calculateMarginMarkup = () => {
        const buy = Number(document.getElementById('add-buyprice').value) || 0;
        const sell = Number(document.getElementById('add-price').value) || 0;

        let markup = 0, margin = 0;
        if (buy > 0) markup = ((sell - buy) / buy) * 100;
        if (sell > 0) margin = ((sell - buy) / sell) * 100;

        document.getElementById('disp-markup-val').innerText = `${Number(markup.toFixed(2))}%`;
        document.getElementById('disp-margin-val').innerText = `${Number(margin.toFixed(2))}%`;
    };

    window.openMarkupInfoModal = (source = 'add') => {
        const buy = source === 'edit'
            ? (Number(document.getElementById('edit-full-buyprice')?.value) || 0)
            : (Number(document.getElementById('add-buyprice').value) || 0);
        const sell = source === 'edit'
            ? (Number(document.getElementById('edit-full-price')?.value) || 0)
            : (Number(document.getElementById('add-price').value) || 0);
        const markup = buy > 0 ? Number((((sell - buy) / buy) * 100).toFixed(2)) : 0;

        document.getElementById('formula-markup-text').innerHTML = `
            (${sell.toLocaleString('en-US')} - ${buy.toLocaleString('en-US')}) / ${buy.toLocaleString('en-US')} = <span class="text-emerald-600 font-bold">${markup}%</span>
        `;
        document.getElementById('modal-markup-info').classList.remove('hidden');
    };
    window.closeMarkupInfoModal = () => document.getElementById('modal-markup-info').classList.add('hidden');

    window.openMarginInfoModal = (source = 'add') => {
        const buy = source === 'edit'
            ? (Number(document.getElementById('edit-full-buyprice')?.value) || 0)
            : (Number(document.getElementById('add-buyprice').value) || 0);
        const sell = source === 'edit'
            ? (Number(document.getElementById('edit-full-price')?.value) || 0)
            : (Number(document.getElementById('add-price').value) || 0);
        const margin = sell > 0 ? Number((((sell - buy) / sell) * 100).toFixed(2)) : 0;

        document.getElementById('formula-margin-text').innerHTML = `
            (${sell.toLocaleString('en-US')} - ${buy.toLocaleString('en-US')}) / ${sell.toLocaleString('en-US')} = <span class="text-emerald-600 font-bold">${margin}%</span>
        `;
        document.getElementById('modal-margin-info').classList.remove('hidden');
    };
    window.closeMarginInfoModal = () => document.getElementById('modal-margin-info').classList.add('hidden');

    // --- DISKON TOGGLE (% / Rp) ---
    window.setDiscountType = (type) => {
        discountMode = type;
        const btnPct = document.getElementById('btn-disc-pct');
        const btnRp = document.getElementById('btn-disc-rp');
        if (type === 'pct') {
            btnPct.className = "px-4 py-3 text-xs font-bold bg-emerald-800 text-white transition";
            btnRp.className = "px-4 py-3 text-xs font-bold bg-emerald-500 text-white transition";
        } else {
            btnRp.className = "px-4 py-3 text-xs font-bold bg-emerald-800 text-white transition";
            btnPct.className = "px-4 py-3 text-xs font-bold bg-emerald-500 text-white transition";
        }
    };

    // --- PILIH KATEGORI POPUP (SS 1000920066) ---
    window.openSelectCategoryModal = (target = 'add') => {
        categoryTargetForm = target;
        document.getElementById('search-select-category-input').value = '';
        document.getElementById('modal-select-category').classList.remove('hidden');
        window.renderSelectCategoryOptions('');
    };
    window.closeSelectCategoryModal = () => document.getElementById('modal-select-category').classList.add('hidden');

    window.renderSelectCategoryOptions = (filterKeyword = '') => {
        const container = document.getElementById('list-select-category-items');
        container.innerHTML = '';
        const cats = window.masterCategories || ["Umum"];
        const filtered = cats.filter(c => c.toLowerCase().includes(filterKeyword.toLowerCase()));

        if (filtered.length === 0) {
            container.innerHTML = `<div class="p-6 text-center text-gray-400 text-xs">Kategori tidak ditemukan.</div>`;
            return;
        }
        filtered.forEach(cat => {
            container.innerHTML += `
                <div onclick="selectCategoryForAddProduct('${cat}')" class="p-4 hover:bg-emerald-50 active:bg-emerald-100 cursor-pointer font-semibold text-xs text-gray-900 transition">
                    ${cat}
                </div>
            `;
        });
    };

    window.selectCategoryForAddProduct = (cat) => {
        if (categoryTargetForm === 'edit') {
            const editCatInput = document.getElementById('edit-full-category');
            const editCatDisp = document.getElementById('disp-edit-selected-category');
            if (editCatInput) editCatInput.value = cat;
            if (editCatDisp) editCatDisp.innerText = cat;
        } else {
            document.getElementById('add-category').value = cat;
            document.getElementById('disp-selected-category').innerText = cat;
        }
        window.closeSelectCategoryModal();
    };

    window.openCategoryManagementFromAddProduct = () => {
        window.returnToAddProductFromCategory = true;
        window.switchView('kategori');
    };

    // --- DROPDOWN TIPE BARANG DINAMIS ---
    window.handleProductTypeChange = (val) => {
        const cPaket = document.getElementById('container-type-paket');
        const cVarian = document.getElementById('container-type-varian');
        const cMulti = document.getElementById('container-type-multisatuan');
        const noteAddon = document.getElementById('note-addon-info');
        const noteAddonDisc = document.getElementById('note-addon-discount-disabled');
        const discInput = document.getElementById('add-discount-val');
        const stockInput = document.getElementById('add-stock');

        cPaket.classList.add('hidden');
        cVarian.classList.add('hidden');
        cMulti.classList.add('hidden');
        noteAddon.classList.add('hidden');
        noteAddonDisc.classList.add('hidden');
        discInput.disabled = false;
        stockInput.readOnly = false;

        if (val === 'Bahan Baku') {
            document.getElementById('modal-bahan-baku-info').classList.remove('hidden');
        } else if (val === 'Paket') {
            cPaket.classList.remove('hidden');
            window.renderPackageDetailsCard();
        } else if (val === 'Varian') {
            cVarian.classList.remove('hidden');
            stockInput.readOnly = true;
            window.renderVariantDetailsCard();
        } else if (val === 'Multisatuan') {
            cMulti.classList.remove('hidden');
            window.renderMultisatuanDetailsCard();
        } else if (val === 'Add On') {
            noteAddon.classList.remove('hidden');
            noteAddonDisc.classList.remove('hidden');
            discInput.value = '0';
            discInput.disabled = true;
        }
    };

    window.activateBahanBakuMode = () => {
        document.getElementById('modal-bahan-baku-info').classList.add('hidden');
    };
    window.cancelBahanBakuMode = () => {
        document.getElementById('modal-bahan-baku-info').classList.add('hidden');
        document.getElementById('add-type').value = 'Default';
    };

    // ========================================================================
    // 4. LOGIKA TIPE BARANG: PAKET (SS 1000919691 - 1000919693)
    // ========================================================================
    window.openPackageSelectView = () => {
        document.querySelectorAll('.view-panel').forEach(p => p.classList.add('hidden'));
        document.getElementById('view-paket-select').classList.remove('hidden');
        document.getElementById('search-paket-input').value = '';
        window.renderPackageCatalog('');
    };

    window.closePackageSelectView = () => {
        document.getElementById('view-paket-select').classList.add('hidden');
        document.getElementById('view-add-product').classList.remove('hidden');
    };

    window.renderPackageCatalog = (keyword = '') => {
        const container = document.getElementById('list-paket-catalog');
        container.innerHTML = '';
        const k = keyword.toLowerCase();
        const filtered = (window.products || []).filter(p =>
            (p.name || '').toLowerCase().includes(k) || (p.sku || '').toLowerCase().includes(k)
        );

        if (filtered.length === 0) {
            container.innerHTML = `<div class="p-8 text-center text-gray-400 text-xs">Barang tidak ditemukan.</div>`;
            return;
        }

        filtered.forEach(p => {
            const initials = p.name ? p.name.trim().substring(0, 2).toUpperCase() : 'RL';
            const existing = window.currentPackageItems.find(x => x.id === p.id);
            const badgeQty = existing
                ? `<span class="border border-gray-600 text-gray-800 text-xs px-2.5 py-0.5 rounded font-bold">${existing.qty}</span>`
                : '';

            container.innerHTML += `
                <div onclick="selectPackageItemCandidate('${p.id}')" class="p-3.5 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="flex items-center space-x-3.5 flex-1 min-w-0 pr-3">
                        <div class="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm flex-shrink-0">
                            ${initials}
                        </div>
                        <div class="min-w-0 flex-1">
                            <h4 class="font-bold text-xs text-gray-900 truncate">${p.name}</h4>
                            <p class="text-[11px] text-gray-600 mt-0.5">Rp ${Number(p.price || 0).toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                    <div>${badgeQty}</div>
                </div>
            `;
        });
    };

    window.selectPackageItemCandidate = (productId) => {
        const p = (window.products || []).find(x => x.id === productId);
        if (!p) return;

        // Syarat Wajib: Hanya produk Default dan Add On yang bisa digunakan untuk tipe Paket
        const prodType = p.type || 'Default';
        if (prodType !== 'Default' && prodType !== 'Add On') {
            alert("Produk ini tidak bisa digunakan untuk tipe paket!\nHanya produk bertipe Default atau Add On yang dapat dipaketkan.");
            return;
        }

        tempPackageItemSelection = { ...p };
        document.getElementById('popup-paket-name').innerText = p.name;
        document.getElementById('popup-paket-sku').innerText = p.sku || '-';
        document.getElementById('popup-paket-price').innerText = `Rp ${Number(p.price || 0).toLocaleString('id-ID')}`;

        const existing = window.currentPackageItems.find(x => x.id === p.id);
        document.getElementById('popup-paket-qty-input').value = existing ? existing.qty : 1;
        document.getElementById('modal-paket-qty').classList.remove('hidden');
    };

    window.updateTempPackageQty = (delta) => {
        const input = document.getElementById('popup-paket-qty-input');
        let val = Number(input.value) || 1;
        val += delta;
        if (val < 1) val = 1;
        input.value = val;
    };

    window.closePackageQtyModal = () => document.getElementById('modal-paket-qty').classList.add('hidden');

    window.confirmPackageQty = () => {
        const qty = Number(document.getElementById('popup-paket-qty-input').value) || 1;
        const exIdx = window.currentPackageItems.findIndex(x => x.id === tempPackageItemSelection.id);
        if (exIdx >= 0) {
            window.currentPackageItems[exIdx].qty = qty;
        } else {
            window.currentPackageItems.push({
                id: tempPackageItemSelection.id,
                name: tempPackageItemSelection.name,
                unit: tempPackageItemSelection.unit || 'pcs',
                qty: qty,
                price: Number(tempPackageItemSelection.price) || 0,
                buyPrice: Number(tempPackageItemSelection.buyPrice) || 0
            });
        }
        window.closePackageQtyModal();
        window.renderPackageCatalog(document.getElementById('search-paket-input').value);
    };

    window.finishPackageSelection = () => {
        window.closePackageSelectView();
        window.renderPackageDetailsCard();
    };

    window.renderPackageDetailsCard = function() {
        const boxTrigger = document.getElementById('box-paket-trigger');
        const cardDetails = document.getElementById('card-paket-details');
        const listContainer = document.getElementById('list-paket-selected-items');

        if (!window.currentPackageItems || window.currentPackageItems.length === 0) {
            boxTrigger.classList.remove('hidden');
            cardDetails.classList.add('hidden');
            return;
        }

        boxTrigger.classList.add('hidden');
        cardDetails.classList.remove('hidden');
        listContainer.innerHTML = '';

        let totalHpp = 0;
        window.currentPackageItems.forEach(i => {
            totalHpp += (Number(i.buyPrice) || 0) * i.qty;
            listContainer.innerHTML += `
                <div class="grid grid-cols-12 py-0.5 text-gray-600">
                    <span class="col-span-4">${i.qty} ${i.unit || 'pcs'}</span>
                    <span class="col-span-8 font-medium text-gray-800">${i.name}</span>
                </div>
            `;
        });

        document.getElementById('add-buyprice').value = totalHpp;
        window.calculateMarginMarkup();
    };

    window.clearPackageItems = () => {
        window.currentPackageItems = [];
        window.renderPackageDetailsCard();
    };

    // ========================================================================
    // 5. LOGIKA TIPE BARANG: VARIAN (SS 1000919694 - 1000919697)
    // ========================================================================
    window.openVariantWizardStep1 = () => {
        document.querySelectorAll('.view-panel').forEach(p => p.classList.add('hidden'));
        document.getElementById('view-variant-step1').classList.remove('hidden');
        if (!window.currentVariantGroups || window.currentVariantGroups.length === 0) {
            window.currentVariantGroups = [{ name: 'Varian-1', options: [] }];
        }
        renderVariantGroupsStep1();
    };

    window.closeVariantStep1 = () => {
        document.getElementById('view-variant-step1').classList.add('hidden');
        document.getElementById('view-add-product').classList.remove('hidden');
        window.renderVariantDetailsCard();
    };

    function renderVariantGroupsStep1() {
        const container = document.getElementById('container-variant-groups');
        container.innerHTML = '';

        window.currentVariantGroups.forEach((grp, gIdx) => {
            let chipsHTML = '';
            grp.options.forEach((opt, oIdx) => {
                chipsHTML += `
                    <div onclick="removeVariantOptionFromGroup(${gIdx}, ${oIdx})" class="border border-gray-400 rounded-md py-2 px-3 text-center text-xs text-gray-700 cursor-pointer hover:bg-red-50 hover:border-red-300 transition">
                        ${opt}
                    </div>
                `;
            });

            container.innerHTML += `
                <div class="space-y-3 border-b pb-5">
                    <div class="flex justify-between items-center">
                        <h4 class="font-semibold text-sm text-gray-700">${grp.name}</h4>
                        <div class="flex items-center space-x-3">
                            <button onclick="renameVariantGroup(${gIdx})" type="button" class="text-emerald-700 text-lg"><i class="fa-solid fa-pen"></i></button>
                            ${gIdx > 0 ? `<button onclick="deleteVariantGroup(${gIdx})" type="button" class="text-red-500 text-base"><i class="fa-solid fa-trash-can"></i></button>` : ''}
                        </div>
                    </div>
                    <div class="flex border border-emerald-600 rounded-md overflow-hidden">
                        <input type="text" id="input-var-opt-${gIdx}" placeholder="ex : Biru" class="flex-1 p-2.5 px-3 text-xs focus:outline-none">
                        <button onclick="addOptionToVariantGroup(${gIdx})" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 transition">Add</button>
                    </div>
                    <p class="text-[11px] text-gray-500">Nama varian hanya dapat berisi huruf, angka, dan tanda strip (-)</p>
                    <div class="grid grid-cols-2 gap-3 pt-1">${chipsHTML}</div>
                </div>
            `;
        });
    }

    window.renameVariantGroup = (gIdx) => {
        const currentName = window.currentVariantGroups[gIdx].name;
        const newName = prompt("Ubah nama grup variasi:", currentName);
        if (newName && newName.trim() !== '') {
            window.currentVariantGroups[gIdx].name = newName.trim();
            renderVariantGroupsStep1();
        }
    };

    window.addNewVariantGroup = () => {
        const nextNum = window.currentVariantGroups.length + 1;
        window.currentVariantGroups.push({ name: `Varian-${nextNum}`, options: [] });
        renderVariantGroupsStep1();
    };

    window.deleteVariantGroup = (gIdx) => {
        window.currentVariantGroups.splice(gIdx, 1);
        renderVariantGroupsStep1();
    };

    window.addOptionToVariantGroup = (gIdx) => {
        const input = document.getElementById(`input-var-opt-${gIdx}`);
        const raw = (input.value || '').trim();
        if (!raw) return;
        if (!/^[a-zA-Z0-9\-\s]+$/.test(raw)) {
            return alert("Nama varian hanya dapat berisi huruf, angka, dan tanda strip (-)");
        }
        if (window.currentVariantGroups[gIdx].options.includes(raw)) {
            return alert("Opsi varian tersebut sudah ditambahkan!");
        }
        window.currentVariantGroups[gIdx].options.push(raw);
        input.value = '';
        renderVariantGroupsStep1();
    };

    window.removeVariantOptionFromGroup = (gIdx, oIdx) => {
        window.currentVariantGroups[gIdx].options.splice(oIdx, 1);
        renderVariantGroupsStep1();
    };

    function getCombinedVariantNames() {
        const validGroups = window.currentVariantGroups.filter(g => g.options.length > 0);
        if (validGroups.length === 0) return [];
        let results = [...validGroups[0].options];
        for (let i = 1; i < validGroups.length; i++) {
            const nextOpts = validGroups[i].options;
            const temp = [];
            results.forEach(r => {
                nextOpts.forEach(n => temp.push(`${r} - ${n}`));
            });
            results = temp;
        }
        return results;
    }

    window.proceedToVariantStep2 = () => {
        const combined = getCombinedVariantNames();
        if (combined.length === 0) {
            return alert("Tambahkan minimal 1 opsi varian terlebih dahulu (ketik nama varian lalu ketuk tombol Add)!");
        }
        document.getElementById('view-variant-step1').classList.add('hidden');
        document.getElementById('view-variant-step2').classList.remove('hidden');
        renderVariantPriceCards(combined);
    };

    window.backToVariantStep1 = () => {
        document.getElementById('view-variant-step2').classList.add('hidden');
        document.getElementById('view-variant-step1').classList.remove('hidden');
    };

    function renderVariantPriceCards(combinedNames) {
        const container = document.getElementById('container-variant-price-cards');
        container.innerHTML = '';

        combinedNames.forEach((varName, idx) => {
            const ex = (window.currentVariantConfig || []).find(x => x.name === varName) || {};
            container.innerHTML += `
                <div class="border border-emerald-600 rounded-md p-3.5 bg-white space-y-3">
                    <h4 class="font-bold text-center text-xs text-gray-700">${varName}</h4>
                    <div class="grid grid-cols-2 gap-3">
                        <input type="text" id="var-sku-${idx}" value="${ex.sku || ''}" placeholder="Barcode / SKU" class="w-full border border-gray-400 p-3 rounded-md text-xs focus:outline-none focus:border-emerald-600">
                        <input type="number" id="var-stock-${idx}" value="${ex.stock !== undefined ? ex.stock : ''}" placeholder="Stok" class="w-full border border-gray-400 p-3 rounded-md text-xs focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <input type="number" id="var-buy-${idx}" value="${ex.buyPrice !== undefined ? ex.buyPrice : ''}" placeholder="Harga dasar" class="w-full border border-gray-400 p-3 rounded-md text-xs focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                        <input type="number" id="var-sell-${idx}" value="${ex.price !== undefined ? ex.price : ''}" placeholder="Harga jual" class="w-full border border-gray-400 p-3 rounded-md text-xs focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                    </div>
                </div>
            `;
        });
    }

    window.finishVariantWizard = () => {
        const combined = getCombinedVariantNames();
        let configList = [];
        let usedSkus = [];

        for (let i = 0; i < combined.length; i++) {
            const opt = combined[i];
            const sku = document.getElementById(`var-sku-${i}`).value.trim();
            const stockRaw = document.getElementById(`var-stock-${i}`).value.trim();
            const buyRaw = document.getElementById(`var-buy-${i}`).value.trim();
            const sellRaw = document.getElementById(`var-sell-${i}`).value.trim();

            if (!sku || stockRaw === '' || buyRaw === '' || sellRaw === '') {
                return alert(`Semua kolom (Barcode/SKU, Stok, Harga dasar, dan Harga jual) pada varian '${opt}' wajib diisi!`);
            }
            if (usedSkus.includes(sku.toLowerCase())) {
                return alert(`Barcode / SKU '${sku}' tidak boleh sama antar varian!`);
            }

            usedSkus.push(sku.toLowerCase());
            configList.push({
                name: opt,
                sku: sku,
                stock: Number(stockRaw) || 0,
                buyPrice: Number(buyRaw) || 0,
                price: Number(sellRaw) || 0
            });
        }

        window.currentVariantConfig = configList;
        document.getElementById('view-variant-step2').classList.add('hidden');
        document.getElementById('view-add-product').classList.remove('hidden');
        window.renderVariantDetailsCard();
    };

    window.renderVariantDetailsCard = function() {
        const boxTrigger = document.getElementById('box-varian-trigger');
        const cardDetails = document.getElementById('card-varian-details');
        const listRows = document.getElementById('list-varian-selected-rows');

        if (!window.currentVariantConfig || window.currentVariantConfig.length === 0) {
            boxTrigger.classList.remove('hidden');
            cardDetails.classList.add('hidden');
            return;
        }

        boxTrigger.classList.add('hidden');
        cardDetails.classList.remove('hidden');
        listRows.innerHTML = '';

        let totalStock = 0;
        window.currentVariantConfig.forEach(v => {
            totalStock += Number(v.stock) || 0;
            listRows.innerHTML += `
                <div class="py-2.5 grid grid-cols-3 items-center">
                    <div>
                        <span class="text-[10px] text-gray-500 block">Var.</span>
                        <span class="font-semibold text-gray-900 text-xs">${v.name}</span>
                    </div>
                    <div class="text-center">
                        <span class="text-[10px] text-gray-500 block">Harga Beli</span>
                        <span class="font-semibold text-gray-900 text-xs">Rp ${Number(v.buyPrice).toLocaleString('id-ID')}</span>
                    </div>
                    <div class="text-right">
                        <span class="text-[10px] text-gray-500 block">Harga jual</span>
                        <span class="font-semibold text-gray-900 text-xs">Rp ${Number(v.price).toLocaleString('id-ID')}</span>
                    </div>
                </div>
            `;
        });

        document.getElementById('add-stock').value = totalStock;
        if (window.currentVariantConfig.length > 0) {
            document.getElementById('add-buyprice').value = window.currentVariantConfig[0].buyPrice;
            document.getElementById('add-price').value = window.currentVariantConfig[0].price;
            window.calculateMarginMarkup();
        }
    };

    window.clearVariantItems = () => {
        window.currentVariantConfig = [];
        window.renderVariantDetailsCard();
    };

    // ========================================================================
    // 6. LOGIKA TIPE BARANG: MULTISATUAN (SS 1000919896 - 1000919902)
    // ========================================================================
    window.tryOpenMultisatuanView = (target = 'add') => {
        multisatuanTargetForm = target;
        const skuInput = target === 'edit' ? document.getElementById('edit-full-sku') : document.getElementById('add-sku');
        const masterSku = (skuInput ? skuInput.value : '').trim();

        // Syarat Wajib: Kode* harus diisi terlebih dahulu
        if (!masterSku) {
            alert("Kode* barang wajib diisi terlebih dahulu sebelum masuk ke halaman Multisatuan!");
            if (skuInput) skuInput.focus();
            return;
        }

        document.querySelectorAll('.view-panel').forEach(p => p.classList.add('hidden'));
        document.getElementById('view-multisatuan').classList.remove('hidden');

        const priceInput = target === 'edit' ? document.getElementById('edit-full-price') : document.getElementById('add-price');
        const masterPrice = Number(priceInput ? priceInput.value : 0) || 0;

        if (!window.multisatuanSmallest) {
            document.getElementById('section-ms-phase-input').classList.remove('hidden');
            document.getElementById('section-ms-phase-list').classList.add('hidden');
            document.getElementById('footer-ms-save-btn').classList.add('hidden');
            document.getElementById('input-ms-smallest-name').value = '';
            document.getElementById('input-ms-smallest-barcode').value = masterSku;
            window.toggleSmallestUnitButton('');
        } else {
            document.getElementById('section-ms-phase-input').classList.add('hidden');
            document.getElementById('section-ms-phase-list').classList.remove('hidden');
            document.getElementById('footer-ms-save-btn').classList.remove('hidden');
            renderMultisatuanListPhase(masterPrice);
        }
    };

    window.closeMultisatuanView = () => {
        document.getElementById('view-multisatuan').classList.add('hidden');
        if (multisatuanTargetForm === 'edit') {
            document.getElementById('view-edit-barang-full').classList.remove('hidden');
            if (window.renderEditMultisatuanCard) window.renderEditMultisatuanCard();
        } else {
            document.getElementById('view-add-product').classList.remove('hidden');
            window.renderMultisatuanDetailsCard();
        }
    };

    window.useMasterBarcodeForSmallest = () => {
        const skuInput = multisatuanTargetForm === 'edit' ? document.getElementById('edit-full-sku') : document.getElementById('add-sku');
        document.getElementById('input-ms-smallest-barcode').value = (skuInput ? skuInput.value : '').trim();
    };

    window.toggleSmallestUnitButton = (text) => {
        const btn = document.getElementById('btn-submit-smallest-unit');
        if (text && text.trim() !== '') {
            btn.disabled = false;
            btn.className = "w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-wider transition cursor-pointer shadow-md";
        } else {
            btn.disabled = true;
            btn.className = "w-full bg-gray-200 text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-wider transition";
        }
    };

    window.saveSmallestUnitPhase = () => {
        const name = document.getElementById('input-ms-smallest-name').value.trim();
        const barcode = document.getElementById('input-ms-smallest-barcode').value.trim();
        const priceInput = multisatuanTargetForm === 'edit' ? document.getElementById('edit-full-price') : document.getElementById('add-price');
        const masterPrice = Number(priceInput ? priceInput.value : 0) || 0;

        if (!name) return alert("Nama satuan terkecil wajib diisi!");

        window.multisatuanSmallest = { name, barcode, price: masterPrice };
        document.getElementById('section-ms-phase-input').classList.add('hidden');
        document.getElementById('section-ms-phase-list').classList.remove('hidden');
        document.getElementById('footer-ms-save-btn').classList.remove('hidden');
        renderMultisatuanListPhase(masterPrice);
    };

    function renderMultisatuanListPhase(masterPrice) {
        const displayPrice = masterPrice || (window.multisatuanSmallest ? window.multisatuanSmallest.price : 0);
        document.getElementById('card-ms-smallest-name').innerText = window.multisatuanSmallest.name;
        document.getElementById('card-ms-smallest-barcode').innerText = window.multisatuanSmallest.barcode || '';
        document.getElementById('card-ms-smallest-price').innerText = `Rp ${Number(displayPrice).toLocaleString('id-ID')}`;

        const container = document.getElementById('container-ms-other-cards');
        container.innerHTML = '';

        (window.multisatuanOthers || []).forEach((item, idx) => {
            container.innerHTML += `
                <div class="border border-gray-200 rounded-2xl p-4 bg-white shadow-xs flex justify-between items-center">
                    <div class="flex-1">
                        <h4 class="font-bold text-sm text-gray-900">${item.name}</h4>
                        <div class="grid grid-cols-2 gap-8 mt-2">
                            <div>
                                <p class="text-xs text-gray-400">Jumlah</p>
                                <p class="text-sm font-bold text-gray-900">${item.qty}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-400">Harga</p>
                                <p class="text-sm font-bold text-gray-900">Rp ${Number(item.price).toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4 text-lg">
                        <button onclick="editOtherUnit(${idx})" type="button" class="text-emerald-600 hover:text-emerald-800"><i class="fa-solid fa-pen"></i></button>
                        <button onclick="removeOtherUnit(${idx})" type="button" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            `;
        });
    }

    // Edit Satuan Terkecil (SS 1000919900)
    window.openEditSmallestUnitModal = () => {
        if (!window.multisatuanSmallest) return;
        const priceInput = multisatuanTargetForm === 'edit' ? document.getElementById('edit-full-price') : document.getElementById('add-price');
        const masterPrice = Number(priceInput ? priceInput.value : 0) || window.multisatuanSmallest.price || 0;

        document.getElementById('modal-edit-smallest-name').value = window.multisatuanSmallest.name;
        document.getElementById('modal-edit-smallest-barcode').value = window.multisatuanSmallest.barcode || '';
        document.getElementById('modal-edit-smallest-price').value = `Rp  ${Number(masterPrice).toLocaleString('id-ID')}`;
        document.getElementById('modal-ms-edit-smallest').classList.remove('hidden');
    };
    window.closeEditSmallestUnitModal = () => document.getElementById('modal-ms-edit-smallest').classList.add('hidden');
    window.saveEditSmallestUnitModal = () => {
        const name = document.getElementById('modal-edit-smallest-name').value.trim();
        const barcode = document.getElementById('modal-edit-smallest-barcode').value.trim();
        if (name) window.multisatuanSmallest.name = name;
        window.multisatuanSmallest.barcode = barcode;
        window.closeEditSmallestUnitModal();
        const priceInput = multisatuanTargetForm === 'edit' ? document.getElementById('edit-full-price') : document.getElementById('add-price');
        renderMultisatuanListPhase(Number(priceInput ? priceInput.value : 0) || 0);
    };

    // Tambah / Edit Satuan Lainnya (SS 1000919898 & 1000919901)
    window.updateOtherUnitSuffix = (val) => {
        document.getElementById('modal-ms-price-suffix').innerText = val ? `/ ${val}` : '/';
    };

    window.openAddOtherUnitModal = () => {
        editingOtherUnitIndex = -1;
        document.getElementById('modal-ms-other-title').innerText = "TAMBAHKAN TIPE SATUAN";
        document.getElementById('modal-ms-name').value = '';
        document.getElementById('modal-ms-name').disabled = false;
        document.getElementById('modal-ms-name').className = "w-full border border-emerald-600 p-3 px-4 rounded-full focus:outline-none bg-white";
        document.getElementById('modal-ms-barcode').value = '';
        document.getElementById('modal-ms-qty').value = '0';
        document.getElementById('modal-ms-qty').disabled = false;
        document.getElementById('modal-ms-qty').className = "w-2/3 border border-emerald-600 p-3 px-4 rounded-full focus:outline-none bg-white";
        document.getElementById('modal-ms-price').value = '0';
        document.getElementById('modal-ms-qty-unit-label').innerText = window.multisatuanSmallest ? window.multisatuanSmallest.name : 'pcs';
        document.getElementById('modal-ms-price-suffix').innerText = '/';
        document.getElementById('modal-ms-other-unit').classList.remove('hidden');
    };

    window.editOtherUnit = (idx) => {
        editingOtherUnitIndex = idx;
        const item = window.multisatuanOthers[idx];
        document.getElementById('modal-ms-other-title').innerText = "EDIT SATUAN TERKECIL";
        document.getElementById('modal-ms-name').value = item.name;
        document.getElementById('modal-ms-Barcode')?.focus();
        document.getElementById('modal-ms-barcode').value = item.barcode || '';
        document.getElementById('modal-ms-qty').value = item.qty;
        document.getElementById('modal-ms-price').value = item.price;
        document.getElementById('modal-ms-qty-unit-label').innerText = window.multisatuanSmallest ? window.multisatuanSmallest.name : 'pcs';
        document.getElementById('modal-ms-price-suffix').innerText = `/ ${item.name}`;
        document.getElementById('modal-ms-other-unit').classList.remove('hidden');
    };

    window.closeOtherUnitModal = () => document.getElementById('modal-ms-other-unit').classList.add('hidden');

    window.saveOtherUnitModal = () => {
        const name = document.getElementById('modal-ms-name').value.trim();
        const barcode = document.getElementById('modal-ms-barcode').value.trim();
        const qty = Number(document.getElementById('modal-ms-qty').value) || 0;
        const price = Number(document.getElementById('modal-ms-price').value) || 0;

        if (!name) return alert("Nama satuan wajib diisi!");
        if (qty <= 1) return alert("Jumlah konversi satuan harus lebih dari 1!");
        if (price <= 0) return alert("Harga satuan wajib lebih dari 0!");

        // Validasi keunikan Nama Satuan, Barcode, dan Jumlah
        const duplicate = window.multisatuanOthers.some((item, idx) => {
            if (idx === editingOtherUnitIndex) return false;
            const sameName = item.name.toLowerCase() === name.toLowerCase();
            const sameQty = Number(item.qty) === qty;
            const sameBarcode = barcode !== '' && item.barcode === barcode;
            return sameName || sameQty || sameBarcode;
        });
        if (duplicate) {
            return alert("Nama Satuan, Barcode, dan Jumlah harus unik (tidak boleh sama dengan satuan lain)!");
        }

        if (editingOtherUnitIndex >= 0) {
            window.multisatuanOthers[editingOtherUnitIndex] = { name, barcode, qty, price };
        } else {
            window.multisatuanOthers.push({ name, barcode, qty, price });
        }

        window.closeOtherUnitModal();
        const priceInput = multisatuanTargetForm === 'edit' ? document.getElementById('edit-full-price') : document.getElementById('add-price');
        renderMultisatuanListPhase(Number(priceInput ? priceInput.value : 0) || 0);
    };

    window.removeOtherUnit = (idx) => {
        window.multisatuanOthers.splice(idx, 1);
        const priceInput = multisatuanTargetForm === 'edit' ? document.getElementById('edit-full-price') : document.getElementById('add-price');
        renderMultisatuanListPhase(Number(priceInput ? priceInput.value : 0) || 0);
    };

    window.finishMultisatuanView = () => {
        window.closeMultisatuanView();
    };

    window.renderMultisatuanDetailsCard = function() {
        const boxTrigger = document.getElementById('box-multisatuan-trigger');
        const cardDetails = document.getElementById('card-multisatuan-details');

        if (!window.multisatuanSmallest) {
            boxTrigger.classList.remove('hidden');
            cardDetails.classList.add('hidden');
            return;
        }

        boxTrigger.classList.add('hidden');
        cardDetails.classList.remove('hidden');

        const masterPrice = Number(document.getElementById('add-price').value) || window.multisatuanSmallest.price || 0;
        document.getElementById('row-ms-smallest-summary').innerHTML = `
            <span>${window.multisatuanSmallest.name}</span>
            <span class="text-center">1</span>
            <span class="text-right">Rp ${Number(masterPrice).toLocaleString('id-ID')}</span>
        `;

        const othersContainer = document.getElementById('list-ms-others-summary');
        othersContainer.innerHTML = '';
        (window.multisatuanOthers || []).forEach((item, idx) => {
            othersContainer.innerHTML += `
                <div class="grid grid-cols-3 items-center py-0.5 text-gray-800 font-semibold">
                    <span>${item.name}</span>
                    <span class="text-center">${item.qty}</span>
                    <div class="flex items-center justify-end space-x-3">
                        <span>Rp ${Number(item.price).toLocaleString('id-ID')}</span>
                        <button onclick="removeOtherUnitFromCard(${idx})" type="button" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash-can text-sm"></i></button>
                    </div>
                </div>
            `;
        });
    };

    window.removeOtherUnitFromCard = (idx) => {
        window.multisatuanOthers.splice(idx, 1);
        window.renderMultisatuanDetailsCard();
    };

    window.clearMultisatuanData = () => {
        window.multisatuanSmallest = null;
        window.multisatuanOthers = [];
        window.renderMultisatuanDetailsCard();
    };

    // ========================================================================
    // 7. LOGIKA TAMBAH TIPE HARGA GROSIR BERTINGKAT (SS 1000920094 - 1000920100)
    // ========================================================================
    window.openTierPricingView = (tierIdx = -1) => {
        editingTierIndex = tierIdx;
        document.querySelectorAll('.view-panel').forEach(p => p.classList.add('hidden'));
        document.getElementById('view-tier-pricing').classList.remove('hidden');

        const baseSellPrice = Number(document.getElementById('add-price').value) || 0;

        if (tierIdx >= 0 && window.savedPriceTiers[tierIdx]) {
            const tier = window.savedPriceTiers[tierIdx];
            document.getElementById('input-tier-name').value = tier.name || '';
            selectedCustomerType = tier.customerType || '';
            tempTierSteps = [...(tier.steps || [])];
        } else {
            document.getElementById('input-tier-name').value = '';
            selectedCustomerType = '';
            tempTierSteps = baseSellPrice > 0 ? [{ minQty: 1, price: baseSellPrice }] : [];
        }

        updateCustomerTypeBadge();
        renderTierPricingList();
    };

    window.closeTierPricingView = () => {
        document.getElementById('view-tier-pricing').classList.add('hidden');
        document.getElementById('view-add-product').classList.remove('hidden');
    };

    window.openSelectCustomerTypeModal = () => {
        document.getElementById('search-customer-tier-input').value = '';
        document.getElementById('modal-select-customer-type').classList.remove('hidden');
        window.renderCustomerTypeOptions('');
    };
    window.closeSelectCustomerTypeModal = () => document.getElementById('modal-select-customer-type').classList.add('hidden');

    window.renderCustomerTypeOptions = (filterKeyword = '') => {
        const container = document.getElementById('list-customer-type-options');
        container.innerHTML = '';
        const types = window.masterCustomerTypes || ["gold", "silver", "grosir"];
        const filtered = types.filter(t => t.toLowerCase().includes(filterKeyword.toLowerCase()));

        filtered.forEach(type => {
            container.innerHTML += `
                <div onclick="selectCustomerTypeOption('${type}')" class="py-3.5 px-2 hover:bg-emerald-50 active:bg-emerald-100 cursor-pointer font-bold text-xs text-gray-900 transition">
                    ${type}
                </div>
            `;
        });
    };

    window.selectCustomerTypeOption = (type) => {
        selectedCustomerType = type;
        document.getElementById('input-tier-name').value = type;
        updateCustomerTypeBadge();
        window.closeSelectCustomerTypeModal();
    };

    function updateCustomerTypeBadge() {
        const badge = document.getElementById('badge-tier-customer-status');
        if (selectedCustomerType) {
            badge.classList.remove('hidden');
            badge.classList.add('flex');
        } else {
            badge.classList.add('hidden');
            badge.classList.remove('flex');
        }
    }

    window.openAddPriceStepModal = () => {
        editingPriceStepIndex = -1;
        document.getElementById('modal-step-title').innerText = "TAMBAH TIPE HARGA";
        const nextSuggestedMin = tempTierSteps.length === 0 ? 1 : (tempTierSteps[tempTierSteps.length - 1].minQty + 10);
        document.getElementById('input-step-min-qty').value = nextSuggestedMin;
        document.getElementById('input-step-price').value = document.getElementById('add-price').value || "0";
        document.getElementById('modal-add-price-step').classList.remove('hidden');
    };

    window.editPriceStep = (idx) => {
        editingPriceStepIndex = idx;
        const item = tempTierSteps[idx];
        document.getElementById('modal-step-title').innerText = "EDIT TIPE HARGA";
        document.getElementById('input-step-min-qty').value = item.minQty;
        document.getElementById('input-step-price').value = item.price;
        document.getElementById('modal-add-price-step').classList.remove('hidden');
    };

    window.closeAddPriceStepModal = () => document.getElementById('modal-add-price-step').classList.add('hidden');

    window.savePriceStepModal = () => {
        const minQty = Number(document.getElementById('input-step-min-qty').value) || 1;
        const price = Number(document.getElementById('input-step-price').value) || 0;

        if (price <= 0) return alert("Harga jual wajib lebih besar dari 0!");

        if (editingPriceStepIndex >= 0) {
            tempTierSteps[editingPriceStepIndex] = { minQty, price };
        } else {
            if (tempTierSteps.some(s => s.minQty === minQty)) {
                return alert(`Jumlah minimal ${minQty} sudah ada di dalam daftar!`);
            }
            tempTierSteps.push({ minQty, price });
        }

        tempTierSteps.sort((a, b) => a.minQty - b.minQty);
        window.closeAddPriceStepModal();
        renderTierPricingList();
    };

    window.deletePriceStep = (idx) => {
        tempTierSteps.splice(idx, 1);
        renderTierPricingList();
    };

    function renderTierPricingList() {
        const emptyBox = document.getElementById('empty-state-tier-pricing');
        const container = document.getElementById('container-tier-pricing-rows');

        if (tempTierSteps.length === 0) {
            emptyBox.classList.remove('hidden');
            container.classList.add('hidden');
            return;
        }

        emptyBox.classList.add('hidden');
        container.classList.remove('hidden');
        container.innerHTML = '';

        tempTierSteps.forEach((step, idx) => {
            const isFirstMin1 = idx === 0 && step.minQty === 1;
            const delBtn = !isFirstMin1 ? `
                <button onclick="deletePriceStep(${idx})" type="button" class="w-7 h-7 rounded-full bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-600 flex items-center justify-center text-xs transition">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            ` : '';

            container.innerHTML += `
                <div class="border border-gray-300 rounded-xl p-3.5 px-4 bg-white flex justify-between items-center text-xs">
                    <span class="${isFirstMin1 ? 'font-semibold text-gray-600' : 'font-bold text-gray-900'}">Min ${step.minQty} @ Rp ${Number(step.price).toLocaleString('id-ID')}</span>
                    <div class="flex items-center space-x-3">
                        ${delBtn}
                        <button onclick="editPriceStep(${idx})" type="button" class="text-emerald-700 hover:text-emerald-900 text-lg transition">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    }

    window.saveTierPricingAndReturn = () => {
        const name = document.getElementById('input-tier-name').value.trim();
        if (!name) return alert("Nama tipe harga wajib diisi!");
        if (tempTierSteps.length === 0) return alert("Tambahkan minimal 1 tingkatan harga pada Daftar Tipe Harga!");

        const tierObj = {
            name,
            customerType: selectedCustomerType,
            steps: [...tempTierSteps]
        };

        if (editingTierIndex >= 0) {
            window.savedPriceTiers[editingTierIndex] = tierObj;
        } else {
            window.savedPriceTiers.push(tierObj);
        }

        window.closeTierPricingView();
        window.renderSavedPriceTiersCards();
    };

    window.renderSavedPriceTiersCards = function() {
        const wrapper = document.getElementById('wrapper-price-tiers-list');
        const container = document.getElementById('container-saved-price-tiers');

        if (!window.savedPriceTiers || window.savedPriceTiers.length === 0) {
            wrapper.classList.add('hidden');
            return;
        }

        wrapper.classList.remove('hidden');
        container.innerHTML = '';

        window.savedPriceTiers.forEach((tier, tIdx) => {
            let stepsHTML = '';
            (tier.steps || []).forEach(st => {
                stepsHTML += `
                    <div class="grid grid-cols-2 py-1 text-gray-900 font-semibold text-xs">
                        <span>${st.minQty}</span>
                        <span class="text-right">Rp ${Number(st.price).toLocaleString('id-ID')}</span>
                    </div>
                `;
            });

            container.innerHTML += `
                <div class="border border-gray-300 rounded-2xl p-4 bg-white shadow-xs space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-xs text-gray-900">Tipe : ${tier.name}</span>
                        <div class="space-x-3 text-xs font-bold">
                            <button onclick="openTierPricingView(${tIdx})" type="button" class="text-emerald-600 hover:underline">Edit</button>
                            <button onclick="deleteSavedPriceTier(${tIdx})" type="button" class="text-red-600 hover:underline">Hapus</button>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 text-gray-500 text-[11px] pt-1">
                        <span>Jumlah minimal</span><span class="text-right">Harga jual/barang</span>
                    </div>
                    <div class="divide-y divide-gray-50">${stepsHTML}</div>
                </div>
            `;
        });
    };

    window.deleteSavedPriceTier = (tIdx) => {
        window.savedPriceTiers.splice(tIdx, 1);
        window.renderSavedPriceTiersCards();
    };

    // ========================================================================
    // 8. SIMPAN DATA BARANG BARU KE FIREBASE FIRESTORE
    // ========================================================================
    window.saveFullNewProduct = async function() {
        const name = document.getElementById('add-name').value.trim();
        const type = document.getElementById('add-type').value;
        const showTransaction = document.getElementById('add-chk-transaksi').checked;
        const useStock = document.getElementById('add-chk-pakai-stok').checked;
        const stock = Number(document.getElementById('add-stock').value) || 0;
        const sku = document.getElementById('add-sku').value.trim();
        const buyPrice = Number(document.getElementById('add-buyprice').value) || 0;
        const price = Number(document.getElementById('add-price').value) || 0;
        const category = document.getElementById('add-category').value.trim() || 'Umum';
        const minStock = Number(document.getElementById('add-min-stock').value) || 0;
        const weight = Number(document.getElementById('add-weight').value) || 0;
        const unit = document.getElementById('add-unit').value.trim() || 'pcs';
        const discountVal = Number(document.getElementById('add-discount-val').value) || 0;
        const rack = document.getElementById('add-rack').value.trim();
        const notes = document.getElementById('add-notes').value.trim();
        const image = document.getElementById('add-prod-image-base64').value;

        if (!name) return alert("Nama* barang wajib diisi!");
        if (type !== 'Varian' && !sku) return alert("Kode* barang wajib diisi!");
        if (type !== 'Varian' && price <= 0) return alert("Harga jual* wajib lebih besar dari 0!");
        if (type === 'Paket' && window.currentPackageItems.length === 0) return alert("Pilih minimal 1 barang untuk Tipe Paket!");
        if (type === 'Varian' && window.currentVariantConfig.length === 0) return alert("Atur minimal 1 variasi untuk Tipe Varian!");
        if (type === 'Multisatuan' && !window.multisatuanSmallest) return alert("Atur satuan terkecil untuk Tipe Multisatuan!");

        const newProductData = {
            name,
            sku: type === 'Varian' && !sku ? (window.currentVariantConfig[0]?.sku || '') : sku,
            buyPrice,
            price,
            stock,
            category,
            type,
            packageItems: window.currentPackageItems || [],
            variantGroups: window.currentVariantGroups || [],
            variants: window.currentVariantConfig || [],
            multisatuanSmallest: window.multisatuanSmallest || null,
            multisatuanOthers: window.multisatuanOthers || [],
            priceTiers: window.savedPriceTiers || [],
            priceTierConfig: window.savedPriceTiers && window.savedPriceTiers.length > 0 ? window.savedPriceTiers[0] : null,
            showTransaction,
            useStock,
            minStock,
            weight,
            unit,
            discountVal,
            discountType: discountMode,
            rack,
            notes,
            image,
            createdAt: window.fb ? window.fb.serverTimestamp() : new Date().toISOString()
        };

        try {
            if (window.fb && window.db) {
                await window.fb.addDoc(window.fb.collection(window.db, "products"), newProductData);
            } else {
                newProductData.id = 'local_' + Date.now();
                window.products.push(newProductData);
            }
            alert("Barang berhasil disimpan!");
            window.closeAddProductView();
            if (window.loadInitialData) window.loadInitialData();
        } catch (err) {
            console.error(err);
            alert("Gagal menyimpan barang ke database.");
        }
    };
})();
