// ============================================================================
// MODUL 10: DISKON, PAJAK, PAJAK DEFAULT, BIAYA, & HUB MANAJEMEN (13 SS)
// ============================================================================

(function() {
    // 1. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- === 0. HALAMAN DAFTAR 10 MENU MANAJEMEN (SS 1000924380) === -->
        <div id="view-manajemen-hub" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3.5 bg-white border-b flex items-center justify-between shadow-xs z-10">
                <button onclick="toggleSidebar()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-bars-staggered"></i></button>
                <h2 class="text-sm font-extrabold text-emerald-600 tracking-wider uppercase">MANAJEMEN</h2>
                <div class="w-6"></div>
            </div>

            <div class="flex-1 overflow-y-auto divide-y divide-gray-100 text-xs font-bold text-gray-900">
                <div onclick="switchView('products')" class="p-4 flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-9 h-9 flex items-center justify-center text-emerald-600 text-2xl"><i class="fa-solid fa-box-open"></i></div>
                    <span>Barang atau jasa</span>
                </div>
                <div onclick="switchView('kategori')" class="p-4 flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-9 h-9 flex items-center justify-center text-emerald-600 text-2xl"><i class="fa-solid fa-border-all"></i></div>
                    <span>Kategori barang</span>
                </div>
                <div onclick="switchView('pos')" class="p-4 flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-9 h-9 flex items-center justify-center text-emerald-600 text-2xl"><i class="fa-solid fa-cart-shopping"></i></div>
                    <span>Transaksi Penjualan</span>
                </div>
                <div onclick="if(window.openManajemenStokMenuView) window.openManajemenStokMenuView(); else switchView('products');" class="p-4 flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-9 h-9 flex items-center justify-center text-emerald-600 text-2xl"><i class="fa-solid fa-dolly"></i></div>
                    <span>Manajemen stok</span>
                </div>
                <div onclick="switchView('pembelian')" class="p-4 flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-9 h-9 flex items-center justify-center text-emerald-600 text-2xl"><i class="fa-solid fa-boxes-packing"></i></div>
                    <span>Pembelian dari Supplier</span>
                </div>
                <div onclick="switchView('pelanggan')" class="p-4 flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-9 h-9 flex items-center justify-center text-emerald-600 text-2xl"><i class="fa-regular fa-id-card"></i></div>
                    <span>Pelanggan dan Supplier</span>
                </div>
                <div onclick="switchView('debts')" class="p-4 flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-9 h-9 flex items-center justify-center text-emerald-600 text-2xl"><i class="fa-solid fa-file-pen"></i></div>
                    <span>Hutang dan Piutang</span>
                </div>
                <div onclick="switchView('diskon')" class="p-4 flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-9 h-9 flex items-center justify-center text-emerald-600 text-2xl"><i class="fa-solid fa-file-invoice-dollar"></i></div>
                    <span>Diskon, Pajak, dan Biaya</span>
                </div>
                <div onclick="switchView('opname')" class="p-4 flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-9 h-9 flex items-center justify-center text-emerald-600 text-2xl"><i class="fa-solid fa-clipboard-check"></i></div>
                    <span>Stok Opname</span>
                </div>
                <div onclick="if(window.openMarketingMainView) window.openMarketingMainView(); else switchView('marketing');" class="p-4 flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-9 h-9 flex items-center justify-center text-emerald-600 text-2xl"><i class="fa-regular fa-star"></i></div>
                    <span>Marketing</span>
                </div>
            </div>
        </div>

        <!-- === 1. HALAMAN UTAMA DISKON, PAJAK, DAN BIAYA (SS 1000924442) === -->
        <div id="view-diskon" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="switchView('manajemen-hub')" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Diskon, Pajak, dan Biaya</h2>
            </div>

            <div class="divide-y divide-gray-100">
                <!-- Menu 1: Diskon -->
                <div onclick="openSubDiskonView()" class="p-4 bg-white flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-10 h-10 flex items-center justify-center text-emerald-600 text-xl">
                        <i class="fa-solid fa-percent border-2 border-emerald-600 rounded px-1.5 py-0.5 text-xs"></i>
                    </div>
                    <span class="font-bold text-sm text-gray-900">Diskon</span>
                </div>

                <!-- Menu 2: Pajak -->
                <div onclick="openSubPajakView()" class="p-4 bg-white flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-10 h-10 flex items-center justify-center text-emerald-600 text-2xl">
                        <i class="fa-solid fa-file-invoice"></i>
                    </div>
                    <span class="font-bold text-sm text-gray-900">Pajak</span>
                </div>

                <!-- Menu 3: Biaya -->
                <div onclick="openSubBiayaView()" class="p-4 bg-white flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-10 h-10 flex items-center justify-center text-emerald-600 text-2xl">
                        <i class="fa-solid fa-hand-holding-dollar"></i>
                    </div>
                    <span class="font-bold text-sm text-gray-900">Biaya</span>
                </div>
            </div>
        </div>

        <!-- === 2. HALAMAN DAFTAR DISKON (SS 1000924443 & 1000924445) === -->
        <div id="view-sub-diskon" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-20">
                <button onclick="switchView('diskon')" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Diskon</h2>
            </div>

            <!-- Baris Filter Panah (2 Pilihan) & Kotak Cari Diskon -->
            <div class="p-3 bg-white border-b flex items-center space-x-2 relative z-20">
                <div class="relative">
                    <button onclick="toggleSubDiskonSortMenu()" class="text-emerald-700 text-xl px-2 py-1 focus:outline-none">
                        <i class="fa-solid fa-arrow-up-wide-short"></i>
                    </button>
                    <!-- Dropdown 2 Pilihan: Nama & Diskon (SS 1000924445) -->
                    <div id="dropdown-sub-diskon-sort" class="absolute left-0 top-10 w-52 bg-white rounded-md shadow-2xl border border-gray-200 py-2 hidden z-50 text-xs font-medium text-gray-900">
                        <button onclick="applySubDiskonSort('name')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Nama</button>
                        <button onclick="applySubDiskonSort('amount')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Diskon</button>
                    </div>
                </div>

                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-700"><i class="fa-solid fa-search text-base"></i></span>
                    <input type="text" id="input-search-sub-diskon" oninput="renderSubDiskonList(this.value)" placeholder="Cari diskon" class="w-full pl-9 pr-4 py-2 border border-emerald-600 rounded-md text-xs text-gray-900 focus:outline-none">
                </div>
            </div>

            <!-- Daftar Item Diskon -->
            <div class="flex-1 overflow-y-auto divide-y divide-gray-200 pb-24" id="container-sub-diskon-rows" onclick="hideSubDiskonSortMenu()"></div>

            <!-- Tombol Bulat + Besar di Tengah Bawah (SS 1000924443) -->
            <div class="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-20">
                <button onclick="openModalDiskonForm(-1)" type="button" class="pointer-events-auto w-14 h-14 rounded-full bg-teal-500 hover:bg-teal-600 text-gray-900 shadow-xl flex items-center justify-center text-2xl transition transform active:scale-90">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        </div>

        <!-- === 3. HALAMAN DAFTAR PAJAK (SS 1000924447 & 1000924448) === -->
        <div id="view-sub-pajak" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-20">
                <button onclick="switchView('diskon')" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Pajak</h2>
            </div>

            <!-- Baris Filter Panah (2 Pilihan) & Kotak Cari Pajak -->
            <div class="p-3 bg-white border-b flex items-center space-x-2 relative z-20">
                <div class="relative">
                    <button onclick="toggleSubPajakSortMenu()" class="text-emerald-700 text-xl px-2 py-1 focus:outline-none">
                        <i class="fa-solid fa-arrow-up-wide-short"></i>
                    </button>
                    <!-- Dropdown 2 Pilihan: Nama & Pajak (SS 1000924448) -->
                    <div id="dropdown-sub-pajak-sort" class="absolute left-0 top-10 w-52 bg-white rounded-md shadow-2xl border border-gray-200 py-2 hidden z-50 text-xs font-medium text-gray-900">
                        <button onclick="applySubPajakSort('name')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Nama</button>
                        <button onclick="applySubPajakSort('rate')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Pajak</button>
                    </div>
                </div>

                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-700"><i class="fa-solid fa-search text-base"></i></span>
                    <input type="text" id="input-search-sub-pajak" oninput="renderSubPajakList(this.value)" placeholder="Cari pajak" class="w-full pl-9 pr-4 py-2 border border-emerald-600 rounded-md text-xs text-gray-900 focus:outline-none">
                </div>
            </div>

            <div class="flex-1 overflow-y-auto pb-24" onclick="hideSubPajakSortMenu()">
                <!-- Kotak Abu-abu Pajak Default Diset (SS 1000924447) -->
                <div class="p-4">
                    <div class="bg-slate-100/90 rounded-2xl p-4 space-y-1.5">
                        <div class="flex justify-between items-center text-xs font-extrabold text-gray-900">
                            <span>Pajak Default diset</span>
                            <span id="label-pajak-default-rate">0.0%</span>
                        </div>
                        <p class="text-xs text-gray-500 font-medium">
                            Atur pajak default? <span onclick="openPajakDefaultView()" class="text-emerald-600 font-bold cursor-pointer hover:underline">Klik Disini</span>
                        </p>
                    </div>
                </div>

                <!-- Daftar Item Pajak -->
                <div id="container-sub-pajak-rows" class="divide-y divide-gray-200 border-t border-gray-100"></div>
            </div>

            <!-- Tombol Bulat + Besar di Tengah Bawah -->
            <div class="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-20">
                <button onclick="openModalPajakForm(-1)" type="button" class="pointer-events-auto w-14 h-14 rounded-full bg-teal-500 hover:bg-teal-600 text-gray-900 shadow-xl flex items-center justify-center text-2xl transition transform active:scale-90">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        </div>

        <!-- === 4. HALAMAN PAJAK DEFAULT (SS 1000924449) === -->
        <div id="view-pajak-default" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closePajakDefaultView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Pajak Default</h2>
            </div>

            <div class="flex-1 overflow-y-auto pb-28">
                <!-- Banner Hijau Muda Bergelombang -->
                <div class="bg-gradient-to-br from-emerald-50 via-teal-50/70 to-emerald-100/60 p-4 border-b border-emerald-100">
                    <p class="text-xs text-gray-900 leading-relaxed font-medium">
                        <strong class="font-extrabold">Pajak Default</strong> adalah biaya tambahan yang dikenakan ke pelanggan di luar harga produk / jasa dalam bentuk persentase.
                    </p>
                </div>

                <div class="p-4 space-y-4">
                    <!-- Toggle Switch Aktifkan Pajak Default -->
                    <div class="flex justify-between items-center pt-1">
                        <div class="flex items-center space-x-2">
                            <span class="text-xs font-extrabold text-gray-900">Aktifkan Pajak Default</span>
                            <button onclick="alert('Jika diaktifkan, persentase Pajak Default akan otomatis diterapkan pada setiap transaksi kasir.')" type="button" class="w-5 h-5 rounded-full border-2 border-emerald-600 text-emerald-600 flex items-center justify-center text-[11px] font-bold">i</button>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="toggle-pajak-default-active" onchange="handleTogglePajakDefault(this.checked)" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 shadow-inner"></div>
                        </label>
                    </div>

                    <!-- Input Pajak Default (%) -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Pajak Default (%)</label>
                        <input type="number" id="input-pajak-default-val" value="0" step="0.1" disabled class="w-full border border-gray-300 rounded-full p-3 px-4 text-sm font-semibold text-gray-500 bg-white focus:outline-none focus:border-emerald-600">
                        <p id="helper-pajak-default-status" class="text-xs text-gray-500 mt-2">Pajak default tidak aktif. Nilai telah disetel ke 0.</p>
                    </div>
                </div>
            </div>

            <!-- Tombol Sticky Bawah: SIMPAN -->
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="savePajakDefaultSettings()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN
                </button>
            </div>
        </div>

        <!-- === 5. HALAMAN DAFTAR BIAYA (SS 1000924452) === -->
        <div id="view-sub-biaya" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-20">
                <button onclick="switchView('diskon')" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Biaya</h2>
            </div>

            <!-- Baris Filter Panah (2 Pilihan: Nama & Biaya) & Kotak Cari Biaya -->
            <div class="p-3 bg-white border-b flex items-center space-x-2 relative z-20">
                <div class="relative">
                    <button onclick="toggleSubBiayaSortMenu()" class="text-emerald-700 text-xl px-2 py-1 focus:outline-none">
                        <i class="fa-solid fa-arrow-up-wide-short"></i>
                    </button>
                    <div id="dropdown-sub-biaya-sort" class="absolute left-0 top-10 w-52 bg-white rounded-md shadow-2xl border border-gray-200 py-2 hidden z-50 text-xs font-medium text-gray-900">
                        <button onclick="applySubBiayaSort('name')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Nama</button>
                        <button onclick="applySubBiayaSort('amount')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Biaya</button>
                    </div>
                </div>

                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-700"><i class="fa-solid fa-search text-base"></i></span>
                    <input type="text" id="input-search-sub-biaya" oninput="renderSubBiayaList(this.value)" placeholder="Cari biaya" class="w-full pl-9 pr-4 py-2 border border-emerald-600 rounded-md text-xs text-gray-900 focus:outline-none">
                </div>
            </div>

            <!-- Daftar Item Biaya -->
            <div class="flex-1 overflow-y-auto divide-y divide-gray-200 pb-24" id="container-sub-biaya-rows" onclick="hideSubBiayaSortMenu()"></div>

            <!-- Tombol Bulat + Besar di Tengah Bawah -->
            <div class="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-20">
                <button onclick="openModalBiayaForm(-1)" type="button" class="pointer-events-auto w-14 h-14 rounded-full bg-teal-500 hover:bg-teal-600 text-gray-900 shadow-xl flex items-center justify-center text-2xl transition transform active:scale-90">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        </div>
    `;

    // 2. SUNTIKKAN HTML MODALS (TAMBAH/EDIT DISKON, PAJAK, BIAYA) KE DALAM #modals-container
    const modalsHTML = `
        <!-- === POPUP TAMBAH / EDIT DISKON (SS 1000924444 & 1000924446) === -->
        <div id="modal-form-sub-diskon" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-4">
                <h3 class="font-extrabold text-xs uppercase tracking-wider text-gray-900 text-center pb-3 border-b" id="title-modal-sub-diskon">TAMBAH DISKON</h3>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nama Diskon</label>
                    <input type="text" id="input-modal-diskon-name" placeholder="Nama Diskon" class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Jumlah Diskon</label>
                    <div class="flex items-center space-x-3">
                        <input type="number" id="input-modal-diskon-val" placeholder="Jumlah" step="0.01" class="flex-1 border border-gray-300 rounded-full p-3 px-4 text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600">
                        <div class="flex rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                            <button type="button" id="btn-modal-diskon-pct" onclick="setModalDiskonUnit('pct')" class="w-12 py-2.5 text-xs font-bold bg-emerald-600 text-white transition">%</button>
                            <button type="button" id="btn-modal-diskon-rp" onclick="setModalDiskonUnit('rp')" class="w-12 py-2.5 text-xs font-bold bg-gray-200 text-white transition">Rp</button>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3 pt-2">
                    <button onclick="closeModalDiskonForm()" type="button" class="bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="saveModalDiskonForm()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">OK</button>
                </div>
            </div>
        </div>

        <!-- === POPUP TAMBAH / EDIT PAJAK (SS 1000924450 & 1000924451) === -->
        <div id="modal-form-sub-pajak" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-4">
                <h3 class="font-extrabold text-xs tracking-wider text-gray-900 text-center pb-3 border-b" id="title-modal-sub-pajak">Tambah Pajak</h3>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nama Pajak</label>
                    <input type="text" id="input-modal-pajak-name" placeholder="Nama Pajak" class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Pajak (%)</label>
                    <input type="number" id="input-modal-pajak-rate" placeholder="Jumlah (%)" step="0.1" class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>

                <div class="grid grid-cols-2 gap-3 pt-2">
                    <button onclick="closeModalPajakForm()" type="button" class="bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="saveModalPajakForm()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">OK</button>
                </div>
            </div>
        </div>

        <!-- === POPUP TAMBAH / EDIT BIAYA (SS 1000924453 & 1000924454) === -->
        <div id="modal-form-sub-biaya" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-4">
                <h3 class="font-extrabold text-xs tracking-wider text-gray-900 text-center pb-3 border-b" id="title-modal-sub-biaya">Tambah Biaya</h3>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nama Biaya</label>
                    <input type="text" id="input-modal-biaya-name" placeholder="Nama Biaya" class="w-full border border-gray-300 rounded-md p-3 px-3.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nominal</label>
                    <div class="flex rounded-md overflow-hidden border border-emerald-600">
                        <input type="number" id="input-modal-biaya-nominal" placeholder="Nominal" step="0.01" class="flex-1 p-3 px-3.5 text-xs font-semibold text-gray-900 focus:outline-none">
                        <div class="bg-emerald-700 text-white font-bold text-xs px-4 flex items-center justify-center">
                            Rp
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3 pt-2">
                    <button onclick="closeModalBiayaForm()" type="button" class="bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="saveModalBiayaForm()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">OK</button>
                </div>
            </div>
        </div>
    `;

    // Pasang ke DOM
    const wsContainer = document.getElementById('workspace-container');
    if (wsContainer) wsContainer.insertAdjacentHTML('beforeend', viewsHTML);

    const mdContainer = document.getElementById('modals-container');
    if (mdContainer) mdContainer.insertAdjacentHTML('beforeend', modalsHTML);

    // Tambahkan Pintasan Menu MANAJEMEN & Marketing ke Sidebar secara Otomatis
    const navDiskonEl = document.getElementById('nav-diskon');
    if (navDiskonEl && !document.getElementById('nav-marketing')) {
        navDiskonEl.insertAdjacentHTML('afterend', `
            <a href="#" onclick="if(window.openMarketingMainView) window.openMarketingMainView(); else switchView('manajemen-hub');" id="nav-marketing" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition">
                <i class="fa-solid fa-star w-5 text-center"></i><span>Marketing</span>
            </a>
            <a href="#" onclick="switchView('manajemen-hub')" id="nav-manajemen-hub" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-emerald-700 font-semibold transition">
                <i class="fa-solid fa-grip w-5 text-center"></i><span>Semua Menu Manajemen</span>
            </a>
        `);
    }

    // ========================================================================
    // 3. DATA AWAL DISKON, PAJAK, DAN BIAYA SESUAI SCREENSHOT
    // ========================================================================
    const defaultDiscounts = [
        { id: 'd_1', name: 'set', amount: 500, unit: 'rp' },
        { id: 'd_2', name: 'set', amount: 1000, unit: 'rp' },
        { id: 'd_3', name: 'set', amount: 2000, unit: 'rp' },
        { id: 'd_4', name: 'set', amount: 3000, unit: 'rp' },
        { id: 'd_5', name: 'set', amount: 4000, unit: 'rp' },
        { id: 'd_6', name: 'set', amount: 5000, unit: 'rp' }
    ];

    const defaultTaxes = [
        { id: 't_1', name: 'QRIS', rate: 1 }
    ];

    const defaultFees = [
        { id: 'f_1', name: 'Ongkir', amount: 10000 }
    ];

    window.masterDiscounts = JSON.parse(localStorage.getItem('pos_master_discounts') || JSON.stringify(defaultDiscounts));
    window.masterTaxes = JSON.parse(localStorage.getItem('pos_master_taxes') || JSON.stringify(defaultTaxes));
    window.masterFees = JSON.parse(localStorage.getItem('pos_master_fees') || JSON.stringify(defaultFees));
    window.pajakDefaultConfig = JSON.parse(localStorage.getItem('pos_pajak_default') || '{"active":false,"rate":0}');

    let subDiskonSortBy = 'amount'; // 'name' atau 'amount'
    let subPajakSortBy = 'name';    // 'name' atau 'rate'
    let subBiayaSortBy = 'name';    // 'name' atau 'amount'

    let editingDiskonIdx = -1;
    let modalDiskonUnit = 'pct'; // 'pct' atau 'rp'
    let editingPajakIdx = -1;
    let editingBiayaIdx = -1;

    // Hook pada switchView('diskon') dan switchView('manajemen-hub') agar header utama disembunyikan
    const prevSwitchView = window.switchView;
    window.switchView = function(viewName) {
        if (typeof prevSwitchView === 'function') prevSwitchView(viewName);
        if (viewName === 'diskon' || viewName === 'manajemen-hub') {
            const mainHeader = document.getElementById('main-header');
            if (mainHeader) mainHeader.classList.add('hidden');
        }
        syncPosDiscountSelect();
    };

    function syncPosDiscountSelect() {
        const sel = document.getElementById('pos-discount');
        if (!sel) return;
        sel.innerHTML = `<option value="0|0">Tidak ada diskon</option>`;
        (window.masterDiscounts || []).forEach(d => {
            const label = d.unit === 'pct' ? `${d.name} (${d.amount}%)` : `${d.name} (Rp ${Number(d.amount).toLocaleString('id-ID')})`;
            const val = d.unit === 'pct' ? `${d.amount}|0` : `0|${d.amount}`;
            sel.innerHTML += `<option value="${val}">${label}</option>`;
        });
    }

    // ========================================================================
    // 4. LOGIKA SUB-MENU 1: DISKON (SS 1000924443 - 1000924446)
    // ========================================================================
    window.openSubDiskonView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-sub-diskon').classList.remove('hidden');
        document.getElementById('input-search-sub-diskon').value = '';
        window.renderSubDiskonList('');
    };

    window.toggleSubDiskonSortMenu = () => {
        document.getElementById('dropdown-sub-diskon-sort').classList.toggle('hidden');
    };
    window.hideSubDiskonSortMenu = () => {
        const el = document.getElementById('dropdown-sub-diskon-sort');
        if (el) el.classList.add('hidden');
    };
    window.applySubDiskonSort = (mode) => {
        subDiskonSortBy = mode;
        window.hideSubDiskonSortMenu();
        window.renderSubDiskonList(document.getElementById('input-search-sub-diskon').value);
    };

    window.renderSubDiskonList = function(keyword = '') {
        const container = document.getElementById('container-sub-diskon-rows');
        if (!container) return;
        container.innerHTML = '';

        const k = (keyword || '').toLowerCase();
        let list = (window.masterDiscounts || []).map((item, idx) => ({ ...item, origIdx: idx }))
            .filter(d => d.name.toLowerCase().includes(k) || String(d.amount).includes(k));

        list.sort((a, b) => {
            if (subDiskonSortBy === 'name') return a.name.localeCompare(b.name);
            return (Number(a.amount) || 0) - (Number(b.amount) || 0);
        });

        if (list.length === 0) {
            container.innerHTML = `<div class="py-12 text-center text-xs text-gray-400 font-semibold">Belum ada data diskon.</div>`;
            return;
        }

        list.forEach(d => {
            const subText = d.unit === 'pct'
                ? `${d.amount} %`
                : `Rp ${Number(d.amount).toLocaleString('id-ID')}`;

            container.innerHTML += `
                <div class="px-4 py-3.5 bg-white flex items-center justify-between hover:bg-gray-50 transition">
                    <div>
                        <h4 class="font-bold text-xs text-gray-900">${d.name}</h4>
                        <p class="text-[11px] text-gray-600 font-medium mt-0.5">${subText}</p>
                    </div>
                    <div class="flex items-center space-x-5">
                        <button onclick="openModalDiskonForm(${d.origIdx})" type="button" class="text-emerald-600 hover:text-emerald-800 text-xl p-1 transition" title="Edit Diskon">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button onclick="deleteSubDiskonItem(${d.origIdx})" type="button" class="text-red-500 hover:text-red-700 text-xl p-1 transition" title="Hapus Diskon">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    };

    window.setModalDiskonUnit = (unit) => {
        modalDiskonUnit = unit;
        const btnPct = document.getElementById('btn-modal-diskon-pct');
        const btnRp = document.getElementById('btn-modal-diskon-rp');
        if (unit === 'pct') {
            btnPct.className = "w-12 py-2.5 text-xs font-bold bg-emerald-600 text-white transition";
            btnRp.className = "w-12 py-2.5 text-xs font-bold bg-gray-200 text-white transition";
        } else {
            btnRp.className = "w-12 py-2.5 text-xs font-bold bg-emerald-600 text-white transition";
            btnPct.className = "w-12 py-2.5 text-xs font-bold bg-gray-200 text-white transition";
        }
    };

    window.openModalDiskonForm = (idx = -1) => {
        window.hideSubDiskonSortMenu();
        editingDiskonIdx = idx;
        const titleEl = document.getElementById('title-modal-sub-diskon');
        const nameInput = document.getElementById('input-modal-diskon-name');
        const valInput = document.getElementById('input-modal-diskon-val');

        if (idx >= 0 && window.masterDiscounts[idx]) {
            const item = window.masterDiscounts[idx];
            titleEl.innerText = "EDIT";
            nameInput.value = item.name;
            valInput.value = Number(item.amount).toFixed(2);
            window.setModalDiskonUnit(item.unit || 'rp');
        } else {
            titleEl.innerText = "TAMBAH DISKON";
            nameInput.value = '';
            valInput.value = '';
            window.setModalDiskonUnit('pct');
        }

        document.getElementById('modal-form-sub-diskon').classList.remove('hidden');
    };

    window.closeModalDiskonForm = () => {
        document.getElementById('modal-form-sub-diskon').classList.add('hidden');
    };

    window.saveModalDiskonForm = () => {
        const name = document.getElementById('input-modal-diskon-name').value.trim();
        const amount = parseFloat(document.getElementById('input-modal-diskon-val').value);

        if (!name) return alert("Nama Diskon wajib diisi!");
        if (isNaN(amount) || amount <= 0) return alert("Jumlah Diskon harus lebih dari 0!");

        const obj = {
            id: editingDiskonIdx >= 0 ? window.masterDiscounts[editingDiskonIdx].id : ('d_' + Date.now()),
            name,
            amount,
            unit: modalDiskonUnit
        };

        if (editingDiskonIdx >= 0) {
            window.masterDiscounts[editingDiskonIdx] = obj;
        } else {
            window.masterDiscounts.push(obj);
        }

        localStorage.setItem('pos_master_discounts', JSON.stringify(window.masterDiscounts));
        window.closeModalDiskonForm();
        window.renderSubDiskonList(document.getElementById('input-search-sub-diskon').value);
        syncPosDiscountSelect();
    };

    window.deleteSubDiskonItem = (idx) => {
        const item = window.masterDiscounts[idx];
        if (!item) return;
        if (confirm(`Hapus diskon '${item.name}'?`)) {
            window.masterDiscounts.splice(idx, 1);
            localStorage.setItem('pos_master_discounts', JSON.stringify(window.masterDiscounts));
            window.renderSubDiskonList(document.getElementById('input-search-sub-diskon').value);
            syncPosDiscountSelect();
        }
    };

    // ========================================================================
    // 5. LOGIKA SUB-MENU 2: PAJAK & PAJAK DEFAULT (SS 1000924447 - 1000924451)
    // ========================================================================
    window.openSubPajakView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-sub-pajak').classList.remove('hidden');
        document.getElementById('input-search-sub-pajak').value = '';
        updatePajakDefaultBoxLabel();
        window.renderSubPajakList('');
    };

    function updatePajakDefaultBoxLabel() {
        const rateLbl = document.getElementById('label-pajak-default-rate');
        if (!rateLbl) return;
        const rate = window.pajakDefaultConfig && window.pajakDefaultConfig.active
            ? Number(window.pajakDefaultConfig.rate || 0).toFixed(1)
            : '0.0';
        rateLbl.innerText = `${rate}%`;
    }

    window.toggleSubPajakSortMenu = () => {
        document.getElementById('dropdown-sub-pajak-sort').classList.toggle('hidden');
    };
    window.hideSubPajakSortMenu = () => {
        const el = document.getElementById('dropdown-sub-pajak-sort');
        if (el) el.classList.add('hidden');
    };
    window.applySubPajakSort = (mode) => {
        subPajakSortBy = mode;
        window.hideSubPajakSortMenu();
        window.renderSubPajakList(document.getElementById('input-search-sub-pajak').value);
    };

    window.renderSubPajakList = function(keyword = '') {
        const container = document.getElementById('container-sub-pajak-rows');
        if (!container) return;
        container.innerHTML = '';

        const k = (keyword || '').toLowerCase();
        let list = (window.masterTaxes || []).map((item, idx) => ({ ...item, origIdx: idx }))
            .filter(t => t.name.toLowerCase().includes(k) || String(t.rate).includes(k));

        list.sort((a, b) => {
            if (subPajakSortBy === 'rate') return (Number(a.rate) || 0) - (Number(b.rate) || 0);
            return a.name.localeCompare(b.name);
        });

        list.forEach(t => {
            container.innerHTML += `
                <div class="px-4 py-3.5 bg-white flex items-center justify-between hover:bg-gray-50 transition">
                    <div>
                        <h4 class="font-bold text-xs text-gray-900">${t.name}</h4>
                        <p class="text-[11px] text-gray-600 font-medium mt-0.5">${t.rate} %</p>
                    </div>
                    <div class="flex items-center space-x-5">
                        <button onclick="openModalPajakForm(${t.origIdx})" type="button" class="text-emerald-600 hover:text-emerald-800 text-xl p-1 transition" title="Edit Pajak">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button onclick="deleteSubPajakItem(${t.origIdx})" type="button" class="text-red-500 hover:text-red-700 text-xl p-1 transition" title="Hapus Pajak">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    };

    window.openModalPajakForm = (idx = -1) => {
        window.hideSubPajakSortMenu();
        editingPajakIdx = idx;
        const titleEl = document.getElementById('title-modal-sub-pajak');
        const nameInput = document.getElementById('input-modal-pajak-name');
        const rateInput = document.getElementById('input-modal-pajak-rate');

        if (idx >= 0 && window.masterTaxes[idx]) {
            const item = window.masterTaxes[idx];
            titleEl.innerText = "EDIT";
            nameInput.value = item.name;
            rateInput.value = Number(item.rate).toFixed(1);
        } else {
            titleEl.innerText = "Tambah Pajak";
            nameInput.value = '';
            rateInput.value = '';
        }

        document.getElementById('modal-form-sub-pajak').classList.remove('hidden');
    };

    window.closeModalPajakForm = () => {
        document.getElementById('modal-form-sub-pajak').classList.add('hidden');
    };

    window.saveModalPajakForm = () => {
        const name = document.getElementById('input-modal-pajak-name').value.trim();
        const rate = parseFloat(document.getElementById('input-modal-pajak-rate').value);

        if (!name) return alert("Nama Pajak wajib diisi!");
        if (isNaN(rate) || rate < 0) return alert("Persentase Pajak tidak valid!");

        const obj = {
            id: editingPajakIdx >= 0 ? window.masterTaxes[editingPajakIdx].id : ('t_' + Date.now()),
            name,
            rate
        };

        if (editingPajakIdx >= 0) {
            window.masterTaxes[editingPajakIdx] = obj;
        } else {
            window.masterTaxes.push(obj);
        }

        localStorage.setItem('pos_master_taxes', JSON.stringify(window.masterTaxes));
        window.closeModalPajakForm();
        window.renderSubPajakList(document.getElementById('input-search-sub-pajak').value);
    };

    window.deleteSubPajakItem = (idx) => {
        const item = window.masterTaxes[idx];
        if (!item) return;
        if (confirm(`Hapus pajak '${item.name}'?`)) {
            window.masterTaxes.splice(idx, 1);
            localStorage.setItem('pos_master_taxes', JSON.stringify(window.masterTaxes));
            window.renderSubPajakList(document.getElementById('input-search-sub-pajak').value);
        }
    };

    // --- HALAMAN PAJAK DEFAULT (SS 1000924449) ---
    window.openPajakDefaultView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-pajak-default').classList.remove('hidden');

        const isActive = window.pajakDefaultConfig?.active === true;
        const rate = Number(window.pajakDefaultConfig?.rate) || 0;

        document.getElementById('toggle-pajak-default-active').checked = isActive;
        document.getElementById('input-pajak-default-val').value = isActive ? rate : 0;
        window.handleTogglePajakDefault(isActive);
    };

    window.closePajakDefaultView = () => {
        document.getElementById('view-pajak-default').classList.add('hidden');
        document.getElementById('view-sub-pajak').classList.remove('hidden');
        updatePajakDefaultBoxLabel();
    };

    window.handleTogglePajakDefault = (checked) => {
        const input = document.getElementById('input-pajak-default-val');
        const helper = document.getElementById('helper-pajak-default-status');

        if (checked) {
            input.disabled = false;
            input.className = "w-full border border-emerald-600 rounded-full p-3 px-4 text-sm font-bold text-gray-900 bg-white focus:outline-none";
            helper.innerText = "Pajak default aktif. Akan diterapkan otomatis pada transaksi.";
        } else {
            input.disabled = true;
            input.value = '0';
            input.className = "w-full border border-gray-300 rounded-full p-3 px-4 text-sm font-semibold text-gray-400 bg-white focus:outline-none";
            helper.innerText = "Pajak default tidak aktif. Nilai telah disetel ke 0.";
        }
    };

    window.savePajakDefaultSettings = () => {
        const active = document.getElementById('toggle-pajak-default-active').checked;
        const rate = active ? (parseFloat(document.getElementById('input-pajak-default-val').value) || 0) : 0;

        window.pajakDefaultConfig = { active, rate };
        localStorage.setItem('pos_pajak_default', JSON.stringify(window.pajakDefaultConfig));

        // Sinkronkan ke input pajak kasir jika ada
        const posTaxInput = document.getElementById('checkout-tax');
        if (posTaxInput) posTaxInput.value = rate;

        alert("Pengaturan Pajak Default berhasil disimpan!");
        window.closePajakDefaultView();
    };

    // ========================================================================
    // 6. LOGIKA SUB-MENU 3: BIAYA (SS 1000924452 - 1000924454)
    // ========================================================================
    window.openSubBiayaView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-sub-biaya').classList.remove('hidden');
        document.getElementById('input-search-sub-biaya').value = '';
        window.renderSubBiayaList('');
    };

    window.toggleSubBiayaSortMenu = () => {
        document.getElementById('dropdown-sub-biaya-sort').classList.toggle('hidden');
    };
    window.hideSubBiayaSortMenu = () => {
        const el = document.getElementById('dropdown-sub-biaya-sort');
        if (el) el.classList.add('hidden');
    };
    window.applySubBiayaSort = (mode) => {
        subBiayaSortBy = mode;
        window.hideSubBiayaSortMenu();
        window.renderSubBiayaList(document.getElementById('input-search-sub-biaya').value);
    };

    window.renderSubBiayaList = function(keyword = '') {
        const container = document.getElementById('container-sub-biaya-rows');
        if (!container) return;
        container.innerHTML = '';

        const k = (keyword || '').toLowerCase();
        let list = (window.masterFees || []).map((item, idx) => ({ ...item, origIdx: idx }))
            .filter(f => f.name.toLowerCase().includes(k) || String(f.amount).includes(k));

        list.sort((a, b) => {
            if (subBiayaSortBy === 'amount') return (Number(a.amount) || 0) - (Number(b.amount) || 0);
            return a.name.localeCompare(b.name);
        });

        list.forEach(f => {
            container.innerHTML += `
                <div class="px-4 py-3.5 bg-white flex items-center justify-between hover:bg-gray-50 transition">
                    <div>
                        <h4 class="font-bold text-xs text-gray-900">${f.name}</h4>
                        <p class="text-[11px] text-gray-600 font-medium mt-0.5">Rp ${Number(f.amount).toLocaleString('id-ID')}</p>
                    </div>
                    <div class="flex items-center space-x-5">
                        <button onclick="openModalBiayaForm(${f.origIdx})" type="button" class="text-emerald-600 hover:text-emerald-800 text-xl p-1 transition" title="Edit Biaya">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button onclick="deleteSubBiayaItem(${f.origIdx})" type="button" class="text-red-500 hover:text-red-700 text-xl p-1 transition" title="Hapus Biaya">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    };

    window.openModalBiayaForm = (idx = -1) => {
        window.hideSubBiayaSortMenu();
        editingBiayaIdx = idx;
        const titleEl = document.getElementById('title-modal-sub-biaya');
        const nameInput = document.getElementById('input-modal-biaya-name');
        const nomInput = document.getElementById('input-modal-biaya-nominal');

        if (idx >= 0 && window.masterFees[idx]) {
            const item = window.masterFees[idx];
            titleEl.innerText = "Edit Biaya";
            nameInput.value = item.name;
            nomInput.value = Number(item.amount).toFixed(2);
        } else {
            titleEl.innerText = "Tambah Biaya";
            nameInput.value = '';
            nomInput.value = '';
        }

        document.getElementById('modal-form-sub-biaya').classList.remove('hidden');
    };

    window.closeModalBiayaForm = () => {
        document.getElementById('modal-form-sub-biaya').classList.add('hidden');
    };

    window.saveModalBiayaForm = () => {
        const name = document.getElementById('input-modal-biaya-name').value.trim();
        const amount = parseFloat(document.getElementById('input-modal-biaya-nominal').value);

        if (!name) return alert("Nama Biaya wajib diisi!");
        if (isNaN(amount) || amount <= 0) return alert("Nominal Biaya harus lebih dari 0!");

        const obj = {
            id: editingBiayaIdx >= 0 ? window.masterFees[editingBiayaIdx].id : ('f_' + Date.now()),
            name,
            amount
        };

        if (editingBiayaIdx >= 0) {
            window.masterFees[editingBiayaIdx] = obj;
        } else {
            window.masterFees.push(obj);
        }

        localStorage.setItem('pos_master_fees', JSON.stringify(window.masterFees));
        window.closeModalBiayaForm();
        window.renderSubBiayaList(document.getElementById('input-search-sub-biaya').value);
    };

    window.deleteSubBiayaItem = (idx) => {
        const item = window.masterFees[idx];
        if (!item) return;
        if (confirm(`Hapus biaya '${item.name}'?`)) {
            window.masterFees.splice(idx, 1);
            localStorage.setItem('pos_master_fees', JSON.stringify(window.masterFees));
            window.renderSubBiayaList(document.getElementById('input-search-sub-biaya').value);
        }
    };

    // Sinkronkan dropdown diskon POS saat pertama kali dimuat
    setTimeout(syncPosDiscountSelect, 400);
})();
