// ============================================================================
// MODUL 3: FORM TAMBAH BARANG, KAMERA <80KB, PAKET, VARIAN, MULTISATUAN, & TIPE HARGA
// (DIROMBAK KE DESAIN KASIR PINTAR KLASIK & FIX NAVIGATION BACK)
// ============================================================================

(function() {
    // 1. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- === FORM LENGKAP TAMBAH BARANG === -->
        <div id="view-add-product" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-30">
            <!-- Header Solid Hijau Klasik -->
            <div class="px-4 py-3 bg-emerald-600 text-white flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-4">
                    <button onclick="closeAddProductView()" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold tracking-wide">Tambah Barang</h2>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
                <div class="flex flex-col items-center justify-center pt-2">
                    <div class="w-28 h-28 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden relative shadow-inner mb-3 border border-gray-200" id="preview-box-container">
                        <img id="add-prod-img-preview" src="" alt="Preview" class="w-full h-full object-cover hidden">
                        <div id="add-prod-img-placeholder" class="text-gray-300 text-5xl"><i class="fa-regular fa-images"></i></div>
                    </div>
                    <div class="flex items-center space-x-6 text-emerald-700 text-xl border border-emerald-100 bg-emerald-50 rounded-full px-6 py-2">
                        <button onclick="openLivePhotoCamera('add')" type="button" class="p-1 hover:text-emerald-800 transition" title="Ambil Foto Kamera (<80KB)">
                            <i class="fa-solid fa-camera"></i>
                        </button>
                        <button onclick="triggerGalleryPick('add')" type="button" class="p-1 hover:text-emerald-800 transition" title="Pilih dari Galeri (Maks 100KB)">
                            <i class="fa-regular fa-image"></i>
                        </button>
                        <button id="btn-clear-add-photo" onclick="clearAddProductPhoto()" type="button" class="p-1 text-gray-400 hover:text-red-500 transition hidden" title="Hapus Gambar">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <input type="file" id="input-prod-gallery" accept="image/*" class="hidden" onchange="handleGalleryPick(event)">
                    <input type="hidden" id="add-prod-image-base64" value="">
                    <span id="add-prod-img-size-info" class="text-[10px] text-emerald-600 font-bold mt-2 hidden"></span>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nama<span class="text-red-500">*</span></label>
                    <input type="text" id="add-name" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Tipe Barang</label>
                    <div class="relative">
                        <select id="add-type" onchange="handleProductTypeChange(this.value)" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-sm focus:outline-none focus:border-emerald-600 appearance-none bg-white font-bold text-gray-800">
                            <option value="Default">Default</option>
                            <option value="Bahan Baku">Bahan Baku</option>
                            <option value="Paket">Paket</option>
                            <option value="Varian">Varian</option>
                            <option value="Multisatuan">Multisatuan</option>
                            <option value="Add On">Add On</option>
                        </select>
                        <span class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
                            <i class="fa-solid fa-chevron-down text-sm"></i>
                        </span>
                    </div>
                    <p id="note-addon-info" class="text-[10px] font-semibold text-gray-500 mt-1.5 hidden">*Barang Add On tidak terpengaruh metode akuntansi (fifo, lifo, dll)</p>
                </div>

                <div id="container-type-paket" class="hidden space-y-2">
                    <div id="box-paket-trigger" onclick="openPackageSelectView()" class="border border-emerald-600 rounded-xl p-4 text-center cursor-pointer hover:bg-emerald-50 transition bg-emerald-50/50">
                        <span class="text-xs font-bold text-emerald-700 block">Tambah Paket</span>
                        <span class="text-[10px] font-semibold text-emerald-600 block mt-1">(Klik di sini untuk menambahkan paket)</span>
                    </div>
                    <div id="card-paket-details" class="hidden border border-gray-300 rounded-2xl p-4 bg-white shadow-xs">
                        <div class="flex justify-between items-center mb-3">
                            <span class="font-bold text-sm text-gray-800">Paket</span>
                            <div class="space-x-3 text-xs font-bold">
                                <button onclick="openPackageSelectView()" type="button" class="text-emerald-600 hover:underline">Edit</button>
                                <button onclick="clearPackageItems()" type="button" class="text-red-600 hover:underline">Hapus</button>
                            </div>
                        </div>
                        <div id="list-paket-selected-items" class="space-y-1.5 text-xs text-gray-600 font-medium"></div>
                    </div>
                </div>

                <div id="container-type-varian" class="hidden space-y-2">
                    <div id="box-varian-trigger" onclick="openVariantWizardStep1()" class="border border-emerald-600 rounded-xl p-4 text-center cursor-pointer hover:bg-emerald-50 transition bg-emerald-50/50">
                        <span class="text-xs font-bold text-emerald-700 block">Tambah / Edit Variasi</span>
                        <span class="text-[10px] font-semibold text-emerald-600 block mt-1">(Ukuran / Warna)</span>
                    </div>
                    <div id="card-varian-details" class="hidden border border-gray-300 rounded-2xl p-4 bg-white shadow-xs">
                        <div class="flex justify-end items-center space-x-4 text-xs font-bold mb-3 border-b border-gray-100 pb-2">
                            <button onclick="openVariantWizardStep1()" type="button" class="text-emerald-600 hover:underline">Edit/Tambah</button>
                            <button onclick="clearVariantItems()" type="button" class="text-red-600 hover:underline">Hapus</button>
                        </div>
                        <div id="list-varian-selected-rows" class="divide-y divide-gray-100 text-xs"></div>
                    </div>
                </div>

                <div id="container-type-multisatuan" class="hidden space-y-2">
                    <div id="box-multisatuan-trigger" onclick="tryOpenMultisatuanView('add')" class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3.5 cursor-pointer hover:bg-emerald-100 transition shadow-sm">
                        <div class="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xl flex-shrink-0 shadow-xs">
                            <i class="fa-solid fa-cube"></i>
                        </div>
                        <div>
                            <h4 class="font-extrabold text-xs text-emerald-900">Tambah Multisatuan</h4>
                            <p class="text-[10px] font-semibold text-emerald-700 mt-0.5">(pcs / Lusin / Dus)</p>
                        </div>
                    </div>
                    <div id="card-multisatuan-details" class="hidden border border-gray-300 rounded-2xl p-4 bg-white shadow-xs">
                        <div class="flex justify-between items-center mb-3">
                            <span class="font-extrabold text-xs text-gray-900">Data Satuan</span>
                            <div class="space-x-3 text-base">
                                <button onclick="tryOpenMultisatuanView('add')" type="button" class="text-emerald-600 hover:text-emerald-800"><i class="fa-solid fa-pen"></i></button>
                                <button onclick="clearMultisatuanData()" type="button" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash-can"></i></button>
                            </div>
                        </div>
                        <div class="space-y-3 text-xs">
                            <div class="bg-gray-50 rounded-lg p-3">
                                <div class="grid grid-cols-3 text-gray-400 text-[10px] font-bold pb-1.5 border-b border-gray-200">
                                    <span>Satuan Terkecil</span><span class="text-center">Jumlah</span><span class="text-right">Harga</span>
                                </div>
                                <div id="row-ms-smallest-summary" class="grid grid-cols-3 font-bold text-gray-900 py-1.5"></div>
                            </div>
                            <div id="wrapper-ms-others-summary" class="bg-gray-50 rounded-lg p-3">
                                <div class="grid grid-cols-3 text-gray-400 text-[10px] font-bold pb-1.5 border-b border-gray-200">
                                    <span>Tipe Satuan</span><span class="text-center">Jumlah</span><span class="text-right">Harga</span>
                                </div>
                                <div id="list-ms-others-summary" class="space-y-1 pt-1"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-3 pt-2">
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" id="add-chk-transaksi" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                        <span class="text-xs font-bold text-gray-800">Tampilkan di Transaksi</span>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" id="add-chk-pakai-stok" checked onchange="toggleAddStockInputState()" class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                        <span class="text-xs font-bold text-gray-800">Pakai stok</span>
                    </label>
                </div>

                <div id="group-stock-input">
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Stok<span class="text-red-500">*</span></label>
                    <input type="number" id="add-stock" value="0" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                </div>

                <div id="group-sku-input">
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Kode<span class="text-red-500">*</span></label>
                    <div class="flex items-center space-x-2">
                        <input type="text" id="add-sku" class="flex-1 border border-gray-300 p-3.5 px-4 rounded-full text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                        <button onclick="generateSequentialBarcode()" type="button" class="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-xl transition hover:bg-emerald-100">
                            <i class="fa-solid fa-arrows-rotate"></i>
                        </button>
                        <button onclick="if(window.openScannerView) window.openScannerView('add-product')" type="button" class="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-xl transition hover:bg-emerald-100">
                            <i class="fa-solid fa-barcode"></i>
                        </button>
                    </div>
                </div>

                <div id="group-buyprice-input">
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Harga dasar<span class="text-red-500">*</span></label>
                    <div class="flex border border-gray-300 rounded-full overflow-hidden focus-within:border-emerald-600">
                        <div class="bg-gray-100 text-gray-600 font-bold px-4 flex items-center border-r border-gray-200">Rp</div>
                        <input type="number" id="add-buyprice" value="0" oninput="calculateMarginMarkup()" class="flex-1 p-3.5 px-3 font-bold text-gray-900 focus:outline-none" pattern="[0-9]*" inputmode="numeric">
                    </div>
                </div>

                <div id="group-price-input">
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Harga jual<span class="text-red-500">*</span></label>
                    <div class="flex border border-gray-300 rounded-full overflow-hidden focus-within:border-emerald-600">
                        <div class="bg-emerald-50 text-emerald-700 font-bold px-4 flex items-center border-r border-emerald-100">Rp</div>
                        <input type="number" id="add-price" value="0" oninput="calculateMarginMarkup()" class="flex-1 p-3.5 px-3 font-bold text-gray-900 focus:outline-none" pattern="[0-9]*" inputmode="numeric">
                    </div>
                    <div id="group-profit-metrics" class="mt-3 space-y-1.5 text-[11px] font-semibold text-gray-500 flex flex-col pl-2">
                        <div class="flex items-center space-x-2">
                            <span>Markup Penjualan <strong id="disp-markup-val" class="text-emerald-700 font-extrabold">0%</strong></span>
                            <button onclick="openMarkupInfoModal('add')" type="button" class="w-4 h-4 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[9px]"><i class="fa-solid fa-info"></i></button>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span>Margin Keuntungan <strong id="disp-margin-val" class="text-emerald-700 font-extrabold">0%</strong></span>
                            <button onclick="openMarginInfoModal('add')" type="button" class="w-4 h-4 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[9px]"><i class="fa-solid fa-info"></i></button>
                        </div>
                    </div>
                </div>

                <div id="add-product-advanced-fields" class="space-y-4 pt-3 border-t border-gray-100">
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Kategori</label>
                        <div class="flex items-center space-x-2">
                            <div onclick="openSelectCategoryModal('add')" class="flex-1 border border-gray-300 p-3.5 px-4 rounded-full text-sm bg-white cursor-pointer flex justify-between items-center hover:border-emerald-500 transition">
                                <span id="disp-selected-category" class="text-gray-800 font-bold truncate">Umum</span>
                                <i class="fa-solid fa-chevron-down text-xs text-gray-400"></i>
                            </div>
                            <input type="hidden" id="add-category" value="Umum">
                            <button onclick="openCategoryManagementFromAddProduct()" type="button" class="w-12 h-12 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full flex items-center justify-center text-lg font-bold transition flex-shrink-0" title="Kelola Kategori">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Batas Minimum Stok</label>
                        <input type="number" id="add-min-stock" value="0" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Berat (gram)</label>
                            <input type="number" id="add-weight" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-sm font-bold focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Satuan (gram,pcs)</label>
                            <input type="text" id="add-unit" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-sm font-bold focus:outline-none focus:border-emerald-600">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Diskon</label>
                        <div class="flex items-center space-x-3">
                            <input type="number" id="add-discount-val" value="0" class="flex-1 border border-gray-300 p-3.5 px-4 rounded-full text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                            <div class="flex rounded-full overflow-hidden border border-emerald-600 flex-shrink-0 bg-white">
                                <button type="button" id="btn-disc-pct" onclick="setDiscountType('pct')" class="px-5 py-3 text-xs font-extrabold bg-emerald-600 text-white transition">%</button>
                                <button type="button" id="btn-disc-rp" onclick="setDiscountType('rp')" class="px-5 py-3 text-xs font-extrabold text-emerald-600 transition">Rp</button>
                            </div>
                        </div>
                        <p id="note-addon-discount-disabled" class="text-[10px] text-gray-500 mt-1.5 font-semibold hidden">Diskon add on tidak tersedia</p>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Letak rak</label>
                        <input type="text" id="add-rack" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-sm font-bold focus:outline-none focus:border-emerald-600">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Keterangan</label>
                        <input type="text" id="add-notes" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-sm font-bold focus:outline-none focus:border-emerald-600">
                    </div>

                    <div id="wrapper-price-tiers-list" class="hidden space-y-3 pt-3 border-t border-gray-100">
                        <div class="font-extrabold text-xs uppercase tracking-wider text-gray-900">Daftar Tipe Harga</div>
                        <div id="container-saved-price-tiers" class="space-y-3"></div>
                    </div>

                    <div class="pt-2">
                        <button onclick="openTierPricingView(-1)" type="button" class="w-full border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 py-3.5 rounded-full font-bold text-xs transition leading-relaxed flex flex-col items-center justify-center">
                            <span>Tambah Tipe Harga</span>
                            <span class="text-[9px] font-semibold opacity-70 mt-0.5">(Grosir / Retailer / Eceran / Gojek)</span>
                        </button>
                    </div>
                </div>

                <div class="text-center pt-4 pb-2">
                    <button onclick="toggleAddProductAdvancedFields()" type="button" class="text-xs font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 px-4 py-2 rounded-full inline-flex items-center space-x-2 transition">
                        <span id="label-toggle-advanced">Tampilkan sedikit</span>
                        <i id="icon-toggle-advanced" class="fa-solid fa-chevron-up text-[10px]"></i>
                    </button>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-20">
                <button onclick="saveFullNewProduct()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN
                </button>
            </div>
        </div>

        <!-- File ini tetap memuat Modals Varian, Multisatuan, Tipe Harga dll (dijaga agar tidak hilang) -->
        <div id="view-paket-select" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <button onclick="closePackageSelectView()" class="text-gray-400 hover:text-gray-600 text-2xl font-light p-1"><i class="fa-solid fa-xmark"></i></button>
                <h2 class="text-xs font-extrabold text-gray-900 tracking-wider uppercase">DAFTAR BARANG</h2>
                <button onclick="finishPackageSelection()" class="w-8 h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-xs transition"><i class="fa-solid fa-check"></i></button>
            </div>
            <div class="p-3 bg-white border-b flex items-center">
                <div class="relative flex-1 flex items-center">
                    <span class="absolute left-3.5 text-gray-400"><i class="fa-solid fa-search text-xs"></i></span>
                    <input type="text" id="search-paket-input" oninput="renderPackageCatalog(this.value)" placeholder="Cari barang paket..." class="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-full text-xs focus:outline-none focus:border-emerald-600 font-bold text-gray-900">
                    <button onclick="document.getElementById('search-paket-input').value=''; renderPackageCatalog('');" class="absolute right-3 text-gray-400 hover:text-gray-600"><i class="fa-solid fa-circle-xmark"></i></button>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-100" id="list-paket-catalog"></div>
        </div>
        
        <div id="view-variant-step1" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="bg-white border-b flex items-center justify-between shadow-sm z-10 h-14">
                <button onclick="closeVariantStep1()" class="text-emerald-700 text-xl font-bold px-4 h-full flex items-center"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-xs font-extrabold text-gray-900 uppercase tracking-wider">TAMBAH / EDIT VARIASI</h2>
                <button onclick="proceedToVariantStep2()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 h-full flex items-center justify-center text-xl transition"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-6">
                <div id="container-variant-groups" class="space-y-6"></div>
                <button onclick="addNewVariantGroup()" type="button" class="flex items-center space-x-2 text-emerald-600 hover:text-emerald-800 text-xs font-bold pt-2 transition">
                    <i class="fa-solid fa-plus text-base"></i><span>Tambah Variasi</span>
                </button>
            </div>
        </div>

        <div id="view-variant-step2" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-gray-50 hidden relative z-40">
            <div class="bg-white border-b flex items-center justify-between shadow-sm z-10 h-14">
                <button onclick="backToVariantStep1()" class="text-emerald-700 text-xl font-bold px-4 h-full flex items-center"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-xs font-extrabold text-gray-900 uppercase tracking-wider">TAMBAH / EDIT VARIASI</h2>
                <button onclick="finishVariantWizard()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 h-full flex items-center justify-center text-xl transition"><i class="fa-solid fa-check"></i></button>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4" id="container-variant-price-cards"></div>
        </div>

        <div id="view-multisatuan" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="px-4 py-3 bg-emerald-600 text-white border-b flex items-center space-x-4 shadow-sm z-10">
                <button onclick="closeMultisatuanView()" class="text-white text-xl font-bold"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold tracking-wide">Multisatuan</h2>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
                <div class="bg-emerald-50 rounded-xl p-4 text-[11px] text-gray-600 font-semibold leading-relaxed space-y-2 border border-emerald-100">
                    <p>Tipe Satuan dibuat dengan format satuan terkecil hingga satuan terbesar. Usahakan untuk satuan pertama adalah satuan PCS, per Unit atau per Buah. Contoh: PCS = 1 Produk = Rp 1.000, sehingga untuk satuan berikutnya seperti lusin, 1 lusin = 12 PCS = Rp 12.000</p>
                    <p class="font-extrabold text-emerald-800">Catatan: Harga satuan terkecil mengikuti harga jual pada data barang</p>
                </div>
                <div id="section-ms-phase-input" class="space-y-4 pt-2">
                    <h4 class="font-extrabold text-sm text-gray-900">Masukkan nama Satuan terkecil</h4>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nama Satuan<span class="text-red-500">*</span></label>
                        <input type="text" id="input-ms-smallest-name" oninput="toggleSmallestUnitButton(this.value)" placeholder="Cth: PCS, Lembar, Bungkus" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Barcode</label>
                        <div class="flex items-center space-x-2">
                            <input type="text" id="input-ms-smallest-barcode" class="flex-1 border border-gray-300 p-3.5 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                            <button onclick="if(window.openScannerView) window.openScannerView('multisatuan-smallest')" type="button" class="text-emerald-700 bg-emerald-50 rounded-full w-12 h-12 flex items-center justify-center text-xl transition hover:bg-emerald-100 border border-emerald-100"><i class="fa-solid fa-barcode"></i></button>
                        </div>
                        <button onclick="useMasterBarcodeForSmallest()" type="button" class="text-emerald-600 text-[10px] font-bold mt-2.5 block hover:underline">Gunakan kode barang induk</button>
                    </div>
                    <div class="pt-4">
                        <button id="btn-submit-smallest-unit" disabled onclick="saveSmallestUnitPhase()" class="w-full bg-gray-200 text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-wider transition">INPUT SATUAN TERKECIL</button>
                    </div>
                </div>
                <div id="section-ms-phase-list" class="hidden space-y-4">
                    <div class="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                        <div class="bg-emerald-100 text-emerald-900 text-[10px] uppercase tracking-wider font-extrabold px-4 py-1.5 inline-block rounded-br-xl">Satuan Terkecil</div>
                        <div class="p-4 pt-3 flex justify-between items-start">
                            <div>
                                <h4 class="font-extrabold text-base text-gray-900" id="card-ms-smallest-name">pcs</h4>
                                <div class="grid grid-cols-2 gap-8 mt-3">
                                    <div><p class="text-[10px] font-semibold text-gray-400">Jumlah</p><p class="text-sm font-extrabold text-gray-900">1</p></div>
                                    <div><p class="text-[10px] font-semibold text-gray-400">Harga</p><p class="text-sm font-extrabold text-gray-900" id="card-ms-smallest-price">Rp 0</p></div>
                                </div>
                            </div>
                            <div class="text-right">
                                <span class="text-[10px] font-bold text-gray-500 block mb-3" id="card-ms-smallest-barcode">-</span>
                                <button onclick="openEditSmallestUnitModal()" type="button" class="text-emerald-600 hover:text-emerald-800 text-xl bg-emerald-50 w-8 h-8 rounded flex items-center justify-center transition"><i class="fa-solid fa-pen text-sm"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-3 pt-4 border-t border-gray-100">
                        <h4 class="font-extrabold text-sm text-gray-900">Tipe Satuan Lainnya</h4>
                        <div id="container-ms-other-cards" class="space-y-3"></div>
                        <div class="flex justify-end pt-2">
                            <button onclick="openAddOtherUnitModal()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-3 px-6 rounded-full shadow-md flex items-center space-x-2 transition uppercase">
                                <i class="fa-solid fa-plus"></i><span>Tambah Satuan</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="footer-ms-save-btn" class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10 hidden">
                <button onclick="finishMultisatuanView()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">SIMPAN</button>
            </div>
        </div>

        <div id="view-tier-pricing" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="px-4 py-3 bg-emerald-600 text-white flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-4">
                    <button onclick="closeTierPricingView()" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold tracking-wide">Tambah Tipe Harga</h2>
                </div>
                <button onclick="saveTierPricingAndReturn()" class="w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center justify-center text-lg font-bold transition">
                    <i class="fa-solid fa-check"></i>
                </button>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-5">
                <div class="space-y-1.5">
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nama Tipe Harga</label>
                    <div class="flex items-center space-x-2">
                        <input type="text" id="input-tier-name" placeholder="Grosir, eceran..." class="flex-1 border border-gray-300 p-3.5 px-4 rounded-full text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                        <button onclick="openSelectCustomerTypeModal()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3.5 px-5 rounded-full flex items-center space-x-2 transition flex-shrink-0 shadow-sm">
                            <i class="fa-regular fa-id-badge text-sm"></i><span>Tipe Pelanggan</span>
                        </button>
                    </div>
                    <div id="badge-tier-customer-status" class="hidden items-center space-x-2 text-[10px] text-emerald-700 font-bold pt-2 px-2 bg-emerald-50 rounded py-1.5 w-max border border-emerald-100">
                        <i class="fa-solid fa-circle-check text-emerald-600"></i><span>Terhubung ke tipe pelanggan</span>
                    </div>
                </div>
                <div class="pt-4 border-t border-gray-100 space-y-4">
                    <div class="flex justify-between items-center">
                        <h4 class="font-extrabold text-sm text-gray-900">Daftar Tipe Harga</h4>
                        <button onclick="openAddPriceStepModal()" type="button" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold py-2.5 px-4 rounded-full flex items-center space-x-2 transition border border-emerald-200">
                            <i class="fa-solid fa-plus text-sm"></i><span>Tambah Level</span>
                        </button>
                    </div>
                    <div id="empty-state-tier-pricing" class="py-20 text-center text-xs font-semibold text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-300">Belum Ada Tipe Harga</div>
                    <div id="container-tier-pricing-rows" class="space-y-3 hidden"></div>
                </div>
            </div>
        </div>
    `;

    // Pasang ke DOM
    const wsContainer = document.getElementById('workspace-container');
    if (wsContainer) wsContainer.insertAdjacentHTML('beforeend', viewsHTML);


    // ========================================================================
    // 3. STATE & LOGIKA JAVASCRIPT FORM TAMBAH BARANG LENGKAP
    // ========================================================================
    let photoTargetForm = 'add';
    let categoryTargetForm = 'add';
    let multisatuanTargetForm = 'add';
    let livePhotoStream = null;
    let discountMode = 'pct';
    let advancedFieldsVisible = false; // Default tertutup sesuai SS klasik

    window.currentPackageItems = [];
    let tempPackageItemSelection = null;
    window.currentVariantGroups = [{ name: 'Varian-1', options: [] }];
    window.currentVariantConfig = [];
    window.multisatuanSmallest = null;
    window.multisatuanOthers = [];
    let editingOtherUnitIndex = -1;
    window.savedPriceTiers = [];
    let editingTierIndex = -1;
    let tempTierSteps = [];
    let selectedCustomerType = '';
    let editingPriceStepIndex = -1;

    // VARIABLE PENANDA BACK RETURN MENU (CONTEXTUAL RETURN)
    window.productFormReturnView = 'view-products'; 

    window.openAddProductView = () => {
        document.querySelectorAll('.view-panel').forEach(p => p.classList.add('hidden'));
        document.getElementById('view-add-product').classList.remove('hidden');

        document.getElementById('add-name').value = '';
        document.getElementById('add-type').value = 'Default';
        document.getElementById('add-chk-transaksi').checked = true;
        document.getElementById('add-chk-pakai-stok').checked = true;
        document.getElementById('add-stock').value = '0';
        document.getElementById('add-stock').disabled = false;
        document.getElementById('add-sku').value = '';
        document.getElementById('add-buyprice').value = '0';
        document.getElementById('add-price').value = '0';
        document.getElementById('add-category').value = 'Umum';
        document.getElementById('disp-selected-category').innerText = 'Umum';
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
        
        // Reset Accordion
        advancedFieldsVisible = false;
        document.getElementById('add-product-advanced-fields').classList.add('hidden');
        document.getElementById('label-toggle-advanced').innerText = "Tampilkan lebih banyak";
        document.getElementById('icon-toggle-advanced').className = "fa-solid fa-chevron-down text-[10px]";
    };

    window.closeAddProductView = () => {
        document.getElementById('view-add-product').classList.add('hidden');
        // KEMBALI SECARA KONTEKSTUAL (Sesuai asal menu)
        const retView = document.getElementById(window.productFormReturnView);
        if(retView) {
            retView.classList.remove('hidden');
        } else {
            // Fallback
            document.getElementById('view-products').classList.remove('hidden');
        }
        
        // Bersihkan state contextual
        window.productFormReturnView = 'view-products';
    };

    window.toggleAddStockInputState = () => {
        const useStk = document.getElementById('add-chk-pakai-stok').checked;
        const stkInput = document.getElementById('add-stock');
        stkInput.disabled = !useStk;
        stkInput.className = useStk
            ? "w-full border border-gray-300 p-3.5 px-4 rounded-full text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-600 bg-white"
            : "w-full border border-gray-200 p-3.5 px-4 rounded-full text-sm font-bold bg-gray-100 text-gray-400";
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

    // --- KAMERA & FOTO ---
    window.openLivePhotoCamera = async (target = 'add') => {
        // [Fungsi kamera tetap utuh tidak berubah]
        photoTargetForm = target;
        document.getElementById('view-live-camera').classList.remove('hidden');
        const video = document.getElementById('live-camera-feed');
        try {
            livePhotoStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: "environment" }, width: { ideal: 1024 }, height: { ideal: 1024 } }
            });
            video.srcObject = livePhotoStream;
        } catch (err) {
            alert("Tidak dapat mengakses kamera perangkat secara langsung.");
            window.closeLivePhotoCamera();
        }
    };
    window.closeLivePhotoCamera = () => {
        if (livePhotoStream) { livePhotoStream.getTracks().forEach(t => t.stop()); livePhotoStream = null; }
        document.getElementById('view-live-camera').classList.add('hidden');
    };
    window.captureLivePhoto = () => {
        const video = document.getElementById('live-camera-feed');
        const canvas = document.createElement('canvas');
        const maxSide = 600;
        let w = video.videoWidth || 600, h = video.videoHeight || 600;
        if (w > maxSide || h > maxSide) {
            if (w > h) { h = Math.round((h * maxSide) / w); w = maxSide; }
            else { w = Math.round((w * maxSide) / h); h = maxSide; }
        }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(video, 0, 0, w, h);

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
        input.value = ''; input.click();
    };
    window.handleGalleryPick = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (file.size > 100 * 1024) {
            alert(`Ukuran gambar (${(file.size / 1024).toFixed(1)} KB) melebihi batas 100KB.`);
            event.target.value = ''; return;
        }
        const reader = new FileReader();
        reader.onload = (e) => applyCapturedOrPickedImage(e.target.result, file.size);
        reader.readAsDataURL(file);
    };
    function applyCapturedOrPickedImage(dataUrl, byteSize) {
        const sizeKB = (byteSize / 1024).toFixed(1);
        if (photoTargetForm === 'edit') {
            const editPreview = document.getElementById('edit-full-img-preview');
            const editBase64 = document.getElementById('edit-full-image-base64');
            if (editBase64) editBase64.value = dataUrl;
            if (editPreview) { editPreview.src = dataUrl; editPreview.classList.remove('hidden'); }
            document.getElementById('edit-full-img-placeholder')?.classList.add('hidden');
        } else {
            document.getElementById('add-prod-image-base64').value = dataUrl;
            const preview = document.getElementById('add-prod-img-preview');
            preview.src = dataUrl; preview.classList.remove('hidden');
            document.getElementById('add-prod-img-placeholder').classList.add('hidden');
            document.getElementById('btn-clear-add-photo').classList.remove('hidden');
            const info = document.getElementById('add-prod-img-size-info');
            info.innerText = `Size: ${sizeKB} KB`; info.classList.remove('hidden');
        }
    }
    window.clearAddProductPhoto = () => {
        document.getElementById('add-prod-image-base64').value = '';
        const preview = document.getElementById('add-prod-img-preview');
        preview.src = ''; preview.classList.add('hidden');
        document.getElementById('add-prod-img-placeholder').classList.remove('hidden');
        document.getElementById('btn-clear-add-photo').classList.add('hidden');
        document.getElementById('add-prod-img-size-info').classList.add('hidden');
    };

    // --- AUTO SKU ---
    window.generateSequentialBarcode = () => {
        let maxNum = 0;
        (window.products || []).forEach(p => {
            const code = (p.sku || '').trim();
            if (/^\d+$/.test(code)) {
                const n = parseInt(code, 10);
                if (n > maxNum) maxNum = n;
            }
        });
        document.getElementById('add-sku').value = (maxNum + 1).toString().padStart(9, '0');
    };

    // --- KALKULATOR MARKUP MARGIN & DISKON ---
    window.calculateMarginMarkup = () => {
        const buy = Number(document.getElementById('add-buyprice').value) || 0;
        const sell = Number(document.getElementById('add-price').value) || 0;
        let markup = 0, margin = 0;
        if (buy > 0) markup = ((sell - buy) / buy) * 100;
        if (sell > 0) margin = ((sell - buy) / sell) * 100;
        document.getElementById('disp-markup-val').innerText = `${Number(markup.toFixed(2))}%`;
        document.getElementById('disp-margin-val').innerText = `${Number(margin.toFixed(2))}%`;
    };
    window.setDiscountType = (type) => {
        discountMode = type;
        const btnPct = document.getElementById('btn-disc-pct');
        const btnRp = document.getElementById('btn-disc-rp');
        if (type === 'pct') {
            btnPct.className = "px-5 py-3 text-xs font-extrabold bg-emerald-600 text-white transition";
            btnRp.className = "px-5 py-3 text-xs font-extrabold text-emerald-600 transition";
        } else {
            btnRp.className = "px-5 py-3 text-xs font-extrabold bg-emerald-600 text-white transition";
            btnPct.className = "px-5 py-3 text-xs font-extrabold text-emerald-600 transition";
        }
    };

    // --- FUNGSI TIPE BARANG & DROPDOWN ---
    window.handleProductTypeChange = (val) => {
        // [Fungsi routing UI jenis barang tetap sama]
        const cPaket = document.getElementById('container-type-paket');
        const cVarian = document.getElementById('container-type-varian');
        const cMulti = document.getElementById('container-type-multisatuan');
        const noteAddon = document.getElementById('note-addon-info');
        const noteAddonDisc = document.getElementById('note-addon-discount-disabled');
        const discInput = document.getElementById('add-discount-val');
        const stockInput = document.getElementById('add-stock');

        cPaket.classList.add('hidden'); cVarian.classList.add('hidden'); cMulti.classList.add('hidden');
        noteAddon.classList.add('hidden'); noteAddonDisc.classList.add('hidden');
        discInput.disabled = false; stockInput.readOnly = false;

        if (val === 'Bahan Baku') document.getElementById('modal-bahan-baku-info').classList.remove('hidden');
        else if (val === 'Paket') { cPaket.classList.remove('hidden'); window.renderPackageDetailsCard(); }
        else if (val === 'Varian') { cVarian.classList.remove('hidden'); stockInput.readOnly = true; window.renderVariantDetailsCard(); }
        else if (val === 'Multisatuan') { cMulti.classList.remove('hidden'); window.renderMultisatuanDetailsCard(); }
        else if (val === 'Add On') { noteAddon.classList.remove('hidden'); noteAddonDisc.classList.remove('hidden'); discInput.value = '0'; discInput.disabled = true; }
    };

    // --- PENYIMPANAN DATA BARANG FINAL KE FIREBASE ---
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
            buyPrice, price, stock, category, type,
            packageItems: window.currentPackageItems || [],
            variantGroups: window.currentVariantGroups || [],
            variants: window.currentVariantConfig || [],
            multisatuanSmallest: window.multisatuanSmallest || null,
            multisatuanOthers: window.multisatuanOthers || [],
            priceTiers: window.savedPriceTiers || [],
            priceTierConfig: window.savedPriceTiers && window.savedPriceTiers.length > 0 ? window.savedPriceTiers[0] : null,
            showTransaction, useStock, minStock, weight, unit,
            discountVal, discountType: discountMode, rack, notes, image,
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
            
            // REFRESH DATA & KEMBALI KONTEKSTUAL
            if (window.loadInitialData) await window.loadInitialData(); // Load ke memori RAM global
            
            // Render ulang module terkait jika ada
            if(window.renderInventoryCards) window.renderInventoryCards(window.products);
            if(window.renderPembelianProductList) window.renderPembelianProductList();
            if(window.renderPosProductList) window.renderPosProductList();

            window.closeAddProductView(); // Ini akan memanggil return contextual di atas
        } catch (err) {
            console.error(err);
            alert("Gagal menyimpan barang ke database.");
        }
    };

    // SEMUA FUNGSI LAINNYA (Varian, Multisatuan, Tipe Harga dll) TETAP SAMA KARENA TIDAK ADA BUG DI SANA
    // Fungsi-fungsi tersebut diasumsikan diletakkan di bawah sini sama persis seperti file sebelumnya
    // (Untuk menghemat batas chat, logika modul sub-item tidak saya copy-paste ulang karena isinya sama, 
    // pastikan kamu TIDAK MENGHAPUS fungsi-fungsi window.openVariantWizardStep1, dll yang ada di bawah file aslimu)

})();
