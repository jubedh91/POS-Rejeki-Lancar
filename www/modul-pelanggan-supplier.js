// ============================================================================
// MODUL 9: PELANGGAN, TIPE PELANGGAN, SUPPLIER, & SINKRONISASI CLOUD
// (FIX: UI KLASIK & INTEGRASI MEMORI GLOBAL)
// ============================================================================

(function() {
    // 1. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- === 1. HALAMAN MENU UTAMA PELANGGAN DAN SUPPLIER === -->
        <div id="view-pelanggan" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-20">
            <div class="px-4 py-3 bg-emerald-600 border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="switchView('manajemen-hub')" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-white tracking-wide">Pelanggan dan Supplier</h2>
            </div>

            <div class="divide-y divide-gray-100">
                <div onclick="openMainPelangganListView()" class="p-4 bg-white flex items-center space-x-4 hover:bg-emerald-50 cursor-pointer transition">
                    <div class="w-10 h-10 flex items-center justify-center text-emerald-600 text-2xl"><i class="fa-regular fa-id-card"></i></div>
                    <span class="font-bold text-sm text-gray-900">Pelanggan</span>
                </div>
                <div onclick="openMainTipePelangganView()" class="p-4 bg-white flex items-center justify-between hover:bg-emerald-50 cursor-pointer transition">
                    <div class="flex items-center space-x-4">
                        <div class="w-10 h-10 flex items-center justify-center text-emerald-600 text-2xl"><i class="fa-regular fa-id-badge"></i></div>
                        <span class="font-bold text-sm text-gray-900">Tipe Pelanggan</span>
                    </div>
                </div>
                <div onclick="openMainSupplierListView()" class="p-4 bg-white flex items-center space-x-4 hover:bg-emerald-50 cursor-pointer transition">
                    <div class="w-10 h-10 flex items-center justify-center text-emerald-600 text-2xl"><i class="fa-solid fa-truck-field"></i></div>
                    <span class="font-bold text-sm text-gray-900">Supplier</span>
                </div>
            </div>
        </div>

        <!-- === 2. HALAMAN DAFTAR PELANGGAN === -->
        <div id="view-main-pelanggan-list" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-30">
            <div class="px-4 py-3 bg-emerald-600 border-b flex items-center space-x-3 shadow-sm z-20">
                <button onclick="switchView('pelanggan')" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-white tracking-wide">Pelanggan</h2>
            </div>

            <div class="p-3 bg-white border-b flex items-center space-x-2 relative z-20 shadow-xs">
                <div class="relative">
                    <button onclick="toggleMainPelangganSortDropdown()" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                    <div id="dropdown-main-pelanggan-sort" class="absolute left-0 top-10 w-52 bg-white rounded-md shadow-2xl border border-gray-200 py-1.5 hidden z-50 text-xs font-bold text-gray-900">
                        <button onclick="applyMainPelangganSort('name')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block border-b border-gray-50">Nama</button>
                        <button onclick="applyMainPelangganSort('email')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block border-b border-gray-50">Email</button>
                        <button onclick="applyMainPelangganSort('trx')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Jumlah Transaksi</button>
                    </div>
                </div>
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" id="input-main-pelanggan-search" oninput="renderMainPelangganList(this.value)" placeholder="Nama, email atau no telp" class="w-full pl-10 pr-4 py-2 border border-emerald-600 rounded-full text-xs text-gray-900 focus:outline-none">
                </div>
                <button onclick="if(window.openScannerView) window.openScannerView('customer-list-search')" class="text-emerald-700 text-2xl px-2"><i class="fa-solid fa-barcode"></i></button>
            </div>

            <div class="flex-1 overflow-y-auto divide-y divide-gray-100 pb-28 bg-gray-50" id="container-main-pelanggan-rows" onclick="hideMainPelangganSortDropdown()"></div>

            <div class="p-3 bg-white border-t absolute bottom-0 left-0 right-0 z-10 text-center space-y-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <span class="text-[11px] font-bold text-gray-500 block uppercase tracking-wider">Tambah Pelanggan</span>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="openContactPickerView('pelanggan')" type="button" class="bg-amber-400 hover:bg-amber-500 text-white font-bold py-3.5 rounded-full text-xs shadow-sm transition">Dari Kontak</button>
                    <button onclick="openFormTambahPelangganManual()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full text-xs shadow-sm transition">Manual</button>
                </div>
            </div>
        </div>

        <!-- === 3. HALAMAN PILIH DARI KONTAK TELEPON === -->
        <div id="view-contact-picker" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="px-4 py-3 bg-emerald-600 border-b flex items-center space-x-3 shadow-sm z-10 text-white">
                <button onclick="closeContactPickerView()" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold tracking-wide" id="contact-picker-header-title">Tambah Pelanggan</h2>
            </div>
            <div class="p-3 bg-white space-y-3 border-b shadow-xs">
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><i class="fa-solid fa-search text-base"></i></span>
                    <input type="text" id="input-contact-picker-search" oninput="renderContactPickerList(this.value)" placeholder="Cari Nama" class="w-full pl-10 pr-4 py-2 border border-emerald-600 rounded-full text-xs text-gray-900 focus:outline-none">
                </div>
                <button onclick="openManualFormFromContactPicker()" type="button" id="btn-contact-picker-manual" class="w-full border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold py-3.5 rounded-full text-xs transition">
                    Tambah Manual
                </button>
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-100 bg-gray-50" id="container-contact-picker-rows"></div>
        </div>

        <!-- === 4. HALAMAN FORM TAMBAH PELANGGAN MANUAL === -->
        <div id="view-form-tambah-pelanggan" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="px-4 py-3 bg-emerald-600 flex items-center space-x-3 z-10 text-white shadow-sm">
                <button onclick="closeFormTambahPelangganManual()" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold tracking-wide">Tambah Manual</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
                <div class="flex flex-col items-center justify-center pb-2">
                    <div class="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-gray-300 text-5xl shadow-inner border border-gray-200">
                        <i class="fa-solid fa-user"></i>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nama Panggilan<span class="text-red-500">*</span></label>
                    <input type="text" id="form-add-cust-name" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Poin</label>
                    <input type="number" id="form-add-cust-points" value="0" readonly class="w-full bg-slate-100 border border-transparent p-3.5 px-4 rounded-full text-xs font-bold text-gray-500 focus:outline-none">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Kode Pelanggan</label>
                    <div class="flex items-center space-x-2">
                        <input type="text" id="form-add-cust-code" class="flex-1 border border-gray-300 p-3.5 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm">
                        <button onclick="if(window.openScannerView) window.openScannerView('add-customer-code')" type="button" class="w-11 h-11 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl transition hover:bg-emerald-100 border border-emerald-100"><i class="fa-solid fa-barcode"></i></button>
                    </div>
                    <label class="flex items-center space-x-2.5 mt-3 cursor-pointer pl-1">
                        <input type="checkbox" id="chk-auto-cust-code" onchange="toggleAutoCustomerCode(this.checked)" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                        <span class="text-xs font-bold text-gray-700">Buat otomatis kode pelanggan</span>
                    </label>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                    <input type="email" id="form-add-cust-email" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Telepon</label>
                    <input type="text" id="form-add-cust-phone" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm" pattern="[0-9]*" inputmode="numeric">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Alamat</label>
                    <input type="text" id="form-add-cust-address" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Tipe Pelanggan</label>
                    <div class="relative">
                        <select id="form-add-cust-tier" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-xs font-bold text-gray-900 bg-white appearance-none focus:outline-none shadow-sm"></select>
                        <span class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500"><i class="fa-solid fa-chevron-down text-xs"></i></span>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="submitFormTambahPelangganManual()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">SIMPAN</button>
            </div>
        </div>

        <!-- === 5. HALAMAN DAFTAR SUPPLIER === -->
        <div id="view-main-supplier-list" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-30">
            <div class="px-4 py-3 bg-emerald-600 border-b flex items-center justify-between shadow-sm z-20 text-white">
                <div class="flex items-center space-x-3">
                    <button onclick="switchView('pelanggan')" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold tracking-wide">Supplier</h2>
                </div>
                <button onclick="openCloudSyncView()" class="text-white hover:text-emerald-200 text-xl p-1 transition" title="Sinkronisasi Data Cloud"><i class="fa-solid fa-arrows-rotate"></i></button>
            </div>

            <div class="p-3 bg-white border-b flex items-center space-x-2 relative z-20 shadow-xs">
                <button onclick="toggleMainSupplierSortOrder()" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" id="input-main-supplier-search" oninput="renderMainSupplierList(this.value)" placeholder="Nama, email atau no telp" class="w-full pl-10 pr-4 py-2 border border-emerald-600 rounded-full text-xs text-gray-900 focus:outline-none">
                </div>
            </div>

            <div class="flex-1 overflow-y-auto divide-y divide-gray-100 pb-28 bg-gray-50" id="container-main-supplier-rows"></div>

            <div class="p-3 bg-white border-t absolute bottom-0 left-0 right-0 z-10 text-center space-y-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <span class="text-[11px] font-bold text-gray-500 block uppercase tracking-wider">Tambah Supplier</span>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="openContactPickerView('supplier')" type="button" class="bg-amber-400 hover:bg-amber-500 text-white font-bold py-3.5 rounded-full text-xs shadow-sm transition">Dari Kontak</button>
                    <button onclick="openFormTambahSupplierManual()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full text-xs shadow-sm transition">Manual</button>
                </div>
            </div>
        </div>

        <!-- === 6. HALAMAN FORM TAMBAH SUPPLIER MANUAL === -->
        <div id="view-form-tambah-supplier" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="px-4 py-3 bg-emerald-600 flex items-center space-x-3 z-10 text-white shadow-sm">
                <button onclick="closeFormTambahSupplierManual()" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold tracking-wide">Tambah Supplier</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
                <div class="flex flex-col items-center justify-center pb-2">
                    <div class="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-gray-300 text-5xl shadow-inner border border-gray-200">
                        <i class="fa-solid fa-truck-field"></i>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nama<span class="text-red-500">*</span></label>
                    <input type="text" id="form-add-sup-name" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                    <input type="email" id="form-add-sup-email" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Telepon</label>
                    <input type="text" id="form-add-sup-phone" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm" pattern="[0-9]*" inputmode="numeric">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Alamat</label>
                    <input type="text" id="form-add-sup-address" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm">
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="submitFormTambahSupplierManual()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">SIMPAN</button>
            </div>
        </div>

        <!-- === 7. HALAMAN TIPE PELANGGAN UTAMA & EDIT === -->
        <div id="view-main-tipe-pelanggan" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-30">
            <div class="px-4 py-3 bg-emerald-600 border-b flex items-center space-x-3 shadow-sm z-10 text-white">
                <button onclick="switchView('pelanggan')" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold tracking-wide">Tipe Pelanggan</h2>
            </div>
            <div class="flex-1 overflow-y-auto p-4 pb-28 space-y-4 bg-gray-50">
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"><i class="fa-solid fa-search text-base"></i></span>
                    <input type="text" id="input-search-tipe-pelanggan" oninput="renderMainTipePelangganCards(this.value)" placeholder="Cari tipe pelanggan" class="w-full pl-11 pr-4 py-3 border border-emerald-600 rounded-full text-xs font-bold text-gray-900 focus:outline-none shadow-sm">
                </div>
                <div id="container-main-tipe-pelanggan-cards" class="space-y-4 pt-2"></div>
            </div>
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="openAddTipePelangganScreen()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">TAMBAH TIPE PELANGGAN</button>
            </div>
        </div>

        <div id="view-add-tipe-pelanggan-screen" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="px-4 py-3 bg-emerald-600 border-b flex items-center space-x-3 shadow-sm z-10 text-white">
                <button onclick="closeAddTipePelangganScreen()" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold tracking-wide">Tipe Pelanggan Baru</h2>
            </div>
            <div class="flex-1 p-4 space-y-5 bg-white">
                <div>
                    <label class="block text-xs font-semibold text-gray-500 mb-1.5">Nama Tipe Pelanggan</label>
                    <input type="text" id="input-new-tier-screen-name" class="w-full border border-emerald-600 p-3.5 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none shadow-sm">
                </div>
                <button onclick="saveNewTipePelangganFromScreen()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-md transition text-xs uppercase tracking-wider">SIMPAN</button>
            </div>
        </div>
    `;

    // Pasang ke DOM
    const wsContainer = document.getElementById('workspace-container');
    if (wsContainer) wsContainer.insertAdjacentHTML('beforeend', viewsHTML);

    // ========================================================================
    // LOGIKA DASAR (STATE)
    // ========================================================================
    const phoneBookContacts = [
        { name: "Agus Prasetyo", sub: "+62 812-3367-7719", rawPhone: "81233677719" },
        { name: "Budi Santoso", sub: "+62 821-4758-8319", rawPhone: "82147588319" },
        { name: "CV Maju Bersama", sub: "0341-599123", rawPhone: "0341599123" }
    ];

    let mainPelangganSortBy = 'name'; 
    let mainSupplierSortAsc = true;
    let contactPickerTarget = 'pelanggan'; 

    // --- ALUR PELANGGAN ---
    window.openMainPelangganListView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-main-pelanggan-list').classList.remove('hidden');
        window.renderMainPelangganList('');
    };

    window.toggleMainPelangganSortDropdown = () => document.getElementById('dropdown-main-pelanggan-sort').classList.toggle('hidden');
    window.hideMainPelangganSortDropdown = () => document.getElementById('dropdown-main-pelanggan-sort')?.classList.add('hidden');
    window.applyMainPelangganSort = (mode) => { mainPelangganSortBy = mode; window.hideMainPelangganSortDropdown(); window.renderMainPelangganList(document.getElementById('input-main-pelanggan-search').value); };

    window.renderMainPelangganList = function(keyword = '') {
        const container = document.getElementById('container-main-pelanggan-rows');
        if (!container) return;
        container.innerHTML = '';
        const k = (keyword || '').toLowerCase();
        
        let list = [...(window.customersList || [])].filter(c => (c.name || '').toLowerCase().includes(k) || (c.phone || '').toLowerCase().includes(k));
        list.sort((a, b) => mainPelangganSortBy === 'name' ? (a.name || '').localeCompare(b.name || '') : 0);

        list.forEach(c => {
            container.innerHTML += `
                <div class="p-4 bg-white flex items-center justify-between hover:bg-emerald-50 cursor-pointer transition">
                    <div class="flex items-center space-x-3.5 min-w-0 pr-3">
                        <div class="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-gray-500 font-bold text-sm shadow-inner">${c.avatarCode || 'PL'}</div>
                        <div class="min-w-0">
                            <h4 class="font-bold text-sm text-gray-900 truncate">${c.name}</h4>
                            <p class="text-[11px] text-gray-500 font-semibold mt-0.5">${c.phone || '-'}</p>
                        </div>
                    </div>
                    <span class="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 shadow-xs">${c.points || 0} Poin</span>
                </div>
            `;
        });
    };

    // --- TAMBAH MANUAL & KONTAK ---
    window.openContactPickerView = (target = 'pelanggan') => {
        contactPickerTarget = target;
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-contact-picker').classList.remove('hidden');
        document.getElementById('contact-picker-header-title').innerText = target === 'supplier' ? "Tambah Supplier" : "Tambah Pelanggan";
        window.renderContactPickerList('');
    };

    window.closeContactPickerView = () => {
        document.getElementById('view-contact-picker').classList.add('hidden');
        document.getElementById(contactPickerTarget === 'supplier' ? 'view-main-supplier-list' : 'view-main-pelanggan-list').classList.remove('hidden');
    };

    window.renderContactPickerList = function(keyword = '') {
        const container = document.getElementById('container-contact-picker-rows');
        container.innerHTML = '';
        const k = keyword.toLowerCase();
        phoneBookContacts.filter(ct => ct.name.toLowerCase().includes(k)).forEach((ct, idx) => {
            container.innerHTML += `
                <div onclick="selectPhoneBookContact(${idx})" class="px-4 py-3.5 bg-white hover:bg-emerald-50 cursor-pointer transition">
                    <h4 class="font-bold text-sm text-gray-900">${ct.name}</h4>
                    <p class="text-[11px] text-gray-500 mt-0.5 font-medium">${ct.sub}</p>
                </div>
            `;
        });
    };

    window.selectPhoneBookContact = (idx) => {
        const ct = phoneBookContacts[idx];
        if (contactPickerTarget === 'supplier') window.openFormTambahSupplierManual(ct.name, ct.rawPhone);
        else window.openFormTambahPelangganManual(ct.name, ct.rawPhone);
    };

    window.openManualFormFromContactPicker = () => {
        if (contactPickerTarget === 'supplier') window.openFormTambahSupplierManual();
        else window.openFormTambahPelangganManual();
    };

    window.openFormTambahPelangganManual = (prefillName = '', prefillPhone = '') => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-form-tambah-pelanggan').classList.remove('hidden');
        document.getElementById('form-add-cust-name').value = prefillName;
        document.getElementById('form-add-cust-phone').value = prefillPhone;
        
        const tierSel = document.getElementById('form-add-cust-tier');
        tierSel.innerHTML = `<option value="-">Pilih Tipe Pelanggan</option>`;
        (window.masterCustomerTypes || []).forEach(t => tierSel.innerHTML += `<option value="${t}">${t}</option>`);
    };

    window.closeFormTambahPelangganManual = () => {
        document.getElementById('view-form-tambah-pelanggan').classList.add('hidden');
        document.getElementById('view-main-pelanggan-list').classList.remove('hidden');
    };

    window.toggleAutoCustomerCode = (checked) => {
        const codeInput = document.getElementById('form-add-cust-code');
        if (checked) codeInput.value = `PLG-${Date.now().toString().slice(-6)}`;
        else codeInput.value = '';
    };

    window.submitFormTambahPelangganManual = () => {
        const name = document.getElementById('form-add-cust-name').value.trim();
        if (!name) return alert("Nama panggilan wajib diisi!");
        
        window.customersList.unshift({
            id: 'cust_' + Date.now(),
            avatarCode: name.substring(0, 2).toUpperCase(),
            name,
            code: document.getElementById('form-add-cust-code').value.trim(),
            points: 0,
            tier: document.getElementById('form-add-cust-tier').value,
            email: document.getElementById('form-add-cust-email').value.trim(),
            phone: document.getElementById('form-add-cust-phone').value.trim(),
            address: document.getElementById('form-add-cust-address').value.trim(),
            piutangList: []
        });

        alert("Data pelanggan berhasil disimpan!");
        window.closeFormTambahPelangganManual();
        window.renderMainPelangganList('');
    };

    // --- ALUR TIPE PELANGGAN ---
    window.openMainTipePelangganView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-main-tipe-pelanggan').classList.remove('hidden');
        window.renderMainTipePelangganCards('');
    };

    window.renderMainTipePelangganCards = function(keyword = '') {
        const container = document.getElementById('container-main-tipe-pelanggan-cards');
        if (!container) return;
        container.innerHTML = '';
        const k = (keyword || '').toLowerCase();
        const list = (window.masterCustomerTypes || ['gold']).filter(t => t.toLowerCase().includes(k));

        list.forEach(tier => {
            const countCust = (window.customersList || []).filter(c => (c.tier || '').toLowerCase() === tier.toLowerCase()).length;
            container.innerHTML += `
                <div class="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-xs hover:border-emerald-500 transition">
                    <div class="p-4 space-y-2">
                        <h4 class="font-extrabold text-sm text-gray-900">${tier}</h4>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-500 font-medium">Jumlah Pelanggan</span>
                            <span class="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">${countCust}</span>
                        </div>
                    </div>
                </div>
            `;
        });
    };

    window.openAddTipePelangganScreen = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-add-tipe-pelanggan-screen').classList.remove('hidden');
    };
    window.closeAddTipePelangganScreen = () => {
        document.getElementById('view-add-tipe-pelanggan-screen').classList.add('hidden');
        document.getElementById('view-main-tipe-pelanggan').classList.remove('hidden');
    };
    window.saveNewTipePelangganFromScreen = () => {
        const name = document.getElementById('input-new-tier-screen-name').value.trim();
        if (!name) return alert("Masukkan nama Tipe Pelanggan!");
        if (!window.masterCustomerTypes) window.masterCustomerTypes = [];
        window.masterCustomerTypes.push(name);
        window.closeAddTipePelangganScreen();
        window.renderMainTipePelangganCards('');
    };

    // --- ALUR SUPPLIER ---
    window.openMainSupplierListView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-main-supplier-list').classList.remove('hidden');
        window.renderMainSupplierList('');
    };

    window.toggleMainSupplierSortOrder = () => { mainSupplierSortAsc = !mainSupplierSortAsc; window.renderMainSupplierList(document.getElementById('input-main-supplier-search').value); };

    window.renderMainSupplierList = function(keyword = '') {
        const container = document.getElementById('container-main-supplier-rows');
        if (!container) return;
        container.innerHTML = '';
        const k = (keyword || '').toLowerCase();
        
        let list = [...(window.suppliersList || [])].filter(s => (s.name || '').toLowerCase().includes(k) || (s.phone || '').toLowerCase().includes(k));
        list.sort((a, b) => mainSupplierSortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

        list.forEach(s => {
            container.innerHTML += `
                <div class="p-4 bg-white flex items-center space-x-4 hover:bg-emerald-50 cursor-pointer transition">
                    <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-gray-500 font-bold text-sm shadow-inner">${s.avatarCode || 'SP'}</div>
                    <div class="min-w-0 flex-1">
                        <h4 class="font-bold text-sm text-gray-900 truncate">${s.name}</h4>
                        <p class="text-[11px] text-gray-500 font-medium mt-0.5">${s.phone || '-'}</p>
                    </div>
                </div>
            `;
        });
    };

    window.openFormTambahSupplierManual = (prefillName = '', prefillPhone = '') => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-form-tambah-supplier').classList.remove('hidden');
        document.getElementById('form-add-sup-name').value = prefillName;
        document.getElementById('form-add-sup-phone').value = prefillPhone;
    };

    window.closeFormTambahSupplierManual = () => {
        document.getElementById('view-form-tambah-supplier').classList.add('hidden');
        document.getElementById('view-main-supplier-list').classList.remove('hidden');
    };

    window.submitFormTambahSupplierManual = () => {
        const name = document.getElementById('form-add-sup-name').value.trim();
        if (!name) return alert("Nama supplier wajib diisi!");
        
        window.suppliersList.unshift({
            id: 'sup_' + Date.now(),
            avatarCode: name.substring(0, 2).toUpperCase(),
            name,
            email: document.getElementById('form-add-sup-email').value.trim(),
            phone: document.getElementById('form-add-sup-phone').value.trim(),
            address: document.getElementById('form-add-sup-address').value.trim(),
            debts: []
        });

        alert("Data supplier berhasil disimpan!");
        window.closeFormTambahSupplierManual();
        window.renderMainSupplierList('');
    };

})();
