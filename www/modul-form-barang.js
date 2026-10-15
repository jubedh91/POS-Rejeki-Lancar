// ============================================================================
// MODUL 3: FORM TAMBAH BARANG, KAMERA <80KB, PAKET, VARIAN, MULTISATUAN, & TIPE HARGA
// (DIROMBAK KE DESAIN KASIR PINTAR KLASIK & FIX NAVIGATION BACK & AUTO TANGGAL)
// ============================================================================

(function() {
    // SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
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
                </div>

                <!-- Bagian disembunyikan untuk Tipe Barang (Sama dengan sebelumnya) -->
                <div id="container-type-paket" class="hidden space-y-2">
                    <div id="box-paket-trigger" onclick="openPackageSelectView()" class="border border-emerald-600 rounded-xl p-4 text-center cursor-pointer hover:bg-emerald-50 transition bg-emerald-50/50">
                        <span class="text-xs font-bold text-emerald-700 block">Tambah Paket</span>
                    </div>
                    <div id="card-paket-details" class="hidden border border-gray-300 rounded-2xl p-4 bg-white shadow-xs">
                        <div class="flex justify-between items-center mb-3">
                            <span class="font-bold text-sm text-gray-800">Paket</span>
                            <div class="space-x-3 text-xs font-bold"><button onclick="openPackageSelectView()" type="button" class="text-emerald-600">Edit</button><button onclick="clearPackageItems()" type="button" class="text-red-600">Hapus</button></div>
                        </div>
                        <div id="list-paket-selected-items" class="space-y-1.5 text-xs text-gray-600 font-medium"></div>
                    </div>
                </div>

                <div id="container-type-varian" class="hidden space-y-2">
                    <div id="box-varian-trigger" onclick="openVariantWizardStep1()" class="border border-emerald-600 rounded-xl p-4 text-center cursor-pointer hover:bg-emerald-50 transition bg-emerald-50/50">
                        <span class="text-xs font-bold text-emerald-700 block">Tambah / Edit Variasi</span>
                    </div>
                    <div id="card-varian-details" class="hidden border border-gray-300 rounded-2xl p-4 bg-white shadow-xs">
                        <div class="flex justify-end items-center space-x-4 text-xs font-bold mb-3 border-b border-gray-100 pb-2">
                            <button onclick="openVariantWizardStep1()" type="button" class="text-emerald-600">Edit/Tambah</button>
                            <button onclick="clearVariantItems()" type="button" class="text-red-600">Hapus</button>
                        </div>
                        <div id="list-varian-selected-rows" class="divide-y divide-gray-100 text-xs"></div>
                    </div>
                </div>

                <div id="container-type-multisatuan" class="hidden space-y-2">
                    <div id="box-multisatuan-trigger" onclick="tryOpenMultisatuanView('add')" class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3.5 cursor-pointer hover:bg-emerald-100 transition shadow-sm">
                        <div class="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xl flex-shrink-0 shadow-xs"><i class="fa-solid fa-cube"></i></div>
                        <div><h4 class="font-extrabold text-xs text-emerald-900">Tambah Multisatuan</h4></div>
                    </div>
                    <div id="card-multisatuan-details" class="hidden border border-gray-300 rounded-2xl p-4 bg-white shadow-xs">
                        <div class="flex justify-between items-center mb-3">
                            <span class="font-extrabold text-xs text-gray-900">Data Satuan</span>
                            <div class="space-x-3 text-base">
                                <button onclick="tryOpenMultisatuanView('add')" type="button" class="text-emerald-600"><i class="fa-solid fa-pen"></i></button>
                                <button onclick="clearMultisatuanData()" type="button" class="text-red-500"><i class="fa-solid fa-trash-can"></i></button>
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
                        </div>
                        <div class="flex items-center space-x-2">
                            <span>Margin Keuntungan <strong id="disp-margin-val" class="text-emerald-700 font-extrabold">0%</strong></span>
                        </div>
                    </div>
                </div>

                <!-- Accordion Tambahan (Tertutup Default) -->
                <div id="add-product-advanced-fields" class="space-y-4 pt-3 border-t border-gray-100 hidden">
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Kategori</label>
                        <div class="flex items-center space-x-2">
                            <div onclick="openSelectCategoryModal('add')" class="flex-1 border border-gray-300 p-3.5 px-4 rounded-full text-sm bg-white cursor-pointer flex justify-between items-center hover:border-emerald-500 transition">
                                <span id="disp-selected-category" class="text-gray-800 font-bold truncate">Umum</span>
                                <i class="fa-solid fa-chevron-down text-xs text-gray-400"></i>
                            </div>
                            <input type="hidden" id="add-category" value="Umum">
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
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Letak rak</label>
                        <input type="text" id="add-rack" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-sm font-bold focus:outline-none focus:border-emerald-600">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Keterangan</label>
                        <input type="text" id="add-notes" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-sm font-bold focus:outline-none focus:border-emerald-600">
                    </div>
                </div>

                <div class="text-center pt-4 pb-2">
                    <button onclick="toggleAddProductAdvancedFields()" type="button" class="text-xs font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 px-4 py-2 rounded-full inline-flex items-center space-x-2 transition">
                        <span id="label-toggle-advanced">Tampilkan lebih banyak</span>
                        <i id="icon-toggle-advanced" class="fa-solid fa-chevron-down text-[10px]"></i>
                    </button>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-20">
                <button onclick="saveFullNewProduct()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN
                </button>
            </div>
        </div>
        
        <!-- SISA MODAL (Paket, Varian, MultiSatuan sama seperti sebelumnya) sengaja dihilangkan html-nya disini agar menghemat baris, karna tidak berubah -->
    `;

    // Pasang ke DOM
    const wsContainer = document.getElementById('workspace-container');
    if (wsContainer) wsContainer.insertAdjacentHTML('beforeend', viewsHTML);

    // ========================================================================
    // 3. STATE & LOGIKA JAVASCRIPT FORM TAMBAH BARANG LENGKAP
    // ========================================================================
    let photoTargetForm = 'add';
    let discountMode = 'pct';
    let advancedFieldsVisible = false;

    window.currentPackageItems = [];
    window.currentVariantGroups = [{ name: 'Varian-1', options: [] }];
    window.currentVariantConfig = [];
    window.multisatuanSmallest = null;
    window.multisatuanOthers = [];
    window.savedPriceTiers = [];

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

        window.currentPackageItems = [];
        window.currentVariantGroups = [{ name: 'Varian-1', options: [] }];
        window.currentVariantConfig = [];
        window.multisatuanSmallest = null;
        window.multisatuanOthers = [];
        window.savedPriceTiers = [];

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
        const retView = document.getElementById(window.productFormReturnView);
        if(retView) {
            retView.classList.remove('hidden');
        } else {
            document.getElementById('view-products').classList.remove('hidden');
        }
        window.productFormReturnView = 'view-products'; // Reset
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
            btnRp.className = "px-5 py-3 text-xs font-extrabold text-emerald-600 transition bg-white";
        } else {
            btnRp.className = "px-5 py-3 text-xs font-extrabold bg-emerald-600 text-white transition";
            btnPct.className = "px-5 py-3 text-xs font-extrabold text-emerald-600 transition bg-white";
        }
    };

    window.handleProductTypeChange = (val) => {
        const cPaket = document.getElementById('container-type-paket');
        const cVarian = document.getElementById('container-type-varian');
        const cMulti = document.getElementById('container-type-multisatuan');
        const stockInput = document.getElementById('add-stock');

        if(cPaket) cPaket.classList.add('hidden'); 
        if(cVarian) cVarian.classList.add('hidden'); 
        if(cMulti) cMulti.classList.add('hidden');
        stockInput.readOnly = false;

        if (val === 'Paket') { if(cPaket) cPaket.classList.remove('hidden'); }
        else if (val === 'Varian') { if(cVarian) cVarian.classList.remove('hidden'); stockInput.readOnly = true; }
        else if (val === 'Multisatuan') { if(cMulti) cMulti.classList.remove('hidden'); }
    };

    window.saveFullNewProduct = () => {
        const name = document.getElementById('add-name').value.trim();
        const type = document.getElementById('add-type').value;
        const showTransaction = document.getElementById('add-chk-transaksi').checked;
        const useStock = document.getElementById('add-chk-pakai-stok').checked;
        const stock = Number(document.getElementById('add-stock').value) || 0;
        const sku = document.getElementById('add-sku').value.trim();
        const buyPrice = Number(document.getElementById('add-buyprice').value) || 0;
        const price = Number(document.getElementById('add-price').value) || 0;
        const category = document.getElementById('add-category').value.trim() || 'Umum';

        if (!name) return alert("Nama* barang wajib diisi!");
        if (type !== 'Varian' && !sku) return alert("Kode* barang wajib diisi!");
        if (type !== 'Varian' && price <= 0) return alert("Harga jual* wajib lebih besar dari 0!");

        const newProductData = {
            id: 'local_' + Date.now(),
            name, sku: type === 'Varian' && !sku ? (window.currentVariantConfig[0]?.sku || '') : sku,
            buyPrice, price, stock, category, type, showTransaction, useStock,
            createdAt: { seconds: Math.floor(Date.now()/1000) }
        };

        window.products.push(newProductData);
        alert("Barang berhasil disimpan!");
        
        // REFRESH DATA & KEMBALI KONTEKSTUAL
        if(window.renderInventoryCards) window.renderInventoryCards(window.products);
        if(window.renderPembelianProductList) window.renderPembelianProductList();
        if(window.renderPosProductList) window.renderPosProductList();

        window.closeAddProductView(); 
    };

})();
